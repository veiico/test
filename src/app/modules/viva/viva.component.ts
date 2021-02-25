import { Component, OnInit, OnDestroy, AfterViewInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { AppService } from '../../app.service';
import { PaymentFor, PaymentMode, CREATE_TASK_TYPE, OnboardingBusinessType } from '../../enums/enum';
import { LoaderService } from '../../services/loader.service';
import { SessionService } from '../../services/session.service';
import { DomSanitizer } from '@angular/platform-browser';
import { VivaService } from './viva.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-viva',
  templateUrl: './viva.component.html',
  styleUrls: ['./viva.component.scss']
})
export class VivaComponent implements OnInit, AfterViewInit, OnDestroy {
  languageStrings: any={};
  public config: any;
  public terminology: any;
  public languageSelected: string;
  public direction: string;
  public vivaPaymentUrl: any;
  public paymentMethod = PaymentMode;
  public paymentMode = PaymentMode;
  paymentObj: any;
  public paymentForEnum = PaymentFor;


  @Input() loginResponse: any;
  @Input() NET_PAYABLE_AMOUNT: number;
  @Output() paymentMadeResponse: any = new EventEmitter();
  @Input() isSourceCustom: any;
  @Input() post_payment_enable: any;
  @Input() debtAmountCheck: any;
  @Input() customerPlanId: any;
  @Input() dataofCart: any;
  customOrderFlow: boolean;


  protected _triggerPayment;
  @Input() paymentFor: any;
  sessionVar: any;
  showBackground: boolean;
  url: any;
  allowPopUp: boolean = true;
  public post_enabled: boolean = false;
  sessionClosed: boolean;
  dataReceived: any;
  get triggerPayment() { return this._triggerPayment };
  @Input() set triggerPayment(val: any) {
    if (val) {

      this._triggerPayment = val;
      if (this.loginResponse && this.loginResponse.formSettings[0].activePaymentMethods) {
        this.paymentObj = this.loginResponse.formSettings[0].activePaymentMethods.filter(ele => ele.value == this.paymentMode.VIVA);
        if (this.paymentObj && this.paymentObj[0] && this.paymentObj[0].payment_process_type) {
          this.post_payment_enable = this.paymentObj[0].payment_process_type;
        }
      }

      this.initVivapay();
    }
  };


  constructor(public sessionService: SessionService,
    public domSanitizer: DomSanitizer,
    public loader: LoaderService,
    public router: Router,
    protected appService: AppService,
    public vivaService: VivaService, protected cdRef: ChangeDetectorRef) {
    this.setConfig();
    this.setLanguage();
  }

  ngOnInit() {
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
    });
    /**
     * iframe events for success and failure payment
     */
    window.onmessage = this.onWindowMessage.bind(this);
  }

  checkIfClosed() {
    console.log(this.sessionVar)
    // debugger
    if (!this.sessionClosed) {
      if (this.sessionVar.closed) {
        // debugger
        console.log('session closed')
        this.setOnCloseWinListener();
        this.sessionClosed = true;
      }
      else {
        console.log('session is open')
      }
    }
  }

  private onWindowMessage(event: any) {
    if (typeof event.data == 'object') {
      this.dataReceived = event.data;
      if (event.data.payment_method == PaymentMode.VIVA) {
        if (event.data.status == 'error' && !this.post_enabled) {
          setTimeout(() => {
            this.showBackground = false;
          }, 900);
        }
        this.allowPopUp = false;
        this.vivaWalletResponse(event.data);
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

  ngAfterViewInit() {

  }

  ngOnDestroy() {

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
  }



  /**
   * init initVivapay
   */
  initVivapay() {
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
      'payment_method': PaymentMode.VIVA,
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


    // if (data.currency === 'EUR') {
    this.vivaService.getVivaPayLink(data).subscribe(response => {
      this.loader.hide();
      this.url = response.data.url;
      this.sessionVar.location.href = this.url;
      setInterval(() => {
        // debugger
        this.checkIfClosed();
      }, 2500);
      this.cdRef.detectChanges();
    }, error => {
      this.loader.hide();
      this.setOnCloseWinListener();
    });
    // }
    // else {
    //   this.loader.hide();
    //   this.setOnCloseWinListener();
    // }
  }


  focusOnWindow() {
    this.sessionVar.focus();
    this.cdRef.detectChanges();
  }

  setOnCloseWinListener() {
    if(this.dataReceived && this.dataReceived.status == 'success') {

    }
    else {
      this.paymentMadeResponse.emit({
        'payment_method': PaymentMode.VIVA,
        'status': 'error'
      });
      this.showBackground = false;
    }    
  };

  /**
    * payment made event
    */
  paymentMade(data) {


    this.paymentMadeResponse.emit(data);
  }

  /**
   * success payment
   */
  vivaWalletResponse(data) {
    setTimeout(() => {
      this.paymentMade(data);

    }, 3000);
  }

  openUrl() {
    this.sessionVar = window.open(this.url);
    // setInterval(() => {
    //   debugger
    //   this.checkIfClosed();
    // }, 2000);
    this.cdRef.detectChanges();
  }


}
