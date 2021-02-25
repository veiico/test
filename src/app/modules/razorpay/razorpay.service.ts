/**
 * Created by mba-214 on 02/11/18.
 */
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { ApiService } from '../../services/api.service';
import { SessionService } from '../../services/session.service';


@Injectable()
export class RazorpayService {
  razorpayUrl: any = new Subject();

  constructor(private apiService: ApiService,
              private sessionService: SessionService) { }

  /**
   * razorpay init payment
   */
  getRazorPayLink(data) {
    const apiObj = {
      url: 'razorPay/razorpayPayment',
      body: data
    };
    return this.apiService.post(apiObj);
  }
  makeRazorPaypayment(data) {
    let obj = {
      app_access_token: data.access_token,
      amount: data.amount,
      user_id: data.user_id,
      orderCreationPayload: data.orderCreationPayload,
    }
    //obj['orderCreationPayload'].task_task_type = 3
    return this.getRazorpayLinkWallet(obj);
  }

  /**
   * razorpay init payment wallet
   */
  getRazorpayLinkWallet(data) {
    let payment_data = this.sessionService.getByKey('app', 'payment')
    if(payment_data && payment_data.is_custom_order == 1){
      data.job_id = undefined;
      data.payment_for = 10;
      data.user_id = payment_data.user_id_merchant;
    }
    const apiObj = {
      url: 'payment/getPaymentUrl',
      body: data
    };
    return this.apiService.post(apiObj);
  }


}
