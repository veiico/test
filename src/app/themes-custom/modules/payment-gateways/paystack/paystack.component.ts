import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { AppService } from '../../../../app.service';
import { LoaderService } from '../../../../services/loader.service';
import { SessionService } from '../../../../services/session.service';
import { PaystackComponent } from '../../../../modules/paystack/paystack.component';
import { PaystackService } from '../../../../../app/modules/paystack/paystack.service';

@Component({
  templateUrl: '../../../../modules/paystack/paystack.component.html',
  styleUrls: ['../../../../modules/paystack/paystack.component.scss']
})
export class DynamicPaystackComponent extends PaystackComponent implements OnInit, AfterViewInit, OnDestroy {


  @Input() loginResponse: any;
  @Input() paymentFor: any; 
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
        this.paymentObj = this.loginResponse.formSettings[0].activePaymentMethods.filter(ele => ele.value == this.paymentMode.PAYSTACK);
        if(this.paymentObj && this.paymentObj[0] && this.paymentObj[0].payment_process_type)
        {
          this.post_payment_enable = this.paymentObj[0].payment_process_type;
        }
      }
      this.initPaystack();
    }
  };

  constructor(protected sessionService: SessionService,
    public paystackService: PaystackService,
    public domSanitizer: DomSanitizer,
    public loader: LoaderService,
    public router: Router,
    protected appService: AppService) {
    super(sessionService, paystackService, domSanitizer, loader, router, appService)
  }

  ngOnInit() {
    super.ngOnInit();
  }

  setConfig() {
    this.loginResponse = this.sessionService.get('appData');
    super.setConfig();
  }
  
  ngAfterViewInit() {
    super.ngAfterViewInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

}
