import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
@Injectable()
export class StripeService {

  constructor(private http: HttpClient) { }

  getToken(token: string) {
    const params = new HttpParams().append('payment_token', token);
    return this.http.get(`${environment.API_ENDPOINT}/billing/getAuthorisationData`, { params })
      .pipe(map(this.tookanResponse.bind(this)));
  }

  saveLog(token: string, response: any) {
    const body = {
      payment_token: token,
      stripe_response: response
    }
    return this.http.post(`${environment.API_ENDPOINT}/stripe/logPaymentToken`, body)
      .pipe(map(this.tookanResponse.bind(this)));

  }

  private tookanResponse(res: any, index: number): any {
    if(res.status === 201){
      return res;
    }
    else if (!(res.status === 200)) {
      throw new Error(res.message);
    }
    else
      return res;
  }
}
