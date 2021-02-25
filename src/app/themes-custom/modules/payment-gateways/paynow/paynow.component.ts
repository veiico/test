import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { AppService } from '../../../../app.service';
import { PaynowComponent } from '../../../../modules/paynow/paynow.component';
import { PaynowService } from '../../../../modules/paynow/paynow.service';
import { PopUpService } from '../../../../modules/popup/services/popup.service';
import { LoaderService } from '../../../../services/loader.service';
import { SessionService } from '../../../../services/session.service';


@Component({
    templateUrl: '../../../../modules/paynow/paynow.component.html',
    styleUrls: ['../../../../modules/paynow/paynow.component.scss']
})
export class DynamicPaynowComponent extends PaynowComponent implements OnInit, AfterViewInit, OnDestroy {


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
                this.paymentObj = this.loginResponse.formSettings[0].activePaymentMethods.filter(ele => ele.value == this.paymentMode.PAYNOW);
                if(this.paymentObj && this.paymentObj[0] && this.paymentObj[0].payment_process_type)
                {
                this.post_payment_enable = this.paymentObj[0].payment_process_type;
                }
            }
            this.initPaynow();
        }
    };

    constructor(protected sessionService: SessionService,
        public paynowService: PaynowService,
        public loader: LoaderService,
        protected popup: PopUpService,
        protected appService: AppService) {
        super(sessionService, paynowService, loader, popup, appService)
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
