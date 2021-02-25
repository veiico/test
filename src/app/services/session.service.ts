import {
  Injectable,
  PLATFORM_ID,
  Inject,
  ElementRef,
  Renderer2
} from '@angular/core';
import { isPlatformServer, DOCUMENT } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

import { TransferState, makeStateKey, Title } from '@angular/platform-browser';
import { environment } from '../../environments/environment';
import { ApiService } from './api.service';
const FETCH_APP_CONFIG = makeStateKey('fetchAppConfig');
const FETCH_APP_TEMPLATES = makeStateKey('fetchAppTemplates');
@Injectable()
export class SessionService {
  yeloDomain: any;
  private config: any;
  private templates: any = { pages: {}, components: {} };
  private localStorage;
  public countryInfo = new BehaviorSubject({})
  public resendOTP;
  public locationTrigger;
  public noListPageRedirection;
  public languageStrings : any = {};
  // public wipayWinRef;
  // public curlecWinRef;
  // public payuWinRef;
  // public payMobWinRef;
  // public wirecardWinRef;
  // public sslCommerzWinRef;
  // public fac3dWinRef;
  // public checkoutComWinRef;
  // public vivaComWinRef;
  // public payHereWinRef;
  // public azulWinRef;
  // public credimaxWinRef;
  // public fatoorahWinRef;
  // public tapWinRef;
  // public thetellerWinRef;
  // public paynowWinRef;
  // public hyperPayWinRef;
  // public paynetWinRef;
  public paymentWinRef;
  public thankYouPageHtml;
  public locationObject: any = {
    lat: '',
    lng: '',
    city: ''
  };
  public is_netcore_enabled;
  public langStringsPromise: Promise<boolean> = new Promise(() => { });
  public isMerchantDomain() {
    return (
      this.config.merchant_domain_obj &&
      !!Object.keys(this.config.merchant_domain_obj || {}).length
    );
  }

  constructor(
    @Inject(PLATFORM_ID) private platform,
    private state: TransferState,
    @Inject(DOCUMENT) private _document: HTMLDocument,
    private titleService: Title
  ) {
    this.configureConfig();
    this.configureLocalStorage();
    console.log('cookiee', this.getCookie('_lc'));
    if (environment.enable_ssr) {
      let _location: any = this.initialLocation();
      this.set('location', _location);
    }
    this.resetTitle();
  }

  private initialLocation() {
    let _location: any = this.getCookie('_lc');
    try {
      if (_location) {
        _location = JSON.parse(_location);
      } else {
        if (this.isMerchantDomain()) {
          //for merchant domain
          let address =
            this.config.merchant_domain_obj &&
            this.config.merchant_domain_obj.address === '-'
              ? ''
              : this.config.merchant_domain_obj.address;
          _location = {
            lat: this.config.merchant_domain_obj.latitude,
            lng: this.config.merchant_domain_obj.longitude,
            city: address
          };
        } else {
          //for admin domain
          let address = this.config.address === '-' ? '' : this.config.address;
          _location = {
            lat: this.config.latitude,
            lng: this.config.longitude,
            city: address
          };
        }
      }
    } catch (e) {
      console.error('cookie error', e, window['cookie']);
      let address = this.config.address === '-' ? '' : this.config.address;
      _location = {
        lat: this.config.latitude,
        lng: this.config.longitude,
        city: address
      };
    } finally {
      return _location;
    }
  }

  public addToTemplates(templates) {
    // this.templates = {};
    if (templates) {
      // console.log(this.templates.pages);
      this.templates.pages[templates.page_template.page_name] =
        templates.page_template;
      this.templates.components = Object.assign(
        {},
        this.templates.components,
        templates.components
      );
    }
    // this.templates[templates.page_template.page_name] = templates;
  }

  private configureConfig() {
    this.config = this.state.get(FETCH_APP_CONFIG, null as any);
    // if(!this.config && !this.isPlatformServer()) {
    //   alert('This service is not available for you. Please contact admin.');
    //   return;
    // }
    if(environment.enable_ssr){
    this.templates = this.state.get(FETCH_APP_TEMPLATES, null as any);
    }


    if (this.isPlatformServer()) {
      this.config = window['config'].config;
      this.templates = window['config'].templates;
      // console.log(this.config, this.templates, "config and templates");
      this.state.set(FETCH_APP_CONFIG, this.config as any);
      this.state.set(FETCH_APP_TEMPLATES, this.templates as any);
    }
  }

  private configureLocalStorage() {
    if (this.isPlatformServer()) {
      let _location: any = this.initialLocation();
      _location = encodeURIComponent(JSON.stringify(_location));
      this.localStorage = {
        obj: {
          domain: this.config.domain_name,
          language: window['language'] || 'en',
          location: _location
        },
        getItem: function(str) {
          return this.obj[str];
        },
        setItem: function(key, value) {
          if (key === 'location') return;
          this.obj[key] = value;
        },
        removeItem: function(key) {
          if (key === 'location') return;
          delete this.obj[key];
        },
        clear: function() {
          this.obj = {};
        },
        length: 1,
        key: null
      };
    } else {
      this.localStorage = window['localStorage'];
      this.locationObject = JSON.parse(
        decodeURIComponent(this.localStorage.getItem('location'))
      );
    }
  }

  set(key, value) {
    if (key == 'config') {
      this.config = value;
      return;
      // this.setStyles();
    }
    if (key == 'templates') {
      // this.templates = value;
      this.addToTemplates(value);
      return;
      // this.setStyles();
    } else if (key == 'location') {
      //set cookie for location
      this.locationObject = value;
      if (!this.isPlatformServer()) {
        document.cookie = `_lc=${encodeURIComponent(
          JSON.stringify(value)
        )}; expires=Thu, 4 Feb 2021 12:00:00 UTC; path=/`;
      }
    }
    value = JSON.stringify(value);
    value = encodeURIComponent(value);
    this.localStorage.setItem(key, value);
  }
  setString(key, value) {
    if (typeof value !== 'string') {
      value = JSON.stringify(value);
    }
    this.localStorage.setItem(key, value);
  }

  setToString(key, value) {
    //value = value;
    this.localStorage.setItem(key, value);
  }

  get(key): any {
    if (key == 'config') return JSON.parse(JSON.stringify(this.config));

    if (key == 'templates') return JSON.parse(JSON.stringify(this.templates));
    if (key == 'location')
      return JSON.parse(JSON.stringify(this.locationObject));
    // if (key == "config") this.config;

    if (this.localStorage.getItem(key)) {
      let data = decodeURIComponent(this.localStorage.getItem(key));
      data = JSON.parse(data);
      return data;
    } else {
      return null;
    }
  }
  getString(key): string {
    if (key === 'domain' && this.config) {
      return this.config.domain_name;
    }

    if (this.localStorage.getItem(key)) {
      let data = this.localStorage.getItem(key);
      return data;
    } else {
      return null;
    }
  }
  setByKey(parentKey, childKey, value) {
    let appObj: any = this.get(parentKey);
    if (!appObj) {
      appObj = {};
    }
    appObj[childKey] = value;
    this.set(parentKey, appObj);
  }
  getByKey(parentKey, childKey, subkey: any = false) {
    const appObj: any = this.get(parentKey);
    if (appObj) {
      if (subkey) {
        return appObj[childKey][subkey];
      } else {
        return appObj[childKey];
      }
    } else {
      return appObj;
    }
  }
  removeByChildKey(parentKey, childKey) {
    const appObj: any = this.get(parentKey);
    if (appObj && typeof appObj === 'object') {
      delete appObj[childKey];
      this.set(parentKey, appObj);
    }
  }
  remove(key) {
    this.localStorage.removeItem(key);
  }
  removeAll() {
    this.localStorage.clear();
  }

  isPlatformServer() {
    return isPlatformServer(this.platform);
  }
  // private setStyles() {
  //   // !isPlatformServer(this.platform) ?
  //     this._document.documentElement.style.setProperty(`--blue`, this.get('config').color);// : '';
  // }

  getCookie(cname) {
    var name = cname + '=';
    var decodedCookie;
    if (this.isPlatformServer())
      decodedCookie = decodeURIComponent(window['cookie']);
    else decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }

  resetTitle() {
    this.titleService.setTitle(
      this.get('config') && this.get('config').form_name
        ? this.get('config').form_name
        : ''
    );
  }

  sortBy(key) {
    return (a, b) => (a[key] > b[key]) ? 1 : ((b[key] > a[key]) ? -1 : 0);
  }
checkForYeloDomains(domain){
     this.yeloDomain = ["yelo.red", "taxi-hawk.com"]
    domain = domain.split(".").splice(-2).join(".");
    if(this.yeloDomain.indexOf(domain)>-1){
    return true;
    }
    return false;
    }
}
