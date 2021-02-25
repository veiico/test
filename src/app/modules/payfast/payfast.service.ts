/**
 * Created by mba-214 on 02/11/18.
 */
import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs/Observable';

import { ApiService } from '../../services/api.service';
import { SessionService } from '../../services/session.service';

@Injectable()
export class PayfastService {
  constructor(
    private apiService: ApiService,
    private sessionService: SessionService
  ) {}

  /**
   * payfast init payment
   */
  getPayfastPayLink(data) {
    const apiObj = {
      url: 'payFast/createPaymentUrl',
      body: data
    };
    return this.apiService.post(apiObj);
  }
}
