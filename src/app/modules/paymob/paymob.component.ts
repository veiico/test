import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { AppService } from '../../app.service';
import { PaymentFor, PaymentMode, CREATE_TASK_TYPE, OnboardingBusinessType } from '../../enums/enum';
import { LoaderService } from '../../services/loader.service';
import { SessionService } from '../../services/session.service';
import { PopUpService } from '../popup/services/popup.service';
import { PayMobService } from './paymob.service';

@Component({
    selector: 'app-paymob',
    templateUrl: './paymob.component.html',
    styleUrls: ['./paymob.component.scss']
})
export class PayMobComponent implements OnInit, AfterViewInit, OnDestroy {

    languageStrings: any={};
    public config: any;
    public terminology: any;
    public langJson: any;
    public languageSelected: string;
    public direction: string;
    public payMobPaymentUrl: any;
    protected payMobWinRef;
    public showBackground: boolean;
    protected closeWindowListener;
    @Input() loginResponse: any;
    @Input() NET_PAYABLE_AMOUNT: number;
    @Output() paymentMadeResponse: any = new EventEmitter();
    @Input() paymentFor: any;
    @Input() dataofCart: any;
    @Input() post_payment_enable: any;
    public paymentMode = PaymentMode;
    paymentObj: any;
    public paymentForEnum = PaymentFor;
    @Input() isSourceCustom: any;
    @Input() debtAmountCheck: any;
    @Input() customerPlanId: any;
    customOrderFlow: boolean;
  

    protected _triggerPayment;
    get triggerPayment() { return this._triggerPayment };
    @Input() set triggerPayment(val: any) {
        if (val) {
            this._triggerPayment = val;
            if (this.loginResponse && this.loginResponse.formSettings[0].activePaymentMethods) {
                this.paymentObj = this.loginResponse.formSettings[0].activePaymentMethods.filter(ele => ele.value == this.paymentMode.PAY_MOB);
                if(this.paymentObj && this.paymentObj[0] && this.paymentObj[0].payment_process_type)
                {
                  this.post_payment_enable = this.paymentObj[0].payment_process_type;
                }
              }
        
            this.initPayMob();
        }
    };

    constructor(protected sessionService: SessionService,
        public payMobService: PayMobService,
        public loader: LoaderService,
        protected popup: PopUpService,
        protected appService: AppService) {
           
            this.setConfig();
        this.setLanguage();
    }

    ngOnInit() {

      
   

        /**
         * iframe events for success and failure payment
         */

        window.onmessage = (event) => {
      
            if (typeof event.data == 'object') {
                if (event.data.payment_method == PaymentMode.PAY_MOB) {
                    if (event.data.status == 'success') {
                        this.payMobResponse(event.data);
                    }
                    else {
                        this.payMobResponse(event.data);
                    }
                }
            }

        };
    }

    ngAfterViewInit() {

    }

    ngOnDestroy() {
        if (this.sessionService.paymentWinRef)
            this.sessionService.paymentWinRef.close();
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
     * init payMob
     */
    initPayMob() {
        // // this.setOnCloseWinListener();
        // this.openWindowInCenter('', '', 500, 600, 100);
        // this.payMobWinRef.document.title = 'Payment Process';
        // this.payMobWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
        this.showBackground = true;

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

        }
        let data = {
            marketplace_user_id: this.sessionService.get("config").marketplace_user_id,
            vendor_id: appData.vendor_details.vendor_id,
            access_token: appData.vendor_details.app_access_token,
            user_id: ((this._triggerPayment.payment_for  == PaymentFor.REPAYMENT || this._triggerPayment.isEditedTask) ? this.sessionService.get('repay_merchant') : this.sessionService.getString("user_id")) || undefined,
            name: customer_name || appData.vendor_details.first_name,
            email: customer_email || appData.vendor_details.email,
            currency: this.config.payment_settings[0].code,
            amount: this.NET_PAYABLE_AMOUNT,
            payment_method: PaymentMode.PAY_MOB,
            app_type: 'WEB',
            domain_name: window.location.origin,
            job_id: this._triggerPayment.job_id,
            get_address_url: 1,
            isEditedTask: this._triggerPayment.isEditedTask ? 1 : undefined,
            payment_for: this._triggerPayment.payment_for !== undefined ? this._triggerPayment.payment_for : undefined

        };
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
    

        if (this.paymentFor) {
            data.payment_for = this.paymentFor;
        }


        this.payMobService.getPayMobLink(data).subscribe(response => {
            if (response.status === 200) {
                this.loader.hide();
                this.sessionService.paymentWinRef.location.href = response.data.url;

            } else {

                this.loader.hide();
                this.setOnCloseWinListener();
                this.popup.showPopup("error", 3000, response.message, false);
            }
        });


    }

    focusOnWindow() {
        this.sessionService.paymentWinRef.focus();
    }

    setOnCloseWinListener() {
                this.paymentMadeResponse.emit({
                    'payment_method': PaymentMode.PAY_MOB,
                    'status': 'error'
                });
                this.showBackground = false;
            
    };



    openWindowInCenter(url, title, w, h, t) {
        // Fixes dual-screen position                         Most browsers      Firefox
        let dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : window.screenX;
        let dualScreenTop = window.screenTop != undefined ? window.screenTop : window.screenY;

        let width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        let height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

        let systemZoom = width / window.screen.availWidth;
        let left = (width - w) / 2 / systemZoom + dualScreenLeft
        let top = (height - h) / 2 / systemZoom + dualScreenTop + t;
        this.sessionService.paymentWinRef = window.open(url, '', 'scrollbars=yes, width=' + w / systemZoom + ', height=' + h / systemZoom + ', top=' + top + ', left=' + left);

        // Puts focus on the newWindow
        if (window.focus) this.sessionService.paymentWinRef.focus();
    }

    /**
     * success payment
     */
    payMobResponse(data) {
        setTimeout(() => {
            // this.payMobPaymentUrl = '';
            this.paymentMadeResponse.emit(data);
        }, 3000);
    }


}
