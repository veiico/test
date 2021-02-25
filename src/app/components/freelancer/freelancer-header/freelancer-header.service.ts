
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SessionService } from '../../../services/session.service';
import { ApiService } from '../../../services/api.service';

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
    payload.marketplace_reference_id = this.sessionService.getString('marketplace_reference_id');
    const apiObj = {
      url: 'language/editVendor',
      'body': payload,
      // 'headers': headers
    };
    return this.apiService.post(apiObj);
  }
}
