import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { AppService } from '../../../../app.service';
import { MPaisaComponent } from '../../../../modules/mpaisa/mpaisa.component';
import { MPaisaService} from '../../../../modules/mpaisa/mpaisa.service';
import { LoaderService } from '../../../../services/loader.service';
import { SessionService } from '../../../../services/session.service';

@Component({
  templateUrl: '../../../../modules/mpaisa/mpaisa.component.html',
  styleUrls: ['../../../../modules/mpaisa/mpaisa.component.scss']
})
export class DynamicMPaisaComponent extends MPaisaComponent implements OnInit, AfterViewInit, OnDestroy {

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
        this.paymentObj = this.loginResponse.formSettings[0].activePaymentMethods.filter(ele => ele.value == this.paymentMode.MPAISA);
        if(this.paymentObj && this.paymentObj[0] && this.paymentObj[0].payment_process_type)
        {
          this.post_payment_enable = this.paymentObj[0].payment_process_type;
        }
      }

      this.initMPaisa();
    }
  };


  constructor(protected sessionService: SessionService,
    public mpaisaService: MPaisaService,
    public domSanitizer: DomSanitizer,
    public loader: LoaderService,
    public router: Router,
    protected appService: AppService) {
    super(sessionService, mpaisaService, domSanitizer, loader, router, appService)
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
