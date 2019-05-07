<p align="center"><a href="https://nodei.co/npm/arenavision-scraper/"><img src="https://nodei.co/npm/arenavision-scraper.png"></a></p>

# Arenavision Scraper [![Build Status](https://travis-ci.org/Dionakra/arenavision-scraper.svg?branch=master)](https://travis-ci.org/Dionakra/arenavision-scraper) [![Coverage Status](https://coveralls.io/repos/github/Dionakra/arenavision-scraper/badge.svg?branch=master)](https://coveralls.io/github/Dionakra/arenavision-scraper?branch=master)
Scrapes Arenavision.ru in order to get the events displayed on the guide and obtaining the acestream links.

__Version 1.0.15 changes__ I have changed the entire object returned by the methods, added one more that encapsulates the other two, added CI with Travis, tests and coverage results. The returned object is slightly different but much better. Therefore, the README has the 1.0.15 docs. To see previous docs, just go through the README git history.

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
### getGuide()
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


### getChannels()
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

### getFullGuide()
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
* [Axios](https://github.com/axios/axios) - HTTP/S requests tool
