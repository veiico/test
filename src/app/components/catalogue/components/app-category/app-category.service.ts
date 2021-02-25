import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../../../services/api.service';
import { SessionService } from '../../../../services/session.service';

// import { Headers } from '@angular/http';

@Injectable()
export class AppCategoryService {

    constructor(private api: ApiService , private sessionService: SessionService) { }

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
          //   apiObj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
          //   apiObj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
          // }
        return this.api.post(apiObj);
    }
    // getAllCategory(): Observable<any> {
    //     let apiObj = {
    //         serviceName: 'get_app_catalogue',
    //         method: 'POST',
    //         serviceType: 8,
    //         payload: {}
    //     }
    //     return this.apiService.apiCall(apiObj);
    // }

  searchProducts(data) {
    // const headers = new Headers();
    const obj = {
      'url': 'search_products',
      'body': data || {},
      // 'headers': headers
    };
    return this.api.post(obj);
  }


}

