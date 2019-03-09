const load = require("cheerio").load;
const axios = require("axios");
const shorten = require('tinyurl').shorten;
const { urlArenaVision, selectors, urlRegex, axiosOpts } = require("./params");

/**
 * Obtains all the channels and their acestream links
 */
function getChannels() {
  return new Promise((resolve, reject) => {
    axios.get(urlArenaVision, axiosOpts)
      .then(async response => {
        const $ = load(response.data);
				const channels = $(selectors.channels);

				let channelList = []
				for(let i = 0; i< channels.length; i++){
					const channelInfo = await getChannelsAcestreamLinks(channels[i]);

					if(channelInfo) {
						channelList = channelList.concat(channelInfo)
					}
				}
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
		const channelNo = channel.children[0].data.split(" ")[1]; // Nimber of the channel extracted from the HTML
		const channelPage = getChannelPageLink(channel);

		try {
			const acestream = await getAcestreamLink(channelPage);
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
function getChannelPageLink(channel){
	const url = channel.attribs.href;
	return url.match(urlRegex) ? url : urlArenaVision + url;
}

/**
 * Based on a Channel URL of Arenavision, extracts the Acestream URL to watch the event
 * @param {String} url URL to get the Acestream link
 */
function getAcestreamLink(url) {
  return new Promise((resolve, reject) => {
    axios.get(url, axiosOpts)
      .then(response => {
        const $ = load(response.data);
				const link = $(selectors.acestream);
        resolve(link[0].attribs.href);
      })
      .catch(error => reject(error));
  });
}

/**
 * Makes an URL tiny
 * @param {String} url URL to tinyfy
 * @returns The same URL but with tinyfy
 */
function tinyfy(url){
  return new Promise(function (resolve, reject) {
    shorten(url, (res) => {
      resolve(res);
    })
  });
}

exports.default = getChannels;
