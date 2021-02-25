import { Injectable } from '@angular/core';

import { ApiService } from '../../services/api.service';

@Injectable()
export class RewardsService {

  constructor(private api: ApiService) {
  }


  /**
   * get wallet history
   */
  getList(data) {
    const obj = {
      'url': 'reward/customerPlans',
      'body': data,
    };
    return this.api.post(obj);
  }

  /**
   * add money
   */
  buyPlan(data) {
    const obj = {
      'url': 'reward/selectPlanByCustomer',
      'body': data,
    };
    return this.api.post(obj);
  }

  /**
   * get wallet balance
   */
  getWalletBalance(data) {
    const apiObj = {
      url: 'vendor/getWalletTxnHistory',
      body: data
    };
    return this.api.post(apiObj);
  }

  /**
   * create charge
   */
  createCharge(data) {
    const obj = {
      'url': 'payment/createCharge',
      'body': data,
    }
    return this.api.post(obj);
  }
}
