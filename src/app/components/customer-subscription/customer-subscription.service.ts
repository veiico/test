/**
 * Created by mba-214 on 02/11/18.
 */
import { Injectable } from '@angular/core';
import { Observable ,  Subject } from 'rxjs';

import { ApiService } from '../../services/api.service';
import { SessionService } from '../../services/session.service';


@Injectable()
export class CustomerSubscriptionService {

  constructor(private apiService: ApiService, 
    private sessionService: SessionService ) { }


  /**
   * pay amount fee
   */
  payHit(data): Observable<any> {
    const apiObj = {
      url: 'subscription/updateVendorSubscription',
      body: data
    };
    return this.apiService.post(apiObj);
  }

  getSubscriptionPlans(){
    const obj = {
      vendor_id : this.sessionService.get('appData').vendor_details.vendor_id,
      access_token : this.sessionService.get('appData').vendor_details.app_access_token
    }
    const apiObj = {
      url: 'customerSubscription/get',
      body: obj
    };
    return this.apiService.postWithoutDOmain(apiObj);
  }
}
