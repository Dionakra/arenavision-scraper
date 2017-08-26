var { load } = require('cheerio');
var { each } = require('lodash');
var { urlArenaVision, urlGuide, selectors, prop, r } = require('./params');

exports.getChannels = function(proxy=null){
  var channelList = [];
  var request = r(proxy);

  return new Promise(function (resolve, reject) {
    request.get(urlArenaVision, async function(error, response, html){
        if(!error){
          var $ = load(html);
          var channels = $(selectors.channels);

          for(i=0;i<channels.length;i++){
            var channel = await getArenaVisionLink(i+1, urlArenaVision + channels[i].attribs.href, proxy);
            channelList.push(channel);
          }

          resolve(channelList);
        } else {
          reject(error);
        }
    });
  });
}

exports.getGuide = function (proxy=null){
  var request = r(proxy);

  return new Promise(function (resolve, reject) {
    request.get(urlGuide, async function(error, response, html){
      if(!error){
        var $ = load(html);
        var events = $(selectors.events).closest("tr");
        var eventsInfo = [];

        each(events, function(event) {
          var info = $(event).find("td");
          eventsInfo.push(getData(info));
        })
        resolve(eventsInfo);
      } else {
        reject(error);
      }
    });
  });
}


/////////////////////////////////////////////////////////////
function getArenaVisionLink(number, url, proxy){
  var request = r(proxy);

  return new Promise(function (resolve, reject) {
    request.get(url, function(error, response, html){
      if(!error){
        var $ = load(html);
        var link = $(selectors.acestream);
        resolve({[number]: link[0].attribs.href});
      } else {
        reject(error);
      }
    });
  });
}

function getData(info){
  data = {};
  data.day = cleanData(info[prop.day]);
  data.time = cleanData(info[prop.time]);
  data.sport = cleanData(info[prop.sport]);
  data.competition = cleanData(info[prop.competition]);
  data.event = cleanData(info[prop.event]);
  data.channels = cleanChannels(info[prop.channels]);

  return data;
}

function cleanData(data){
  var text = "";

  each(data.children, function(innerText) {
    if(innerText.data){
      text += " " + innerText.data.replace("\n", "");
    }
  })

  return text.replace("-", " - ").trim();
}

function cleanChannels(dataChannel){
  var channels = {};

  each(dataChannel.children, function(text) {
    if(text.data && text.data.trim() != ""){
      var rip = text.data.split("[");
      var lang = rip[1].replace("]", "");
      var channelsRip = rip[0].trim().split("-")

      each(channelsRip, function(channel){
        channels[channel] = lang;
      });
    }
  })

  return channels;
}
