/**
 * Created by cl-macmini-51 on 03/08/18.
 */
import { Injectable } from '@angular/core';

import {ApiService} from '../../services/api.service';

// import { Headers } from '@angular/http';

@Injectable()
export class FuguIntelInputService {
  constructor(private api: ApiService) {
  }
/**
 * do not use on server side.
 */
  getCountryData() {
    // const headers = new Headers();
    const obj = {
      'url': 'requestCountryCodeGeoIP2'
      // 'headers': headers
    };
    return this.api.getCountryData(obj);
  }

}
