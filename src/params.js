module.exports = {
  urlArenaVision: "https://www.arenavision.us/",
  selectors: {
    channels: "ul.menu > li.expanded > ul.menu > li > a",
    events: "tr",
    guide: "ul.menu > li[class=leaf] > a",
    guideImg: "#main img"
  },
  regex: {
    url: /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
    usual: /acestream:\/\/(.*?)\"/,
    alt: /\.m3u8\?id=(.*?)"/,
    guide: /(\d{2}\/\d{2}\/\d{4}) (\d{2}:\d{2} CEST) (.*?) (.*?):(.*?),(.*)/m
  },
  prop: {
    day: 0,
    time: 1,
    sport: 2,
    competition: 3,
    event: 4,
    channels: 5
  },
  fetchOpts: {
    "credentials": "include",
    "headers": {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
      "accept-language": "es",
      "cache-control": "no-cache",
      "dnt": "1",
      "pragma": "no-cache",
      "sec-fetch-mode": "navigate",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36"
    },
    "referrerPolicy": "no-referrer-when-downgrade",
    "body": null,
    "method": "GET",
    "mode": "cors"
  }
};
