/**
 * Created by cl-macmini-51 on 01/06/18.
 */
import { Injectable } from '@angular/core';

import { ApiService } from '../../services/api.service';
import { SessionService } from "../../services/session.service";

// import { Headers } from '@angular/http';

@Injectable()
export class ProductDetailsService {
  constructor(private api: ApiService, public sessionService: SessionService) {
  }

  getProductDetails(data) {
    const obj = {
      'url': (this.sessionService.get('config').business_model_type === 'ECOM') && (this.sessionService.get('config').nlevel_enabled === 2) ? 'AdminCatalog/getProductDetails' : 'product/view',
      'body': data,
    };
    return this.api.post(obj);
  }

  getProfileData(data) {
    const obj = {
      'url': 'merchant/viewProfile',
      'body': data,
    };
    return this.api.post(obj);
  }

  createProductReview(data) {
    const obj = {
      'url': '/product/createReview',
      'body': data,
    };
    return this.api.post(obj);
  }

  getProductReviews(data) {
    const obj = {
      'url': '/product/allReviews',
      'body': data,
    };
    return this.api.post(obj);
  }

  getProductLastReviews(data) {
    const obj = {
      'url': '/product/lastReviews',
      'body': data,
    };
    return this.api.post(obj);
  }

  getSingleRestaturant(data) {
    const obj = {
      'url': 'marketplace_get_city_storefronts_single_v2',
      'body': {...data,source:0},
      // 'headers': headers
    };
    return this.api.post(obj);
  }

}
