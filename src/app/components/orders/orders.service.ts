import { Injectable } from '@angular/core';

import { ApiService } from '../../services/api.service';
import { SessionService } from '../../services/session.service';
import { BehaviorSubject } from 'rxjs';

// import { Headers } from '@angular/http';

@Injectable()
export class OrdersService {
  
  public orderList = new BehaviorSubject([]);
  public orderDetails = new BehaviorSubject({});

  constructor(private api: ApiService, private sessionService: SessionService) {
  }

  getOrders(data) {
    // const headers = new Headers();
    if (this.sessionService.get('appData').business_model_type === 'FREELANCER') {
      data['business_model_type'] = this.sessionService.get('appData').business_model_type;
    }
    const obj = {
      // 'url': 'get_order_history',
      'url': 'get_service_job_history',
      'body': data,
      // 'headers': headers
    };

    return this.api.post(obj);
  }
  
  getAgentData(data) {
    const obj = {
     
      'url': 'task/getTrackingDetails',
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
    };
    return this.api.get(obj);
  }
  getProduct(data) {
    const obj = {
      'url': 'get_products_for_category',
      'body': data || {},
    };
    return this.api.post(obj);
  }
  getReasonData(data) {
    const obj = {
      'url': 'marketplace/getCancellationReason',
      'body': data
    }
    return this.api.post(obj);
  }
  submitReview(data) {
    // const headers = new Headers();
    const obj = {
      'url': 'create_customer_order_review',
      'body': data,
      // 'headers': headers
    };
    return this.api.post(obj);
  }

  submitAgentReview(data) {
    // const headers = new Headers();
    const obj = {
      'url': 'tookan/rateAgent',
      'body': data,
      // 'headers': headers
    };
    return this.api.post(obj);
  }

  cancelOrder(data) {
    // const headers = new Headers();
    const obj = {
      'url': 'cancel_order',
      'body': data,
      // 'headers': headers
    };
    return this.api.post(obj);
  }

  skipReview(data) {
    // const headers = new Headers();
    const obj = {
      'url': 'skip_order_review',
      'body': data,
      // 'headers': headers
    };
    return this.api.post(obj);
  }
  getCancellationRules(data) {
    const obj = {
      'url': 'cancelPolicyDetailsByJobId',
      'body': data
    }
    return this.api.post(obj);
  }
  getCancelCharges(data) {
    const obj = {
      'url': 'cancelPolicy/getCancellationCharges',
      'body': data
    }
    return this.api.post(obj);
  }
}
