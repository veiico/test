import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { AppService } from '../../../../app.service';
import { StripeidealComponent } from '../../../../modules/stripeideal/stripeideal.component';
import { StripeidealService} from '../../../../modules/stripeideal/stripeideal.service';
import { LoaderService } from '../../../../services/loader.service';
import { SessionService } from '../../../../services/session.service';
import { PaymentService } from '../../../../components/payment/payment.service';

@Component({
  templateUrl: '../../../../modules/stripeideal/stripeideal.component.html',
  styleUrls: ['../../../../modules/stripeideal/stripeideal.component.scss']
})
export class DynamicStripeidealComponent extends StripeidealComponent implements OnInit, AfterViewInit, OnDestroy {

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
        this.paymentObj = this.loginResponse.formSettings[0].activePaymentMethods.filter(ele => ele.value == this.paymentMode.STRIPE_IDEAL);
        if(this.paymentObj && this.paymentObj[0] && this.paymentObj[0].payment_process_type)
        {
          this.post_payment_enable = this.paymentObj[0].payment_process_type;
        }
      }
      this.initStripeIdeal();
    }
  };


  constructor(protected sessionService: SessionService,
    public stripeIdealService: StripeidealService,
    public domSanitizer: DomSanitizer,
    public loader: LoaderService,
    public router: Router,
    protected appService: AppService,
    protected paymentService: PaymentService) {
    super(sessionService, stripeIdealService, domSanitizer, loader, router, appService, paymentService)
  }

  ngOnInit() {
    super.ngOnInit()
  }

  ngAfterViewInit() {
    super.ngAfterViewInit()
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

}
