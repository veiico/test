/**
 * Created by cl-macmini-51 on 01/05/18.
 */
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { ApiService } from '../../services/api.service';

// import { Headers } from '@angular/http';

@Injectable()
export class UserRightsService {
  constructor(private api: ApiService) {
  }

  setUserRights(data) {
    // const headers = new Headers();
    const obj = {
      'url': 'set_customer_user_rights',
      'body': data,
      // 'headers': headers
    };
    return this.api.post(obj);
  }

}
