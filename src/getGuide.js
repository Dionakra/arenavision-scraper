const load = require("cheerio").load;
const fetch = require("node-fetch")
const { filter, flatten } = require("lodash")

const util = require('util')
const fs = require('fs')
const streamPipeline = util.promisify(require('stream').pipeline)
const Tesseract = require('tesseract.js');

const { urlArenaVision, selectors, prop, fetchOpts, regex } = require("./params");
const IMG_NAME = `guide_${new Date().getTime()}.png`

getGuide()

/**
 * Obtains the guide at Arenavision.ru available at the moment in an JSON friendly format
 */
function getGuide() {
  return new Promise(async (resolve, reject) => {
    // Obtaining the Guide URL (it changes every time)
    const url = await getGuideLink();

    // Obtaining the HTML from the Guide
    const res = await fetch(url, fetchOpts);
    const data = await res.text();

    // First we try to obtain data from text (which is faster and easier)
    let guide = await getGuideFromText(data)

    // If we couldn't extract data from the HTML, let´s try with the image
    if (guide === undefined || guide.length === 0) {
      guide = await getGuideFromImage(data)
    }

    resolve(guide)
  });
};

function getGuideFromImage(data) {
  let res = []

  return new Promise(async (resolve, reject) => {
    // Obtain the image (if there is one)
    const $ = load(data)
    const imgUrl = $(selectors.guideImg).attr('src')

    const response = await fetch(`${urlArenaVision}${imgUrl}`)
    if (!response.ok) throw new Error(`unexpected response ${response.statusText}`)
    await streamPipeline(response.body, fs.createWriteStream(IMG_NAME))

    // Once the image is saved, pass it to Tesseract
    const { TesseractWorker } = Tesseract;
    const worker = new TesseractWorker();
    const { text } = await worker.recognize(IMG_NAME)
    worker.terminate();

    res = text.split('\n')
      .filter(l => l.includes(":") && l.includes(","))
      .map(l => {
        const m = regex.guide.exec(l.trim())

        if (m != null) {
          return {
            day: m[1].trim(),
            time: m[2].trim(),
            sport: m[3].trim(),
            competition: m[4].trim(),
            event: m[5].trim(),
            channels: cleanChannelsFromImage(m[6])
          }
        } else {
          return null
        }
      }).filter(l => l != null)

      console.log(JSON.stringify(res))

    resolve(res)
  })
}


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

/**
 * Obtains each channel and language for each event
 * @param {Object} dataChannel Object with the cell where the channels info are stored
 */
function cleanChannelsFromImage(text) {
  const channels = text.replace("[[", "[")
    .replace("]]", "]")
    .split("]")
    .filter(w => w.trim().length > 0)
    .map(entry => {
      const [channels, lang] = entry.split("[")
      return channels.split("-").map(channel => {
        return {
          channel: channel.trim(),
          lang: lang.trim()
        }
      })
    })

    return flatten(channels)
}

exports.default = getGuide;
