const load = require("cheerio").load;
const fetch = require("node-fetch");
const shorten = require('tinyurl').shorten;
const { urlArenaVision, selectors, fetchOpts, regex } = require("./params");
const Log = require('./log').default

let LOGGER = new Log(false)

/**
 * Obtains all the channels and their acestream links
 */
function getChannels(enableLog = false) {
  LOGGER = new Log(enableLog, 'GET_CHANNELS')

  return new Promise((resolve, reject) => {
    LOGGER.info(`Querying ${urlArenaVision} for getting the HTML...`)
    fetch(urlArenaVision, fetchOpts)
      .then(res => {
        // Set the referer based on the response. If not set, it will redirect to homepage
        fetchOpts.headers.referer = res.url
        
        return res.text()
      })
      .then(async data => {
        LOGGER.info('Extracting the URLs where the channel info is stored...')
        const $ = load(data);
        const channels = $(selectors.channels);

        LOGGER.info('Extracting Acestream links from channels URLs')
        let channelList = []
        for (let i = 0; i < channels.length; i++) {
          const channelInfo = await getChannelsAcestreamLinks(channels[i]);

          if (channelInfo) {
            channelList = channelList.concat(channelInfo)
          }
        }
        LOGGER.info(`Extraction finished successfully: ${channelList}`)
        resolve(channelList);
      })
      .catch(error => reject(error));
  });
};

/**
 * For a given channel, returns its acestream link and channel number
 * @param {Object} channel 
 * @param {Number} index 
 */
async function getChannelsAcestreamLinks(channel) {
  return new Promise(async (resolve, reject) => {
    const channelNo = channel.children[0].data.split(" ")[1];
    const channelPage = getChannelPageLink(channel);

    try {
      LOGGER.info(`Obtaining Arenavision URL for channel ${channelNo} at ${channelPage}`)
      const acestream = await getAcestreamLink(channelPage);

      LOGGER.info(`Acestream URL for channel ${channelNo}: ${acestream}. Tinyfying...`)
      const tinyurl = await tinyfy(acestream);
      resolve([{
        channel: channelNo,
        url: {
          acestream,
          tinyurl
        }
      }]);
    } catch (ex) {
      resolve(undefined);
    }
  });

}

/**
 * Gets the channel URL in order to extract later the Acestream link.
 * If the URL is relative, prepends the full URL. If not, just returns the URL.
 * @param {Object} channel Channel object to extract the channel URL
 * @returns {String} The URL of the channel
 */
function getChannelPageLink(channel) {
  let url = channel.attribs.href;
  if(!url.match(regex.url)){
    if(url.startsWith("/")){
      url = urlArenaVision + url.substr(1)
    } else {
      url = urlArenaVision + url
    }
  }
  return url;
}

/**
 * Based on a Channel URL of Arenavision, extracts the Acestream URL to watch the event
 * @param {String} url URL to get the Acestream link
 */
function getAcestreamLink(url) {
  return new Promise((resolve, reject) => {
    fetch(url, fetchOpts)
      .then(res => res.text())
      .then(data => {
        let res = "";

        let match = regex.usual.exec(data);
        if (match != null && match[1] !== undefined && match[1] !== "") {
          res = match[1]
        } else {
          match = regex.alt.exec(data);
          if (match != null && match[1] !== undefined && match[1] !== "") {
            res = match[1]
          }
        }

        resolve(`acestream://${res}`);
      })
      .catch(error => {
        reject(error)
      });
  });
}

/**
 * Makes an URL tiny
 * @param {String} url URL to tinyfy
 * @returns The same URL but with tinyfy
 */
function tinyfy(url) {
  return new Promise(function (resolve, reject) {
    shorten(url, (res) => {
      resolve(res);
    })
  });
}

exports.default = getChannels;
