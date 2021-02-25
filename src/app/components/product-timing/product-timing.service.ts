/**
 * Created by cl-macmini-51 on 08/05/18.
 */
import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';


import { SessionService } from '../../services/session.service';
import { ApiService } from '../../services/api.service';

// import { Headers } from '@angular/http';

@Injectable()
export class ProductTimingService {
  addService :EventEmitter<any> =  new EventEmitter<any>(); 

  constructor(private apiService: ApiService, private sessionService: SessionService) { }

  getSlotsForDayForProduct(payload): Observable<any> {
    // const headers = new Headers();
    // payload.reference_id = this.sessionService.getString('appData').vendor_details.reference_id;
    // payload.user_id = this.sessionService.get('user_id');
    // payload.marketplace_user_id = this.sessionService.getString('config').marketplace_user_id;
    payload.marketplace_reference_id = this.sessionService.get('config').marketplace_reference_id;
    if (this.sessionService.get('appData')) {
      payload['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      payload['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    const apiObj = {
      url: 'get_product_timeslots',
      'body': payload,
      // 'headers': headers
    };
    return this.apiService.post(apiObj);
  }
  availableDates(payload): Observable<any> {
    // const headers = new Headers();
    // payload.vendor_id = this.sessionService.getString('appData').vendor_details.vendor_id;
    // payload.access_token = this.sessionService.getString('appData').vendor_details.app_access_token;
    // payload.reference_id = this.sessionService.getString('appData').vendor_details.reference_id;
    payload.user_id = this.sessionService.get('user_id');
    payload.marketplace_user_id = this.sessionService.get('config').marketplace_user_id;
    payload.marketplace_reference_id = this.sessionService.get('config').marketplace_reference_id;
    const apiObj = {
      url: 'product/getAvailableDates',
      'body': payload,
      // 'headers': headers
    };
    return this.apiService.post(apiObj);
  }

  checkTimeSlots(payload): Observable<any> {
    // const headers = new Headers();
    // payload.vendor_id = this.sessionService.getString('appData').vendor_details.vendor_id;
    // payload.access_token = this.sessionService.getString('appData').vendor_details.app_access_token;
    // payload.reference_id = this.sessionService.getString('appData').vendor_details.reference_id;
    payload.timezone = new Date().getTimezoneOffset();
    // payload.marketplace_reference_id = this.sessionService.getString('config').marketplace_reference_id;
    const apiObj = {
      url: 'order/checkTimeSlots',
      'body': payload,
      // 'headers': headers
    };
    return this.apiService.post(apiObj);
  }

  addServiceToCart(data){
    this.addService.emit(data);
  }

  getAgentList(payload){
    const apiObj = {
      url: 'product/getAgents',
      'body': payload,
    };
    return this.apiService.post(apiObj);
  }
}

