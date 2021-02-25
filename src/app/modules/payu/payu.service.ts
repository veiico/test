/**
 * Created by mba-214 on 02/11/18.
 */
import { Injectable } from '@angular/core';

import { ApiService } from '../../services/api.service';
import { SessionService } from '../../services/session.service';


@Injectable()
export class PayuService {

    constructor(private apiService: ApiService,
        private sessionService: SessionService) { }

    /**
     * payu init payment
     */
    getPayuLink(data) {
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
        //     url: "payULatam/getPaymentData",
        //     body: data
        // };
        // return this.apiService.post(apiObj);
    }


}
