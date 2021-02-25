import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { LoaderService } from '../../services/loader.service';
import { SessionService } from '../../services/session.service';
import { PaymentFor, PaymentMode, CREATE_TASK_TYPE, OnboardingBusinessType } from '../../enums/enum';
import { HyperPayService } from './hyperpay.service';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-hyperpay',
  templateUrl: './hyperpay.component.html',
  styleUrls: ['./hyperpay.component.scss']
})
export class HyperpayComponent implements OnInit {
  languageStrings: any={};
  @Input() loginResponse: any;
  @Input() NET_PAYABLE_AMOUNT: number;
  @Output() paymentMadeResponse: any = new EventEmitter();
  @Input() paymentFor: any;
  @Input() isSourceCustom: any;
  @Input() post_payment_enable: any;
  @Input() debtAmountCheck: any;
  @Input() customerPlanId: any;
  @Input() dataofCart: any;
  customOrderFlow: boolean;


  protected _triggerPayment;
  public config: any;
  public terminology: any;
  public langJson: any;
  public languageSelected: string;
  public direction: string;
  public showBackground: boolean;
  public winClosed: boolean;
  url: any;
  allowPopUp: boolean = true;
  sessionVar: any;
  public post_enabled: boolean = false;
  public paymentMode = PaymentMode;
  paymentObj: any;
  public paymentForEnum = PaymentFor;


  get triggerPayment() { return this._triggerPayment };
  @Input() set triggerPayment(val: any) {
    if (val) {
      this._triggerPayment = val;
      if (this.loginResponse && this.loginResponse.formSettings[0].activePaymentMethods) {
        this.paymentObj = this.loginResponse.formSettings[0].activePaymentMethods.filter(ele => ele.value == PaymentMode.HYPERPAY);
        if (this.paymentObj && this.paymentObj[0] && this.paymentObj[0].payment_process_type) {
          this.post_payment_enable = this.paymentObj[0].payment_process_type;
          this.post_enabled = this.paymentObj[0].payment_process_type == 1 ? true : false;
        }
      }

      this.initHyperPay();
    }
  };

  constructor(public loader: LoaderService, protected sessionService: SessionService, public hyperPayService: HyperPayService, protected cdRef: ChangeDetectorRef, protected appService: AppService) {
   
    this.setConfig();
    this.setLanguage();
  }

  ngOnInit() {
    /**
     * iframe events for success and failure payment
     */
    window.onmessage = this.onWindowMessage.bind(this);
  }

  initHyperPay() {
    this.sessionVar = this.sessionService.paymentWinRef;
    this.showBackground = true;

    const appData = this.sessionService.get('appData');
    const data = {
      'vendor_id': appData.vendor_details.vendor_id,
      'marketplace_user_id': this.config.marketplace_user_id,
      'user_id': this.sessionService.getString('user_id') || undefined,
      'access_token': appData.vendor_details.app_access_token,
      'app_type': 'WEB',
      'currency': this.config.payment_settings[0].code,
      'payment_method': PaymentMode.HYPERPAY,
      'name': appData.vendor_details.first_name,
      'email': appData.vendor_details.email,
      'domain_name': window.location.origin,
      'amount': this.NET_PAYABLE_AMOUNT,
    };

    if (typeof this._triggerPayment == 'object' && this._triggerPayment.job_id) {
      data['job_id'] = this._triggerPayment.job_id.toString();
    }

    if (typeof this._triggerPayment == 'object') {
      data['isEditedTask'] = this._triggerPayment.isEditedTask ? 1 : undefined;
      data['payment_for'] = this._triggerPayment.payment_for !== undefined ? this._triggerPayment.payment_for : undefined;
    }

    if (this.paymentFor) {
      data['payment_for'] = this.paymentFor;
    }

    if (this.debtAmountCheck) {
      data['payment_for'] = PaymentFor.DEBT_AMOUNT;
    }
    else if (this.customerPlanId) {
      data['payment_for'] = PaymentFor.CUSTOMER_SUBSCRIPTION_AMOUNT;
    }
    else if (this.post_payment_enable === 2) {
      data['orderCreationPayload'] = this.dataofCart;
      data['orderCreationPayload'].amount = this.NET_PAYABLE_AMOUNT;
      if (this.paymentFor == this.paymentForEnum.REWARDS) {
        data['orderCreationPayload'].task_type = CREATE_TASK_TYPE.REWARD;
      }
      else if (this.paymentFor == this.paymentForEnum.WALLET || this.paymentFor == this.paymentForEnum.GIFT_CARD) {
        data['orderCreationPayload'].task_type = CREATE_TASK_TYPE.CREATE_CHARGE;
      }
      else {
        if (this.config.onboarding_business_type === OnboardingBusinessType.LAUNDRY) {
          if (this.customOrderFlow) {
            data['orderCreationPayload'].task_type = CREATE_TASK_TYPE.LAUNDARY_CUSTOM_ORDER;
            data['orderCreationPayload'].job_id = this.sessionService.getByKey('app', 'payment').order_id;
            data['orderCreationPayload'].isEditedTask = 0;
            data['orderCreationPayload'].additionalpaymentId = this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').additionalpaymentId ? this.sessionService.getByKey('app', 'payment').additionalpaymentId : 0;
          }
          else {
            data['orderCreationPayload'].task_type = CREATE_TASK_TYPE.LAUNDARY;
          }
        }
        else if (this.config.onboarding_business_type === OnboardingBusinessType.FREELANCER) {
          data['orderCreationPayload'].task_type = CREATE_TASK_TYPE.FREELANCER
        }
        else if (this.customOrderFlow && !this.isSourceCustom) {
          data['orderCreationPayload'].task_type = CREATE_TASK_TYPE.CUSTOM_ORDER;
        }
        else if (this.isSourceCustom) {
          data['orderCreationPayload'].task_type = CREATE_TASK_TYPE.QUOTATION;
          data['orderCreationPayload'].isEditedTask = 0;
          data['orderCreationPayload'].additionalpaymentId = this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').additionalpaymentId ? this.sessionService.getByKey('app', 'payment').additionalpaymentId : 0;
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').order_id) {
            data['orderCreationPayload'].job_id = this.sessionService.getByKey('app', 'payment').order_id
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').additionalpaymentId) {
            data['orderCreationPayload'].task_type = CREATE_TASK_TYPE.CREATE_CHARGE;
          }
          if (this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1) {
            data['orderCreationPayload'].payment_for = 10;
          }
        }
        else {
          data['orderCreationPayload'].task_type = CREATE_TASK_TYPE.FOOD;
        }
        if (this.sessionService.get("config").is_menu_enabled) {
          data['orderCreationPayload'].is_app_menu_enabled = 1;
        }
        data['orderCreationPayload'].is_app_product_tax_enabled = 1;
      }
    }

    if (this.isSourceCustom && this.config.onboarding_business_type === OnboardingBusinessType.LAUNDRY && this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').remaining_balance && this.sessionService.getByKey('app', 'payment').remaining_balance > 0) {
      data['isEditedTask'] = 1;
    }


    // if (data.currency === 'SAR') {
    this.hyperPayService.getHyperPayLink(data).subscribe(response => {
      this.loader.hide();
      if (response.status === 200) {
        this.url = response.data.url;
        this.sessionVar.location.href = this.url;
        this.cdRef.detectChanges();
      } else {
        this.loader.hide();
        this.setOnCloseWinListener();
      }
    }, error => {
      this.loader.hide();
    });
    // }
  }

  focusOnWindow() {
    this.sessionVar.focus();
    this.cdRef.detectChanges();
  }

  setOnCloseWinListener() {
    this.paymentMadeResponse.emit({
      'payment_method': PaymentMode.HYPERPAY,
      'status': 'error'
    });
    this.showBackground = false;

  };

  paymentMade(data) {
    this.paymentMadeResponse.emit(data);
  }

  hyperPayResponse(data) {
    setTimeout(() => {
      this.paymentMade(data);
    }, 3000);
  }

  private onWindowMessage(event: any) {
    if (typeof event.data == 'object') {
      if (event.data.payment_method == PaymentMode.HYPERPAY) {
        if (event.data.status == 'error' && !this.post_enabled) {
          setTimeout(() => {
            this.showBackground = false;
          }, 900);
        }
        this.allowPopUp = false;
        this.hyperPayResponse(event.data);
        this.cdRef.detectChanges();
      }
    }
  }

  /**
  * set config
  */
  setConfig() {
    this.config = this.sessionService.get('config');
    this.terminology = this.config.terminology;
    this.customOrderFlow = this.sessionService.getString("customOrderFlow")
      ? Boolean(this.sessionService.getString("customOrderFlow"))
      : false;

  }

  /**
     * set language
     */
  setLanguage() {
    // checks for ar translations
    if (this.sessionService.getString('language')) {
      this.languageSelected = this.sessionService.getString('language');
      if (this.languageSelected === 'ar') {
        this.direction = 'rtl';
      } else {
        this.direction = 'ltr';
      }
    } else {
      this.languageSelected = 'en';
      if (this.languageSelected === 'ar') {
        this.direction = 'rtl';
      } else {
        this.direction = 'ltr';
      }
    }
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
    });
  }

  openUrl() {
    this.sessionVar = window.open(this.url)
    this.cdRef.detectChanges();
  }

}
