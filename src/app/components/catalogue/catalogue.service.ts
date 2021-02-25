import { Injectable, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { SessionService } from '../../services/session.service';


// import { Headers } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class CatalogueService {
  public productList = new BehaviorSubject({});
  public categoryList = new BehaviorSubject([]);
  public categoryData = new BehaviorSubject({});
  cartDataChange :EventEmitter<any> =  new EventEmitter<any>();

  constructor(private api: ApiService,private sessionService: SessionService) {
  }

  getSuperCategories(data) {
    // const headers = new Headers();
    data.date_time = (new Date()).toISOString();
    const obj = {
      'url': 'get_app_catalogue',
      'body': data,
      // 'headers': headers
    };
    return this.api.post(obj);
  }

  getAllCategory(data) {
    // const headers = new Headers();
    // if (!data.date_time) {
    //   data.date_time = (new Date()).toISOString();
    // }
    const obj = {
      // 'url': 'get_app_catalogue',
      'url': 'catalogue/get',
      'body': data || {},
      // 'headers': headers
    };
    return this.api.post(obj);
  }
  getProduct(data) {
    // let prodParmUrl = new URLSearchParams(window.location.search);
    // let prodCat = prodParmUrl.get('pordCat');
    // if(prodCat)
    //   data.parent_category_id = Number(prodCat);

    // const headers = new Headers();
    const obj = {
      'url': 'get_products_for_category',
      'body': data || {},
      // 'headers': headers
    };
    return this.api.post(obj);
  }

  nLevelCategory(data) {
    // const headers = new Headers();
    const obj = {
      'url': 'catalogue/getParentCategories',
      'body': data || {},
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

  getAllPages(data) {
    // const headers = new Headers();
    const obj = {
      'url': 'userPages/get',
      'body': data,
      // 'headers': headers
    };
    return this.api.post(obj);
  }

  getSingleRestaturant(data) {
    if (this.sessionService.isPlatformServer()) {
      data.source = 0;
    }
    const obj = {
      'url': 'marketplace_get_city_storefronts_single_v2',
      'body': {...data,source:0},
      // 'headers': headers
    };
    return this.api.get(obj);
  }

  cartDataChanged(){
    this.cartDataChange.emit(true);
  }


}
