import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router, Route, ActivatedRoute } from "@angular/router";
import { SessionService } from "../../../../services/session.service";
import { LoaderService } from "../../../../services/loader.service";
import { RewardsService } from "../../rewards.service";
import { PopUpService } from "../../../../modules/popup/services/popup.service";
import { ValidationService } from "../../../../services/validation.service";
import { AppService } from '../../../../app.service';
import { PaymentFor } from '../../../../enums/enum';
import { PaymentMode } from '../../../../enums/enum';
import { ModalType, MessageType } from '../../../../constants/constant';


@Component({
  selector: 'app-reward-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class RewardsListComponent implements OnInit { 

  post_enabled: number=0;
  paymentObj: any;
  loginResponse: any;
  getOrderCreationPayload: any;
  public headerData: any;
  public config: any;
  public loginData: any;
  public terminology: any = {};
  public langJson: any = {};
  public languageSelected: string;
  public direction: string;
  public ecomView: boolean;
  public rewardData: any = [];
  public currency: string;
  public selectedPaymentMethod: number;
  public paymentMode = PaymentMode;
  public paymentForModes = PaymentFor;
  public modalType: ModalType = ModalType;
  public showModal: boolean;
  public routeParams: any;
  public rewardDataSingle: any;
  public billInfo: any = {};
  public paymentMadeResponse: any;
  public walletDetails: any = {};
  public triggerPayment:any;
  languageStrings: any={};

  constructor(private sessionService: SessionService,
              private loader: LoaderService,
              private rewardService: RewardsService,
              private fb: FormBuilder,
              public route: ActivatedRoute,
              public router: Router,
              public popup: PopUpService,
              private validationService: ValidationService,
              public appService: AppService) {
    this.ecomView =
      this.sessionService.get("config").business_model_type === "ECOM" &&
      this.sessionService.get("config").nlevel_enabled === 2;

  }

  ngOnInit() {

    this.headerData = this.sessionService.get('config');
    this.loginResponse = this.sessionService.get('appData');
    this.setConfig();
    this.setLanguage();
    if (!this.sessionService.isPlatformServer()) {
      this.getRewardList();
      this.subscriptionForUrlParams();
      this.getWalletDetails();
    }
  }
setLangKeys()
{
  this.languageStrings.orders_count= (this.languageStrings.orders_count || "Order Count")
  .replace('ORDER_ORDER',this.terminology.ORDER);
  this.languageStrings.orders_left= (this.languageStrings.orders_left || "Order Left")
  .replace('ORDER_ORDER',this.terminology.ORDER)
}
  /**
   * set config
   */
  setConfig() {
    this.config = this.sessionService.get('config');
    if (!this.sessionService.isPlatformServer()) {
      this.loginData = this.sessionService.get('appData');
    }
    this.currency = this.config.payment_settings[0].symbol;
    if (this.config) {
      this.terminology = this.config.terminology;
    }
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
     this.setLangKeys();
    });
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
   * get wallet history
   */
  getRewardList() {
    const data = {
      marketplace_user_id: this.loginData.vendor_details.marketplace_user_id,
      //start: 0,
      //length: 25
    };
    if (this.loginData) {
      data['vendor_id'] = this.loginData.vendor_details.vendor_id;
      data['access_token'] = this.loginData.vendor_details.app_access_token;
    }
    this.loader.show();
    this.rewardService.getList(data).subscribe((response) => {
    
      this.loader.hide();
      if (response.status === 200) {
        this.rewardData = response.data;
      } else {
        this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
      }
    }, error => {
      console.error(error);
    });
  }

  /**
   * hide payment modal
   */
  hidePaymentModal() {
    this.showModal = false;
  }

  /**
   * get payment module load
   */
  getLoad(event) {

  }

  /**
   * activate plan
   */
  activatePlan(data) {

    this.rewardDataSingle = data;
    this.billInfo['NET_PAYABLE_AMOUNT'] = data.plan_fees;
    this.showModal = true;
  }

  /**
   * selected payment method
   */
  paymentMethod(event) {
    this.selectedPaymentMethod = event.value;
    switch(this.selectedPaymentMethod) {
      case this.paymentMode.STRIPE:
        break;
      case this.paymentMode.PAYFORT:
        break;
      case this.paymentMode.VISTA:
        break;
      case this.paymentMode.PAYSTACK:
        this.triggerPayment = Math.random();
        this.getOrderCreationPayload=this.getPaymentData();
        break;
      case this.paymentMode.RAZORPAY:
        this.triggerPayment = Math.random();
        this.getOrderCreationPayload=this.getPaymentData();
        break;
      case this.paymentMode.PAYPAL:
        this.triggerPayment = Math.random();
        this.getOrderCreationPayload=this.getPaymentData();
        break;
      case this.paymentMode.TELR:
        this.triggerPayment = Math.random();
        this.getOrderCreationPayload=this.getPaymentData();
        break;
      case this.paymentMode.MPAISA:
        this.triggerPayment = Math.random(); //only to trigger the geturl api
        this.getOrderCreationPayload=this.getPaymentData();
        break;
      case this.paymentMode.WALLET:
        this.makePaymentThroughWallet();
        break;
      // case this.paymentMode.PAY_MOB:
      //   this.triggerPayment = Math.random(); //only to trigger the geturl api
      //   this.sessionService.payMobWinRef = window.open('');
      //   this.sessionService.payMobWinRef.document.title = 'Payment Process';
      //   this.sessionService.payMobWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      //   break;
      // case this.paymentMode.WIRE_CARD:
      //     this.triggerPayment = Math.random(); //only to trigger the geturl api
      //     this.sessionService.wirecardWinRef = window.open('');
      //     this.sessionService.wirecardWinRef.document.title = 'Payment Process';
      //     this.sessionService.wirecardWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      //     break;
      // case this.paymentMode.SSL_COMMERZ:
      //   this.triggerPayment = Math.random(); //only to trigger the geturl api
      //   this.sessionService.sslCommerzWinRef = window.open('');
      //   this.sessionService.sslCommerzWinRef.document.title = 'Payment Process';
      //   this.sessionService.sslCommerzWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      //   break;
      case this.paymentMode.AZUL:
        if (this.config.payment_settings[0].code === 'DOP') {
          this.triggerPayment = Math.random(); //only to trigger the geturl api
          this.sessionService.paymentWinRef = window.open('');
          this.sessionService.paymentWinRef.document.title = 'Payment Process';
          this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
          this.getOrderCreationPayload=this.getPaymentData();
          break;
        }
        else {
          this.showModal = false;
          this.popup.showPopup(MessageType.ERROR, 2000, this.languageStrings.currency_not_supported ||'Currency not supported', false);
          break;
        }
      case this.paymentMode.CREDIMAX:
        if (this.config.payment_settings[0].code === 'BHD') {
          this.triggerPayment = Math.random(); //only to trigger the geturl api
          this.sessionService.paymentWinRef = window.open('');
          this.sessionService.paymentWinRef.document.title = 'Payment Process';
          this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
          this.getOrderCreationPayload=this.getPaymentData();
          break;
        }
        else {
          this.showModal = false;
          this.popup.showPopup(MessageType.ERROR, 2000,  'languageStrings.currency_not_supported' || 'Currency not supported', false);
          break;
        }
      // case this.paymentMode.MY_FATOORAH:
      //   this.triggerPayment = Math.random(); //only to trigger the geturl api
      //   this.sessionService.fatoorahWinRef = window.open('');
      //   this.sessionService.fatoorahWinRef.document.title = 'Payment Process';
      //   this.sessionService.fatoorahWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      //   break;
      // case this.paymentMode.PAYNET:
      //   this.triggerPayment = Math.random(); //only to trigger the geturl api
      //   this.sessionService.paynetWinRef = window.open('');
      //   this.sessionService.paynetWinRef.document.title = 'Payment Process';
      //   this.sessionService.paynetWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      //   break;
      // case this.paymentMode.TAP:
      //   this.triggerPayment = Math.random(); //only to trigger the geturl api
      //   this.sessionService.tapWinRef = window.open('');
      //   this.sessionService.tapWinRef.document.title = 'Payment Process';
      //   this.sessionService.tapWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      //   break;
      // case this.paymentMode.CURLEC:
      //   this.triggerPayment = Math.random(); //only to trigger the geturl api
      //   this.sessionService.curlecWinRef = window.open('');
      //   this.sessionService.curlecWinRef.document.title = 'Payment Process';
      //   this.sessionService.curlecWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      //   break;
      // case this.paymentMode.WIPAY:
      //   this.triggerPayment = Math.random(); //only to trigger the geturl api
      //   this.sessionService.wipayWinRef = window.open('');
      //   this.sessionService.wipayWinRef.document.title = 'Payment Process';
      //   this.sessionService.wipayWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      //   break;
      // case this.paymentMode.THETELLER:
      //   this.triggerPayment = Math.random(); //only to trigger the geturl api
      //   this.sessionService.thetellerWinRef = window.open('');
      //   this.sessionService.thetellerWinRef.document.title = 'Payment Process';
      //   this.sessionService.thetellerWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      //   break;
      // case this.paymentMode.FAC_3D:
      //   this.triggerPayment = Math.random(); //only to trigger the geturl api
      //   this.sessionService.fac3dWinRef = window.open('');
      //   this.sessionService.fac3dWinRef.document.title = 'Payment Process';
      //   this.sessionService.fac3dWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      //   break;
      case this.paymentMode.CHECKOUT_COM:
        if (this.config.payment_settings[0].code === 'EUR' || this.config.payment_settings[0].code === 'SAR') {
          this.triggerPayment = Math.random(); //only to trigger the geturl api
          this.sessionService.paymentWinRef = window.open('');
          this.sessionService.paymentWinRef.document.title = 'Payment Process';
          this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
          this.getOrderCreationPayload=this.getPaymentData();
          break;
        }
        else {
          this.showModal = false;
          this.popup.showPopup(MessageType.ERROR, 2000, this.languageStrings.currency_not_supported ||'Currency not supported', false);
          break;
        }
      // case this.paymentMode.PAYHERE:
      //   this.triggerPayment = Math.random(); //only to trigger the geturl api
      //   this.sessionService.payHereWinRef = window.open('');
      //   this.sessionService.payHereWinRef.document.title = 'Payment Process';
      //   this.sessionService.payHereWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      //   break;
      case this.paymentMode.HYPERPAY:
        // if (this.config.payment_settings[0].code === 'SAR') {
          this.triggerPayment = Math.random(); //only to trigger the geturl api
          this.sessionService.paymentWinRef = window.open('');
          this.sessionService.paymentWinRef.document.title = 'Payment Process';
          this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
          this.getOrderCreationPayload=this.getPaymentData();
        // }
        // else {
        //   this.showModal = false;
        //   this.popup.showPopup(MessageType.ERROR, 2000, 'Currency not supported', false);
        // }
        break;
      // case this.paymentMode.PAYNOW:
      //   this.triggerPayment = Math.random(); //only to trigger the geturl api
      //   this.sessionService.paynowWinRef = window.open('');
      //   this.sessionService.paynowWinRef.document.title = 'Payment Process';
      //   this.sessionService.paynowWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      //   break;
      case this.paymentMode.STRIPE_IDEAL:
        this.triggerPayment = Math.random(); //only to trigger the geturl api
        this.getOrderCreationPayload=this.getPaymentData();
        break;
      case this.paymentMode.LIME_LIGHT:
        this.triggerPayment = Math.random(); //only to trigger the geturl api
        this.getOrderCreationPayload=this.getPaymentData();
        break;
      case this.paymentMode.TWO_CHECKOUT:
        this.triggerPayment = Math.random(); //only to trigger the geturl api
        this.getOrderCreationPayload=this.getPaymentData();
        break;
      case this.paymentMode.VIVA:
        // if (this.config.payment_settings[0].code === 'EUR') {
        this.triggerPayment = Math.random(); //only to trigger the geturl api
        this.sessionService.paymentWinRef = window.open('');
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
        this.getOrderCreationPayload = this.getPaymentData();
        // }
        // else {
        //   this.showModal = false;
        //   this.popup.showPopup(MessageType.ERROR, 2000, 'Currency not supported', false);
        // }
        break;
      default:
        this.triggerPayment = Math.random(); //only to trigger the geturl api
        this.sessionService.paymentWinRef = window.open('');
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
        this.getOrderCreationPayload=this.getPaymentData();
        break;
    }
  }

  /**
   * payment made response
   */
  addCardResponse(event) {
    this.paymentMadeResponse = event.response;
    if (this.loginResponse && this.loginResponse.formSettings[0].activePaymentMethods && this.paymentMadeResponse) {
      this.paymentObj = this.loginResponse.formSettings[0].activePaymentMethods.filter(
          ele => ele.value == this.paymentMadeResponse.payment_method
        );
  
        if(this.paymentObj && this.paymentObj[0] && this.paymentObj[0].payment_process_type)
        {
          this.post_enabled = this.paymentObj[0].payment_process_type;
         }
      }
    if (this.paymentMadeResponse && (this.paymentMadeResponse.status != 'error' || !this.paymentMadeResponse.status)) {
      let autoPayArray = [PaymentMode.RAZORPAY, PaymentMode.PAYPAL, PaymentMode.PAYZEN, PaymentMode.PAYFAST, PaymentMode.TAP, PaymentMode.CURLEC, PaymentMode.LIME_LIGHT, PaymentMode.WHOOSH, PaymentMode.PAYNET, PaymentMode.PAGAR, PaymentMode.STRIPE_IDEAL, PaymentMode.ONEPAY, PaymentMode.MTN, PaymentMode.TRUEVO, PaymentMode.FIRSTDATA, PaymentMode.MY_FATOORAH, PaymentMode.VALITOR, PaymentMode.VIVA, PaymentMode.SSL_COMMERZ, PaymentMode.HYPERPAY, PaymentMode.FAC_3D, PaymentMode.AZUL, PaymentMode.CREDIMAX, PaymentMode.ATH, PaymentMode.PAGOPLUX, PaymentMode.MYBILLPAYMENT, PaymentMode.TWO_CHECKOUT, PaymentMode.WECHAT, PaymentMode.SQUARE, PaymentMode.INNSTAPAY, PaymentMode.PAYHERE, PaymentMode.PAY_MOB, PaymentMode.IPAY88, PaymentMode.PAYU, PaymentMode.PAYSTACK, this.paymentMode.PAYNOW, PaymentMode.ETISALAT, PaymentMode.PROXYPAY, PaymentMode.CYBERSOURCE, PaymentMode.BANKOPEN, PaymentMode.WIPAY, PaymentMode.MPAISA, PaymentMode.ALFALAH, PaymentMode.CULQI, PaymentMode.NMI, PaymentMode.CHECKOUT_COM, PaymentMode.FLUTTERWAVE, PaymentMode.MPESA, PaymentMode.ADYEN, PaymentMode.PAYMARK, PaymentMode.HYPUR, PaymentMode.PAYTMV3, PaymentMode.PIXELPAY, PaymentMode.DOKU, PaymentMode.PEACH, PaymentMode.PAGUELOFACIL, PaymentMode.NOQOODY, PaymentMode.GTBANK, PaymentMode.URWAY, PaymentMode.VUKA, PaymentMode.VPOS, PaymentMode.CXPAY, PaymentMode.PAYKU, PaymentMode.BAMBORA, PaymentMode.PAYWAYONE, PaymentMode.PLACETOPAY, PaymentMode.TELR];

      if(autoPayArray.includes(+this.paymentMadeResponse.payment_method) && this.post_enabled==2)
      {
        this.showModal = false;
        this.popup.showPopup(MessageType.SUCCESS, 3000, this.languageStrings.congrats_your_plan_has_been_activated_successfully || 'Congrats! Your plan has been activated successfully', false);
        this.getRewardList();
          this.manupulateHistory();
      }
      else
      {   if (this.selectedPaymentMethod === PaymentMode.TWO_CHECKOUT && this.paymentMadeResponse.detail.detail.status == 400) {
        this.showModal = false;
      } else 
      this.buyPlanHit();

    }
   
    } else if (this.paymentMadeResponse && this.paymentMadeResponse.status && this.paymentMadeResponse.status == 'error') {
      let payArray = [PaymentMode.PAY_MOB,PaymentMode.SSL_COMMERZ,PaymentMode.PAYNOW,PaymentMode.FAC_3D,PaymentMode.CHECKOUT_COM,PaymentMode.VIVA,PaymentMode.PAYHERE,PaymentMode.AZUL,PaymentMode.HYPERPAY,PaymentMode.CREDIMAX,PaymentMode.MY_FATOORAH,PaymentMode.TAP,PaymentMode.THETELLER,PaymentMode.PAYNET,PaymentMode.CURLEC,PaymentMode.WIPAY,PaymentMode.PAGAR, PaymentMode.WHOOSH,PaymentMode.MTN, PaymentMode.WECHAT,PaymentMode.ONEPAY,PaymentMode.PAGOPLUX, PaymentMode.MYBILLPAYMENT, PaymentMode.VALITOR, PaymentMode.TRUEVO, PaymentMode.PAYZEN, PaymentMode.FIRSTDATA, PaymentMode.BANKOPEN, PaymentMode.SQUARE, PaymentMode.ETISALAT, PaymentMode.SUNCASH, PaymentMode.GOCARDLESS, PaymentMode.ATH, PaymentMode.IPAY88, PaymentMode.PROXYPAY, PaymentMode.CYBERSOURCE, PaymentMode.ALFALAH, PaymentMode.CULQI, PaymentMode.NMI, PaymentMode.FLUTTERWAVE, PaymentMode.MPESA, PaymentMode.ADYEN, PaymentMode.PAYMARK, PaymentMode.HYPUR, PaymentMode.PAYTMV3, PaymentMode.PIXELPAY, PaymentMode.DOKU, PaymentMode.PEACH, PaymentMode.PAGUELOFACIL, PaymentMode.NOQOODY, PaymentMode.GTBANK, PaymentMode.URWAY, PaymentMode.VUKA, PaymentMode.VPOS, PaymentMode.CXPAY, PaymentMode.PAYKU, PaymentMode.BAMBORA, PaymentMode.PAYWAYONE, PaymentMode.PLACETOPAY];

      this.showModal = false;

      if(payArray.includes(+event.payment_method)) {
        this.sessionService.paymentWinRef.close();
      }
      this.popup.showPopup(MessageType.ERROR, 2000, 'Transaction Failed', false);

      //this.buyPlanHit();
    }
  }

  /**
   * buy plan hit
   */
  buyPlanHit() {
    const obj = {};

    obj['marketplace_user_id'] = this.loginData.vendor_details.marketplace_user_id;
    obj['reward_id'] = this.rewardDataSingle.id;
    obj['payment_method'] = this.selectedPaymentMethod;

    if (this.sessionService.get('appData')) {
      obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }

    switch (this.selectedPaymentMethod) {
      case this.paymentMode.STRIPE:
        obj['transaction_id'] = this.paymentMadeResponse.transaction_id;
        break;
      case this.paymentMode.PAYFORT:
        obj['transaction_id'] = this.paymentMadeResponse.transaction_id ? this.paymentMadeResponse.transaction_id : '';
        break;
      case this.paymentMode.VISTA:
        obj['transaction_id'] = this.paymentMadeResponse.transaction_id;
        break;
      case this.paymentMode.PAYSTACK:
        obj['transaction_id'] = this.paymentMadeResponse.transaction_id ? this.paymentMadeResponse.transaction_id : '';
        break;
      case this.paymentMode.WALLET:
        obj['transaction_id'] = this.paymentMadeResponse.transaction_id ? this.paymentMadeResponse.transaction_id : '';
        break;
      case this.paymentMode.PAYNOW:
        obj['transaction_id'] = this.paymentMadeResponse.transaction_id ? this.paymentMadeResponse.transaction_id : '';
        break;
      case this.paymentMode.LIME_LIGHT:
        obj['transaction_id'] = this.paymentMadeResponse.detail.detail.transactionID ? this.paymentMadeResponse.detail.detail.transactionID : '';
        break;
      case this.paymentMode.STRIPE_IDEAL:
        obj['transaction_id'] = this.paymentMadeResponse.transactionId ? this.paymentMadeResponse.transactionId : '';
        break;
      case this.paymentMode.TWO_CHECKOUT:
        obj['transaction_id'] = this.paymentMadeResponse.detail.detail.transactionID ? this.paymentMadeResponse.detail.detail.transactionID : '';
        break;
      case this.paymentMode.VIVA:
        obj['transaction_id'] = this.paymentMadeResponse.transactionId ? this.paymentMadeResponse.transactionId : '';
        break;
      case this.paymentMode.PAYPAL:
        obj['transaction_id'] = this.paymentMadeResponse.transaction_id ? this.paymentMadeResponse.transaction_id : '';
        break;
      
      case this.paymentMode.TELR:
          obj['transaction_id'] = this.paymentMadeResponse.transaction_id ? this.paymentMadeResponse.transaction_id : '';
          break;
        
        case this.paymentMode.RAZORPAY:
        obj['transaction_id'] = this.paymentMadeResponse.rzp_payment_id ? this.paymentMadeResponse.rzp_payment_id : '';
        break;
      default:
        obj['transaction_id'] = this.paymentMadeResponse.transactionId ? this.paymentMadeResponse.transactionId : undefined;
        break;

    }

    this.loader.show();
    this.rewardService.buyPlan(obj).subscribe((response) => {
      this.loader.hide();
      if (response.status === 200) {
        let payArray = [PaymentMode.PAY_MOB,PaymentMode.SSL_COMMERZ,PaymentMode.PAYNOW,PaymentMode.FAC_3D,PaymentMode.CHECKOUT_COM,PaymentMode.VIVA,PaymentMode.PAYHERE,PaymentMode.AZUL,PaymentMode.HYPERPAY,PaymentMode.CREDIMAX,PaymentMode.MY_FATOORAH,PaymentMode.TAP,PaymentMode.THETELLER,PaymentMode.PAYNET,PaymentMode.CURLEC,PaymentMode.WIPAY,PaymentMode.PAGAR, PaymentMode.WHOOSH,PaymentMode.MTN, PaymentMode.WECHAT,PaymentMode.ONEPAY,PaymentMode.PAGOPLUX, PaymentMode.MYBILLPAYMENT, PaymentMode.VALITOR, PaymentMode.TRUEVO, PaymentMode.PAYZEN, PaymentMode.FIRSTDATA, PaymentMode.BANKOPEN, PaymentMode.SQUARE, PaymentMode.ETISALAT, PaymentMode.SUNCASH, PaymentMode.GOCARDLESS, PaymentMode.ATH, PaymentMode.IPAY88, PaymentMode.PROXYPAY, PaymentMode.CYBERSOURCE, PaymentMode.ALFALAH, PaymentMode.CULQI, PaymentMode.NMI, PaymentMode.FLUTTERWAVE, PaymentMode.MPESA, PaymentMode.ADYEN, PaymentMode.PAYMARK, PaymentMode.HYPUR, PaymentMode.PAYTMV3, PaymentMode.PIXELPAY, PaymentMode.DOKU, PaymentMode.PEACH, PaymentMode.PAGUELOFACIL, PaymentMode.NOQOODY, PaymentMode.GTBANK, PaymentMode.URWAY, PaymentMode.VUKA, PaymentMode.VPOS, PaymentMode.CXPAY, PaymentMode.PAYKU, PaymentMode.BAMBORA, PaymentMode.PAYWAYONE, PaymentMode.PLACETOPAY];

        if(payArray.includes(this.selectedPaymentMethod)) {
          this.sessionService.paymentWinRef.close();
        }

        this.showModal = false;
        this.getRewardList();
        setTimeout(() => {
          this.manupulateHistory();
          this.popup.showPopup(MessageType.SUCCESS, 2000, response.message, false);
        }, 300);
      } else {
        this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
      }
    }, error => {
      console.error(error);
    });
  }

  /**
   * get wallet details
   */
  getWalletDetails() {
    const data = {
      marketplace_user_id: this.config.marketplace_user_id,
      need_balance_only: 1
    };
    if (this.sessionService.get('appData')) {
      data['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      data['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    this.rewardService.getWalletBalance(data).subscribe(response => {
      if (response.status === 200) {
     
        this.walletDetails = response.data;
      } else {
        this.walletDetails = {};
      }
    });
  }

  /**
   * make payment through wallet
   */
  makePaymentThroughWallet() {
    if (Number(this.billInfo.NET_PAYABLE_AMOUNT) > Number(this.walletDetails.wallet_balance)) {
      this.popup.showPopup(MessageType.ERROR,3000,this.languageStrings.please_add_balance_in_wallet || "Please add balance in Wallet.",false);
      let balance = Number(this.billInfo.NET_PAYABLE_AMOUNT) -  Number(this.walletDetails.wallet_balance);
      this.sessionService.set('rewardData',this.rewardDataSingle);
      this.sessionService.set('walletAddMoney',{balance: balance, redirect: 'reward'});
      this.router.navigate(['wallet']);
      return;
    } else {
      this.makeCreateChargeHit();
    }
  }

  /**
   * subscribe url params
   */
  subscriptionForUrlParams() {
    const response = this.route.snapshot.queryParams;

    this.routeParams = response;
    if (response && response['success']) {
      if (this.sessionService.get('rewardData')) {
        this.rewardDataSingle = this.sessionService.get('rewardData');
        this.billInfo['NET_PAYABLE_AMOUNT'] = this.rewardDataSingle.plan_fees;
      }
      this.selectedPaymentMethod = this.paymentMode.WALLET;
      this.makeCreateChargeHit();
    }
  }

  /**
   * create charge hit
   */
  makeCreateChargeHit() {
    const data = {
      "amount" : this.billInfo.NET_PAYABLE_AMOUNT,
      "payment_method" : this.selectedPaymentMethod,
      "payment_for" : this.paymentForModes.REWARDS,
      "marketplace_user_id" : this.loginData.vendor_details.marketplace_user_id,
      "vendor_id" : this.loginData.vendor_details.vendor_id,
      "app_access_token": this.loginData.vendor_details.app_access_token,
      "access_token": this.loginData.vendor_details.app_access_token,
      "user_id" : this.loginData.vendor_details.marketplace_user_id,
      "app_type": "WEB"
    };

    this.rewardService.createCharge(data).subscribe(response => {
      if (response.status === 200){
        
        if (response.status === 200) {
          this.paymentMadeResponse = {
            transaction_id: response.data.transaction_id
          };
          this.buyPlanHit();
          this.sessionService.remove('rewardData');
        }
      } else {
        this.popup.showPopup(MessageType.ERROR, 3000, response.message, false);
      }
    });
  }

  /**
   * manupulate history
   */
  manupulateHistory() {
    let domain = window.location.hostname;
    let url = 'reward';
    if (
      domain === "localhost" ||
      domain === "dev-webapp.yelo.red" ||
      domain === "beta-webapp.yelo.red" ||
      domain === "127.0.0.1" ||
      domain === "dev.yelo.red"
    ) {
      history.replaceState('', '', location.origin + '/' + url);
      this.router.navigate(['reward'])
    } else {
      history.replaceState('', '', location.origin + '/'+ this.languageSelected + '/' + url);
      this.router.navigate(['reward'])
    }
  }

getPaymentData()
{  const obj = {};
  obj['marketplace_user_id'] = this.loginData.vendor_details.marketplace_user_id;
  obj['reward_id'] = this.rewardDataSingle.id;
  obj['payment_method'] = this.selectedPaymentMethod;

  if (this.sessionService.get('appData')) {
    obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
    obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
  }
  return obj;
}
}
