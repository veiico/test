import { Injectable } from '@angular/core';

import {ApiService} from '../../services/api.service';
import { Subject, BehaviorSubject } from 'rxjs';
import { throttle, throttleTime } from 'rxjs/operators';
import { SessionService } from '../../services/session.service';

// import { Headers } from '@angular/http';

@Injectable()
export class RestaurantsService {
  public productChangeSubject = new Subject();
  public reloadPage = new BehaviorSubject(false);

  constructor(private api:ApiService, private sessionService: SessionService) {
    this.reloadPage.next(false);
  }

  getRestaurants(data) {
    const obj = {
      'url': 'marketplace/marketplace_get_city_storefronts_v3',
      'body': {...data,source:0},

    }; 
    return this.api.get(obj).pipe(throttleTime(500));
  }

  getSideOrders(data) {

    const obj = {
      'url': 'merchant/getSubCategory',
      'body': data,

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

  getProductList(data) {

    const obj = {
      'url': 'product/getAll',
      'body': data,

    };
    return this.api.post(obj);
  }

  getProductListForEcom(data) {

    const obj = {
      'url': 'AdminCatalog/getProductsWithSellers',
      'body': data,

    };
    return this.api.post(obj);
  }

  getFilterList(data) {

    const obj = {
      'url': 'product/getFilters',
      'body': data,

    };
    return this.api.get(obj);
  }

  getAdminCategories(data) {

    const obj = {
      'url': 'AdminCatalog/getMerchantCatalog',
      'body': data,

    };
    return this.api.post(obj);
  }

  getMerchantListAccordingToCat(data) {

    const obj = {
      'url': 'AdminCatalog/getMerchantList',
      'body': data,

    };
    return this.api.post(obj);
  }

  getLastLevelCat(data) {

    const obj = {
      'url': 'AdminCatalog/getSubcategories',
      'body': data,
      
    };
    return this.api.post(obj);
  }

  getCollection(data) {
    const headers = new Headers();
    const obj = {
      'url': 'AdminCatalog/getCategoryFilters',
      'body': data,
      'headers': headers
    };
    return this.api.post(obj);
  }

  /**
   * function to validate serving radius check
   * @param payload address for validating
   */
  validateAddress(payload) {
    const apiObj = {
      url: 'order/serviceableCheck',
      'body': payload,
    };
    return this.api.postWithoutDOmain(apiObj);
  }

}
