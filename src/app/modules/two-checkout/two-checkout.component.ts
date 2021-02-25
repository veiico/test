import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LoaderService } from '../../services/loader.service';
import { environment } from '../../../environments/environment';
import { SessionService } from '../../services/session.service';
import { PaymentFor, PaymentMode, CREATE_TASK_TYPE, OnboardingBusinessType } from '../../enums/enum';
import { TwoCheckoutService } from './two-checkout.service';
import { PopUpService } from '../popup/services/popup.service';

@Component({
  selector: 'app-two-checkout',
  templateUrl: './two-checkout.component.html',
  styleUrls: ['./two-checkout.component.scss']
})
export class TwoCheckoutComponent implements OnInit {
  public config: any;
  public terminology: any;
  public langJson: any;
  public languageSelected: string;
  public direction: string;
  twocheckoutPaymentData;
  public paymentMode = PaymentMode;
  paymentObj: any;
  public paymentForEnum = PaymentFor;


  @Input() loginResponse: any;
  @Output() paymentMadeResponse: any = new EventEmitter();
  @Input() NET_PAYABLE_AMOUNT: number;
  @Input() paymentFor: any;
  @Input() isSourceCustom: any;
  @Input() post_payment_enable: any;
  @Input() debtAmountCheck: any;
  @Input() customerPlanId: any;
  @Input() dataofCart: any;
  customOrderFlow: boolean;


  protected _triggerPayment;
  get triggerPayment() { return this._triggerPayment };
  @Input() set triggerPayment(val: any) {
    if (val) {
      this._triggerPayment = val;
      if (this.loginResponse && this.loginResponse.formSettings[0].activePaymentMethods) {
        this.paymentObj = this.loginResponse.formSettings[0].activePaymentMethods.filter(ele => ele.value == this.paymentMode.TWO_CHECKOUT);
        if(this.paymentObj && this.paymentObj[0] && this.paymentObj[0].payment_process_type)
        {
          this.post_payment_enable = this.paymentObj[0].payment_process_type;
        }
      }

      this.loadScript();
    }
  };

  constructor(public loader: LoaderService, protected sessionService: SessionService, public twocheckoutService: TwoCheckoutService, protected popup: PopUpService) {
    this.setConfig();
   }

  ngOnInit() {
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

  loadTwoCheckoutScript(source: string) {
    return new Promise((resolve, reject) => {
      if (document.getElementById('twocheckout-script')) {
        return resolve(true);
      }
      const script: any = document.createElement('script');
      script.async = true;
      script.src = source;
      script.id = 'twocheckout-script';
      script.onload = () => {
        resolve(true);
      };
      document.head.appendChild(script);
    });
  }

  /**
   * init TwoCheckout
   */
  initTwoCheckout() {
    const appData = this.sessionService.get('appData');
    let customer_name, customer_email;
    if (this.config.business_model_type === "FREELANCER") {
      customer_name = appData.vendor_details.first_name
      customer_email = appData.vendor_details.email
    }
    else {
      if (this.sessionService.getByKey("app", "checkout")) {
        const checkoutData = this.sessionService.getByKey("app", "checkout").cart;
        customer_name = checkoutData.job_pickup_name;
        customer_email = checkoutData.job_pickup_email;
      }
      const data = {
        marketplace_user_id: this.sessionService.get("config").marketplace_user_id,
        vendor_id: appData.vendor_details.vendor_id,
        access_token: appData.vendor_details.app_access_token,
        user_id: ((this._triggerPayment.payment_for  == PaymentFor.REPAYMENT || this._triggerPayment.isEditedTask) ? this.sessionService.get('repay_merchant') : this.sessionService.getString("user_id")) || undefined,
        name: customer_name || appData.vendor_details.first_name,
        email: customer_email || appData.vendor_details.email,
        currency: this.config.payment_settings[0].code,
        amount: this.NET_PAYABLE_AMOUNT,
        payment_method: PaymentMode.TWO_CHECKOUT,
        app_type: 'WEB',
        domain_name: window.location.origin,
        job_id: this._triggerPayment.job_id,
        get_address_url: 1,
        isEditedTask: this._triggerPayment.isEditedTask ? 1 : undefined,
        payment_for: this._triggerPayment.payment_for !== undefined ? this._triggerPayment.payment_for : undefined

      };

      if (this.paymentFor) {
        data.payment_for = this.paymentFor;
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
  

      
      this.twocheckoutService.getTwoCheckoutLink(data).subscribe(response => {
        if (response.status === 200) {
          this.loader.hide();
  
          let vendor = this.sessionService.get('appData').vendor_details.vendor_id;
          this.twocheckoutPaymentData = {            
            reference_id: response.data.reference_id,
            user_id: response.data.user_id,
            product_customer_id: vendor,
            publishable_key: response.data.publishable_key,
            offering_id: 2,
            email: this.sessionService.get('appData').vendor_details.email,
            name: this.sessionService.get('appData').vendor_details.first_name,
            phone: this.sessionService.get('appData').vendor_details.phone_no,
            seller_id: response.data.seller_id
          };

        } else {
          this.loader.hide();
          this.popup.showPopup("error", 3000, response.message, false);
        }
      });
    }

  }

  public async loadScript() {
    this.loader.show();

    await this.loadTwoCheckoutScript(`${environment.jungle_payment_url}twoCheckout/twoCheckout.js`);
    this.initTwoCheckout();
  }

  getPaymentInfo(data) {
    this.paymentMadeResponse.emit(data);
   }
}
