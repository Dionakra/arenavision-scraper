const load = require("cheerio").load;
const fetch = require("node-fetch")
const filter = require("lodash/filter")

const { urlArenaVision, selectors, prop, fetchOpts, regex } = require("./params");

const Log = require('./log').default
let LOGGER = new Log(false)

/**
 * Obtains the guide at Arenavision.ru available at the moment in an JSON friendly format
 */
function getGuide(enableLog = false) {
  LOGGER = new Log(enableLog, 'GET_GUIDE')
  return new Promise(async (resolve, reject) => {
    LOGGER.info(`Obtaining events URL from ${urlArenaVision}`)
    const url = await getGuideLink();
    LOGGER.info(`Events page: ${url}`)

    LOGGER.info('Obtaining data from the HTML...')
    const res = await fetch(url, fetchOpts);
    const data = await res.text();

    const guide = await getGuideFromText(data)
    LOGGER.info(`Information found: ${JSON.stringify(guide)}`)

    resolve(guide)
  });
};

function getGuideFromText(data) {
  return new Promise((resolve, reject) => {
    const $ = load(data);
    const eventsInfo = [];

    $("table").find("tr").each(function (i, elem) {
      const info = $(this).find("td");
      const data = getData(info);

      if (data.channels && data.channels.length > 0) {
        eventsInfo.push(getData(info));
      }

    });
    resolve(eventsInfo);
  })
}

/**
 * Obtains the URL to the Guide page. 
 * It should be static but this guys change it often, so with this we are safe
 */
function getGuideLink() {
  return new Promise((resolve, reject) => {
    let html = undefined;
    
    fetch(urlArenaVision, fetchOpts)
      .then(res => {
        // Set the referer based on the response. If not set, it will redirect to homepage
        fetchOpts.headers.referer = res.url
        
        return res.text()
      })
      .then(res => {
        html = res;
        const $ = load(res);
        const linkObj = $(selectors.guide);

        // Sometimes the link is relative. If so, fill it with the base url
        let link = linkObj[0].attribs.href;
        //const url = link.match(regex.url) ? link : urlArenaVision + link;
        if(!link.match(regex.url)){
          if(link.startsWith("/")){
            link = urlArenaVision + link.substr(1)
          } else {
            link = urlArenaVision + link
          }
        }

        resolve(link);
      })
      .catch(error => {
        LOGGER.info(`GET_GUIDE_LINK ERROR ${html}`);
        reject(error)
      });
  });
}

/**
 * Generates an object JSON friendly from each event. Basically turns each event into an API to be consumed
 * @param {Object} info Guide at Arenavision
 */
function getData(info) {
  const data = {};

  data.day = cleanData(info[prop.day]);
  data.time = cleanData(info[prop.time]);
  data.sport = cleanData(info[prop.sport]);
  data.competition = cleanData(info[prop.competition]);
  data.event = cleanData(info[prop.event]);
  data.channels = cleanChannels(info[prop.channels]);

  return data;
}

/**
 * Cleans all the rubbish string from Arenavision
 * @param {Object} data Data to be cleaned
 */
function cleanData(data) {
  if (data) {
    const text = [...data.children]
      .filter(innerText => innerText.data)
      .reduce((prev, next) => prev + " " + next.data, "")

    return text.replace("-", " - ").replace("\n", "").replace("\r", "").trim();
  } else {
    return "";
  }
}

/**
 * Obtains each channel and language for each event
 * @param {Object} dataChannel Object with the cell where the channels info are stored
 */
function cleanChannels(dataChannel) {
  if (!dataChannel)
    return []

  let channels = [];

  filter(dataChannel.children, text => {
    return text.data && text.data.trim() != "" && text.data.includes("[");
  })
    .forEach(text => {
      const str = text.data.replace("\r", "").replace("\n", "").trim();
      const rip = str.split("[");
      const lang = rip[1].replace("]", "");
      const channelsRip = rip[0].trim().split("-");

      channelsRip.forEach(channel => {
        channels = channels.concat({ channel, lang })
      })
    })

  return channels;
}

exports.default = getGuide;
