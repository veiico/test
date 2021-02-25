import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

import { ApiService } from './services/api.service';
import { of, BehaviorSubject } from 'rxjs';
import { SessionService } from './services/session.service';
import { LoaderService } from './services/loader.service';
import { tookanResponse } from './constants/constant';
import { environment } from '../environments/environment';

// import { Headers } from '@angular/http';
// import 'rxjs/add/operator/map';
// import { HttpClient } from '@angular/common/http';
// import '../getFBSDK.ts';

@Injectable()
export class AppService {
  public langData: any = {};
  public notDeliverable = new BehaviorSubject({})
  public langPromise: Promise<boolean> = new Promise(() => { });

  constructor(
    private api: ApiService,
    private http: HttpClient,
    private sessionService: SessionService,
    private loaderService: LoaderService
  ) {
    window['s'] = this;
  }

  /**
   * notdeliverable input 
   */
  notDelivered(data) {
    this.notDeliverable.next(data)
  }

  fetchAppConfiguration() {
    const obj = {
      url: 'marketplace_fetch_app_configuration',
      body: {}
      // 'headers': this.headers
    };
    return this.api.get(obj);
  }


  flightmap_reverse_geocode(lngLat) {
    const data = {
      lat: lngLat.lat,
      lng: lngLat.lng,
      fm_token: this.sessionService.get('config').map_object.webapp_map_api_key,
      user_unique_key: this.sessionService.get('config').marketplace_user_id.toString(),
      zoom: '18'
    };
    return this.http.get(`${environment.maps_api_url}/search_reverse`, { params: new HttpParams({ fromObject: data }) }).pipe(
      map(this.tookanResponse).bind(this))
  }

  fetchTemplates(user_id, preview_theme_id, pageName?) {
    const obj: any = {
      url: 'themes/getComponentsByPage',
      body: {
        name: pageName || 'home',
        component_data: 1,
        marketplace_user_id: user_id,
        post_to_get: 1,
        noDualUser: 1
      }
    };
    if (preview_theme_id) {
      obj.body.theme_id = preview_theme_id;
      // 'headers': this.headers
    }

    return this.api.get(obj);
  }

  hitLangJson(type) {
    const url = `lang-json/${type}.json`;
    let resolve, reject;
    this.langPromise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return this.http.get(url, { responseType: 'text' }).pipe(
      map(response => {
        try {
          this.langData = JSON.parse(response);
        } catch (e) {
          this.langData = response;
        } finally {
          resolve(true);
          return response;
        }
      }),
      catchError(e => of(console.error('error of lang json', e)))
    );
    // .map(response => {this.langData = response.json();});
  }

  getAddressFromIp() {
    const url = 'https://ipinfo.io/?callback=';
    return this.http.get(url).pipe(map(tookanResponse));
    // .map(response => {this.langData = response.json();});
  }

  getLangJsonData() {
    return this.langData;
  }

  getAddonConfig() {
    const obj: any = {
      url: 'addOn/get',
      body: {}
    };
    return this.api.get(obj);
  }

  getAlternateIP() {
    return this.http
      .get("https://api.ipify.org/?format=json")
      .pipe(map((res: any) => res));
  }
  tookanResponse(res: any) {
    return res;
  }

  hitLanguageStrings() {
    let resolve, reject;
    this.sessionService.langStringsPromise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    const obj = {
      url: 'getAccountTranslations',
      body: {}
    };
    this.loaderService.show();
    this.api.post_test(obj).subscribe((response)=>{
      setTimeout(() =>{
        this.sessionService.languageStrings = response.data.language_strings;
        resolve(true);
        this.loaderService.hide();
      },0);
    })

  }
}
