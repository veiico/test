import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { AppService } from '../../../../app.service';
import { TelrComponent } from '../../../../modules/telr/telr.component';
import { TelrService } from '../../../../modules/telr/telr.service';
import { LoaderService } from '../../../../services/loader.service';
import { SessionService } from '../../../../services/session.service';
import { PaymentService } from '../../../../components/payment/payment.service';

@Component({
  
  templateUrl: '../../../../modules/telr/telr.component.html',
  styleUrls: ['../../../../modules/telr/telr.component.scss']
})
export class DynamicTelrComponent extends TelrComponent implements OnInit, AfterViewInit, OnDestroy {


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
        this.paymentObj = this.loginResponse.formSettings[0].activePaymentMethods.filter(ele => ele.value == this.paymentMode.TELR);
        if(this.paymentObj && this.paymentObj[0] && this.paymentObj[0].payment_process_type)
        {
          this.post_payment_enable = this.paymentObj[0].payment_process_type;
        }
      }
      this.initTelr();
    }
  };

  constructor(protected sessionService: SessionService,
    public telrService: TelrService,
    public domSanitizer: DomSanitizer,
    public loader: LoaderService,
    public router: Router,
    protected appService: AppService,
    protected paymentService: PaymentService) {
    super(sessionService, telrService, domSanitizer, loader, router, appService, paymentService)
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
