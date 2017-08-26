var request = require('request');

const headers = {
  'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Cookie':'__cfduid=d1d4b8310312a1267705cb2723e1b324f1491936747; beget=begetok; has_js=1; _ga=GA1.2.93746227.1493840624; _gid=GA1.2.1790409592.1493840624',
  'Host':'www.arenavision.ru',
  'Referer':'http://www.arenavision.ru/',
  'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.81 Safari/537.36'
};
const timeout = 120000;

module.exports = {
  urlArenaVision: 'http://www.arenavision.ru',
  urlGuide: 'http://arenavision.ru/guide',
  selectors: {
    channels: 'ul.menu > li.expanded > ul.menu > li > a',
    acestream: 'p.auto-style1 > a[target=_blank]',
    events: 'tbody > tr > td.auto-style3'
  },
  prop: {
    day: 0,
    time: 1,
    sport: 2,
    competition: 3,
    event: 4,
    channels: 5
  },
  r: function(proxy=null){
    return request.defaults({headers: headers, timeout: timeout, proxy: proxy});
  }
}
