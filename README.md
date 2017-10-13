<p align="center"><a href="https://nodei.co/npm/arenavision-scraper/"><img src="https://nodei.co/npm/arenavision-scraper.png"></a></p>

# Arenavision Scraper
Scrapes Arenavision.ru in order to get the events displayed on the guide and obtaining the acestream links.

__09/09/2017 log__ Arenavision has implemented CloudFlare, and it wants you to fill in the captcha. If the library isn't working for you, just download the source code, put some _console.log(html)_ somewhere and you will find out what is happening.

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
### getGuide([proxy])
It scrapes de *guide* page of Arenavision and returns a Promise with a JSON containing every event on this page. It supports a proxy url to perform the request. It helps on countries where Arenavision is banned, like Spain. 

#### Example
``` js
var { getGuide } = require('arenavision-scraper');

getGuide().then((result) => {
  console.log(result);
}).catch((error) => {
  console.log(error)
});

// Proxy 
getGuide('http://212.109.219.81:8888').then((result) => {
  console.log(result);
}).catch((error) => {
  console.log(error)
});
```

This returns:

```
[  
   {  
      day:'13/10/2017',
      time:'16:30 CEST',
      sport:'SOCCER',
      competition:'FIFA WORLD CUP SUB - 17',
      event:'SPAIN - NORTH KOREA',
      channels:{  
         '8':'SPA',
         '9':'SPA'
      }
   },
   {  
      day:'13/10/2017',
      time:'19:00 CEST',
      sport:'BASKETBALL',
      competition:'EUROLEAGUE',
      event:'BC KHIMKI - VALENCIA BASKET',
      channels:{  
         '15':'SPA',
         '16':'SPA'
      }
   },
....
]
```


### getChannels([proxy])
It recovers the channels and its acestream links. That is done because these links are not static, they change sometimes, so you may have to recover these links. It supports a proxy url to perform the request. It helps on countries where Arenavision is banned, like Spain. 

#### Example
``` js
var { getChannels } = require('arenavision-scraper');

getChannels().then((result) => {
  console.log(result);
}).catch((error) => {
  console.log(error)
});

// Proxy 
getChannels('http://212.109.219.81:8888').then((result) => {
  console.log(result);
}).catch((error) => {
  console.log(error)
});
```

This returns:

```
[ <1 empty item>,
  'acestream://bbda24210d7937932965369c248f7ccdfc2a023f',
  'acestream://bbda24210d7937932965369c248f7ccdfc2a023f',
  'acestream://56d3a01f6e5e74eb2cb5840556d80a52adf2871d',
  'acestream://56d3a01f6e5e74eb2cb5840556d80a52adf2871d',
  'acestream://9ed0bb4cc44b2f5c7b99c9ce609916ccf931f16a',
  'acestream://9ed0bb4cc44b2f5c7b99c9ce609916ccf931f16a',
  'acestream://f252caa464bbdf311e8fa4b016508531ad92df2c',
  'acestream://e5cb58e5b82976076316606ef71e92e97ce863d7',
  'acestream://e5cb58e5b82976076316606ef71e92e97ce863d7',
  'acestream://d6409da7a77f7c7baee5038d73d828a5695e3bde',
  'acestream://d6409da7a77f7c7baee5038d73d828a5695e3bde',
....]
```

## Built With

* [Cheerio](https://github.com/cheeriojs/cheerio) - Scraping tool
* [Lodash](https://github.com/lodash/lodash) - Functionalities tool
* [Request](https://github.com/request/request) - HTTP/S requests tool
