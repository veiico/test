import { PaymentFor, PaymentMode, CREATE_TASK_TYPE, OnboardingBusinessType } from '../../enums/enum';
/**
 * Created by mba-214 on 02/11/18.
 */
import { Component, OnInit, Input, EventEmitter, Output, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { AppService } from '../../app.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from "@angular/router";

import { PayfastService } from './payfast.service';
import { LoaderService } from '../../services/loader.service';
import { PaymentService } from '../../components/payment/payment.service';
// import { PaymentMode } from '../../enums/enum';

@Component({
  selector: 'app-payfast',
  templateUrl: './payfast.component.html',
  styleUrls: ['./payfast.component.scss']
})
export class PayfastComponent implements OnInit, AfterViewInit, OnDestroy {

  languageStrings: any={};
  public config: any;
  public terminology: any;
  public langJson: any;
  public languageSelected: string;
  public direction: string;
  public payfastPaymentUrl: any;
  public paymentMode = PaymentMode;
  paymentObj: any;
  public paymentForEnum = PaymentFor;

  @Input() loginResponse: any;
  @Input() NET_PAYABLE_AMOUNT: number;
  @Output() paymentMadeResponse: any = new EventEmitter();
  @Input() dataofCart: any;
  @Input() isSourceCustom: any;
  @Input() paymentFor: any;
  @Input() debtAmountCheck: any;
  @Input() customerPlanId: any;

  protected _triggerPayment;
  productArray: any   ;
  post_payment_enable: any;
  customOrderFlow: boolean;
  get triggerPayment() { return this._triggerPayment };
  @Input() set triggerPayment(val: any) {

    if (val) {
      this._triggerPayment = val;
      if (this.loginResponse && this.loginResponse.formSettings[0].activePaymentMethods) {
        this.paymentObj = this.loginResponse.formSettings[0].activePaymentMethods.filter(ele => ele.value == this.paymentMode.PAYFAST);
        if(this.paymentObj && this.paymentObj[0] && this.paymentObj[0].payment_process_type)
        {
          this.post_payment_enable = this.paymentObj[0].payment_process_type;
        }
      }
      this.initPayfast();
    }
  };

  constructor(protected sessionService: SessionService,
              public payfastService: PayfastService,
              public domSanitizer: DomSanitizer,
              public loader: LoaderService,
              public router: Router,
              protected appService: AppService,
              protected paymentService: PaymentService) {
            
                this.setConfig();
                this.setLanguage();
              }

  ngOnInit() {

    /**
     * iframe events for success and failure payment
     */
    window.onmessage =  (event) => {
      if (typeof event.data == 'object') {
        if(event.data.payment_method == 1024){
          if(event.data.status == 'success'){
            this.payfastResponse(event.data);
          } else{
            this.payfastResponse(event.data);
          }
        }
      }
    };
    const productData = this.sessionService.getByKey("app", "cart");
      this.productArray = productData.map( elem => {
        return elem.id
      });  
  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {

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


  /**
   * init payfast
   */
  initPayfast() {
    this.loader.show();
    const appData = this.sessionService.get('appData');
    const data = {
      'vendor_id': appData.vendor_details.vendor_id,
      'marketplace_user_id': this.config.marketplace_user_id,
      'user_id': this.sessionService.getString('user_id') || undefined,
      'access_token': appData.vendor_details.app_access_token,
      'app_type': 'WEB',
      'currency': this.config.payment_settings[0].code,
      'payment_method': PaymentMode.PAYFAST,
      'name': appData.vendor_details.first_name,
      'email': appData.vendor_details.email,
      'domain_name': window.location.origin,
      'amount': this.NET_PAYABLE_AMOUNT,
    };

    if (typeof this._triggerPayment == 'object') {
     
      data['job_id'] = this._triggerPayment.job_id;
      data['isEditedTask'] = this._triggerPayment.isEditedTask ? 1 :undefined;
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
      if(this.paymentFor == this.paymentForEnum.REWARDS)
      {
        data['orderCreationPayload'].task_type = CREATE_TASK_TYPE.REWARD;
      } 
      else if (this.paymentFor == this.paymentForEnum.WALLET || this.paymentFor == this.paymentForEnum.GIFT_CARD) {
        data['orderCreationPayload'].task_type = CREATE_TASK_TYPE.CREATE_CHARGE;
      }
      else{
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
        else if(this.config.onboarding_business_type === OnboardingBusinessType.FREELANCER) {
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
          if(this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').additionalpaymentId){
            data['orderCreationPayload'].task_type = CREATE_TASK_TYPE.CREATE_CHARGE;
          }
          if(this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').is_custom_order == 1){
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

   if(this.isSourceCustom && this.config.onboarding_business_type === OnboardingBusinessType.LAUNDRY && this.sessionService.getByKey('app', 'payment') && this.sessionService.getByKey('app', 'payment').remaining_balance && this.sessionService.getByKey('app', 'payment').remaining_balance > 0){
    data['isEditedTask'] = 1;
   }

    this.paymentService.getPaymentUrl(data).subscribe(response => {
      this.loader.hide();
      if (response.status === 200) {
        this.payfastPaymentUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(response.data.transaction_url);
      } else {
        this.setOnCloseWinListener();
        this.loader.hide();
      }
    },error=>{
        this.loader.hide();
    });
  }

  setOnCloseWinListener() {
    this.paymentMadeResponse.emit({
      'payment_method': PaymentMode.PAYFAST,
      'status': 'error'
    });

  };

  /**
   * payment made event
   */
  paymentMade(data) {

    this.paymentMadeResponse.emit(data);
  }

  /**
   * iframe content
   */
  getContentPayfast(event) {

    let frame = window.frames;
   
  }

  /**
   * close iframe
   */
  close3dver() {
    this.payfastPaymentUrl = '';
  }

  /**
   * success payment
   */
  payfastResponse(data) {
      setTimeout(()=>{
        // this.payfastPaymentUrl = '';
        this.paymentMade(data);
        if(this.config.onboarding_business_type == 805) {
          if (typeof this._triggerPayment == 'object' && data.status == 'error') {
            this.manupulateBrowserHistory();
            this.changeRouteWithParams();
          }
        }
      },3000);
  }

  /**
   * change route when payment not done with payment status
   */
  changeRouteWithParams() {
    setTimeout(() => {
      this.loader.hide();
      //this.orderPlacedCartClear();
      const payment_params = {
        payment_status: 0
      };
      if (this._triggerPayment.payment_for  == PaymentFor.REPAYMENT) {
        payment_params['repayment'] = 1
      }
      if ((this.sessionService.get('config').business_model_type === 'ECOM') &&
        (this.sessionService.get('config').nlevel_enabled === 2)) {
        this.router.navigate(['ecom/categories'],{queryParams:payment_params});
      }
      else {
        this.router.navigate(['list'],{queryParams:payment_params});
      }
    }, 200);
  }

  /**
   * manupulate bowser history for failed payment
   */
  manupulateBrowserHistory() {
    let domain = window.location.hostname;
    let url =''
    if ((this.sessionService.get('config').business_model_type === 'ECOM') &&
      (this.sessionService.get('config').nlevel_enabled === 2)) {
      url = 'ecom/categories';
    }
    else {
      url = 'list';
    }

    if (
      domain === "localhost" ||
      domain === "dev-webapp.yelo.red" ||
      domain === "beta-webapp.yelo.red" ||
      domain === "127.0.0.1" ||
      domain === "dev.yelo.red"
    ) {
      history.replaceState('', '', location.origin + '/'+url+'?payment_status=0' + (this._triggerPayment.payment_for  == PaymentFor.REPAYMENT ? '&repayment=1':''));
    } else {
      history.replaceState('', '', location.origin + '/'+this.languageSelected + '/'+url+'?payment_status=0' + (this._triggerPayment.payment_for  == PaymentFor.REPAYMENT ? '&repayment=1':''));
    }
  }
}
