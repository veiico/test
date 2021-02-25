import { AfterViewInit, Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { EventEmitter } from 'events';

import { AppService } from '../../../../app.service';
import { InnstapayComponent } from '../../../../modules/innstapay/innstapay.component';
import { InnstapayService } from '../../../../modules/innstapay/innstapay.service';
import { LoaderService } from '../../../../services/loader.service';
import { SessionService } from '../../../../services/session.service';


@Component({
  templateUrl: '../../../../modules/innstapay/innstapay.component.html',
  styleUrls: ['../../../../modules/innstapay/innstapay.component.scss']
})
export class DynamicInnstapayComponent extends InnstapayComponent implements OnInit, AfterViewInit, OnDestroy {

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
        this.paymentObj = this.loginResponse.formSettings[0].activePaymentMethods.filter(ele => ele.value == this.paymentMode.INNSTAPAY);
        if(this.paymentObj && this.paymentObj[0] && this.paymentObj[0].payment_process_type)
        {
          this.post_payment_enable = this.paymentObj[0].payment_process_type;
        }
      }
      this.initInnstapay();
    }
  };

  constructor(protected sessionService: SessionService,
    public innstapayService: InnstapayService,
    public domSanitizer: DomSanitizer,
    public loader: LoaderService,
    public router: Router,
    protected appService: AppService) {
    super(sessionService, innstapayService, domSanitizer, loader, router, appService)
  }

  ngOnInit() {
    super.ngOnInit();
  }
  setConfig() {
    this.loginResponse = this.sessionService.get('appData');
    super.setConfig();
  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {

  }




}
