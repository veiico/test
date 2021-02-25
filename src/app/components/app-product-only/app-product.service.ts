/**
 * Created by cl-macmini-51 on 25/05/18.
 */
import { Injectable } from '@angular/core';

import {ApiService} from '../../services/api.service';

// import { Headers } from '@angular/http';

@Injectable()
export class ProductOnlyService {
  constructor(private api: ApiService) {
  }
  getRestaurants(data) {
    // const headers = new Headers();
    const obj = {
      'url': 'marketplace_get_city_storefronts_v2',
      'body': data,
      // 'headers': headers
    };
    return this.api.post(obj);
  }

}
