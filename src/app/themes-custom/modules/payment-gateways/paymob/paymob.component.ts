import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { AppService } from '../../../../app.service';
import { PayMobComponent } from '../../../../modules/paymob/paymob.component';
import { PayMobService } from '../../../../modules/paymob/paymob.service';
import { PopUpService } from '../../../../modules/popup/services/popup.service';
import { LoaderService } from '../../../../services/loader.service';
import { SessionService } from '../../../../services/session.service';


@Component({
    templateUrl: '../../../../modules/paymob/paymob.component.html',
    styleUrls: ['../../../../modules/paymob/paymob.component.scss']
})
export class DynamicPayMobComponent extends PayMobComponent implements OnInit, AfterViewInit, OnDestroy {

    @Input() loginResponse: any;
    @Input() NET_PAYABLE_AMOUNT: number;
    @Output() paymentMadeResponse: any = new EventEmitter();
    @Input() paymentFor: any;

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
                this.paymentObj = this.loginResponse.formSettings[0].activePaymentMethods.filter(ele => ele.value == this.paymentMode.PAY_MOB);
                if(this.paymentObj && this.paymentObj[0] && this.paymentObj[0].payment_process_type)
                {
                this.post_payment_enable = this.paymentObj[0].payment_process_type;
                }
            }
            this.initPayMob();
        }
    };

    constructor(protected sessionService: SessionService,
        public payMobService: PayMobService,
        public loader: LoaderService,
        protected popup: PopUpService,
        protected appService: AppService) {
        super(sessionService, payMobService, loader, popup, appService)
    }

    ngOnInit() {
        super.ngOnInit();
    }

    ngAfterViewInit() {
        super.ngAfterViewInit();
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }


}
