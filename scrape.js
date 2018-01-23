const { load } = require('cheerio');
const { each } = require('lodash');
const axios = require('axios');
const { urlArenaVision, selectors, prop, urlRegex } = require('./params');
const opts = { headers: { Cookie:  'beget=begetok'+'; expires='+new Date().toGMTString()+'; path=/' } }


exports.getChannels = function(proxy=null){
  var channelList = [];

  return new Promise((resolve, reject) => {
    axios.get(urlArenaVision, opts)
      .then(async response => {
        var $ = load(response.data);
        var channels = $(selectors.channels);

        for(i=0;i<channels.length;i++){
          const linkUrl = channels[i].attribs.href;
          const url = linkUrl.match(urlRegex) ? linkUrl : urlArenaVision + linkUrl;

          var channel = await getArenaVisionLink(i+1, url, proxy);
          channelList.push({[i+1]: channel});
        }

        resolve(channelList);
      }).catch(error => reject(error));
  });
}

exports.getGuide = function (proxy=null){
  return new Promise(async (resolve, reject)  => {
    var urlGuide = await getGuideLink(proxy);
    const url = urlGuide.match(urlRegex) ? urlGuide : urlArenaVision + urlGuide;

    axios.get(url, opts)
      .then(response => {
        var $ = load(response.data);
        var events = $(selectors.events).closest("tr");
        var eventsInfo = [];

        each(events, function(event) {
          var info = $(event).find("td");
          eventsInfo.push(getData(info));
        })
        resolve(eventsInfo);
      }).catch(error => reject(error));
  });
}


/////////////////////////////////////////////////////////////
function getGuideLink(proxy){
  return new Promise((resolve, reject) => {
    axios.get(urlArenaVision, opts)
      .then(response => {
        var $ = load(response.data);
        var link = $(selectors.guide);
        resolve(link[0].attribs.href);
      }).catch(error => reject(error));
  })
}

function getArenaVisionLink(number, url, proxy){
  return new Promise(function (resolve, reject) {
    axios.get(url, opts)
      .then(response => {
        var $ = load(response.data);
        var link = $(selectors.acestream);
        resolve(link[0].attribs.href);
      }).catch(error => reject(error));
  });
}

function getData(info){
  const data = {};
  data.day = cleanData(info[prop.day]);
  data.time = cleanData(info[prop.time]);
  data.sport = cleanData(info[prop.sport]);
  data.competition = cleanData(info[prop.competition]);
  data.event = cleanData(info[prop.event]);
  data.channels = cleanChannels(info[prop.channels]);

  return data;
}

function cleanData(data){
  let text = "";

  each(data.children, function(innerText) {
    if(innerText.data){
      text += " " + innerText.data.replace("\n", "");
    }
  })

  return text.replace("-", " - ").trim();
}

function cleanChannels(dataChannel){
  const channels = {};

  each(dataChannel.children, function(text) {
    if(text.data && text.data.trim() != ""){
      const rip = text.data.split("[");
      if(rip.length >= 2){
        const lang = rip[1].replace("]", "");
        const channelsRip = rip[0].trim().split("-")

        each(channelsRip, function(channel){
          channels[channel] = lang;
        });
      }
    }
  })

  return channels;
}
