/**
 * Created by mba-214 on 02/11/18.
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../services/api.service';
import { SessionService } from '../../services/session.service';


@Injectable()
export class FacService {

  constructor(private apiService: ApiService,
              private sessionService: SessionService) { }

  /**
   * fac init payment
   */
  getFacPayLink(data) {
    const apiObj = {
      url: 'facPayment/getAuthorizationToken',
      body: data
    };
    return this.apiService.post(apiObj);
  }

    /**
   * get all card list
   * @param payload
   * @returns {Observable<T>|Observable<*>|Observable<B>|Observable<C>|Observable<D>|Observable<E>|any}
   */
  getAllCards(payload): Observable<any> {
    const apiObj = {
      // 'url': 'facPayment/fetchCreditCards',
      'url': 'get_customer_cards',
      'body': payload
    };
    return this.apiService.post(apiObj);
  }

  /**
   * add customer cards
   */
  addCustomerCard(data): Observable<any> {
    const apiObj = {
      // url: 'facPayment/saveCreditCards',
      'url': 'add_customer_card',
      body: data
    };
    return this.apiService.post(apiObj);
  }

  /**
   * delete customer card
   */
  removeCard(payload): Observable<any> {
    const apiObj = {
      url: "facPayment/deleteCreditCards",
      body: payload
    };
    return this.apiService.post(apiObj);
  }

    /**
   * billplz init payment wallet
   */
  getFacLinkWallet(data) {
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
