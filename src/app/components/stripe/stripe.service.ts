
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../services/api.service';
import { SessionService } from '../../services/session.service';


@Injectable()
export class StripeApiService {

    constructor(private apiService: ApiService, private sessionService: SessionService) {
    }

    submitDetails(data): Observable<any> {
        const apiObj = {
            url: 'stripe/addCard',
            body: data
            };
        return this.apiService.post(apiObj);
    }
    getStripeKey(data): Observable<any> {
      const apiObj = {
        url: 'stripe/getKeys',
        body: data
      };
      return this.apiService.post(apiObj);
    }
}
