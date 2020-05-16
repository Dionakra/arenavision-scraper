# Arenavision Scraper _(DEPRECATED)_
_This library has been deprecated. Please refer to [this issue](https://github.com/Dionakra/arenavision-scraper/issues/6) if you want to know why. It has been fun, but it is over._
Node library for obtaining information related to sports events and acestream links to watch them stored at Arenavision.


## Installation (NPM)
``` bash
$ npm install --save arenavision-scraper
```

## Installation (Github)
``` bash
$ git clone https://github.com/Dionakra/arenavision-scraper.git
$ cd arenavision-scraper
$ npm install
```

## Available methods (v 1.0.15+)
### getGuide(enableLog = false)
It scrapes the *guide* page of Arenavision and returns a Promise with a JSON containing every event on this page.

#### Example
``` js
const { getGuide } = require('arenavision-scraper');

getGuide().then(console.log);
```
```
[
  {
    "day": "09/03/2019",
    "time": "17:00 CET",
    "sport": "SOCCER",
    "competition": "FRANCE LIGUE 1",
    "event": "STRASBOURG - OLYMPIQUE LYON",
    "channels": [
      {
        "channel": "21",
        "lang": "FRE",
      }
    ]
  },
  {
    "day": "09/03/2019",
    "time": "17:45 CET",
    "sport": "RUGBY",
    "competition": "6 NATIONS",
    "event": "ENGLAND - ITALY",
    "channels": [
      {
        "channel": "15",
        "lang": "SPA"
      }
    ]
  }
]
....
]
```


### getChannels(enableLog = false)
It recovers the channels and its acestream links. That is done because these links are not static, they change sometimes, so you may have to recover these links. It also provides the tinyurl for Acestream.

#### Example
``` js
const { getChannels } = require('arenavision-scraper');

getChannels().then(console.log);
```
```
[
  {
    "channel": "1",
    "url": {
      "acestream": "acestream://93e33b8239023c1ce9106596dc7e9aaa5494f2c2",
      "tinyurl": "http://tinyurl.com/y2ffn77s"
    }
  },
  {
    "channel": "2",
    "url": {
      "acestream": "acestream://93e33b8239023c1ce9106596dc7e9aaa5494f2c2",
      "tinyurl": "http://tinyurl.com/y2ffn77s"
    }
  },
  ....
]
```

### getFullGuide(enableLog = false)
Mix the previous methods in one just to get all the information with just one method.

#### Example
```js
const { getFullGuide } = require('arenavision-scraper');
getFullGuide().then(console.log);
```
```
[
  {
    "day": "09/03/2019",
    "time": "20:45 CET",
    "sport": "SOCCER",
    "competition": "SPANISH LA LIGA",
    "event": "GETAFE - HUESCA",
    "channels": [
      {
        "channel": "1",
        "lang": "SPA",
        "url": {
          "acestream": "acestream://93e33b8239023c1ce9106596dc7e9aaa5494f2c2",
          "tinyurl": "http://tinyurl.com/y2ffn77s"
        }
      },
      {
        "channel": "23",
        "lang": "ENG",
        "url": {
          "acestream": "acestream://f5455a6bab5f6542d0880bc596d20dd13eba13d3",
          "tinyurl": "http://tinyurl.com/ybn8gnoo"
        }
      }
    ]
  }
],
  ....
]
```

## Built With

* [Cheerio](https://github.com/cheeriojs/cheerio) - Scraping tool
* [Lodash](https://github.com/lodash/lodash) - Functionalities tool
* [Node-Fetch](https://github.com/bitinn/node-fetch) - HTTP/S requests tool
