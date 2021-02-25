/**
 * Created by mba-214 on 17/11/18.
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../services/api.service';
import { SessionService } from '../../services/session.service';


@Injectable()
export class AuthorizeNetService {

  constructor(private apiService: ApiService,
              private sessionService: SessionService) { }

  /**
   * get all card list
   * @param payload
   * @returns {Observable<T>|Observable<*>|Observable<B>|Observable<C>|Observable<D>|Observable<E>|any}
   */
  getAllCards(payload): Observable<any> {
    const apiObj = {
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
      url: 'add_customer_card',
      body: data
    };
    return this.apiService.post(apiObj);
  }


  /**
   * delete customer card
   */
  removeCard(payload): Observable<any> {
    const apiObj = {
      url: "authorizeNet/deleteCard",
      body: payload
    };
    return this.apiService.post(apiObj);
  }

}
