/**
 * Created by cl-macmini-51 on 12/07/18.
 */
import { Injectable, Inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Title } from '@angular/platform-browser';
// import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from '../app.service';
import { SessionService } from './session.service';
import { environment } from '../../environments/environment';
import { CommonService } from './common.service';
import { Inspectlet, MarketplaceUserId } from '../enums/enum';
// import { ActivatedRoute } from '@angular/router';

declare var FB: any;
declare var fbq: any;
declare var gtag: any;
declare var smartech: any;

@Injectable()
export class AppStartService {
  public data: any;
  public inspectlet = Inspectlet;
  public marketplaceUserIdEnum = MarketplaceUserId;
  constructor(
    private appService: AppService,
    @Inject(DOCUMENT) private _document: HTMLDocument,
    private titleService: Title,
    private sessionService: SessionService,
    private common: CommonService
  ) {}

  public initialLoad() {
    if (this.sessionService.isPlatformServer()) return true;

    if (!environment.enable_ssr) {
      this.checkApiUrl();

      return this.appService
        .fetchAppConfiguration()
        .toPromise()
        .then(async response => {
          let preview_theme_id = 50;
          this.data = response.data;
          preview_theme_id = this.common.getParams(window.location.href)[
            'theme_id'
          ];
          // this.route.params.subscribe(params => {
          //   console.log(params);
          //   preview_theme_id = params['theme_id'];
          // });
    

          let templates = await this.appService
            .fetchTemplates(this.data.marketplace_user_id, preview_theme_id)
            .toPromise();
          
          this.sessionService.set('config', this.data);
          this.sessionService.set('templates', templates.data);
          this.onFetchAppResponse();
        })

        .catch((err: any) =>
          Promise.reject('unable to get domain details' + err)
        );
    } else {
      this.data = this.sessionService.get('config');
      this.onFetchAppResponse();
    }
  }

  intializeScript(scriptId, scriptName) {
    let js;
    const fjs = document.getElementsByTagName('script')[0];
    if (document.getElementById(scriptId)) {
      return;
    }
    js = document.createElement('script');
    js.id = scriptId;
    js.async = true;
    js.src = scriptName;

    fjs.parentNode.insertBefore(js, fjs);
  }
  initializeAdWords(key) {
    // key = key
    // || "UA-113061976-2"

    this.intializeScript(
      'gtag',
      'https://www.googletagmanager.com/gtag/js?id=' + key
    );

    (<any>window).dataLayer = (<any>window).dataLayer || [];

    (<any>window).gtag = function(a, b) {
      (<any>window).dataLayer.push(arguments);
    };
    gtag('js', new Date());

    gtag('config', key || 'UA-113061976-2');
  }
  intializeFbPixel(pixelId) {
    const invokeScript = (f, b, e, v, n?, t?, s?) => {
      if (f.fbq) return;
      n = f.fbq = function() {
        n.callMethod
          ? n.callMethod.apply(n, arguments)
          : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    };
    invokeScript(
      <any>window,
      <any>document,
      'script',
      'https://connect.facebook.net/en_US/fbevents.js'
    );
    fbq('init', pixelId);
    fbq('track', 'PageView');
  }

  intializeLinkedInPixel(key) {
    (<any>window)._linkedin_data_partner_ids = [];
    (<any>window)._linkedin_data_partner_ids.push(key);
    this.intializeScript(
      'linkedin',
      'https://snap.licdn.com/li.lms-analytics/insight.min.js'
    );
  }

  checkApiUrl() {
    // if (!environment.production) {
    const apiUrl = localStorage.getItem('apiUrl');
    if (apiUrl) {
      environment.API_ENDPOINT = apiUrl;
    }
    // }
  }

  private localStorageBugFixForLocation() {
    try {
      const value = localStorage.getItem('localStorageBugFixForLocation');
      if (!value) {
        localStorage.setItem('localStorageBugFixForLocation', '1');
        localStorage.removeItem('location');
      }
    } catch (e) {}
  }

  private onFetchAppResponse() {
    // if (this.data.color) {
    //   // document.documentElement.style.setProperty(
    //   //   "--theme",
    //   //   this.data.color
    //   // );
    // }
    
    //check condiiton for bumbl script bumbl_domain_name -> src of bumbl script
    if(this.sessionService.get('config').bumbl_domain_name)
    {
      this.initializeBumblScript(this.sessionService.get('config').bumbl_domain_name);
    }

    //check condiiton for oneSignal script(appId)
    if(this.sessionService.get('config').one_signal_app_id)
    {
      this.loadOneSignalScript(this.sessionService.get('config').one_signal_app_id);
    }
    let fb_app_id: any;
    if (this.sessionService.get('config').facebook_app_id) {
      fb_app_id = this.sessionService.get('config').facebook_app_id;
      // fb_app_id = '319801051760673';
      (<any>window).fbAsyncInit = () => {
        FB.init({
          appId: fb_app_id,
          // autoLogAppEvents : true,
          xfbml: false,
          version: 'v3.2'
        });
        FB.AppEvents.logPageView();
      };
      this.intializeScript(
        'facebook-jssdk',
        '//connect.facebook.net/en_US/sdk.js'
      );
    } else {
      fb_app_id = '';
    }

    // ********************* gtag + fb pixel ******************
    if (
      this.sessionService.get('config').fb_pixel_id
      //  || "261724087999662"
    ) {
      this.intializeFbPixel(
        this.sessionService.get('config').fb_pixel_id
        //   || "261724087999662"
      );
    }
    if (
      this.sessionService.get('config').google_analytics_tracking_id ||
      this.sessionService.get('config').google_adwords_key
      //  || "AW-791827547"
    ) {
      this.initializeAdWords(
        this.sessionService.get('config').google_adwords_key
          ? this.sessionService.get('config').google_adwords_key
          : this.sessionService.get('config').google_analytics_tracking_id
        //   || "AW-791827547"
      );
    }

    // ************************ google tag manager script **********************
    if(this.sessionService.get('config').gtm_key){
      this.loadGTM(this.sessionService.get('config').gtm_key);
    }
    if (this.sessionService.get('config').linkedin_pixcel_id) {
      this.intializeLinkedInPixel(
        this.sessionService.get('config').linkedin_pixcel_id
        //   || "261724087999662"
      );
    }

    // ***********************************************************

    if (this.sessionService.get('config').instagram_app_id) {
      this.intializeScript(
        'insta-jssdk',
        'https://cdn.rawgit.com/oauth-io/oauth-js/c5af4519/dist/oauth.min.js'
      );
    }

    if (this.sessionService.get('config').google_client_app_id) {
      this.intializeScript(
        'google-login-jssdk',
        'https://apis.google.com/js/platform.js'
      );
    }
    if (this.data.fav_logo) {
      this._document
        .getElementById('appFavicon')
        .setAttribute('href', this.data.fav_logo);
    }
    if (!environment.production) {
      this.titleService.setTitle(
        this.data.form_name ? this.data.form_name : ''
      );
    }
    this.sessionService.setToString(
      'marketplace_reference_id',
      this.data.marketplace_reference_id
    );
    if (document.getElementById('g_loader')) {
      const element = document.getElementById('g_loader').style;
      element.borderBottomColor = this.data.color;
      element.borderLeftColor = this.data.color;
    }
    const domain = window.location.hostname;
  if (
      domain !== 'localhost' &&
      domain !== 'dev-webapp.yelo.red' &&
      domain !== 'beta-webapp.yelo.red' &&
      domain !== '127.0.0.1' &&
      domain !== 'dev.yelo.red' &&
      location.pathname === '/'
    ) {
      if (this.data.languages && this.data.languages.length === 0) {
        this.sessionService.setToString('language', 'en');
        location.pathname = 'en/';
      } else if (this.data.languages && this.data.languages.length === 1) {
        if (this.data.languages[0].language_code === 'en') {
          this.sessionService.setToString('language', 'en');
          location.pathname = 'en/';
        } else if (this.data.languages[0].language_code !== 'en') {
          this.sessionService.setToString(
            'language',
            this.data.languages[0].language_code
          );
          location.pathname = this.data.languages[0].language_code + '/';
        }
      } else {
        if (this.sessionService.getString('language')) {
          let customLocation = this.sessionService.getString('language') + '/';
          if (customLocation != location.pathname) {
            this.sessionService.setToString('language', 'en');
          }
        }
      }
    } else if (location.pathname !== '/' && domain !== 'localhost') {
      this.sessionService.setToString(
        'language',
        location.pathname.split('/')[1]
      );
    } else if (location.pathname !== '/' && domain === 'localhost') {
      this.sessionService.setToString('language', 'en');
    }

    /* load inspectlet script based on marketplace user id */
    var id;
    switch(this.data.marketplace_user_id) {
      case this.marketplaceUserIdEnum.JINI: id = this.inspectlet.JINI;
                        break;
      case this.marketplaceUserIdEnum.DIETBUDDY: id = this.inspectlet.DIETBUDDY;
                        break;
      default: id = null;
                break;
    }

    if(id != null) {
      this.common.insertInspectletScript(id);
    }
    /**
     * for high steet canabis, live chat script
     */
    if (this.data.marketplace_user_id == 137525) {
      this.initializeCustomScriptWithCode("window.__lc = window.__lc || {};window.__lc.license = 11267002;(function() {var lc = document.createElement('script'); lc.type = 'text/javascript'; lc.async = true;lc.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'cdn.livechatinc.com/tracking.js';var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(lc, s);})();");
    }
    /**
     * for rushy hub, custom script
     */
    if (this.data.marketplace_user_id == 90531) {
      this.loadScript("https://cdnt.netcoresmartech.com/smartechclient.js").then(() => {
        smartech('create', 'ADGMOT35CHFLVDHBJNIG50K9690LIV5DBPC3FJRHIPB1PRRQE51G');
        smartech('register', 'd204b0a45265ed23a4279b51cf6c1873');
        smartech('identify', '');
        smartech('dispatch', 1, {});
      });
    }

    document.getElementsByTagName('body')[0].style.backgroundColor = this.data.webapp_bg_color || '#ffffff';
    document.documentElement.style.setProperty('--rating-bar-color', this.data.admin_rating_bar_color);
    document.documentElement.style.setProperty('--bg-color', this.data.webapp_bg_color);
  }

  /**
   * load google tag manager script
   * @param gtm_key = gtm_key (client specific)
   */
  private loadGTM(gtm_key) {
    if (environment.production) {
      try {
        const load = (w, d, s, l, i) => {
          w[l] = w[l] || []; w[l].push({
            'gtm.start':
              new Date().getTime(), event: 'gtm.js'
          });
          const f = d.getElementsByTagName(s)[0],
            j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src =
              'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
        };
        load(window, document, 'script', 'dataLayer', gtm_key);
      } catch (error) {
        console.error(error);
      }

    }
  }

  /**
   * to load custom scripts of clients
   */
  initializeCustomScriptWithCode(code) {
    const s = document.createElement('script');
    s.type = 'text/javascript';
    try {
      s.appendChild(document.createTextNode(code));
      document.body.appendChild(s);
    } catch (e) {
      s.text = code;
      document.body.appendChild(s);
    }
  }

  /**
   * Load Bumbl Script
   * @param domain = bumbl script src (client specific)
   */
   initializeBumblScript(domain){
     const mySscript = document.createElement('script');
      try{   
     const load = (w,d,t,u,n,a,m) => {
        w['MauticTrackingObject']=n;
        w[n]=w[n]||function(){(w[n].q=w[n].q||[]).push(arguments)},a=d.createElement(t),
        m=d.getElementsByTagName(t)[0];a.async=1;a.src=u;m.parentNode.insertBefore(a,m)
    };
    load(window,document,'script',`${domain}mtc.js`,'mt','','');
    }
      catch(error){
        console.error(error);
    }
   }

   /**
   *  load OneSignal script
   * @param appId = OneSignal appID (client specific)
   */
  
   loadOneSignalScript(appId){   
    this.loadScript("https://cdn.onesignal.com/sdks/OneSignalSDK.js");
    this.initializeCustomScriptWithCodeToHead(`
    window.OneSignal = window.OneSignal || [];
    OneSignal.push(function() {
      OneSignal.init({
        appId: "${appId}",
      });
    });`);
}

  /**
   *  append custom script to head
   */
initializeCustomScriptWithCodeToHead(code) {
  const s = document.createElement('script');
  s.type = 'text/javascript';
  try {
    s.appendChild(document.createTextNode(code));
    document.head.appendChild(s);
  } catch (e) {
    s.text = code;
    document.head.appendChild(s);
  }
}
  /**
   * loading scripts via js
   */
  loadScript(source) {
    return new Promise((resolve, reject) => {
      let script = <any>document.createElement('script');
      const prior = document.getElementsByTagName('script')[0];
      script.async = 1;

      script.onload = script.onreadystatechange = (_, isAbort) => {
        if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
          script.onload = script.onreadystatechange = null;
          script = undefined;

          if (!isAbort) { resolve(); }
        }
      };

      script.src = source;
      prior.parentNode.insertBefore(script, prior);
    });
  }
}
