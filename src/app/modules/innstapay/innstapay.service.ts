/**
 * Created by mba-214 on 02/11/18.
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../services/api.service';
import { SessionService } from '../../services/session.service';


@Injectable()
export class InnstapayService {

  constructor(private apiService: ApiService,
              private sessionService: SessionService) { }

  /**
   * razorpay init payment
   */
  getInnstapayPayLink(data) {
    let payment_data = this.sessionService.getByKey('app', 'payment')
    if(payment_data && payment_data.is_custom_order == 1){
      data.job_id = undefined;
      data.payment_for = 10;
      data.user_id = payment_data.user_id_merchant;
    }
    const apiObj = {
      url: "payment/getPaymentUrl",
      body: data
    };
    return this.apiService.post(apiObj);

    // const apiObj = {
    //   url: 'innstapay/makePaymentUrl',
    //   body: data
    // };
    // return this.apiService.post(apiObj);
  }


}
