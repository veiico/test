import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../services/api.service';
import { SessionService } from '../../services/session.service';


@Injectable()
export class TelrService {

  constructor(private apiService: ApiService,
    private sessionService: SessionService) { }

  /**
   * telr init payment
   */
  getTelrPayLink(data) {
    let paymentKey = this.sessionService.getByKey('app', 'payment');
    if (paymentKey && paymentKey.is_custom_order == 1) {
      data.job_id = undefined;
      data.payment_for = 10;
    }
    const apiObj = {
      url: 'telr/makePayment',
      body: data
    };
    return this.apiService.post(apiObj);
  }


}