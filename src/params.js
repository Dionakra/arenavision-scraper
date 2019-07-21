module.exports = {
  urlArenaVision: "http://www.arenavision.biz",
  selectors: {
    channels: "ul.menu > li.expanded > ul.menu > li > a",
    events: "tr",
    guide: "ul.menu > li[class=leaf] > a",
  },
  regex: {
    url: /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
    usual:  /acestream:\/\/(.*?)\"/,
    alt: /\.m3u8\?id=(.*?)"/
  },
  prop: {
    day: 0,
    time: 1,
    sport: 2,
    competition: 3,
    event: 4,
    channels: 5
  },
  fetchOpts: {"credentials":"include","headers":{"accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3","accept-language":"es","cache-control":"no-cache","pragma":"no-cache","upgrade-insecure-requests":"1"},"referrerPolicy":"no-referrer-when-downgrade","body":null,"method":"GET"}
};
