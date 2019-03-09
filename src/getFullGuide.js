const getGuide = require('./getGuide').default
const getChannels = require('./getChannels').default
const flatMap = require('lodash/flatMap')

async function getFullGuide() {
  const [guide, channels] = await Promise.all([getGuide(), getChannels()]);

  return new Promise((resolve, reject) => {
    const fullGuide = guide.map(event => {
      let eventUrls = []
      const eventChannels = flatMap(event.channels, channel => {
        const channelInfo = getAcestreamURL(channel.channel, channels)

        if(channelInfo){
          const acestreamURL = channelInfo.url.acestream
        
          if(!eventUrls.includes(acestreamURL)){
            channel.url = channelInfo.url
            eventUrls = eventUrls.concat(acestreamURL)
            return channel
          } else {
            return []
          }
        }
        
      })
      event.channels = eventChannels
      return event
    })
  
    resolve(fullGuide)
  })
}

function getAcestreamURL(channelNo, channels){
  return channels.filter(channel => channel.channel == channelNo)[0]
}

exports.default = getFullGuide;
