/**
 * Created by mba-214 on 02/11/18.
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../services/api.service';
import { SessionService } from '../../services/session.service';


@Injectable()
export class PaypalService {

  constructor(private apiService: ApiService,
    private sessionService: SessionService) { }

  /**
   * paypal init payment
   */
  getPaypalPayLink(data) {
    let paymentKey = this.sessionService.getByKey('app', 'payment');
    if (paymentKey && paymentKey.is_custom_order == 1) {
      data.job_id = undefined;
      data.payment_for = 10;
    }
    const apiObj = {
      url: 'paypal/makePayment',
      body: data
    };
    return this.apiService.post(apiObj);
  }


}
