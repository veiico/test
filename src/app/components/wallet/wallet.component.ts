import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router, Route, ActivatedRoute } from "@angular/router";

import { AppService } from '../../app.service';
import { LoaderService } from '../../services/loader.service';
import { SessionService } from '../../services/session.service';
import { WalletService } from './wallet.service';
import { ModalType, validations, MessageType } from '../../constants/constant';
import { PaymentMode, PaymentFor, WalletStatus } from '../../enums/enum';
import { ValidationService } from '../../services/validation.service';
import { PopUpService } from '../../modules/popup/services/popup.service';
declare var Stripe: any;

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {

  post_enabled: number=0;
  paymentObj: any;
  loginResponse: any;
  getOrderCreationPayload: any;
  public headerData: any;
  public config: any;
  public loginData: any;
  public terminology: any;
  public langJson: any = {};
  public languageSelected: string;
  public direction: string;
  public modalType: ModalType = ModalType;
  public showModal: boolean;
  public amountAdded: boolean;
  public paymentMethod: number;
  public paymentMode = PaymentMode;
  public paymentFor = PaymentFor;
  public walletStatus = WalletStatus;
  public addMoneyForm: FormGroup;
  public wallet_balance: number;
  public paymentMadeResponse: any;
  public history: any;
  public triggerPayment: any;
  public redirectData: any;
  public redirectDataFlag: boolean = true;
  public totalRecords: number = 100;
  public showProcessing: boolean;
  public stripe;
  languageStrings: any={};

  constructor(private sessionService: SessionService,
              private loader: LoaderService,
              private walletService: WalletService,
              private fb: FormBuilder,
              private router: Router,
              public popup: PopUpService,
              private validationService: ValidationService,
              public appService: AppService) {

  }

  ngOnInit() {
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
     this.languageStrings.wallet_balance = (this.languageStrings.wallet_balance || "Wallet Balance")
     .replace("WALLET_WALLET",this.terminology.WALLET);
     this.languageStrings.added_to_wallet = (this.languageStrings.added_to_wallet || 'Added to Wallet')
     .replace("WALLET_WALLET",this.terminology.WALLET);
     this.languageStrings.paid_for_order = (this.languageStrings.paid_for_order || 'Paid for order')
     .replace("ORDER_ORDER",this.terminology.ORDER);
     this.languageStrings.paid_for_reward = (this.languageStrings.paid_for_reward || 'Paid for Reward')
     .replace("REWARD_REWARD",this.terminology.REWARD);
     this.languageStrings.gift_card_purchased = (this.languageStrings.gift_card_purchased || 'Gift Card Purchased')
     .replace("GIFT_CARD",this.terminology.GIFT_CARD);
     this.languageStrings.cashback_for_order = (this.languageStrings.cashback_for_order || 'Cashback for Order')
     .replace("ORDER_ORDER",this.terminology.ORDER);
    });
    this.headerData = this.sessionService.get('config');
    this.loginResponse = this.sessionService.get('appData');
    this.setConfig();
    this.setLanguage();
    this.checkRedirectionUrl();
    this.checkForUrlParam();
    if (!this.sessionService.isPlatformServer()) {
      this.checkPaymentMethod();
      this.getWalletHistory();
    }
}

  /**
   * set config
   */
  setConfig() {
    this.config = this.sessionService.get('config');
    if (!this.sessionService.isPlatformServer()) {
      this.loginData = this.sessionService.get('appData');
    }
    if (this.config) {
      this.terminology = this.config.terminology;
    }
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

    this.appService.langPromise.then(() => {
      this.langJson = this.appService.getLangJsonData();
    });
  }

  /**
   * check payment method
   */
  checkPaymentMethod() {
    const loginData = this.sessionService.get('appData');
    for (let i = 0; i < loginData.formSettings[0].payment_methods.length; i++) {
      if (loginData.formSettings[0].payment_methods[i].value !== this.paymentMode.CASH &&
          loginData.formSettings[0].payment_methods[i].value !== this.paymentMode.WALLET &&
          loginData.formSettings[0].payment_methods[i].value !== this.paymentMode.PAY_LATER &&
          loginData.formSettings[0].payment_methods[i].enabled) {
        this.paymentMethod = loginData.formSettings[0].payment_methods[i].value;
      }
    }


  }

  /**
   * hide payment modal
   */
  hidePaymentModal() {
    this.showModal = false;
    this.amountAdded = false;
    this.showProcessing = false;
  }

  /**
   * add money
   */
  addMoney() {
    this.showModal = true;
    this.amountAdded = false;
    this.showProcessing = false;
    this.initForm();
  }

  /**
   * init form
   */
  initForm() {
    this.addMoneyForm = this.fb.group({
      'amount': ['', [Validators.required, Validators.pattern(validations.numbersWithDecimal), ValidationService.setDecimalConfigRegexPattren(this.config.decimal_calculation_precision_point)]]
    })
  }

  /**
   * submit amount
   */
  onSubmit() {
    if (!this.addMoneyForm.valid) {
      return this.validationService.validateAllFormFields(this.addMoneyForm);
    }
    this.sessionService.setString('wallet', this.addMoneyForm.controls.amount.value);
    if(this.paymentMethod==this.paymentMode.VIVA)
    {
      this.showProcessing = false;
    }
    else{
      this.showProcessing = true;
    }
    
    switch(this.paymentMethod) {
      case this.paymentMode.BILLPLZ:
        this.amountAdded = true;
        this.triggerPayment = Math.random();
        break;
      case this.paymentMode.STRIPE:
        this.amountAdded = true;
        break;
      case this.paymentMode.RAZORPAY:
        this.amountAdded = true;
        this.triggerPayment = Math.random();
        this.getOrderCreationPayload=this.getPaymentData();
        break;
      case this.paymentMode.PAYFORT:
        this.amountAdded = true;
        break;
      case this.paymentMode.VISTA:
        this.amountAdded = true;
        break;
      case this.paymentMode.PAYPAL:
        this.amountAdded = true;
        this.triggerPayment = Math.random();
        this.getOrderCreationPayload=this.getPaymentData();
        break;

        case this.paymentMode.TELR:
        this.amountAdded = true;
        this.triggerPayment = Math.random();
        this.getOrderCreationPayload=this.getPaymentData();
        break;
      // case this.paymentMode.PAY_MOB:
      //   this.amountAdded = true;
      //   this.sessionService.payMobWinRef = window.open('');
      //   this.sessionService.payMobWinRef.document.title = 'Payment Process';
      //   this.sessionService.payMobWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      //   this.triggerPayment = Math.random();
      //   break;
      // case this.paymentMode.WIRE_CARD:
      //     this.amountAdded = true;
      //     this.sessionService.wirecardWinRef = window.open('');
      //       this.sessionService.wirecardWinRef.document.title = 'Payment Process';
      //       this.sessionService.wirecardWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      //     this.triggerPayment = Math.random();
      //     break;
      // case this.paymentMode.SSL_COMMERZ:
      //   this.amountAdded = true;
      //   this.sessionService.sslCommerzWinRef = window.open('');
      //   this.sessionService.sslCommerzWinRef.document.title = 'Payment Process';
      //   this.sessionService.sslCommerzWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      //   this.triggerPayment = Math.random();
      //   break;
      // case this.paymentMode.FAC_3D:
      //   this.amountAdded = true;
      //   this.sessionService.fac3dWinRef = window.open('');
      //   this.sessionService.fac3dWinRef.document.title = 'Payment Process';
      //   this.sessionService.fac3dWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      //   this.triggerPayment = Math.random();
      //   break;
      case this.paymentMode.CHECKOUT_COM:
        if (this.config.payment_settings[0].code === 'EUR' || this.config.payment_settings[0].code === 'SAR') {
          this.amountAdded = true;
          this.sessionService.paymentWinRef = window.open('');
          this.sessionService.paymentWinRef.document.title = 'Payment Process';
          this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
          this.triggerPayment = Math.random();
          this.getOrderCreationPayload=this.getPaymentData();
          break;
        }
        else this.popup.showPopup(MessageType.ERROR, 3000, this.languageStrings.currency_not_supported || 'Currency not supported', false);
        break;
      // case this.paymentMode.PAYHERE:
      //   this.amountAdded = true;
      //   this.sessionService.payHereWinRef = window.open('');
      //   this.sessionService.payHereWinRef.document.title = 'Payment Process';
      //   this.sessionService.payHereWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      //   this.triggerPayment = Math.random();
      //   break;
      case this.paymentMode.AZUL:
        if (this.config.payment_settings[0].code === 'DOP') {
          this.amountAdded = true;
          this.sessionService.paymentWinRef = window.open('');
          this.sessionService.paymentWinRef.document.title = 'Payment Process';
          this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
          this.triggerPayment = Math.random();
          this.getOrderCreationPayload=this.getPaymentData();
        }
        else this.popup.showPopup(MessageType.ERROR, 3000, this.languageStrings.currency_not_supported || 'Currency not supported', false);
        break;
      case this.paymentMode.HYPERPAY:
        // if (this.config.payment_settings[0].code === 'SAR') {
          this.amountAdded = true;
          this.sessionService.paymentWinRef = window.open('');
          this.sessionService.paymentWinRef.document.title = 'Payment Process';
          this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
          this.triggerPayment = Math.random();
          this.getOrderCreationPayload=this.getPaymentData();
        
        // else
        //   this.popup.showPopup(MessageType.ERROR, 3000, 'Currency not supported', false);
        break;
      case this.paymentMode.CREDIMAX:
        if (this.config.payment_settings[0].code === 'BHD') {
          this.amountAdded = true;
          this.sessionService.paymentWinRef = window.open('');
          this.sessionService.paymentWinRef.document.title = 'Payment Process';
          this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
          this.triggerPayment = Math.random();
          this.getOrderCreationPayload=this.getPaymentData();
        }
        else this.popup.showPopup(MessageType.ERROR, 3000,  this.languageStrings.currency_not_supported || 'Currency not supported', false);
        break;
      // case this.paymentMode.MY_FATOORAH:
      //   this.amountAdded = true;
      //   this.sessionService.fatoorahWinRef = window.open('');
      //   this.sessionService.fatoorahWinRef.document.title = 'Payment Process';
      //   this.sessionService.fatoorahWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      //   this.triggerPayment = Math.random();
      //   break;
      // case this.paymentMode.PAYNET:
      //   this.amountAdded = true;
      //   this.sessionService.paynetWinRef = window.open('');
      //   this.sessionService.paynetWinRef.document.title = 'Payment Process';
      //   this.sessionService.paynetWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      //   break;
      // case this.paymentMode.TAP:
      //   this.amountAdded = true;
      //   this.sessionService.tapWinRef = window.open('');
      //   this.sessionService.tapWinRef.document.title = 'Payment Process';
      //   this.sessionService.tapWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      //   this.triggerPayment = Math.random();
      //   break;
      // case this.paymentMode.CURLEC:
      //   this.amountAdded = true;
      //   this.sessionService.curlecWinRef = window.open('');
      //   this.sessionService.curlecWinRef.document.title = 'Payment Process';
      //   this.sessionService.curlecWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      //   this.triggerPayment = Math.random();
      //   break;
      // case this.paymentMode.WIPAY:
      //   this.amountAdded = true;
      //   this.sessionService.wipayWinRef = window.open('');
      //   this.sessionService.wipayWinRef.document.title = 'Payment Process';
      //   this.sessionService.wipayWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      //   this.triggerPayment = Math.random();
      //   break;
      // case this.paymentMode.THETELLER:
      //   this.amountAdded = true;
      //   this.sessionService.thetellerWinRef = window.open('');
      //   this.sessionService.thetellerWinRef.document.title = 'Payment Process';
      //   this.sessionService.thetellerWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      //   this.triggerPayment = Math.random();
      //   break;
      case this.paymentMode.PAYSTACK:
        this.amountAdded = true;
        this.triggerPayment = Math.random();
        this.getOrderCreationPayload=this.getPaymentData();
        break;
      case this.paymentMode.MPAISA:
        this.amountAdded = true;
        this.triggerPayment = Math.random();
        this.getOrderCreationPayload=this.getPaymentData();
        break;
      // case this.paymentMode.PAYNOW:
      //   this.amountAdded = true;
      //   this.sessionService.paynowWinRef = window.open('');
      //   this.sessionService.paynowWinRef.document.title = 'Payment Process';
      //   this.sessionService.paynowWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
      //   this.triggerPayment = Math.random();
      //   break;
      case this.paymentMode.LIME_LIGHT:
        this.amountAdded = true;
        this.triggerPayment = Math.random();
        this.getOrderCreationPayload=this.getPaymentData();
        this.showProcessing = false;
        break;
      case this.paymentMode.TWO_CHECKOUT:
        this.amountAdded = true;
        this.triggerPayment = Math.random();
        this.getOrderCreationPayload=this.getPaymentData();
        this.showProcessing = false;
        break;
      case this.paymentMode.STRIPE_IDEAL:
        this.amountAdded = true;
        this.triggerPayment = Math.random();
        this.getOrderCreationPayload=this.getPaymentData();
        break;
      case this.paymentMode.VIVA:
        // if (this.config.payment_settings[0].code === 'EUR') {
        this.amountAdded = true;
        this.sessionService.paymentWinRef = window.open('');
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
        this.getOrderCreationPayload = this.getPaymentData();
        this.triggerPayment = Math.random();
        // break;
        // }
        // else this.popup.showPopup(MessageType.ERROR, 3000, 'Currency not supported', false);
        break;
      default:
        this.amountAdded = true;
        this.sessionService.paymentWinRef = window.open('');
        this.sessionService.paymentWinRef.document.title = 'Payment Process';
        this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
        this.triggerPayment = Math.random();
        this.getOrderCreationPayload=this.getPaymentData();
        break;
    }
  }

  /**
   * get wallet history
   */
  getWalletHistory() {
    const data = {
      marketplace_user_id: this.loginData.vendor_details.marketplace_user_id,
      need_balance_only: 0,
      //start: 0,
      //length: 25
    };
    if (this.sessionService.get('appData')) {
      data['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      data['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    this.loader.show();
    this.walletService.getHistory(data).subscribe((response) => {

      this.loader.hide();
      if (response.status === 200) {
        this.wallet_balance = response.data.wallet_balance;
        this.history = response.data.txn_history;
        //this.loginData.vendor_details.wallet_balance = response.data.wallet_balance;
        //this.sessionService.set('appData', this.loginData);
        if (this.redirectData && !this.redirectDataFlag) {
          this.sessionService.remove('walletAddMoney');
          if (this.redirectData.custom && this.redirectData.redirect === 'payment') {
            let redirct_params = { redir_source: 'CUSTOM' }
            if(this.redirectData.repayment){
              redirct_params['repayment_transaction'] = 1
             }
             if(this.redirectData.debt_payment) {
              redirct_params['debt_payment'] = 1
             }
             if(this.redirectData.customerPlanData){
              redirct_params['customerPlanData'] = this.redirectData.customerPlanData;
             }

            this.router.navigate(['payment'], { queryParams: redirct_params });
          } else if (this.redirectData.redirect === 'payment') {
            this.router.navigate(['payment']);
          } else if (this.redirectData.redirect === 'giftCard') {
            this.router.navigate(['giftCard'], { queryParams: { success: 'true' } });
          } else if (this.redirectData.redirect === 'reward') {
            this.router.navigate(['reward'], { queryParams: { success: 'true' } });
          }

        }
      } else {
        this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
      }
    }, error => {
      console.error(error);
    });
  }

  /**
   * payment made response
   */
  addCardResponse(event) {
    if (this.loginResponse && this.loginResponse.formSettings[0] && this.loginResponse.formSettings[0].activePaymentMethods) {
      this.paymentObj = this.loginResponse.formSettings[0].activePaymentMethods.filter(
          ele => ele.value == event.payment_method
        );
       if(this.paymentObj && this.paymentObj[0] && this.paymentObj[0].payment_process_type)
      {
        this.post_enabled = this.paymentObj[0].payment_process_type;
       }
      }
    this.paymentMadeResponse = event;

    let payArray = [PaymentMode.PAY_MOB,PaymentMode.SSL_COMMERZ,PaymentMode.PAYNOW,PaymentMode.FAC_3D,PaymentMode.CHECKOUT_COM,PaymentMode.VIVA,PaymentMode.PAYHERE,PaymentMode.AZUL,PaymentMode.HYPERPAY,PaymentMode.CREDIMAX,PaymentMode.MY_FATOORAH,PaymentMode.TAP,PaymentMode.THETELLER,PaymentMode.PAYNET,PaymentMode.CURLEC,PaymentMode.WIPAY,PaymentMode.PAGAR, PaymentMode.WHOOSH,PaymentMode.MTN, PaymentMode.WECHAT,PaymentMode.ONEPAY,PaymentMode.PAGOPLUX, PaymentMode.MYBILLPAYMENT, PaymentMode.VALITOR, PaymentMode.TRUEVO, PaymentMode.PAYZEN, PaymentMode.FIRSTDATA, PaymentMode.BANKOPEN, PaymentMode.SQUARE, PaymentMode.ETISALAT, PaymentMode.SUNCASH, PaymentMode.GOCARDLESS, PaymentMode.ATH, PaymentMode.IPAY88, PaymentMode.PROXYPAY, PaymentMode.CYBERSOURCE, PaymentMode.ALFALAH, PaymentMode.CULQI, PaymentMode.NMI, PaymentMode.FLUTTERWAVE, PaymentMode.MPESA, PaymentMode.ADYEN, PaymentMode.PAYMARK, PaymentMode.HYPUR, PaymentMode.PAYTMV3, PaymentMode.PIXELPAY, PaymentMode.DOKU, PaymentMode.PEACH, PaymentMode.PAGUELOFACIL, PaymentMode.NOQOODY, PaymentMode.GTBANK, PaymentMode.URWAY, PaymentMode.VUKA, PaymentMode.VPOS, PaymentMode.CXPAY, PaymentMode.PAYKU, PaymentMode.BAMBORA, PaymentMode.PAYWAYONE, PaymentMode.PLACETOPAY];

    let autoPayArray = [PaymentMode.RAZORPAY, PaymentMode.PAYPAL, PaymentMode.PAYZEN, PaymentMode.PAYFAST, PaymentMode.TAP, PaymentMode.CURLEC, PaymentMode.LIME_LIGHT, PaymentMode.WHOOSH, PaymentMode.PAYNET, PaymentMode.PAGAR, PaymentMode.ONEPAY, PaymentMode.MTN, PaymentMode.STRIPE_IDEAL, PaymentMode.TRUEVO, PaymentMode.FIRSTDATA, PaymentMode.MY_FATOORAH, PaymentMode.VALITOR, PaymentMode.VIVA, PaymentMode.SSL_COMMERZ, PaymentMode.HYPERPAY, PaymentMode.FAC_3D, PaymentMode.AZUL, PaymentMode.CREDIMAX, PaymentMode.ATH, PaymentMode.PAGOPLUX, PaymentMode.MYBILLPAYMENT, PaymentMode.TWO_CHECKOUT, PaymentMode.WECHAT, PaymentMode.SQUARE, PaymentMode.INNSTAPAY, PaymentMode.PAYHERE, PaymentMode.PAY_MOB, PaymentMode.IPAY88, PaymentMode.PAYSTACK, PaymentMode.PAYU, PaymentMode.PAYNOW, PaymentMode.ETISALAT, PaymentMode.PROXYPAY, PaymentMode.CYBERSOURCE, PaymentMode.BANKOPEN, PaymentMode.WIPAY, PaymentMode.MPAISA, PaymentMode.ALFALAH, PaymentMode.CULQI, PaymentMode.NMI, PaymentMode.CHECKOUT_COM, PaymentMode.FLUTTERWAVE, PaymentMode.MPESA, PaymentMode.ADYEN, PaymentMode.PAYMARK, PaymentMode.HYPUR, PaymentMode.PAYTMV3, PaymentMode.PIXELPAY, PaymentMode.DOKU, PaymentMode.PEACH, PaymentMode.PAGUELOFACIL, PaymentMode.NOQOODY, PaymentMode.GTBANK, PaymentMode.URWAY, PaymentMode.VUKA, PaymentMode.VPOS, PaymentMode.CXPAY, PaymentMode.PAYKU, PaymentMode.BAMBORA, PaymentMode.PAYWAYONE, PaymentMode.PLACETOPAY, PaymentMode.TELR];

    if (this.paymentMadeResponse && (this.paymentMadeResponse.status != 'error' || !this.paymentMadeResponse.status)) {
      if(autoPayArray.includes(+event.payment_method) && this.post_enabled ==2)
    {  this.showModal=false;
      this.popup.showPopup(MessageType.SUCCESS, 3000, 'Successful', false);
      this.redirectDataFlag = false;
      this.getWalletHistory();
      this.sessionService.remove('wallet');
    }
    else
    {
      this.makeMoneyHit();     
      if(payArray.includes(+event.payment_method)) {
        this.sessionService.paymentWinRef.close();
      }
    }
     } else if (this.paymentMadeResponse.status && this.paymentMadeResponse.status == 'error') {

      if(payArray.includes(+event.payment_method)) {
        this.sessionService.paymentWinRef.close();
        this.popup.showPopup(MessageType.ERROR, 2000, 'Transaction Failed', false);
      }

      // if (event.payment_method == PaymentMode.PAY_MOB) {
      //   this.sessionService.payMobWinRef.close();
      // }
      // if(event.payment_method == PaymentMode.WIRE_CARD){
      //   this.sessionService.wirecardWinRef.close();
      // }
      // if (event.payment_method == PaymentMode.SSL_COMMERZ) {
      //   this.sessionService.sslCommerzWinRef.close();
      // }
      // if (event.payment_method == PaymentMode.FAC_3D) {
      //   this.sessionService.fac3dWinRef.close();
      // }
      // if (event.payment_method == PaymentMode.CHECKOUT_COM) {
      //   this.sessionService.checkoutComWinRef.close();
      // }
      // if (event.payment_method == PaymentMode.HYPERPAY) {
      //   this.sessionService.hyperPayWinRef.close();
      // }
      // if (event.payment_method == PaymentMode.VIVA) {
      //   this.sessionService.vivaComWinRef.close();
      // }
      // if (event.payment_method == PaymentMode.PAYHERE) {
      //   this.sessionService.payHereWinRef.close();
      // }
      // if (event.payment_method == PaymentMode.AZUL) {
      //   this.sessionService.azulWinRef.close();
      // }
      // if (event.payment_method == PaymentMode.CREDIMAX) {
      //   this.sessionService.credimaxWinRef.close();
      // }
      // if (event.payment_method == PaymentMode.MY_FATOORAH) {
      //   this.sessionService.fatoorahWinRef.close();
      // }
      // if (event.payment_method == PaymentMode.TAP) {
      //   this.sessionService.tapWinRef.close();
      // }
      // if (event.payment_method == PaymentMode.THETELLER) {
      //   this.sessionService.thetellerWinRef.close();
      // }
      // if (event.payment_method == PaymentMode.PAYNOW) {
      //   this.sessionService.paynowWinRef.close();
      // }
      // if (event.payment_method == PaymentMode.PAYNET) {
      //   this.sessionService.paynetWinRef.close();
      // }
      // if (event.payment_method == PaymentMode.CURLEC) {
      //   this.sessionService.curlecWinRef.close();
      // }
      // if (event.payment_method == PaymentMode.WIPAY) {
      //   this.sessionService.wipayWinRef.close();
      // }

      this.showModal = false;
      this.amountAdded = false;
      this.showProcessing = false;
      this.redirectDataFlag = false;
      if(!autoPayArray.includes(+event.payment_method) && this.post_enabled !=2)
      {
       this.makeMoneyHit();
      }     
    }
  }

  /**
   * make money hit
   */
  makeMoneyHit() {
    const obj = {};
    obj['vendor_id'] = this.loginData.vendor_details.vendor_id;
    obj['marketplace_user_id'] = this.loginData.vendor_details.marketplace_user_id;
    obj['user_id'] = this.loginData.vendor_details.marketplace_user_id;
    obj['access_token'] = this.loginData.vendor_details.app_access_token;
    obj['reference_id'] = this.loginData.vendor_details.reference_id;
    obj['app_type'] = 'WEB';

    obj['payment_method'] = this.paymentMethod;
    obj['currency'] = this.config.payment_settings[0].code;
    obj['payment_for'] = this.paymentFor.WALLET;
    obj['amount'] = this.addMoneyForm.controls.amount.value ? Number(this.addMoneyForm.controls.amount.value) : Number(this.sessionService.getString('wallet'));

    switch (this.paymentMethod) {
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
      case this.paymentMode.VISTA:
        obj['card_id'] = this.paymentMadeResponse.card_id;
        break;
      case this.paymentMode.PAYPAL:
        obj['transaction_id'] = this.paymentMadeResponse.transaction_id ? this.paymentMadeResponse.transaction_id : '';
        break;
      case this.paymentMode.TELR:
          obj['transaction_id'] = this.paymentMadeResponse.transaction_id ? this.paymentMadeResponse.transaction_id : '';
          break;
      case this.paymentMode.PAYSTACK:
        obj['transaction_id'] = this.paymentMadeResponse.transaction_id ? this.paymentMadeResponse.transaction_id : '';
        break;
      case this.paymentMode.PAYNOW:
        obj['transaction_id'] = this.paymentMadeResponse.transaction_id ? this.paymentMadeResponse.transaction_id : '';
        break;
      case this.paymentMode.STRIPE_IDEAL:
        obj['transaction_id'] = this.paymentMadeResponse.transactionId ? this.paymentMadeResponse.transactionId : '';
        break;
      case this.paymentMode.LIME_LIGHT:
        obj['transaction_id'] = this.paymentMadeResponse.detail.detail.transactionID ? this.paymentMadeResponse.detail.detail.transactionID : '';
        break;
      case this.paymentMode.TWO_CHECKOUT:
        obj['transaction_id'] = this.paymentMadeResponse.detail.detail.transactionID ? this.paymentMadeResponse.detail.detail.transactionID : '';
        break;
      case this.paymentMode.VIVA:
        obj['transaction_id'] = this.paymentMadeResponse.transactionId ? this.paymentMadeResponse.transactionId : '';
        break;
      default:
        obj['transaction_id'] = this.paymentMadeResponse.transactionId ? this.paymentMadeResponse.transactionId : undefined;
        break;
    }



    if (obj['transaction_id'] || obj['card_id']) {
      obj['is_transaction_failed'] = 0;
    } else {
      obj['is_transaction_failed'] = 1;
    }
    
    this.loader.show();
    this.walletService.addMoneyWallet(obj).subscribe((response) => {
      this.loader.hide();
      if (response.status === 200) {
        this.showProcessing = false;
        this.showModal = false;
        this.redirectDataFlag = false;
        if (this.paymentMethod === this.paymentMode.STRIPE && response.data.authentication_required == 1) {
          this.makePayment(response.data, response.message);
          return;
        }
        this.getWalletHistory();
        this.sessionService.remove('wallet');
        this.popup.showPopup(MessageType.SUCCESS, 2000, response.message, false);
        switch (this.paymentMethod) {
          case this.paymentMode.BILLPLZ:
            this.manupulateHistory();
            break;
          case this.paymentMode.STRIPE:
              break;
          // case this.paymentMode.PAY_MOB:
          // this.sessionService.payMobWinRef.close();
          // break;
          // case this.paymentMode.WIRE_CARD:
          //     this.sessionService.wirecardWinRef.close();
          //   break;
          // case this.paymentMode.SSL_COMMERZ:
          //   this.sessionService.sslCommerzWinRef.close();
          //   break;
          // case this.paymentMode.FAC_3D:
          //   this.sessionService.fac3dWinRef.close();
          //   break;
          // case this.paymentMode.CHECKOUT_COM:
          //   this.sessionService.checkoutComWinRef.close();
          //   break;
          // case this.paymentMode.HYPERPAY:
          //   this.sessionService.hyperPayWinRef.close();
          //   break;
          // case this.paymentMode.VIVA:
          //   this.sessionService.vivaComWinRef.close();
          //   break;
          // case this.paymentMode.PAYHERE:
          //   this.sessionService.payHereWinRef.close();
          //   break;
          // case this.paymentMode.PAYNOW:
          //   this.sessionService.paynowWinRef.close();
          //   break;
          // case this.paymentMode.AZUL:
          //   this.sessionService.azulWinRef.close();
          //   break;
          // case this.paymentMode.CREDIMAX:
          //   this.sessionService.credimaxWinRef.close();
          //   break;
          // case this.paymentMode.MY_FATOORAH:
          //   this.sessionService.fatoorahWinRef.close();
          //   break;
          // case this.paymentMode.TAP:
          //   this.sessionService.tapWinRef.close();
          //   break;
          // case this.paymentMode.THETELLER:
          //   this.sessionService.thetellerWinRef.close();
          //   break;
          // case this.paymentMode.PAYNET:
          //   this.sessionService.paynetWinRef.close();
          //   break;
          // case this.paymentMode.CURLEC:
          //   this.sessionService.curlecWinRef.close();
          //   break;
          // case this.paymentMode.WIPAY:
          //   this.sessionService.wipayWinRef.close();
          //   break;
          default:
            this.sessionService.paymentWinRef.close();
            break;
        }
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
      setTimeout(() => {
      this.getWalletHistory();
      this.sessionService.remove('wallet');
      }, 2000);
    } else {
      setTimeout(() => {
        this.getWalletHistory();
        this.sessionService.remove('wallet');
        }, 2000);
      this.popup.showPopup(MessageType.SUCCESS, 2000, msg, false);
      // The payment has succeeded. Display a success message.
    }
  });
}
  /**
   * check for url params
   */
  checkForUrlParam() {
    let billUrl = decodeURIComponent(location.href);
    billUrl = billUrl.replace(/ /g, "");
    if (this.getParameterByName("billplz[id]", billUrl)) {
      this.initForm();
      this.paymentMethod = this.paymentMode.BILLPLZ;
      this.amountAdded = true;
      this.showModal = true;
    }
  }

  /**
   * extract params from url
   * @param name
   * @param url
   * @returns {any}
   */
  getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) {
      return null;
    }
    if (!results[2]) {
      return "";
    }
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  /**
   * manupulate history
   */
  manupulateHistory() {
    let domain = window.location.hostname;
    let url = 'wallet';
    if (
      domain === "localhost" ||
      domain === "dev-webapp.yelo.red" ||
      domain === "beta-webapp.yelo.red" ||
      domain === "127.0.0.1" ||
      domain === "dev.yelo.red"
    ) {
      history.replaceState('', '', location.origin + '/' + url);
    } else {
      history.replaceState('', '', location.origin + '/'+ this.languageSelected + '/' + url);
    }
  }

  /**
   * check redirect hit
   */
  checkRedirectionUrl() {
    this.initForm();
    this.redirectData = this.sessionService.get('walletAddMoney');
    if (this.redirectData) {
      this.showModal = true;
      this.redirectDataFlag = true;
      this.amountAdded = false;
      let amount = Number(this.redirectData.balance.toFixed(this.config.decimal_calculation_precision_point)) + 1
      this.addMoneyForm.controls.amount.setValue(amount);
    }
  }

  /**
   * load data
   */
  loadData(event) {
    
  }

  /**
   * get load when window loaded
   */
  getLoad(event) {
  
    this.showProcessing = false;
  }
  
    getPaymentData()
  {
    const obj = {};
    obj['vendor_id'] = this.loginData.vendor_details.vendor_id;
    obj['marketplace_user_id'] = this.loginData.vendor_details.marketplace_user_id;
    obj['user_id'] = this.loginData.vendor_details.marketplace_user_id;
    obj['access_token'] = this.loginData.vendor_details.app_access_token;
    obj['reference_id'] = this.loginData.vendor_details.reference_id;
    obj['app_type'] = 'WEB';
    obj['currency'] = this.config.payment_settings[0].code;
    obj['payment_for'] = this.paymentFor.WALLET;
    obj['amount'] = this.addMoneyForm.controls.amount.value;
    obj['payment_method'] = this.paymentMethod;
    obj['transaction_id']=""
    return obj;
  }
  
}
