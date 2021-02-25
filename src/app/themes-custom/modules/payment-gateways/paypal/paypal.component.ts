import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { AppService } from '../../../../app.service';
import { PaypalComponent } from '../../../../modules/paypal/paypal.component';
import { PaypalService } from '../../../../modules/paypal/paypal.service';
import { LoaderService } from '../../../../services/loader.service';
import { SessionService } from '../../../../services/session.service';
import { PaymentService } from '../../../../components/payment/payment.service';


@Component({
  templateUrl: '../../../../modules/paypal/paypal.component.html',
  styleUrls: ['../../../../modules/paypal/paypal.component.scss']
})
export class DynamicPaypalComponent extends PaypalComponent implements OnInit, AfterViewInit, OnDestroy {


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
        this.paymentObj = this.loginResponse.formSettings[0].activePaymentMethods.filter(ele => ele.value == this.paymentMode.PAYPAL);
        if(this.paymentObj && this.paymentObj[0] && this.paymentObj[0].payment_process_type)
        {
          this.post_payment_enable = this.paymentObj[0].payment_process_type;
        }
      }
      this.initPaypal();
    }
  };

  constructor(protected sessionService: SessionService,
    public paypalService: PaypalService,
    public domSanitizer: DomSanitizer,
    public loader: LoaderService,
    public router: Router,
    protected appService: AppService,
    protected paymentService: PaymentService) {
    super(sessionService, paypalService, domSanitizer, loader, router, appService, paymentService)
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
