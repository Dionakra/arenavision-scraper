const { load } = require("cheerio");
const axios = require("axios");
const {
  urlArenaVision,
  selectors,
  prop,
  urlRegex,
  axiosOpts
} = require("./params");

exports.getGuide = function(proxy = null) {
  return new Promise(async (resolve, reject) => {
    var urlGuide = await getGuideLink(proxy);
    const url = urlGuide.match(urlRegex) ? urlGuide : urlArenaVision + urlGuide;

    axios
      .get(url, opts)
      .then(response => {
        var $ = load(response.data);
        var events = $(selectors.events).closest("tr");
        var eventsInfo = [];

        each(events, function(event) {
          var info = $(event).find("td");
          eventsInfo.push(getData(info));
        });
        resolve(eventsInfo);
      })
      .catch(error => reject(error));
  });
};

/////////////////////////////////////////////////////////////
function getGuideLink(proxy) {
  return new Promise((resolve, reject) => {
    axios
      .get(urlArenaVision, opts)
      .then(response => {
        var $ = load(response.data);
        var link = $(selectors.guide);
        resolve(link[0].attribs.href);
      })
      .catch(error => reject(error));
  });
}

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

function cleanData(data) {
  let text = "";

  each(data.children, function(innerText) {
    if (innerText.data) {
      text += " " + innerText.data.replace("\n", "");
    }
  });

  return text.replace("-", " - ").trim();
}

function cleanChannels(dataChannel) {
  const channels = {};

  each(dataChannel.children, function(text) {
    if (text.data && text.data.trim() != "") {
      const rip = text.data.split("[");
      if (rip.length >= 2) {
        const lang = rip[1].replace("]", "");
        const channelsRip = rip[0].trim().split("-");

        each(channelsRip, function(channel) {
          channels[channel] = lang;
        });
      }
    }
  });

  return channels;
}

export default getGuide;
