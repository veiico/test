import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../../../services/api.service';
import { SessionService } from '../../../../services/session.service';

@Injectable()
export class AppProductService {

    constructor(private apiService: ApiService, private sessionService: SessionService) { }

    getAllCategory(): Observable<any> {
        const apiObj = {
            serviceName: 'get_app_catalogue',
            method: 'POST',
            serviceType: 3,
            payload: {date_time: (new Date()).toISOString(),
              vendor_id : this.sessionService.get('appData').vendor_details.vendor_id,
              access_token : this.sessionService.get('appData').vendor_details.app_access_token
            }
        };
        // if (this.sessionService.get('appData')) {
        //     apiObj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
        //     apiObj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
        //   }
        return this.apiService.post(apiObj);
    }
      getProduct(payload): Observable<any> {
        payload.date_time = (new Date()).toISOString();
        const apiObj = {
            serviceName: 'get_products_for_category',
            method: 'POST',
            serviceType: 3,
            payload: payload
        };
        return this.apiService.post(apiObj);
      }
    //   getAllCategory(): Observable<any> {
    //     let apiObj = {
    //         serviceName: 'get_app_catalogue',
    //         method: 'POST',
    //         serviceType: 8,
    //         payload: {}
    //     }
    //     return this.apiService.apiCall(apiObj);
    // }
    //   getProduct(payload): Observable<any> {
    //     let apiObj = {
    //         serviceName: 'get_products_for_category',
    //         method: 'POST',
    //         serviceType: 8,
    //         payload: payload
    //     }
    //     return this.apiService.apiCall(apiObj);
    // }



}

