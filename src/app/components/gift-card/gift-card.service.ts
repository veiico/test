import { Injectable } from '@angular/core';

import { ApiService } from '../../services/api.service';

@Injectable()
export class GiftCardService {

  constructor(private api: ApiService) {
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
   * buy gift card
   */
  buyGiftCard(data) {
    const obj = {
      'url': 'payment/createCharge',
      'body': data,
    }
    return this.api.post(obj);
  }

  /**
   * reedem gift card
   */
  reedemGiftCard(data) {
    const obj = {
      'url': 'giftCard/vendorRedeemGiftCard',
      'body': data,
    }
    return this.api.post(obj);
  }

  /**
   * gift card history
   */
  giftCardHistory(data) {
    const obj = {
      'url': 'giftCard/getGiftCardTxnHistory',
      'body': data,
    }
    return this.api.post(obj);
  }
}
