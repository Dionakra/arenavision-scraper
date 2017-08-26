# Arenavision Scraper
Scrapes Arenavision.ru in order to get the events displayed on the guide and obtaining the acestream links.

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

## Available methods
### getGuide()
It scrapes de *guide* page of Arenavision and returns a Promise with a JSON containing every event on this page.

#### Example
``` js
var { getGuide } = require('arenavision-scraper');
getGuide()
.then((result) => {
  console.log(result);
}) 
.catch((error) => {
  console.log(error)
});
```

This returns:

```
[{
  day: '26/08/2017',
  time: '10:00 CEST',
  sport: 'MOTOGP',
  competition: 'BRITISH GP',
  event: 'MOTO3 FREE PRACTICE 3',
  channels: {
      '12': 'ENG'
  }
 },
 {
  day: '26/08/2017',
  time: '10:55 CEST',
  sport: 'MOTOGP',
  competition: 'BRITISH GP',
  event: 'MOTOGP FREE PRACTICE 3',
  channels: {
      '12': 'ENG'
  }
 }
]
```


### getChannels()
It recovers the channels and its acestream links. That is done because these links are not static, they change sometimes, so you may have to recover these links

#### Example
``` js
var { getChannels } = require('arenavision-scraper');
getChannels()
.then((result) => {
  console.log(result);
}) 
.catch((error) => {
  console.log(error)
});
```

This returns:

```
[{'1': 'acestream://b6041d93d129acd512e87a603655753adf8546db'},
 {'2': 'acestream://b6041d93d129acd512e87a603655753adf8546db'},
 {'3': 'acestream://b6b533c39b614bacfb062471d05434c25f0348a0'},
 {'4': 'acestream://b6b533c39b614bacfb062471d05434c25f0348a0'},
 {'5': 'acestream://bdaf954deb611ac70ab70372526fc55fa3aec17d'}]
```

## Built With

* [Cheerio](https://github.com/cheeriojs/cheerio) - Scraping tool
* [Lodash](https://github.com/lodash/lodash) - Functionalities tool
* [Request](https://github.com/request/request) - HTTP/S requests tool
