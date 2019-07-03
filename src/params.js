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
  axiosOpts: {
    headers: {
      Cookie:
        "beget=begetok" + "; expires=" + new Date().toGMTString() + "; path=/"
    }
  }
};
