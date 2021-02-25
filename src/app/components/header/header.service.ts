
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SessionService } from '../../services/session.service';
import { ApiService } from '../../services/api.service';

// import { Headers } from '@angular/http';

@Injectable()
export class HeaderService {

  constructor(private apiService: ApiService, private sessionService: SessionService) { }


  getNotifications(payload): Observable<any> {
    // const headers = new Headers();
    payload.reference_id = this.sessionService.get('appData').vendor_details.reference_id;
    payload.user_id = this.sessionService.get('user_id');
    payload.marketplace_user_id = this.sessionService.get('appData').vendor_details.marketplace_user_id;
    const apiObj = {
      url: 'get_app_notifications',
      'body': payload,
      // 'headers': headers
    };
    return this.apiService.post(apiObj);
  }
  //to disable device token
  userLogout() {
    const body = {
      'vendor_id': this.sessionService.get('appData').vendor_details.vendor_id,
      'marketplace_user_id':  this.sessionService.get('appData').vendor_details.marketplace_user_id,
      'access_token' : this.sessionService.get('appData').vendor_details.app_access_token,
      'device_token':this.sessionService.get("device_token") || this.sessionService.get("device_token_app")
    };
    const obj = {
      'url': 'vendor_logout',
      'body': body,
    };
    return this.apiService.post(obj);
  }
  readNotification(payload): Observable<any> {
    // const headers = new Headers();
    payload.reference_id = this.sessionService.get('appData').vendor_details.reference_id;
    payload.user_id = this.sessionService.get('user_id');
    payload.marketplace_user_id = this.sessionService.get('appData').vendor_details.marketplace_user_id;
    const apiObj = {
      url: 'update_app_notifications',
      'body': payload,
      // 'headers': headers
    };
    return this.apiService.post(apiObj);
  }

  removeNotifications(payload): Observable<any> {
    // const headers = new Headers();
    payload.reference_id = this.sessionService.get('appData').vendor_details.reference_id;
    payload.user_id = this.sessionService.get('user_id');
    payload.marketplace_user_id = this.sessionService.get('appData').vendor_details.marketplace_user_id;
    const apiObj = {
      url: 'update_app_notifications',
      'body': payload,
      // 'headers': headers
    };
    return this.apiService.post(apiObj);
  }

  getAllPages(data) {
    const obj = {
      'url': 'userPages/get',
      'body': data,
    };
    return this.apiService.post(obj);
  }

  clearAllNotifications(payload): Observable<any> {
    // const headers = new Headers();
    payload.reference_id = this.sessionService.get('appData').vendor_details.reference_id;
    payload.user_id = this.sessionService.get('user_id');
    payload.marketplace_user_id = this.sessionService.get('appData').vendor_details.marketplace_user_id;
    const apiObj = {
      url: 'update_app_notifications',
      'body': payload,
      // 'headers': headers
    };
    return this.apiService.post(apiObj);
  }

  languageChange(payload): Observable<any> {
    // const headers = new Headers();
    payload.user_id = this.sessionService.get('user_id');
    payload.marketplace_reference_id = this.sessionService.get('config').marketplace_reference_id;
    const apiObj = {
      url: 'language/editVendor',
      'body': payload,
      // 'headers': headers
    };
    return this.apiService.post(apiObj);
  }

  checkApiUrl(): Observable<any> {
    // const headers = new Headers();
    const obj = {
      'url': 'marketplace_fetch_app_configuration',
      'body': {},
      // 'headers': this.headers
    };
    return this.apiService.post(obj);
  }
}
