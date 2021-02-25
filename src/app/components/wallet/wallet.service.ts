import { Injectable } from '@angular/core';

import { ApiService } from '../../services/api.service';

@Injectable()
export class WalletService {

  constructor(private api: ApiService) {
  }


  /**
   * get wallet history
   */
  getHistory(data) {
    const obj = {
      'url': 'vendor/getWalletTxnHistory',
      'body': data,
    };
    return this.api.postWithoutDOmain(obj);
  }

  /**
   * add money
   */
  addMoneyWallet(data) {
    const obj = {
      'url': 'payment/createCharge',
      'body': data,
    }
    return this.api.postWithoutDOmain(obj);
  }
}
