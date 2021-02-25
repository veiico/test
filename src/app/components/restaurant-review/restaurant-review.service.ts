/**
 * Created by socomo on 3/15/18.
 */
import { Injectable } from '@angular/core';

import {ApiService} from '../../services/api.service';

// import { Headers } from '@angular/http';

@Injectable()
export class RestaurantReviewService {
  constructor(private api: ApiService) {
  }

  getAllReviews(data) {
    // const headers = new Headers();
    const obj = {
      'url': 'get_store_all_reviews',
      'body': data,
      // 'headers': headers
    };
    return this.api.post(obj);
  }
  submitReview(data) {
    // const headers = new Headers();
    const obj = {
      'url': 'create_Storefront_review',
      'body': data,
      // 'headers': headers
    };
    return this.api.post(obj);
  }
}
