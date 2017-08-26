var {getGuide, getChannels} = require('./scrape.js');

getGuide('http://212.109.219.81:8888').then((data) => {
  console.log(data);
});

getChannels('http://212.109.219.81:8888').then((data) => {
  console.log(data);
});
