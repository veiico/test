/**
 * Created by mba-214 on 02/11/18.
 */
import { Component, OnInit, Input, EventEmitter, Output, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { AppService } from '../../app.service';
import { DomSanitizer } from '../../../../node_modules/@angular/platform-browser';
import { Router } from "@angular/router";

import { RazorpayService } from './razorpay.service';
import { LoaderService } from '../../services/loader.service';
import { PopUpService } from '../popup/services/popup.service';
import { PaymentMode, PaymentFor, CREATE_TASK_TYPE, OnboardingBusinessType } from '../../enums/enum';
import { MessageType } from '../../constants/constant';

@Component({
  selector: 'app-razor-pay',
  templateUrl: './razorpay.component.html',
  styleUrls: ['./razorpay.component.scss']
})
export class RazorpayComponent implements OnInit, AfterViewInit, OnDestroy {

  post_enabled: number=0;
  paymentObj: any;
  public config: any;
  public terminology: any;
  public langJson: any;
  public languageSelected: string;
  public direction: string;
  public razorPayUrl: any;
  public cardWindowRef: any;
  public paymentMode = PaymentMode;
  public paymentForEnum = PaymentFor;

  @Input() loginResponse: any;
  @Input() NET_PAYABLE_AMOUNT: number;
  @Input() paymentFor: any;
  @Input() getOrderCreationPayload:any;
  @Output() paymentMadeResponse: any = new EventEmitter();
  @Output() onload: any = new EventEmitter();

  private _triggerPayment;
  get triggerPayment() { return this._triggerPayment };
  @Input() set triggerPayment(val: any) {

    if (val) {
      this._triggerPayment = val;
      if (this.loginResponse && this.loginResponse.formSettings[0].activePaymentMethods) {
        this.paymentObj = this.loginResponse.formSettings[0].activePaymentMethods.filter(
            ele => ele.value == this.paymentMode.RAZORPAY 
          );
    
          if(this.paymentObj && this.paymentObj[0] && this.paymentObj[0].payment_process_type)
          {
            this.post_enabled = this.paymentObj[0].payment_process_type;
           }
        }

      this.initRazorpayWallet();
    }
  

  };

  constructor(private sessionService: SessionService,
              public razorpayService: RazorpayService,
              public domSanitizer: DomSanitizer,
              public router: Router,
              public loader: LoaderService,
              protected popup: PopUpService,
              private appService: AppService) {
    this.setConfig();
    this.setLanguage();
  }

  ngOnInit() {
      /**
       * iframe events for success and failure payment
       */
    window.onmessage = (event) => {
      if (typeof event.data == 'object') {
        this.razorpayService.razorpayUrl.next(event.data);
        if (event.data.payment_method === 128 && !event.data.action) {
          this.successRazorpayTransaction(event.data);
        } else if (event.data.payment_method === 128 && event.data.action === 'close') {
          this.close3dver();
        }
      }

    };

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
   * init razorpay
   */
  initRazorPay() {
    let appConfig= this.sessionService.get('config');
    this.loader.show();
    const data = {
      amount: this.NET_PAYABLE_AMOUNT,
      app_access_token: this.loginResponse.vendor_details.app_access_token
    };

    if (typeof this._triggerPayment == 'object') {
      
      data['job_id'] = this._triggerPayment.job_id;
      data['isEditedTask'] = this._triggerPayment.isEditedTask ? 1 :undefined;
      data['payment_for'] = this._triggerPayment.payment_for ? this._triggerPayment.payment_for :undefined;
      data['user_id']     = this.sessionService.getString('user_id') || this.loginResponse.vendor_details.marketplace_user_id;
    }
    if(this.post_enabled ==2 && this.paymentFor == this.paymentForEnum.REWARDS)
{
  data['orderCreationPayload']=this.getOrderCreationPayload;
  data['orderCreationPayload'].task_type = CREATE_TASK_TYPE.REWARD;
} 
else if(this.post_enabled ==2 && this.getOrderCreationPayload && appConfig && appConfig.onboarding_business_type === OnboardingBusinessType.LAUNDRY)
{
  data['orderCreationPayload']=this.getOrderCreationPayload;
  data['orderCreationPayload'].task_type = 3
}
    this.razorpayService.getRazorPayLink(data).subscribe(response => {
  
      this.loader.hide();
      if (response.status === 200) {
        //this.cardWindowRef = window.open('','',"width=500,height=600,top=100,left=400");
        //this.cardWindowRef.document.title = 'Pay Amount';
        //this.cardWindowRef.location.href = response.data.url + "&domain_name=" + window.location.origin;
        this.razorPayUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(response.data.url + '&domain_name=' + window.location.origin);
      } else {

      }
    });
  }

  /**
   * init razorpay wallet
   */
  initRazorpayWallet() {
    let appConfig= this.sessionService.get('config');
    this.loader.show();
    const data = {
      'vendor_id': this.loginResponse.vendor_details.vendor_id,
      'marketplace_user_id': this.config.marketplace_user_id,
      'user_id': this.sessionService.getString('user_id')  || this.loginResponse.vendor_details.marketplace_user_id,
      // 'domain_name': window.location.origin,
      'app_access_token': this.loginResponse.vendor_details.app_access_token,
      'access_token': this.loginResponse.vendor_details.app_access_token,
      'amount': this.NET_PAYABLE_AMOUNT,
      'app_type': 'WEB',
      'payment_method': this.paymentMode.RAZORPAY,
      'payment_for': this.paymentFor,
      'currency': this.config.payment_settings[0].code,
      'email': this.loginResponse.vendor_details.email || this.loginResponse.vendor_details.first_name,
      'name': this.loginResponse.vendor_details.first_name,
      'phone': this.loginResponse.vendor_details.phone_no
    };

    if (typeof this._triggerPayment == 'object') {
      data['job_id'] = this._triggerPayment.job_id;
    }

    if(this.post_enabled == 2 && (this.paymentFor == this.paymentForEnum.WALLET || this.paymentFor == this.paymentForEnum.GIFT_CARD))
    {
      data['orderCreationPayload'] = this.getOrderCreationPayload;
      data['orderCreationPayload'].task_type = CREATE_TASK_TYPE.CREATE_CHARGE;
    }
    else if(this.post_enabled ==2 && this.paymentFor == this.paymentForEnum.REWARDS)
    {
      data['orderCreationPayload']=this.getOrderCreationPayload;
      data['orderCreationPayload'].task_type = CREATE_TASK_TYPE.REWARD;
    } 
    else if(this.post_enabled ==2 && this.getOrderCreationPayload && appConfig && appConfig.onboarding_business_type === OnboardingBusinessType.LAUNDRY)
    {
      data['orderCreationPayload']=this.getOrderCreationPayload;
      data['orderCreationPayload'].task_type = 3
    }


    this.razorpayService.getRazorpayLinkWallet(data).subscribe(response => {
      this.loader.hide();
      if (response.status === 200) {
        this.razorPayUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(response.data.url + '&domain_name=' + window.location.origin);
      } else {
        this.loader.hide();
        this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
      }
    },error=>{
      this.loader.hide();
    });
  }

  /**
   * payment made event
   */
  paymentMade(data) {
 
    this.paymentMadeResponse.emit(data);
  }

  /**
   * iframe content
   */
  getContentRazorpay(event) {
  
    this.onload.emit({data: true});
  }

  /**
   * close iframe
   */
  close3dver() {
    //if (this.cardWindowRef) {
    //  this.cardWindowRef.close();
    //}
    if (typeof this._triggerPayment == 'object') {
      this.razorPayUrl = '';
      this.manupulateBrowserHistory();
      this.changeRouteWithParams();
    } else {
      this.razorPayUrl = '';
      if (this.paymentFor == this.paymentForEnum.GIFT_CARD || this.paymentFor == this.paymentForEnum.WALLET) {
        this.paymentMade({status: 'error'});
      }
    }
  }

  /**
   * success payment
   */
  successRazorpayTransaction(data) {
    setTimeout(() => {
      //if (this.cardWindowRef) {
      //  this.cardWindowRef.close();
      //}
      this.razorPayUrl = '';
      this.paymentMade(data)
    }, 3000);

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
