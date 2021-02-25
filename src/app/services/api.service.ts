import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import * as $ from 'jquery';

import { environment } from '../../environments/environment';
import { SessionService } from "./session.service";
import { HttpParamEncoder } from '../classes/encoder.class';

// import { HttpClient } from '@angular/common/http';
// import 'rxjs/add/operator/map';

@Injectable()
export class ApiService {
  private isPlatformServer: boolean;
  private protoCol: string = (location && location.protocol && ['http:', 'https:'].includes(location.protocol)) ? location.protocol : 'https:';
  private countryPromise: Promise<any>;
  constructor(private http: HttpClient, private sessionService: SessionService) {
    this.isPlatformServer = this.sessionService.isPlatformServer();
  }

  post(data) {
    const config = this.sessionService.get('config');
    let url = '';
    if (((environment.production || environment.beta))) {
      if (this.sessionService.isMerchantDomain())
        url = `${this.protoCol}//${config.merchant_domain_obj.domain_name}/api/${data.url}`;
      else
        url = `${this.protoCol}//${config.domain_name}/api/${data.url}`;
    } else {
      url = environment.API_ENDPOINT + data.url;
    }
    data.body['domain_name'] = data.body['domain_name'] || this.sessionService.getString('domain'); // 'hyperlocal.taxi-hawk.com';
    if (this.sessionService.get('config') && this.sessionService.get('config').is_dual_user_enable === 1) {
      data.body['dual_user_key'] = 1;
    } else {
      data.body['dual_user_key'] = 0;
    }


    if (!('language' in data.body)) {
      data.body['language'] = this.sessionService.getString('language') || 'en'; // 'a-b-c-web.yelo.red';
    }


    return this.http
      .post(url, data.body)
      .pipe(map(this.tookanResponse));
    // .map(response => response.json()); // , { headers: data.headers }

  }
  post_test(data) {
    const config = this.sessionService.get('config');
    let url = '';
   
      url = environment.API_ENDPOINT + data.url;
    data.body['domain_name'] = data.body['domain_name'] || this.sessionService.getString('domain'); // 'hyperlocal.taxi-hawk.com';

    if (!('language' in data.body)) {
      data.body['language'] = this.sessionService.getString('language') || 'en'; // 'a-b-c-web.yelo.red';
    }
    data.body.marketplace_user_id = this.sessionService.get('config').marketplace_user_id;
    return this.http
      .post(url, data.body)
      .pipe(map(this.tookanResponse));
    // .map(response => response.json()); // , { headers: data.headers }

  }

  put(data) {
    const config = this.sessionService.get('config');
    let url = '';
    if (((environment.production || environment.beta))) {
      if (this.sessionService.isMerchantDomain())
        url = `${this.protoCol}//${config.merchant_domain_obj.domain_name}/api/${data.url}`;
      else
        url = `${this.protoCol}//${config.domain_name}/api/${data.url}`;
    } else {
      url = environment.API_ENDPOINT + data.url;
    }
    data.body['domain_name'] = data.body['domain_name'] || this.sessionService.getString('domain'); // 'hyperlocal.taxi-hawk.com';
    if (this.sessionService.get('config') && this.sessionService.get('config').is_dual_user_enable === 1) {
      data.body['dual_user_key'] = 1;
    } else {
      data.body['dual_user_key'] = 0;
    }


    if (!('language' in data.body)) {
      data.body['language'] = this.sessionService.getString('language') || 'en'; // 'a-b-c-web.yelo.red';
    }


    return this.http
      .put(url, data.body)
      .pipe(map(this.tookanResponse));
    // .map(response => response.json()); // , { headers: data.headers }

  }

  postWithoutDOmain(data) {
    const config = this.sessionService.get('config');
    let url = '';
    if ((environment.production || environment.beta)) {
      if (this.sessionService.isMerchantDomain())
        url = `${this.protoCol}//${config.merchant_domain_obj.domain_name}/api/${data.url}`;
      else
        url = `${this.protoCol}//${config.domain_name}/api/${data.url}`;
    } else {
      url = environment.API_ENDPOINT + data.url;
    }
    return this.http
      .post(url, data.body)
      .pipe(map(this.tookanResponse));
    //.map(response => response.json()); // , { headers: data.headers }

  }

  get(data) {
    const config = this.sessionService.get('config');
    let url = '';
    if ((environment.production || environment.beta)) {
      if (this.sessionService.isMerchantDomain())
        url = `${this.protoCol}//${config.merchant_domain_obj.domain_name}/api/${data.url}`;
      else
        url = `${this.protoCol}//${config.domain_name}/api/${data.url}`;
    } else {
      url = environment.API_ENDPOINT + data.url;
    }

    const params = this.mapDataToUrl(data);
    url += '?' + params;
    return this.http
      .get(url)
      .pipe(map(this.tookanResponse));
    // .map(response => response.json()); // , { headers: data.headers }

  }

  getWithoutPostToGet(data) {
    const config = this.sessionService.get('config');
    let url = '';
    if ((environment.production || environment.beta)) {
      if (this.sessionService.isMerchantDomain())
        url = `${this.protoCol}//${config.merchant_domain_obj.domain_name}/api/${data.url}`;
      else
        url = `${this.protoCol}//${config.domain_name}/api/${data.url}`;
    } else {
      url = environment.API_ENDPOINT + data.url;
    }

    const params = this.mapDataToUrlWithoutPostToGet(data);
    url += '?' + params;
    return this.http
      .get(url)
      .pipe(map(this.tookanResponse));
    // .map(response => response.json()); // , { headers: data.headers }

  }
  private mapDataToUrlWithoutPostToGet(data: any) {
    data.body['domain_name'] = this.sessionService.getString('domain'); // 'a-b-c-web.yelo.red';
    if (this.sessionService.get('config') && this.sessionService.get('config').is_dual_user_enable === 1) {
      data.body['dual_user_key'] = 1;
    }
    else {
      data.body['dual_user_key'] = 0;
    }
    if (!('language' in data.body)) {
      data.body['language'] = this.sessionService.getString('language') || 'en'; // 'a-b-c-web.yelo.red';
    }
    // let params = new HttpParams({ encoder: new HttpParamEncoder(), fromObject: data.body });
    // return params;
    let params = [];
    Object.keys(data.body).forEach(key => {
      params.push(`${encodeURIComponent(key)}=${encodeURIComponent(data.body[key])}`);
    })
    return params.join('&');
  }

  private mapDataToUrl(data: any) {
    const config = this.sessionService.get('config') || {};
    let obj = {
      domain_name: config.domain_name || this.sessionService.getString('domain'),

      post_to_get: 1,
      ...data.body
	}

	if(!data.body.noDualUser){
		obj = {
			...obj,
			dual_user_key: config.is_dual_user_enable === 1 ? 1 : 0,
            language: data.body['language'] || this.sessionService.getString('language') || 'en'
		}
	}
	else{
		delete obj.noDualUser;
	}

    // let params = new HttpParams({
    //   encoder: new HttpParamEncoder(),
    //   fromObject: { ...data.body, ...obj },
    // });
    let params = [];
    Object.keys(obj).forEach(key => {
      params.push(`${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`);
    })
    return params.join('&');
  }


  getCountryData(data) {
    let url = '';
    url = environment.API_ENDPOINT_TOOKAN + data.url;
    // const fromSession = sessionStorage.getItem('country_config');
    // if (fromSession) {
    //   return of(JSON.parse(fromSession));
    // }
    if (!this.countryPromise) {
      this.countryPromise = this.http
        .get(url)
        .pipe(map((res: any) => {
          // sessionStorage.setItem('country_config', JSON.stringify(res));
          return res;
        })).toPromise();
    }
    return new Observable((observer) => {
      this.countryPromise.then(res => {
        observer.next(res);
        observer.complete();
      }).catch(err => observer.error(err))
      return () => observer.unsubscribe();
    });
    // .map(response => response.json()); // , { headers: data.headers }

  }

  getCountryInfo() {
    let url = 'requestCountryCodeGeoIP2';
    url = environment.API_ENDPOINT_TOOKAN + url;
    if (!this.countryPromise) {
      this.countryPromise = this.http
        .get(url)
        .pipe(map((res: any) => {
          return res;
        })).toPromise();
    }
    return new Observable((observer) => {
      this.countryPromise.then(res => {
        observer.next(res);
        observer.complete();
      }).catch(err => observer.error(err))
      return () => observer.unsubscribe();
    });
  }
  getWithEncodedParams(api_url, params) {
    const config = this.sessionService.get('config');
    let url = '';
    if ((environment.production || environment.beta)) {
      if (this.sessionService.isMerchantDomain())
        url = `${this.protoCol}//${config.merchant_domain_obj.domain_name}/api/${api_url}`;
      else
        url = `${this.protoCol}//${config.domain_name}/api/${api_url}`;
    } else {
      url = environment.API_ENDPOINT + api_url;
    }

    return this.http
      .get(url, { params })
      .pipe(map(this.tookanResponse));
  }

  /** Tookan not following response code standards. */
  tookanResponse(res: any) {
    return res;
  }

}
