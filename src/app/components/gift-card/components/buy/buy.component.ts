import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router, Route, ActivatedRoute } from "@angular/router";
import { takeWhile } from 'rxjs/operators';

import { SessionService } from '../../../../services/session.service';
import { LoaderService } from '../../../../services/loader.service';
import { AppService } from '../../../../app.service';
import { ValidationService } from '../../../../services/validation.service';
import { validations, MessageType } from '../../../../constants/constant';
import { ModalType } from '../../../../constants/constant';
import { GiftCardService } from '../../gift-card.service';
import { PaymentFor, PaymentMode } from '../../../../enums/enum';
import { PopUpService } from '../../../../modules/popup/services/popup.service';
declare var Stripe: any;

@Component({
  selector: 'app-gift-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.scss']
})
export class GiftBuyComponent implements OnInit, OnDestroy {

  getOrderCreationPayload: {};
  post_enabled: number=0;
  paymentObj: any;
  loginResponse: any;
  public headerData: any;
  public config: any;
  public loginData: any = {};
  public terminology: any = {};
  public langJson: any = {};
  public languageSelected: string;
  public direction: string;
  public currency: string;
  public showModal: boolean;
  public buyForm: FormGroup;
  public modalType: ModalType = ModalType;
  public paymentFor = PaymentFor;
  public paymentMode = PaymentMode;
  public walletDetails: any = {};
  public routeParams: any;
  public billInfo: any = {};
  public selectedPaymentMethod: any;
  public triggerPayment: number;
  public paymentMadeResponse: any;
  public alive: boolean = true;
  public stripe;
  languageStrings: any={};
  constructor(private sessionService: SessionService,
              private loader: LoaderService,
              private giftCardService: GiftCardService,
              private fb: FormBuilder,
              public popup: PopUpService,
              public route: ActivatedRoute,
              public router: Router,
              private validationService: ValidationService,
              public appService: AppService) {

  }

  ngOnInit() {
    this.headerData = this.sessionService.get('config');
    this.loginResponse = this.sessionService.get('appData');
    this.setConfig();
    this.setLanguage();
    this.initForm();
    if (!this.sessionService.isPlatformServer()) {
      this.getWalletDetails();
      this.subscriptionForUrlParams();
    }
  }


  ngOnDestroy() {
    this.alive = false;
  }

  /**
   * set config
   */
  setConfig() {
    this.config = this.sessionService.get('config');
    this.loginData = this.sessionService.get('appData');
    if (this.config) {
      this.terminology = this.config.terminology;
      this.currency = this.config.payment_settings[0].symbol;
    }
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
     this.languageStrings.give_gift_card=(this.languageStrings.give_gift_card || 'Give a Gift Card').replace('GIFT_CARD',this.terminology.GIFT_CARD);
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
   * init form for buy card
   */
  initForm() {
    this.buyForm = this.fb.group({
      amount: ['', [Validators.required, Validators.pattern(validations.numbersWithDecimal), ValidationService.setDecimalConfigRegexPattren(this.config.decimal_calculation_precision_point)]],
      fromName: ['', [Validators.required]],
      toName: ['', [Validators.required]],
      toEmail: ['', [Validators.required, ValidationService.emailValidator]],
      fromDescription: ['', [Validators.required]]
    })
  }

  /**
   * on submit
   */
  onSubmit() {
    if (!this.buyForm.valid) {
      return this.validationService.validateAllFormFields(this.buyForm);
    }

    const obj = {
      amount: this.buyForm.controls.amount.value,
      fromName: this.buyForm.controls.fromName.value,
      toName: this.buyForm.controls.toName.value,
      toEmail: this.buyForm.controls.toEmail.value,
      fromDescription: this.buyForm.controls.fromDescription.value,
    };

    this.sessionService.set('gift', obj);

    this.showModal = true;
    this.billInfo['NET_PAYABLE_AMOUNT'] = this.buyForm.controls.amount.value;
  }

  /**
   * hide payment modal
   */
  hidePaymentModal() {
    this.showModal = false;

    let payArray = [PaymentMode.PAY_MOB, PaymentMode.PAYNOW,PaymentMode.SSL_COMMERZ,PaymentMode.FAC_3D,PaymentMode.CHECKOUT_COM,PaymentMode.VIVA,PaymentMode.PAYHERE,PaymentMode.AZUL,PaymentMode.HYPERPAY,PaymentMode.CREDIMAX,PaymentMode.MY_FATOORAH,PaymentMode.THETELLER,PaymentMode.PAYNET,PaymentMode.TAP,PaymentMode.CURLEC,PaymentMode.WIPAY,PaymentMode.PAGAR, PaymentMode.WHOOSH,PaymentMode.MTN, PaymentMode.WECHAT, PaymentMode.ONEPAY,PaymentMode.PAGOPLUX,PaymentMode.MYBILLPAYMENT,PaymentMode.VALITOR, PaymentMode.TRUEVO, PaymentMode.PAYZEN, PaymentMode.FIRSTDATA, PaymentMode.BANKOPEN, PaymentMode.SQUARE, PaymentMode.ETISALAT, PaymentMode.SUNCASH, PaymentMode.GOCARDLESS, PaymentMode.ATH, PaymentMode.IPAY88, PaymentMode.PROXYPAY, PaymentMode.CYBERSOURCE, PaymentMode.ALFALAH, PaymentMode.CULQI, PaymentMode.NMI, PaymentMode.FLUTTERWAVE, PaymentMode.MPESA, PaymentMode.ADYEN, PaymentMode.PAYMARK, PaymentMode.HYPUR, PaymentMode.PAYTMV3, PaymentMode.PIXELPAY, PaymentMode.DOKU, PaymentMode.PEACH, PaymentMode.PAGUELOFACIL, PaymentMode.NOQOODY, PaymentMode.GTBANK, PaymentMode.URWAY, PaymentMode.VUKA, PaymentMode.VPOS, PaymentMode.CXPAY, PaymentMode.PAYKU, PaymentMode.BAMBORA, PaymentMode.PAYWAYONE, PaymentMode.PLACETOPAY]

    if(payArray.includes(this.selectedPaymentMethod)) {
      this.sessionService.paymentWinRef.close();
    }
  }

  /**
   * get wallet details
   */
  getWalletDetails() {
    const data = {
      marketplace_user_id: this.config.marketplace_user_id,
      need_balance_only: 1
    }
    if (this.sessionService.get('appData')) {
      data['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      data['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    this.giftCardService.getWalletBalance(data).subscribe(response => {
      if (response.status === 200) {
        this.walletDetails = response.data;
      } else {
        this.walletDetails = {};
      }
    });
  }

  /**
   * selected payment method
   */
  paymentMethod(event) {

    this.selectedPaymentMethod = event.value;
    if (this.isEmpty(this.routeParams)) {
      switch(this.selectedPaymentMethod) {
        case this.paymentMode.BILLPLZ:
          this.triggerPayment = Math.random();
          break;
        case this.paymentMode.STRIPE:
          break;
        case this.paymentMode.RAZORPAY:
          this.triggerPayment = Math.random();
          this.getOrderCreationPayload=this.getPaymentData();
          break;
        case this.paymentMode.PAYFORT:
          break;
        case this.paymentMode.VISTA:
          // this.triggerPayment = Math.random();
          break;
        case this.paymentMode.PAYPAL:
          this.triggerPayment = Math.random();
          this.getOrderCreationPayload=this.getPaymentData();
          break;
        // telr
          case this.paymentMode.TELR:
          this.triggerPayment = Math.random();
          this.getOrderCreationPayload=this.getPaymentData();
          break;
        // case this.paymentMode.PAY_MOB:
        //   this.triggerPayment = Math.random(); //only to trigger the geturl api
        //   this.sessionService.payMobWinRef = window.open('');
        //   this.sessionService.payMobWinRef.document.title = 'Payment Process';
        //   this.sessionService.payMobWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
        //   break;
        case this.paymentMode.PAYSTACK:
          this.triggerPayment = Math.random();
          this.getOrderCreationPayload=this.getPaymentData();
          break;
        case this.paymentMode.MPAISA:
          this.triggerPayment = Math.random();
          this.getOrderCreationPayload=this.getPaymentData();
          break;
        // case this.paymentMode.WIRE_CARD:
        //         this.triggerPayment = Math.random(); //only to trigger the geturl api
        //         this.sessionService.wirecardWinRef = window.open('');
        //         this.sessionService.wirecardWinRef.document.title = 'Payment Process';
        //         this.sessionService.wirecardWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
        //         break;
        // case this.paymentMode.SSL_COMMERZ:
        //   this.triggerPayment = Math.random(); //only to trigger the geturl api
        //   this.sessionService.sslCommerzWinRef = window.open('');
        //   this.sessionService.sslCommerzWinRef.document.title = 'Payment Process';
        //   this.sessionService.sslCommerzWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
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
            this.popup.showPopup(MessageType.ERROR, 3000,this.languageStrings.currency_not_supported || 'Currency not supported', false);
            this.sessionService.paymentWinRef.close();
          }
        // case this.paymentMode.PAYHERE:
        //   this.triggerPayment = Math.random(); //only to trigger the geturl api
        //   this.sessionService.payHereWinRef = window.open('');
        //   this.sessionService.payHereWinRef.document.title = 'Payment Process';
        //   this.sessionService.payHereWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
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
            this.popup.showPopup(MessageType.ERROR, 3000,this.languageStrings.currency_not_supported || 'Currency not supported', false);
          }
        case this.paymentMode.HYPERPAY:
          // if (this.config.payment_settings[0].code === 'SAR') {
            this.triggerPayment = Math.random(); //only to trigger the geturl api
            this.sessionService.paymentWinRef = window.open('');
            this.sessionService.paymentWinRef.document.title = 'Payment Process';
            this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
            this.getOrderCreationPayload=this.getPaymentData();
            break;
          
          // else {
          //   this.showModal = false;
          //   this.popup.showPopup(MessageType.ERROR, 3000, 'Currency not supported', false);
          // }
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
            this.popup.showPopup(MessageType.ERROR, 3000, this.languageStrings.currency_not_supported || 'Currency not supported', false);
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
        // case this.paymentMode.THETELLER:
        //   this.triggerPayment = Math.random(); //only to trigger the geturl api
        //   this.sessionService.thetellerWinRef = window.open('');
        //   this.sessionService.thetellerWinRef.document.title = 'Payment Process';
        //   this.sessionService.thetellerWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
        //   break;
        // case this.paymentMode.WIPAY:
        //   this.triggerPayment = Math.random(); //only to trigger the geturl api
        //   this.sessionService.wipayWinRef = window.open('');
        //   this.sessionService.wipayWinRef.document.title = 'Payment Process';
        //   this.sessionService.wipayWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
        //   break;
        case this.paymentMode.LIME_LIGHT:
          this.triggerPayment = Math.random();
          this.getOrderCreationPayload=this.getPaymentData();
          break;
        case this.paymentMode.TWO_CHECKOUT:
          this.triggerPayment = Math.random();
          this.getOrderCreationPayload=this.getPaymentData();
          break;
        // case this.paymentMode.MPAISA:
        //   this.triggerPayment = Math.random();
        //   break;
        case this.paymentMode.VIVA:
          // if (this.config.payment_settings[0].code === 'EUR') {
          this.triggerPayment = Math.random(); //only to trigger the geturl api
          this.sessionService.paymentWinRef = window.open('');
          this.sessionService.paymentWinRef.document.title = 'Payment Process';
          this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
          this.getOrderCreationPayload = this.getPaymentData();
          break;
          // }
          // else {
          //   this.showModal = false;
          //   this.popup.showPopup(MessageType.ERROR, 3000, 'Currency not supported', false);
          // }
        case this.paymentMode.WALLET:
          this.makePaymentThroughWallet();
          break;
        // case this.paymentMode.PAYNOW:
        //   this.triggerPayment = Math.random(); //only to trigger the geturl api
        //   this.sessionService.paynowWinRef = window.open('');
        //   this.sessionService.paynowWinRef.document.title = 'Payment Process';
        //   this.sessionService.paynowWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
        //   break;
        case this.paymentMode.STRIPE_IDEAL:
          this.triggerPayment = Math.random();
          this.getOrderCreationPayload=this.getPaymentData();
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
  }

  /**
   * check if object is empty
   */
   isEmpty(obj) {
    for(var key in obj) {
      if(obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }

  /**
   * payment response
   */
  paymentResponse(event) {
    if (this.loginResponse && this.loginResponse.formSettings[0].activePaymentMethods && event && event.response) {
      this.paymentObj = this.loginResponse.formSettings[0].activePaymentMethods.filter(
          ele => ele.value == event.response.payment_method 
        );
  
        if(this.paymentObj && this.paymentObj[0] && this.paymentObj[0].payment_process_type)
        {
          this.post_enabled = this.paymentObj[0].payment_process_type;
         }
      }
    this.paymentMadeResponse = event.response;
    if(this.paymentMadeResponse && this.paymentMadeResponse.status == 'error') {
      let payArray = [PaymentMode.FAC_3D,PaymentMode.CHECKOUT_COM,PaymentMode.VIVA,PaymentMode.PAYHERE,PaymentMode.AZUL,PaymentMode.HYPERPAY,PaymentMode.CREDIMAX,PaymentMode.MY_FATOORAH,PaymentMode.THETELLER,PaymentMode.PAYNET,PaymentMode.TAP,PaymentMode.CURLEC,PaymentMode.WIPAY,PaymentMode.PAGAR, PaymentMode.WHOOSH,PaymentMode.MTN, PaymentMode.WECHAT, PaymentMode.ONEPAY,PaymentMode.PAGOPLUX,PaymentMode.MYBILLPAYMENT, PaymentMode.VALITOR, PaymentMode.TRUEVO, PaymentMode.PAYZEN, PaymentMode.FIRSTDATA, PaymentMode.BANKOPEN, PaymentMode.SQUARE, PaymentMode.ETISALAT, PaymentMode.SUNCASH, PaymentMode.GOCARDLESS, PaymentMode.ATH, PaymentMode.IPAY88, PaymentMode.PROXYPAY, PaymentMode.CYBERSOURCE, PaymentMode.ALFALAH, PaymentMode.CULQI, PaymentMode.NMI, PaymentMode.FLUTTERWAVE, PaymentMode.MPESA, PaymentMode.ADYEN, PaymentMode.PAYMARK, PaymentMode.HYPUR, PaymentMode.PAYTMV3, PaymentMode.PIXELPAY, PaymentMode.DOKU, PaymentMode.PEACH, PaymentMode.PAGUELOFACIL, PaymentMode.NOQOODY, PaymentMode.GTBANK, PaymentMode.URWAY, PaymentMode.VUKA, PaymentMode.VPOS, PaymentMode.CXPAY, PaymentMode.PAYKU, PaymentMode.BAMBORA, PaymentMode.PAYWAYONE, PaymentMode.PLACETOPAY]

      if(payArray.includes(this.selectedPaymentMethod)) {
        this.sessionService.paymentWinRef.close();
      }
      this.showModal = false;
      this.popup.showPopup(MessageType.ERROR, 3000, "Transaction Failed", false);
      return;
    }
    if (this.paymentMadeResponse) {
      let autoPayArray = [PaymentMode.RAZORPAY, PaymentMode.PAYPAL, PaymentMode.PAYZEN, PaymentMode.PAYFAST, PaymentMode.LIME_LIGHT, PaymentMode.TAP, PaymentMode.CURLEC, PaymentMode.WHOOSH, PaymentMode.PAGAR, PaymentMode.PAYNET, PaymentMode.STRIPE_IDEAL, PaymentMode.ONEPAY, PaymentMode.MTN, PaymentMode.FIRSTDATA, PaymentMode.TRUEVO, PaymentMode.MY_FATOORAH, PaymentMode.VALITOR, PaymentMode.VIVA, PaymentMode.SSL_COMMERZ, PaymentMode.HYPERPAY, PaymentMode.FAC_3D, PaymentMode.AZUL, PaymentMode.CREDIMAX, PaymentMode.ATH, PaymentMode.PAGOPLUX, PaymentMode.MYBILLPAYMENT, PaymentMode.TWO_CHECKOUT, PaymentMode.WECHAT, PaymentMode.SQUARE, PaymentMode.INNSTAPAY, PaymentMode.PAYHERE, PaymentMode.PAY_MOB, PaymentMode.IPAY88, PaymentMode.PAYNOW, PaymentMode.PAYSTACK, PaymentMode.PAYU, PaymentMode.ETISALAT, PaymentMode.PROXYPAY, PaymentMode.CYBERSOURCE, PaymentMode.MPAISA, PaymentMode.BANKOPEN, PaymentMode.WIPAY, PaymentMode.ALFALAH, PaymentMode.CULQI, PaymentMode.NMI, PaymentMode.CHECKOUT_COM, PaymentMode.FLUTTERWAVE, PaymentMode.MPESA, PaymentMode.ADYEN, PaymentMode.PAYMARK, PaymentMode.HYPUR, PaymentMode.PAYTMV3, PaymentMode.PIXELPAY, PaymentMode.DOKU, PaymentMode.PEACH, PaymentMode.PAGUELOFACIL, PaymentMode.NOQOODY, PaymentMode.GTBANK, PaymentMode.URWAY, PaymentMode.VUKA, PaymentMode.VPOS, PaymentMode.CXPAY, PaymentMode.PAYKU, PaymentMode.BAMBORA, PaymentMode.PAYWAYONE, PaymentMode.PLACETOPAY, PaymentMode.TELR];

      if(autoPayArray.includes(+this.paymentMadeResponse.payment_method) && this.post_enabled==2)
      {
        this.sessionService.remove('gift');
        this.routeParams = {};
        this.showModal=false;
        this.popup.showPopup(MessageType.SUCCESS, 3000, 'Gift card has been sent successfully.', false);
        this.initForm();
        this.manupulateHistory()
      }
      else{
        this.makeBuyGiftCardHit();
      }
     
    }
  
  }

  /**
   * make payment through wallet
   */
  makePaymentThroughWallet() {
    if (Number(this.billInfo.NET_PAYABLE_AMOUNT) > Number(this.walletDetails.wallet_balance)) {
      this.popup.showPopup(MessageType.ERROR,3000,"Please add balance in Wallet.",false);
      let balance = Number(this.billInfo.NET_PAYABLE_AMOUNT) -  Number(this.walletDetails.wallet_balance);
      this.sessionService.set('walletAddMoney',{balance: balance, redirect: 'giftCard'});
      this.router.navigate(['wallet']);
      return;
    } else {
      this.makeBuyGiftCardHit();
    }
  }

  /**
   * buy gift card hit
   */
  makeBuyGiftCardHit() {
    const giftData = this.sessionService.get('gift');
    const obj = {};
    // obj['vendor_id'] = this.loginData.vendor_details.vendor_id;
    obj['marketplace_user_id'] = this.loginData.vendor_details.marketplace_user_id;
    obj['user_id'] = this.loginData.vendor_details.marketplace_user_id;
    // obj['access_token'] = this.loginData.vendor_details.app_access_token;
    obj['reference_id'] = this.loginData.vendor_details.reference_id;
    obj['app_type'] = 'WEB';

    obj['payment_method'] = Number(this.selectedPaymentMethod);
    obj['currency'] = this.config.payment_settings[0].code;
    obj['payment_for'] = this.paymentFor.GIFT_CARD;

    obj['sender_name'] = giftData.fromName;
    obj['receiver_name'] = giftData.toName;
    obj['receiver_email'] = giftData.toEmail;
    obj['message'] = giftData.fromDescription;
    obj['amount'] = Number(giftData.amount);
    if (this.sessionService.get('appData')) {
      obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }

    switch(Number(this.selectedPaymentMethod)) {
      case this.paymentMode.STRIPE:
        obj['card_id'] = this.paymentMadeResponse.card_id;
        break;
      case this.paymentMode.BILLPLZ:
        obj['transaction_id'] = this.paymentMadeResponse.transactionId ? this.paymentMadeResponse.transactionId : '';
        break;
      case this.paymentMode.RAZORPAY:
        obj['transaction_id'] = this.paymentMadeResponse.rzp_payment_id ? this.paymentMadeResponse.rzp_payment_id : '';
        break;
      case this.paymentMode.PAYFORT:
        obj['transaction_id'] = this.paymentMadeResponse.transaction_id ? this.paymentMadeResponse.transaction_id : '';
        break;
      case this.paymentMode.PAYPAL:
        obj['transaction_id'] = this.paymentMadeResponse.transaction_id ? this.paymentMadeResponse.transaction_id : '';
        break;
      case this.paymentMode.TELR:
        obj['transaction_id'] = this.paymentMadeResponse.transaction_id ? this.paymentMadeResponse.transaction_id : '';
        break;
      case this.paymentMode.LIME_LIGHT:
          obj['transaction_id'] = this.paymentMadeResponse.detail.detail.transactionID ? this.paymentMadeResponse.detail.detail.transactionID : undefined;
          break;  
      case this.paymentMode.TWO_CHECKOUT:
          obj['transaction_id'] = this.paymentMadeResponse.detail.detail.transactionID ? this.paymentMadeResponse.detail.detail.transactionID : undefined;
          break;
      case this.paymentMode.PAYSTACK:
        obj['transaction_id'] = this.paymentMadeResponse.transaction_id ? this.paymentMadeResponse.transaction_id : '';
        break;
      case this.paymentMode.VISTA:
          obj['card_id'] = this.paymentMadeResponse.card_id;
        break;
      case this.paymentMode.PAYNOW:
        obj['transaction_id'] = this.paymentMadeResponse.transaction_id ? this.paymentMadeResponse.transaction_id : '';
        break;
        case this.paymentMode.STRIPE_IDEAL:
            obj['transaction_id'] = this.paymentMadeResponse.transactionId ? this.paymentMadeResponse.transactionId : '';
            break;
        default: 
          obj['transaction_id'] = this.paymentMadeResponse && this.paymentMadeResponse.transactionId ? this.paymentMadeResponse.transactionId : undefined;
          break;  
          
    }

    if (obj['transaction_id'] || obj['card_id'] || this.selectedPaymentMethod == this.paymentMode.WALLET) {
      obj['is_transaction_failed'] = 0;
    } else {
      obj['is_transaction_failed'] = 1;
    }



    this.loader.show();
    this.giftCardService.buyGiftCard(obj).subscribe((response) => {
      this.loader.hide();
      if (response.status === 200) {
        this.showModal = false;

        let payArray = [PaymentMode.PAY_MOB, PaymentMode.PAYNOW, PaymentMode.SSL_COMMERZ, PaymentMode.FAC_3D, PaymentMode.CHECKOUT_COM, PaymentMode.VIVA, PaymentMode.PAYHERE, PaymentMode.AZUL, PaymentMode.HYPERPAY, PaymentMode.CREDIMAX, PaymentMode.MY_FATOORAH, PaymentMode.THETELLER, PaymentMode.PAYNET, PaymentMode.TAP, PaymentMode.CURLEC, PaymentMode.WIPAY, PaymentMode.PAGAR, PaymentMode.WHOOSH,PaymentMode.MTN, PaymentMode.WECHAT, PaymentMode.ONEPAY,PaymentMode.PAGOPLUX,PaymentMode.MYBILLPAYMENT, PaymentMode.VALITOR, PaymentMode.TRUEVO, PaymentMode.PAYZEN, PaymentMode.FIRSTDATA, PaymentMode.BANKOPEN, PaymentMode.SQUARE, PaymentMode.ETISALAT, PaymentMode.SUNCASH, PaymentMode.GOCARDLESS, PaymentMode.ATH, PaymentMode.IPAY88, PaymentMode.PROXYPAY, PaymentMode.CYBERSOURCE, PaymentMode.ALFALAH, PaymentMode.CULQI, PaymentMode.NMI, PaymentMode.FLUTTERWAVE, PaymentMode.MPESA, PaymentMode.ADYEN, PaymentMode.PAYMARK, PaymentMode.HYPUR, PaymentMode.PAYTMV3, PaymentMode.PIXELPAY, PaymentMode.DOKU, PaymentMode.PEACH, PaymentMode.PAGUELOFACIL, PaymentMode.NOQOODY, PaymentMode.GTBANK, PaymentMode.URWAY, PaymentMode.VUKA, PaymentMode.VPOS, PaymentMode.CXPAY, PaymentMode.PAYKU, PaymentMode.BAMBORA, PaymentMode.PAYWAYONE, PaymentMode.PLACETOPAY]

        if(payArray.includes(this.selectedPaymentMethod)) {
          this.sessionService.paymentWinRef.close();
        }

        this.sessionService.remove('gift');
        this.routeParams = {};
        if(this.selectedPaymentMethod == this.paymentMode.STRIPE && response.data.authentication_required == 1){
          this.makePayment(response.data,response.message);
          return ;
        }
        this.popup.showPopup(MessageType.SUCCESS, 2000, response.message, false);
        setTimeout(() => {
          switch(Number(this.selectedPaymentMethod)) {
            case this.paymentMode.BILLPLZ:
              this.manupulateHistory();
              break;
              case this.paymentMode.PAY_MOB:
              this.manupulateHistory();
              break;
            case this.paymentMode.WALLET:
              this.manupulateHistory();
              break;
            case this.paymentMode.PAYNOW:
              this.manupulateHistory();
              break;

          }
          this.popup.showPopup(MessageType.SUCCESS, 2000, response.message, false);
        }, 300);
        this.initForm();
        this.getWalletDetails();
      } else {
        this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
      }
    }, error => {
      console.error(error);
    });
  }
 /**
  * stripe make paymemt
  */
 makePayment(data, msg) {
  this.stripe = Stripe(this.config.stripe_public_key);
  this.stripe.handleCardPayment(
    data.client_secret,
    {
      payment_method: data.payment_method || data.card_token,
    }
  ).then((result) => {
    if (result.error) {
      // this.stripePaymentAuthorize = "initial";
      msg = result.error.message;
      this.popup.showPopup(MessageType.SUCCESS, 2000, msg, false);
    } else {
      this.popup.showPopup(MessageType.SUCCESS, 2000, msg, false);
      this.initForm();
      this.getWalletDetails();
      // The payment has succeeded. Display a success message.
    }
  });
}
  /**
   * subscribe url params
   */
  subscriptionForUrlParams() {
    const response = this.route.snapshot.queryParams;
    this.routeParams = response;
    if (response && response['billplz[id]']) {
      this.selectedPaymentMethod = this.paymentMode.BILLPLZ;
      this.showModal = true;
    } else if (response && response['success']) {
      this.selectedPaymentMethod = this.paymentMode.WALLET;
      const giftData = this.sessionService.get('gift');
      this.buyForm.controls.amount.setValue(Number(giftData.amount));
      this.buyForm.controls.fromName.setValue(giftData.fromName);
      this.buyForm.controls.toName.setValue(giftData.toName);
      this.buyForm.controls.fromDescription.setValue(giftData.fromDescription);
      this.buyForm.controls.toEmail.setValue(giftData.toEmail);
      this.makeBuyGiftCardHit();
    }
    //this.route.queryParams.pipe(takeWhile(_ => this.alive)).subscribe((response) => {
    //  console.log(response);
    //
    //})
  }

  /**
   * manupulate history
   */
  manupulateHistory() {
    let domain = window.location.hostname;
    let url = 'giftCard';
    if (
      domain === "localhost" ||
      domain === "dev-webapp.yelo.red" ||
      domain === "beta-webapp.yelo.red" ||
      domain === "127.0.0.1" ||
      domain === "dev.yelo.red"
    ) {
      history.replaceState('', '', location.origin + '/' + url);
      this.router.navigate(['giftCard'])
    } else {
      history.replaceState('', '', location.origin + '/'+ this.languageSelected + '/' + url);
      this.router.navigate(['giftCard'])
    }
  }
  getPaymentData()
  {
    const giftData = this.sessionService.get('gift');
    const obj = {};
    // obj['vendor_id'] = this.loginData.vendor_details.vendor_id;
    obj['marketplace_user_id'] = this.loginData.vendor_details.marketplace_user_id;
    obj['user_id'] = this.loginData.vendor_details.marketplace_user_id;
    // obj['access_token'] = this.loginData.vendor_details.app_access_token;
    obj['reference_id'] = this.loginData.vendor_details.reference_id;
    obj['app_type'] = 'WEB';

    obj['payment_method'] = Number(this.selectedPaymentMethod);
    obj['currency'] = this.config.payment_settings[0].code;
    obj['payment_for'] = this.paymentFor.GIFT_CARD;

    obj['sender_name'] = giftData.fromName;
    obj['receiver_name'] = giftData.toName;
    obj['receiver_email'] = giftData.toEmail;
    obj['message'] = giftData.fromDescription;
    obj['amount'] = Number(giftData.amount);
    if (this.sessionService.get('appData')) {
      obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    return obj;
  }
}
