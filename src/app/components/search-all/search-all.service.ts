import { Injectable } from '@angular/core';
import {ApiService} from '../../services/api.service';

@Injectable()
export class SearchAllService {
  constructor(public api: ApiService) {
  }

  getSearchData(data) {
    // const headers = new Headers();
    const obj = {
      'url': 'product/search ',
      'body': data,
      // 'headers': headers
    };
    return this.api.post(obj);
  }

  getSearchedMerchant(data){
    const obj = {
      'url': 'search/global/merchants',
      'body': {
        ...data
      }
    };
    return this.api.post(obj);
  }
  getSingleRestaturant(data) {
    const obj = {
      'url': 'marketplace_get_city_storefronts_single_v2',
      'body': {...data},
      // 'headers': headers
    };
    return this.api.post(obj);
  }

  getSearchedProduct(data){
    const obj = {
      'url': 'search/global/product',
      'body': {
        ...data
      }
    };
    return this.api.post(obj);
  }

  getEcomSearchData(data) {
    // const headers = new Headers();
    const obj = {
      'url': 'searchProduct ',
      'body': data,
      // 'headers': headers
    };
    return this.api.post(obj);
  }

  public convertStringToBreakHTML(string: string){
    if (string) {
      let str = string.split('&lt;').join('<');
      let str2 = str.split('&gt;').join('>');
      return str2.split('\\n').join('<br>')
    }
    return string;
  }

  getSideOrders(data) {
    // const headers = new Headers();
    const obj = {
      'url': 'merchant/getSubCategory',
      'body': data,
      // 'headers': headers
    };
    return this.api.post(obj);
  }
}
