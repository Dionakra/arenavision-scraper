var { getChannels, getGuide } = require('./scrape.js');

getChannels().then((data) => {
  console.log(data)
}).catch((error) => console.log(error));


getGuide().then((data) => {
  console.log(data)
}).catch((error) => console.log(error));
