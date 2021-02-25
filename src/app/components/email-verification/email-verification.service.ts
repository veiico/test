/**
 * Created by cl-macmini-51 on 26/07/18.
 */
import { Injectable } from '@angular/core';
import { Observable ,  Subject } from 'rxjs';

import { ApiService } from '../../services/api.service';


@Injectable()
export class EmailVerificationService {

  constructor(private apiService: ApiService) { }

  emailVerifyMerchantHit(payload): Observable<any> {
    // const headers = new Headers();
    const apiObj = {
      'url': '/merchant/emailVerification',
      'body': payload,
      // 'headers': headers

    };
    return this.apiService.post(apiObj);
  }
  emailVerifyVendorHit(payload): Observable<any> {
    // const headers = new Headers();
    const apiObj = {
      'url': '/vendor/emailVerification',
      'body': payload,
      // 'headers': headers

    };
    return this.apiService.post(apiObj);
  }

}
