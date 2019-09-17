<p align="center"><a href="https://nodei.co/npm/arenavision-scraper/"><img src="https://nodei.co/npm/arenavision-scraper.png"></a></p>

# Arenavision Scraper [![Build Status](https://travis-ci.org/Dionakra/arenavision-scraper.svg?branch=master)](https://travis-ci.org/Dionakra/arenavision-scraper)
Scrapes Arenavision in order to get the events displayed on the guide and obtaining the acestream links.

__Version 1.0.33 changelog__
Now Arenavision went back to the old fashioned way of displaying data in a HTML table rather in a tiny image, so the image-processing path is no longer required. That's not the only reason to drop that implementation from the library. TesseractJS was causing some problems when I was trying to deploy a Firebase Function using this library. Now with everything related to that implementation removed I have successfully deployed a Firebase Function using this library, so everything is fine.

__Version 1.0.30 changelog__
As now the information extraction is a bit difficult, you have the option of logging everything that happens just in case you need to trace what the f*ck happens when extracting the information. Also it will give you the ability to see what's going on in this long running process.

__Version 1.0.27 changelog__
Arenavision just changed the way they display the events. Now all the information is printed inside an image, so now is much harder to extract information from it. I am ussing TesseractJS to extract the information, but it requires some power. With some tests, on a regular i5 laptop it takes about one minute to get the full guide. In a basic DigitialOcean's droplet, more than five minutes.

__Version 1.0.25 changelog__
Arenavision has put a Cloudflare authentication wall to reject petitions for non-web-users. I couldn't fix this with `axios`, so I moved to `node-fetch` because replicating the HTTP request with the `fetch` built in Chrome command it just works, so its easier for me to get just the same command to Node and copy and paste the options to get it working.

__Version 1.0.24 changelog__
Version 1.0.24 points to www.arenavision.biz, and version 1.0.23 points to www.arenavision.us. If one of them doesn't work, try the other one.

__Version 1.0.15 changelog__ I have changed the entire object returned by the methods, added one more that encapsulates the other two, added CI with Travis, tests and coverage results. The returned object is slightly different but much better. Therefore, the README has the 1.0.15 docs. To see previous docs, just go through the README git history.

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
