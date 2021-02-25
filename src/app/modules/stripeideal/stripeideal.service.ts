import { Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';


@Injectable()
export class StripeidealService {

  constructor(private apiService: ApiService) { }


  getPaymentLink(data) {
    const apiObj = {
      url: 'stripeIdeal/makePaymentUrl',
      body: data
    };
    return this.apiService.post(apiObj);
  }


}