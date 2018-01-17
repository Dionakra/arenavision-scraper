const axios = require('axios');
const timeout = 120000;

module.exports = {
  urlArenaVision: 'http://www.arenavision.us',
  selectors: {
    channels: 'ul.menu > li.expanded > ul.menu > li > a',
    acestream: 'p.auto-style1 > a[target=_blank]',
    events: 'tbody > tr > td.auto-style13',
    guide: 'ul.menu > li[class=leaf] > a'
  },
  prop: {
    day: 0,
    time: 1,
    sport: 2,
    competition: 3,
    event: 4,
    channels: 5
  },
  urlRegex: /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
}
