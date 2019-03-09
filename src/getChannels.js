const load = require("cheerio").load;
const axios = require("axios");
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
					const channelInfo = await getChannelsAcestreamLinks(channels[i], i);

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
async function getChannelsAcestreamLinks(channel, index) {
	return new Promise(async (resolve, reject) => {
		const url = getChannelPageLink(channel);

		try {
			const acestream = await getAcestreamLink(url);
			resolve([{
				channel: index + 1, // Channels start at 1, not 0 like Arrays
				url: acestream
			}]);
		} catch (ex) {
			//console.debug(`This URL couldn't be requested: ${url}`);
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

exports.default = getChannels;
