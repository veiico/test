import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { AppService } from '../../app.service';
import { PaymentFor, PaymentMode, CREATE_TASK_TYPE, OnboardingBusinessType } from '../../enums/enum';
import { LoaderService } from '../../services/loader.service';
import { SessionService } from '../../services/session.service';
import { PopUpService } from '../popup/services/popup.service';
import { LimeLightService } from './limelight.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-limelight',
  templateUrl: './limelight.component.html',
  styleUrls: ['./limelight.component.scss']
})
export class LimelightComponent implements OnInit, AfterViewInit, OnDestroy {

  public config: any;
  public terminology: any;
  public langJson: any;
  public languageSelected: string;
  public direction: string;
  public payMobPaymentUrl: any;
  protected payMobWinRef;
  public showBackground: boolean;
  protected closeWindowListener;
  limelightPaymentData;
  @Input() loginResponse: any;
  @Output() paymentMadeResponse: any = new EventEmitter();
  @Input() NET_PAYABLE_AMOUNT: number;
  @Input() paymentFor: any;
  @Input() dataofCart: any;
  @Input() isSourceCustom: any;
  post_payment_enable: any;
  customOrderFlow: boolean;
  @Input() debtAmountCheck: any;
  @Input() customerPlanId: any;
  public paymentMode = PaymentMode;
  paymentObj: any;
  public paymentForEnum = PaymentFor;

  protected _triggerPayment;
  get triggerPayment() { return this._triggerPayment };
  @Input() set triggerPayment(val: any) {
    if (val) {
      this._triggerPayment = val;
      if (this.loginResponse && this.loginResponse.formSettings[0].activePaymentMethods) {
        this.paymentObj = this.loginResponse.formSettings[0].activePaymentMethods.filter(ele => ele.value == this.paymentMode.LIME_LIGHT);
        if(this.paymentObj && this.paymentObj[0] && this.paymentObj[0].payment_process_type)
        {
          this.post_payment_enable = this.paymentObj[0].payment_process_type;
        }
      }
      this.loadScript();
    }
  };

  constructor(protected sessionService: SessionService,
    public limeLightService: LimeLightService,
    public loader: LoaderService,
    protected popup: PopUpService,
    protected appService: AppService) {
    this.setConfig();
  }

  ngOnInit() {
  }

  async loadScript() {
    this.loader.show();
    await this.loadLimeLightScript(`${environment.jungle_payment_url}limelight/limelight.js`);
    this.initLimeLight();
  }

  ngAfterViewInit() {

  }

  loadLimeLightScript(source: string) {
    return new Promise((resolve, reject) => {
      if (document.getElementById('limelight-script')) {
        return resolve(true);
      }
      const script: any = document.createElement('script');
      script.async = true;
      script.src = source;
      script.id = 'limelight-script';
      script.onload = () => {
        resolve(true);
      };
      document.head.appendChild(script);
    });
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

  getPaymentInfo(data) {
   this.paymentMadeResponse.emit(data);
  }
  /**
   * init payMob
   */
  initLimeLight() {
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
        payment_method: PaymentMode.LIME_LIGHT,
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
  

      this.limeLightService.getLimeLightLink(data).subscribe(response => {
        if (response.status === 200) {
          this.loader.hide();
          this.limelightPaymentData = {            
            reference_id: response.data.reference_id,
            user_id: response.data.user_id
          };

        } else {
          this.loader.hide();
          this.popup.showPopup("error", 3000, response.message, false);
        }
      });
    }

  }
}
