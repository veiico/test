/**
 * Created by cl-macmini-51 on 09/10/18.
 */
import { Injectable } from '@angular/core';

import { ApiService } from '../../services/api.service';

// import { Headers } from '@angular/http';

@Injectable()
export class ReferAndEarnShareService {
  constructor(private api: ApiService) {
  }

  getDataForShare(data) {
    // const headers = new Headers();
    const obj = {
      'url': 'vendor/getReferralData',
      'body': data,
      // 'headers': headers
    };
    return this.api.post(obj);
  }
}
