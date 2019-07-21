const load = require("cheerio").load;
const fetch = require("node-fetch")
const { filter } = require("lodash")
const { urlArenaVision, selectors, prop, fetchOpts, regex } = require("./params");

/**
 * Obtains the guide at Arenavision.ru available at the moment in an JSON friendly format
 */
function getGuide() {
  return new Promise(async (resolve, reject) => {
    const url = await getGuideLink();

    fetch(url, fetchOpts)
      .then(res => res.text())
      .then(data => {
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
      .catch(error => reject(error));
  });
};


/**
 * Obtains the URL to the Guide page. 
 * It should be static but this guys change it often, so with this we are safe
 */
function getGuideLink() {
  return new Promise((resolve, reject) => {
    fetch(urlArenaVision, fetchOpts)
      .then(res => res.text())
      .then(res => {
        const $ = load(res);
        const linkObj = $(selectors.guide);

        // Sometimes the link is relative. If so, fill it with the base url
        const link = linkObj[0].attribs.href;
        const url = link.match(regex.url) ? link : urlArenaVision + link;

        resolve(url);
      })
      .catch(error => reject(error));
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
