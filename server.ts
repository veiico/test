//config
import { join } from 'path';
// require('dotenv').config(process.cwd(), '..', '.env')
const { environment } = require('./env');
import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import { enableProdMode } from '@angular/core';

// if (environment.production)
//   var https = require("http");
// else
var https = require('https');

var redis = require('redis');

const rateLimit   = require("express-rate-limit");
const fs          = require("fs");
const compression = require('compression');

var redis_client;
const pageList = ['home', 'list', 'store', 'orders', 'settings', 'loyalty', 'profile', 'payment','debtAmount'];


const pageListLaundry = ['home'];


//if (environment.production) {
//try {
//var raven = require('raven');
// var raven_client = new raven.Client(environment.RAVEN_CLIENT);
//  raven_client.patchGlobal();
// } catch (e) {
// console.error(e);
// }
//}

// Express Engine
// import { ngExpressEngine } from '@nguniversal/express-engine';
// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

import * as express from 'express';
import { renderModuleFactory } from '@angular/platform-server';
import { readFileSync } from 'fs';

var domino = require('domino');

var window = domino.createWindow('<h1>Hello world</h1>', 'http://example.com');
var document = window.document;

var $ = jqueryMorph();

window['fuguInit'] = function() {};
global['window'] = window;
global['document'] = document;
global['$'] = $;
global['ga'] = function() {};
global['KeyboardEvent'] = {};
global['Event'] = {};
global['location'] = {};
global['MouseEvent'] = {};

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();

const PORT = environment.SSR_PORT || 4000;
const DIST_FOLDER = join(process.cwd(), environment.DIST, 'browser');
const LANG_PATH   = join(process.cwd(), environment.DIST, "../../", 'userFiles');

// * NOTE :: leave this as require() since this file is built Dynamically from webpack

const languageSpecificData = {};
setLanguageSpecificData();

// Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
// app.engine(
//   'html',
//   ngExpressEngine({
//     bootstrap: AppServerModuleNgFactory,
//     providers: [provideModuleMap(LAZY_MODULE_MAP)],
//   })
// );

app.engine('html', (_, options, callback) => {
  // console.log(
  //   'req params, locale ',
  //   options.req.path,
  //   options.req.params.locale
  // );
  // const lang = options.req.path.split('/')[1] || 'en';
  const lang     = options.req.params.locale;
  const path     = options.req.path;
  window['language'] = lang;
  window['path'] = path;
  getIndexFile(lang).then((template)=>{
    renderModuleFactory(languageSpecificData[lang].AppServerModuleNgFactory, {
      // Our index.html
      document: template.toString(),
      url     : options.req.url,
      // DI so that we can get lazy-loading to work differently (since we need it to just instantly render it)
      extraProviders: [
        provideModuleMap(languageSpecificData[lang].LAZY_MODULE_MAP)
      ]
    }).then(html => {
      callback(null, html);
    });
  })
});

app.use(compression()); 

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type,access_token'
  );
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'en'));
app.set('trust proxy', 1);

const WHITELIST_IPS = [
  "54.203.56.53",
  "54.202.72.25",
  "172.31.10.22",
  "172.17.0.1",
  "35.154.18.171",
  "13.244.178.247",
  "127.0.0.1",
  "34.208.16.103",
  "135.181.45.100",
  "165.22.223.6"
]

const limiter = rateLimit({
  windowMs: 3 * 1000, // 3 sec
  max: 3,
  message: "Too many requests, please try again later.",
  statusCode: 429,
  headers: true,
  skipFailedRequests: false,
  keyGenerator: function(req /*, res*/) {
    return req.headers['x-forwarded-for'];
  },
  handler: function(req, res /*, next*/) {
    console.log("blocked",req.headers['x-forwarded-for'], "", req.get('host'));
    try{
      res.sendFile(
        join(
          process.cwd(),
          `${environment.DIST}/browser/en`,
          'error-429.html'
        ));
    }catch(error){
      res.status(429).send("Too many requests, please try again later.");
    }
  },
  skip : function(req){
    // can whitelist some ips here
    // US nginx - 54.203.56.53
    // US ssr - 54.202.72.25 
    // US ssr - 172.31.10.22 
    // US ssr - 172.17.0.1
    // India nginx - 35.154.18.171
    // capetown - 13.244.178.247
    // localhost for internal hits - 127.0.0.1
    // Haproxy - 34.208.16.103
    // Rendertron - 135.181.45.100
    // Office VPN - 165.22.223.6
    if(WHITELIST_IPS.indexOf(req.headers['x-forwarded-for'])>-1){
      console.log("skipped rate limit for ", req.headers['x-forwarded-for'], req.get('host'));
      return true;
    }else{
      return false;
    }
  }
});

const throttle = rateLimit({
  windowMs: 30 * 1000, // 30 sec
  max: 1,
  keyGenerator: function(req /*, res*/) {
    const host = getHost(req.get('host'));
    const lang = req.params.locale;
    return host+"-"+lang;
  },
  handler: async function(req, res /*, next*/) {
      const host = getHost(req.get('host'));
      const lang = req.params.locale;
      let sendCache = checkIfSendFromCache(req.url, lang);
      if(sendCache && await checkIfFileExists(join(LANG_PATH, host,`${lang}.html`))){
        console.log("got same hit- sending response from cache for ", req.get('host'));
        res.sendFile(join(LANG_PATH, host,`${lang}.html`));
      }else{
        sendLangResponse(req, res);
      }
  },
  skip : function(req){
    if(req.query.is_preview){
      console.log("giving fresh data for preview for ", req.get('host'));
      return true;
    }else{
      return false;
    }
  }
});

// Example Express Rest API endpoints
// app.get('/api/**', (req, res) => { });
// Server static files from /browser
app.get(
  '*.*',
  express.static(DIST_FOLDER, {
    maxAge: '1y'
  })
);
app.get('/ping', function (req, res) {
  res.send(200)
  })
// All regular routes use the Universal engine
// app.get('/:locale(en|fr)/:route(freelancer|list|/|ecom|stripe)', async (req, res) => {
app.get(
  `/:locale(${environment.SSR_Langs.join('|')})/*`,limiter, throttle,
  async (req, res, next) => {
    console.log('request', req.url);
    console.log("ip", req.headers['x-forwarded-for'])
    // console.log("rate limit check", req.rateLimit)
    const regex = new RegExp(/^(.*)\.(.*)$\/?$/, 'i');
    const assetsRegex = new RegExp(/^assets\/(.*)\.(.*)$\/?$/, 'i');
    if (req.url.endsWith('null') || req.url.endsWith('null/')) {
      res.status(404).send('Not found'); // HTTP status 404: NotFound
    } else if (assetsRegex.test(req.url)) {
      try{
        res.sendFile(join(process.cwd(),`${environment.DIST}/browser/${req.params.locale}`,req.url));
      }catch (e) {
        res.status(404).send('Not found');
      }
    } else if (regex.test(req.url)) {
      try{
        res.sendFile(join(process.cwd(), `${environment.DIST}/server`, req.url));
      }catch (e) {
        res.status(404).send('Not found');
      }
    } else {
      sendLangResponse(req, res);
    }
  }
);

app.get(`/devops/*`, async (req, res, next) => {
  req.setTimeout(5000, (err, res)=>{});
  res.send({ status: 200 });
});

app.get(
  `/updateRedis/:locale(${environment.SSR_Langs.join('|')})`,
  async (req, res, next) => {
    const host = req.get('host');
    const lang = req.params.locale || 'en';
    // const theme_id = req.query.is_preview ? req.query.theme_id : '';

    const config = await fetchApp(host, lang);

    let templates:any = {
       pages: {},
       components: {}
    };
    if (config.theme_enabled) {
      for(let i=0; i<pageList.length; i++){
          let temp = await fetchTemplates(
            host,
            config.marketplace_user_id,
            null,
            pageList[i]
            // theme_id
          );
       templates.pages[pageList[i]] = temp.page_template
       templates.components = Object.assign({}, templates.components, temp.components);
      }
    }


    redis_client.set(`${host}:${lang}`, JSON.stringify({ config, templates }));

    //    redis_client.set(`${host}:${lang}`, JSON.stringify(config));
    console.log('redis force update successful');
    res.send({ status: 200 });
  }
);

app.get(
  '**',
  express.static(DIST_FOLDER, {
    maxAge: '1y'
  })
);

initRedis();

function initRedis() {
  redis_client = redis.createClient(
    environment.REDIS_PORT,
    environment.REDIS_HOST
  );
  redis_client.on('connect', function() {
    // Start up the Node server
    console.log('Redis connected');
    app.listen(PORT, () => {
      console.log(`Node Express server listening on http://localhost:${PORT}`);
      setIndexFileInRedis();
    });
  });
}

function jqueryMorph() {
  'use strict';

  var _createClass = (function() {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ('value' in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    return function(Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }

  var $: any = (function() {
    function $() {
      var _this = this;

      _classCallCheck(this, $);

      return function() {
        return _this;
      };
    }

    _createClass(
      $,
      [
        {
          key: 'on',
          value: function on() {}
        }
      ],
      {}
    );
    _createClass(
      $,
      [
        {
          key: 'click',
          value: function click() {}
        }
      ],
      {}
    );
    _createClass(
      $,
      [
        {
          key: 'removeClass',
          value: function removeClass() {}
        }
      ],
      {}
    );

    return $;
  })();
  return new $();
}

function fetDataFromRedis(domain, lang, queryParams, reqParams) {
  return new Promise((resolve, reject) => {
    redis_client.get(`${domain}:${lang}`, async function(err, reply) {
      // reply is null when the key is missing
      // console.log(JSON.parse(reply).templates, '***************************');
      let pageName = "home";
      if (
        reply &&
        // reply.templates &&
        !queryParams.is_preview

      ) {
        if(JSON.parse(reply).config.theme_enabled && JSON.parse(reply).templates.pages && JSON.parse(reply).templates.pages[pageName])
          resolve(JSON.parse(reply));
        else if(!JSON.parse(reply).config.theme_enabled){
          resolve(JSON.parse(reply));
        }
      }
      // if (!reply) {
      const config = await fetchApp(domain, lang, queryParams);

        switch(config.onboarding_business_type){
        case 8: pageList.forEach(val => {

                if  (reqParams.match(val)) {
                   pageName = val;
                }
                });
                break;

        case 805: pageListLaundry.forEach(val => {
                if  (reqParams.match(val)) {
                   pageName = val;
                }
                });
                break;
      }
      const theme_id = queryParams.is_preview ? queryParams.theme_id : '';

      let templates: any = {};

      if (config.theme_enabled) {
        if (reply && JSON.parse(reply).templates && Object.keys(JSON.parse(reply).templates).length) {
          templates = {
            pages: JSON.parse(reply).templates.pages ,
            components: JSON.parse(reply).templates.components
          };
        } else {
          templates = {
            pages: {},
            components: {}
          };
        }
        let temp = await fetchTemplates(
          domain,
          config.marketplace_user_id,
          theme_id,
          pageName
        );

        templates.pages[pageName] = temp.page_template;
        templates.components = Object.assign(
          templates.components,
          temp.components
        );
      }

      // resolve(templates);
      if (
        !reply ||
        queryParams.is_preview
      ) {
        resolve({ config, templates });
        // resolve(templates);
      }

      //set in redis
      console.log('Saving in redis');
      if (!queryParams.is_preview) {
        redis_client.set(
          `${domain}:${lang}`,
          JSON.stringify({ config, templates })
        );
      }
      // }
      // resolve(JSON.parse(reply));
    });
  });
}

function fetchApp(domain, lang, queryParams = {}) {
  let url = `${
    environment.SSR_API_ENDPOINT
  }marketplace_fetch_app_configuration?domain_name=${domain}&post_to_get=1&source=0&language=${lang}`;

  if (queryParams['from_dash']) {
    url += '&webapp_open_via_dashboard=1';
  }

  return new Promise<any>((resolve, reject) => {
    console.log('url', url);
    var req = https.get(url, function(res) {
      var output = '';
      res.setEncoding('utf8');

      res.on('data', function(chunk) {
        output += chunk;
      });

      res.on('end', function() {
        try {
          var obj = JSON.parse(output);
          resolve(obj);
        } catch (error) {
          console.log('fetch app parse error');
          console.log(error);
        }
      });
    });

    req.on('error', function(err) {
      reject(err);
      //res.send('error: ' + err.message);
    });

    req.end();
  });
}

function setLanguageSpecificData() {
  const languages = environment.SSR_Langs;
  languages.forEach(lang => {
    const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require(`./${
      environment.DIST
    }/server/${lang}/main`);
    languageSpecificData[lang] = { AppServerModuleNgFactory, LAZY_MODULE_MAP };
  });
}

function fetchTemplates(domain, user_id, theme_id?, pName?) {
  console.log('fetching Data for Page', pName);
  const url = `${
    environment.SSR_API_ENDPOINT
  }themes/getComponentsByPage?domain_name=${domain}&name=${pName}&component_data=1&marketplace_user_id=${user_id ||
    50739}&post_to_get=1${theme_id ? `&theme_id=${theme_id}` : ''}`;

  return new Promise<any>((resolve, reject) => {
    console.log('url', url);
    var req = https.get(url, function(res) {
      var output = '';
      res.setEncoding('utf8');

      res.on('data', function(chunk) {
        output += chunk;
      });

      res.on('end', function() {
        try {
          var obj = JSON.parse(output).data;
          resolve(obj);
        } catch (error) {
          console.log('themes parse error');
        }
      });
    });

    req.on('error', function(err) {
      reject(err);
      //res.send('error: ' + err.message);
    });

    req.end();
  });
}

function createLangFile(domain, lang, html) {
  let path = join(LANG_PATH,domain);
  fs.mkdir(path, {recursive: true}, (err, result) => {
    if (err) {
      if(err.code !='EEXIST'){
        console.error(err);
        return;
      }
    }
    fs.writeFile(join(path,`${lang}.html`), html, (err) => {
      if (err){
        console.error("error in creating lang file", join(path,`${lang}.html`));
        console.error(err);
      }
      console.log(join(path,`${lang}.html`), " written");
    });
  });
}

function readFile(srcPath) {
  return new Promise(function (resolve, reject) {
      fs.readFile(srcPath, 'utf8', function (err, data) {
          if (err) {
              reject(err)
          } else {
              resolve(data);
          }
      });
  })
}

function createFileFromExisting(sourcePath, domain, lang){
  readFile(sourcePath).then((results)=>{createLangFile(domain, lang, results)}).catch(err=>{console.error(err)})
}

function checkIfFileExists(path){
 return new Promise((resolve, reject)=>{
  fs.access(path, fs.F_OK, (err) => {
    if (err) {
      return resolve(false);
    }
    resolve(true);
  })
 });
}

function getHost(host){
  if(!host){
    return host;
  }
  if (
    !(environment.production || environment.beta) &&
    (host.startsWith('localhost') || host.startsWith('35.154.18.171') || host.startsWith('34.209.115.53'))
  ){
    host = 'latertest-betaweb.yelo.red';
  }
  return host;
}

async function sendLangResponse(req, res){
  let host = getHost(req.get('host'));
  console.log(host);
  const lang        = req.params.locale;
  const queryParams = req.query;
  const reqParams   = req.params['0'];
  let resSent = 0;
  let sendCache = checkIfSendFromCache(req.url, lang);
  let path    = join(LANG_PATH, host,`${lang}.html`);
  if(!queryParams.is_preview && sendCache){
    if(await checkIfFileExists(path)){
      res.sendFile(path);
      resSent = 1;
    }
  }

  const config: any = await fetDataFromRedis(host, lang, queryParams, reqParams);

  if (config.config.status === 201) {
    console.log('Marketplace not available');
    if(!resSent){
      res.sendFile(join(process.cwd(),`${environment.DIST}/browser/en`,'no-market.html'));
    }
    createFileFromExisting(join(process.cwd(),`${environment.DIST}/browser/en`,'no-market.html'), host, lang);
  }else if(config.config.status == 207) {
    console.log('Billing expired');
    if(!resSent){
      res.sendFile(join(process.cwd(),`${environment.DIST}/browser/en`,'no-billing.html'));
    }
    createFileFromExisting(join(process.cwd(),`${environment.DIST}/browser/en`,'no-billing.html'), host, lang);
  }else {
    window['config'] = config;
    //cookie
    window['cookie'] = req.headers.cookie;

    if(!queryParams.is_preview && sendCache){
      res.render('index', { req, domain: req.url }, function(err, html){
        if(!resSent){
          res.send(html);
        }
        createLangFile(host, lang, html);
      });
    }else{
      res.render('index', { req, domain: req.url });
    }
  }
}

(function createLangDirectory(){
  fs.mkdir(LANG_PATH, {recursive: true}, (err, result) => {
    if (err) {
      if(err.code !='EEXIST'){
        console.error(err);
        return;
      }
    }
    console.log(LANG_PATH , " created");
  });
})()

function setIndexFileInRedis(){
    const languages = environment.SSR_Langs;
    languages.forEach(lang => {
      redis_client.set(`${lang}`, readFileSync(join(DIST_FOLDER, lang, 'index.html')).toString());
    });
    console.log("index files added in redis");
}

function getIndexFile(lang){
  return new Promise((resolve)=>{
    redis_client.get(`${lang}`, (err, result)=>{
      if(result){
        return resolve(result);
      }
      console.log("not found in redis");
      return resolve(readFileSync(join(DIST_FOLDER, lang, 'index.html')).toString());
    });
  });
}


function checkIfSendFromCache(url,lang){
  if(!url || typeof url!="string"){
    return 0;
  }
  let arr = url.split(lang);
  if(arr.length ==2 && (arr[1]=="//" || arr[1]=="/")){
    return 1;
  }else{
    return 0;
  }
}