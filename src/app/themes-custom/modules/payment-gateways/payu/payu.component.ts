import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { AppService } from '../../../../app.service';
import { PayuComponent } from '../../../../modules/payu/payu.component';
import { PayuService } from '../../../../modules/payu/payu.service';
import { PopUpService } from '../../../../modules/popup/services/popup.service';
import { LoaderService } from '../../../../services/loader.service';
import { SessionService } from '../../../../services/session.service';


@Component({
    templateUrl: '../../../../modules/payu/payu.component.html',
    styleUrls: ['../../../../modules/payu/payu.component.scss']
})
export class DynamicPayuComponent extends PayuComponent implements OnInit, AfterViewInit, OnDestroy {


    @Input() loginResponse: any;
    @Input() NET_PAYABLE_AMOUNT: number;

    protected _triggerPayment;
    get triggerPayment() { return this._triggerPayment };
    @Input() set triggerPayment(val: any) {
        if (val) {
            this._triggerPayment = val;
            this.dataofCart = val.orderCreationPayload;
            this.isSourceCustom = val.isSourceCustom;
            this.debtAmountCheck = val.debtAmountCheck;
            this.customerPlanId = val.customerPlanId;
            if (this.loginResponse && this.loginResponse.formSettings[0].activePaymentMethods) {
                this.paymentObj = this.loginResponse.formSettings[0].activePaymentMethods.filter(ele => ele.value == this.paymentMode.PAYU);
                if(this.paymentObj && this.paymentObj[0] && this.paymentObj[0].payment_process_type)
                {
                this.post_payment_enable = this.paymentObj[0].payment_process_type;
                }
            }
            this.initPayu();
        }
    };

    constructor(protected sessionService: SessionService,
        public payuService: PayuService,
        public loader: LoaderService,
        protected popup: PopUpService,
        protected appService: AppService) {
        super(sessionService, payuService, loader, popup, appService)
    }

    ngOnInit() {
        super.ngOnInit();
    }

    setConfig() {
        this.loginResponse = this.sessionService.get('appData');
        super.setConfig();
      }
      
    ngOnDestroy() {
        super.ngOnDestroy();
    }

    ngAfterViewInit() {
        super.ngAfterViewInit();
    }


}
