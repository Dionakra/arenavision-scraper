const {getGuide, getChannels} = require('./scrape.js');


getGuide().then((data) => {
  console.log(data);
});

getChannels().then((data) => {
  console.log(data);
});
