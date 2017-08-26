var request = require('request');
var cheerio = require('cheerio');
var { each } = require('lodash');
var { urlArenaVision, urlGuide, headers, selectors, prop, timeout } = require('./params');

var channelList = []
var r = request.defaults({headers: headers, timeout: timeout})

// Obtener los canales y sus URLs de ArenaVision
function getChannels(){
  r.get(getOptions(urlArenaVision), function(error, response, html){
      if(!error){
        var $ = cheerio.load(html);
        var channels = $(selectors.channels);

        for(i=0;i<channels.length;i++){
          getArenaVisionLink(i+1, urlArenaVision + channels[i].attribs.href);
        }
      } else {
        console.log(error);
      }
  });
}

// Por el canal, obtener el link
function getArenaVisionLink(number, url){
  r.get(getOptions(url), function(error, response, html){
    if(!error){
      var $ = cheerio.load(html);
      var link = $(selectors.acestream);
      channelList[number] = link[0].attribs.href;
    } else {
      console.log(error);
    }
  });
}

// Obtener la guía con los canales
function getGuide(channels){
  r.get(getOptions(urlGuide), function(error, response, html){
    if(!error){
      var $ = cheerio.load(html);
      var events = $(selectors.events).closest("tr");
      var eventsInfo = [];

      each(events, function(event) {
        var info = $(event).find("td");
        eventsInfo.push(getData(info));
      })
      console.log(eventsInfo);
    } else {
      console.log(error);
    }
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



function getOptions(url){
  return {
    url: url
  }
}
getGuide();
