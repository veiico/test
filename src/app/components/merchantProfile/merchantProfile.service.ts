import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { ApiService } from '../../services/api.service';

@Injectable()
export class MerchantProfileService {
  constructor(private api: ApiService) {
  }

  fetchMerchantData(data) {
    // const headers = new Headers();
    const obj = {
      'url': 'merchant/viewProfile',
      'body': data,
      // 'headers': headers
    };
    return this.api.post(obj);
  }

}
