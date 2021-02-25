import { MessageType } from './../../../../constants/constant';
/**
 * Created by mba-214 on 24/10/18.
 */
import { Component, Input, OnInit, OnDestroy, AfterViewInit, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppCartService } from '../../../catalogue/components/app-cart/app-cart.service';
import { SessionService } from '../../../../services/session.service';
import { CheckOutService } from '../../../checkout/checkout.service';
import { GoogleAnalyticsEvent, PromoMode, PromotionOn, PageType, PaymentByUsing } from '../../../../enums/enum';
import { GoogleAnalyticsEventsService } from '../../../../services/google-analytics-events.service';
import { AppService } from '../../../../app.service';
import { MessageService } from '../../../../services/message.service';
import { PopUpService } from '../../../../modules/popup/services/popup.service';
import { LoaderService } from '../../../../services/loader.service';
import { priceType } from '../../../../constants/constant';
import { PaymentService } from '../../../payment/payment.service';
import { GoogleAdWordsService } from '../../../../services/google-adwords.service';
import { FBPixelService } from '../../../../services/fb-pixel.service';
import { PaymentMode } from '../../../../enums/enum';
import { UtilityFunctions } from '../../../../classes/utility-functions.class';
import { takeWhile } from 'rxjs/operators';
import { DomSanitizer } from '../../../../../../node_modules/@angular/platform-browser';
import { RazorpayService } from  '../../../../modules/razorpay/razorpay.service'; //'src/app/modules/razorpay/razorpay.service';
declare var Stripe: any;
@Component({
  selector: 'app-payment-laundry',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})

export class PaymentComponent implements OnInit, OnDestroy, AfterViewInit {
  getOrderCreationPayload: {};
  @ViewChild('iframe') iframe: ElementRef;

  @Input() stepsArray: any;
  public formSettings: any;
  public terminology: any;
  public langJson: any;
  public languageSelected: string;
  public direction: string;
  public currency: string;
  public currencyData: any;
  public priceType = priceType;
  public perTaskCost = '';
  public billInfo: any;
  public selectedReferralPromo: any;
  public referralStatus: any;
  public loyaltyPointsAdded: any;
  public transcationAmount: boolean = false;
  public tipAddedTotal: any;
  public paylater_transaction: boolean= false;
  public transactional_check:boolean = false;
  public selectedPaymentMode: any;
  public paymentResponseRecieved: any;
  public jobResponse: any;
  public post_payment_enable: boolean;
  public paymentMode = PaymentMode;
  public PaymentByUsing=PaymentByUsing;
  public triggerPayment: any;
  public previousResponse: any;
  public loginData: any;
  public walletDetails: any = {};
  public alive:boolean=true;
  public cvvFac: any;
  public card_id:any;
  public paytmLinkNumber;
  public stripe;
  showPayButton: boolean = true;
  activePaymentMethod: any;
  paymentProcessType: any;
  payMoney: boolean;
  razorPayUrl: any;
  @Output() onload: any = new EventEmitter();
  count: any = 0;
  transaction_id: any;
  languageStrings: any={};
  constructor(public cartService: AppCartService,
    public sessionService: SessionService,
    public appService: AppService,
    public messageService: MessageService,
    protected router: Router,
    protected popup: PopUpService,
    protected loader: LoaderService,
    protected paymentService: PaymentService,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
    public fbPixelService: FBPixelService,
    public googleAdWordsService: GoogleAdWordsService,
    public checkoutService: CheckOutService, public razorPayService: RazorpayService,
    public domSanitizer: DomSanitizer) {
  }


  ngOnInit() {
    this.sessionService.langStringsPromise.then(() =>
      {
       this.languageStrings = this.sessionService.languageStrings;
       this.languageStrings.delivery_charge = (this.languageStrings.delivery_charge || "DELIVERY_DELIVERY Charge")
       .replace("DELIVERY_DELIVERY", this.terminology.DELIVERY);
       this.languageStrings.transaction_charge_be_added_for_this = (this.languageStrings.transaction_charge_be_added_for_this || "TRANSACTION_CHARGE will be added for this payment")
       .replace("TRANSACTION_CHARGE", this.terminology.TRANSACTION_CHARGE );
      });
    this.setConfig();
    this.setLang();
    this.getPaymentStatus();
    this.getWalletDetails();
    this.initEvents();
    this.getActivePaymentOption();
    this.razorPayService.razorpayUrl.subscribe(next => {
        if(next && next.payment_method == 128) {
          if(next.action == 'close') {
            this.close3dver();
        } else {
          this.successRazorpayTransaction(next);
        }
      }
    })

  }
  protected getActivePaymentOption() {
    this.paymentService.getActivePaymentOption().subscribe(response => {
      if (response && response.data.length > 0 && response.data) {
        this.activePaymentMethod = response.data;
      }
    });
  }


  initEvents(){
    this.messageService.emitCvvForFAC.pipe(takeWhile(_ => this.alive)).subscribe((res)=>{
      if(res) {
        this.card_id=res;
       }
     })
    this.messageService.emitNumberForPaytm.pipe(takeWhile(_ => this.alive)).subscribe(res => {
      if(res){
        this.paytmLinkNumber = res;
      }
    })
  }

  ngOnDestroy() {
    this.alive = false;
  }

  ngAfterViewInit() {

  }

  /**
   * setConfig
   */
  setConfig() {
    this.loginData = this.sessionService.get('appData');
    this.formSettings = this.sessionService.get('config');
    this.terminology = this.formSettings.terminology;
    this.currency = this.formSettings.payment_settings[0].symbol;
    this.currencyData = this.formSettings.payment_settings[0];
    this.priceType[1].name = this.terminology.UNIT || 'Unit';
    this.referralStatus = this.sessionService.get("appData").referral.status;
    this.post_payment_enable = Boolean(this.formSettings.post_payment_enable);
    //this.post_payment_enable = false;
  }

  /**
   * set lang
   */
  setLang() {
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
   * check enabled payment method
   */
  checkWhichPaymentEnabled() {
    let method = this.sessionService.get("appData").formSettings;
    for (let i = 0; i < method[0].payment_methods.length; i++) {
      if (method[0].payment_methods[i].enabled) {
        return method[0].payment_methods[i].value;
      }
    }
  }

  /**
   * send payment for task
   */
  getPaymentStatus() {
    this.loader.show();
    const data: any = {};
    const checkoutData = this.sessionService.getByKey("app", "checkout").cart;
    const productData = this.sessionService.getByKey("app", "cart");

    data["user_id"] = this.sessionService.getString("user_id");
    // data["access_token"] = this.sessionService.get("appData").vendor_details.app_access_token;
    data["marketplace_reference_id"] = this.sessionService.getString("marketplace_reference_id");
    // data["vendor_id"] = this.sessionService.get("appData").vendor_details.vendor_id;
    data["marketplace_user_id"] = this.sessionService.get("appData").vendor_details.marketplace_user_id;
    data["job_pickup_datetime"] = checkoutData.job_pickup_datetime;
    data["job_delivery_datetime"] = checkoutData.job_delivery_datetime;
    data["payment_method"] = this.checkWhichPaymentEnabled(); // checkoutData.payment_method;
    data["amount"] = 0;
    if (this.sessionService.get('appData')) {
      data['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      data['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    data["products"] = [];
    if (productData) {
      for (let i = 0; i < productData.length; i++) {
        data["amount"] += productData[i].showPrice * productData[i].quantity;
        data["products"].push({
          product_id: productData[i].id,
          unit_price: productData[i].price,
          quantity: productData[i].quantity,
          total_price: productData[i].price * productData[i].quantity,
          customizations: productData[i].customizations,
          return_enabled: productData[i].return_enabled
        });
      }
    }
    this.paymentService.sendPaymentTask(data).subscribe(response => {
      this.loader.hide();
      if (response.status === 200) {
        this.perTaskCost = response.data.per_task_cost || 0;
        //this.setDefaultTip();
        this.getPaymentInfo(response.data.per_task_cost);
      } else {
        this.popup.showPopup(MessageType.ERROR, 3000, response.message, false);
      }
    });
  }

  /**
   * get payment info
   */
  getPaymentInfo(amount) {
    this.loader.show();
    const data = {};
    data["marketplace_reference_id"] = this.sessionService.getString("marketplace_reference_id");
    data["marketplace_user_id"] = this.sessionService.get("appData").vendor_details.marketplace_user_id;
    data["user_id"] = this.sessionService.getString("user_id");
    // data["vendor_id"] = this.sessionService.get("appData").vendor_details.vendor_id;
    // data["access_token"] = this.sessionService.get("appData").vendor_details.app_access_token;
    data["amount"] = amount || 0;
    data["tip"] = this.tipAddedTotal ? +this.tipAddedTotal.tip : undefined;
    data['loyalty_points'] = this.loyaltyPointsAdded ? this.loyaltyPointsAdded.point : undefined;
    if (this.sessionService.get('appData')) {
      data['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      data['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    if (this.selectedReferralPromo && this.selectedReferralPromo.promo) {
      data["promo_id"] = this.selectedReferralPromo.promo;
    } else if (this.selectedReferralPromo && this.selectedReferralPromo.promo_code) {
      data["promo_code"] = this.selectedReferralPromo.promo_code;
    }
    //else if (promo && promo.promo_code) {
    //  data["promo_code"] = promo.promo_code;
    //} else if (promo && promo.referral_code) {
    //  data["referral_code"] = promo.referral_code;
    //}

    if (this.tipAddedTotal) {
      data["tip_type"] = +this.tipAddedTotal.tip_type;
    }

    if (this.sessionService.getString("deliveryMethod")) {
      const method = this.sessionService.getString("deliveryMethod");
      switch (Number(method)) {
        case 1:
          data["home_delivery"] = 1;
          break;
        case 2:
          data["self_pickup"] = 1;
          break;
        case 8:
          data["pick_and_drop"] = 1;
          break;
      }
    }

    const checkoutData = this.sessionService.getByKey("app", "checkout").cart;
    const checkoutTemplate = this.sessionService.getByKey("app", "checkout_template") || [];
    data["checkout_template"] = JSON.stringify(checkoutTemplate);
    data["latitude"] = checkoutData.job_pickup_latitude;
    data["longitude"] = checkoutData.job_pickup_longitude;

    this.paymentService.getPaymentBillInfo(data).subscribe(response => {
      this.loader.hide();
      if (response.status === 200) {
        this.previousResponse = data;
        this.billInfo = response.data;
        this.setAutoApplyDiscount();


      } else {
        this.checkPromoError();
        this.popup.showPopup(MessageType.ERROR, 3000, response.message, false);
      }
    });
  }

  private setAutoApplyDiscount() {
    if (this.billInfo && this.billInfo.APPLIED_PROMOS && this.billInfo.APPLIED_PROMOS.length) {
      const autoAppliedPromo = this.billInfo.APPLIED_PROMOS.filter(el => el.promo_mode === PromoMode.AUTO_APPLY);
      if (autoAppliedPromo && autoAppliedPromo.length) {
        const autoAppliedPromoGrouped = UtilityFunctions.groupBy(autoAppliedPromo, 'promo_on');
        this.billInfo.autoAppliedPromoOnDelivery = autoAppliedPromoGrouped[PromotionOn.DELIVERY_CHARGE] || [];
        this.billInfo.autoAppliedPromoOnSubtotal = autoAppliedPromoGrouped[PromotionOn.SUBTOTAL] || [];
      }
    }

    if (this.billInfo.DELIVERY_DISCOUNT && !isNaN(this.billInfo.DELIVERY_DISCOUNT)) {
      this.billInfo.DELIVERY_CHARGE_AFTER_DISCOUNT = +this.billInfo.DELIVERY_CHARGE - +this.billInfo.DELIVERY_DISCOUNT;
    }

  }

  /**
   * check promo error and restore previous promo if any
   */
  checkPromoError() {

    this.selectedReferralPromo = {};
    if (this.previousResponse && this.previousResponse.promo_id) {
      let index = this.billInfo.PROMOS.findIndex((o) => {
        return o.id === this.previousResponse.promo_id;
      });
      if (index > -1) {
        this.selectedReferralPromo.promo_code = this.billInfo.PROMOS[index].code;
      }

    } else if (this.previousResponse && this.previousResponse.promo_code) {
      if (this.billInfo.PROMOS && this.billInfo.PROMOS.length) {
        let index = this.billInfo.PROMOS.findIndex((o) => {
          return o.code.toLowerCase() === this.previousResponse.promo_code.toLowerCase();
        });
        if (index > -1) {
          this.selectedReferralPromo.promo = this.billInfo.PROMOS[index].id;
        }
      }

      if (this.billInfo.REFERRAL && this.billInfo.REFERRAL.length) {
        let indexR = this.billInfo.REFERRAL.findIndex((o) => {
          return o.code.toLowerCase() === this.previousResponse.promo_code.toLowerCase();
        });
        if (indexR > -1) {
          this.selectedReferralPromo.promo_code = this.billInfo.REFERRAL[indexR].code;
        }
      }
    }
  }

  /**
   * selected promo or referral
   */
  selectedPromo(data) {
    this.selectedReferralPromo = data;
    this.getPaymentInfo(this.perTaskCost);
  }

  /**
   * entered loyalty points
   */
  loyaltyPoints(data) {
    this.loyaltyPointsAdded = data;
    this.getPaymentInfo(this.perTaskCost);
  }

  /**
   * tip added
   */
  tipAdded(data) {
    this.tipAddedTotal = data;
    this.getPaymentInfo(this.perTaskCost);
  }

  /**
   * payment mode selected
   */
  paymentMethod(data) {  
    if(data.value == 65536 && this.billInfo.TRANSACTIONAL_CHARGES_INFO.PAYLATER){
      this.paylater_transaction =  true;
      this.transactional_check = true;
    } else {
      this.paylater_transaction =  false;
      this.transactional_check = false;
      this.transcationAmount = false;
    }
    this.selectedPaymentMode = data;
  }
  addTransactional(){
    this.transcationAmount = true;
    this.transactional_check = false;
  }
  /**
   * payment response
   */
  paymentResponse(data) {
    this.paymentResponseRecieved = data ? data.response : '';
    let payArr = [this.paymentMode.PAYFORT, this.paymentMode.STRIPE_IDEAL, this.paymentMode.RAZORPAY, this.paymentMode.INNSTAPAY, this.paymentMode.VIVA, this.paymentMode.PAYPAL, this.paymentMode.PAYFAST, this.paymentMode.PAYU, this.paymentMode.PAY_MOB, this.paymentMode.PAYNOW, this.paymentMode.PAYSTACK, this.paymentMode.MPAISA, this.paymentMode.SSL_COMMERZ, this.paymentMode.FAC_3D, this.paymentMode.CHECKOUT_COM, this.paymentMode.VISTA, this.paymentMode.LIME_LIGHT, this.paymentMode.TWO_CHECKOUT, this.paymentMode.PAYTM_LINK, this.paymentMode.AZUL, this.paymentMode.CREDIMAX, this.paymentMode.PAYHERE, this.paymentMode.HYPERPAY, this.paymentMode.MY_FATOORAH, this.paymentMode.THETELLER, this.paymentMode.PAYNET, this.paymentMode.CURLEC,this.paymentMode.TAP, this.paymentMode.WIPAY,this.paymentMode.PAGAR, this.paymentMode.WHOOSH,this.paymentMode.MTN, this.paymentMode.WECHAT, this.paymentMode.ONEPAY,this.paymentMode.PAGOPLUX,this.paymentMode.MYBILLPAYMENT, this.paymentMode.VALITOR,this.paymentMode.TRUEVO, this.paymentMode.PAYZEN, this.paymentMode.FIRSTDATA, this.paymentMode.BANKOPEN, this.paymentMode.SQUARE, this.paymentMode.ETISALAT, this.paymentMode.SUNCASH, this.paymentMode.GOCARDLESS, this.paymentMode.ATH, this.paymentMode.IPAY88, this.paymentMode.PROXYPAY, this.paymentMode.CYBERSOURCE, this.paymentMode.ALFALAH, this.paymentMode.CULQI, this.paymentMode.NMI, this.paymentMode.FLUTTERWAVE, this.paymentMode.MPESA, this.paymentMode.ADYEN, this.paymentMode.PAYMARK, this.paymentMode.HYPUR, this.paymentMode.PAYTMV3, this.paymentMode.PIXELPAY, this.paymentMode.DOKU, this.paymentMode.PEACH, this.paymentMode.PAGUELOFACIL, this.paymentMode.NOQOODY, this.paymentMode.GTBANK,PaymentMode.URWAY, PaymentMode.VUKA, PaymentMode.VPOS, PaymentMode.CXPAY, PaymentMode.PAYKU, PaymentMode.BAMBORA, PaymentMode.PAYWAYONE, PaymentMode.PLACETOPAY, this.paymentMode.TELR];

    let autoPayArray = [PaymentMode.RAZORPAY, PaymentMode.PAYPAL, PaymentMode.PAYZEN, PaymentMode.PAYFAST, PaymentMode.TAP, PaymentMode.CURLEC, PaymentMode.LIME_LIGHT, PaymentMode.WHOOSH, PaymentMode.PAGAR, PaymentMode.PAYNET, PaymentMode.STRIPE_IDEAL, PaymentMode.ONEPAY, PaymentMode.MTN, PaymentMode.TRUEVO, PaymentMode.FIRSTDATA, PaymentMode.MY_FATOORAH, PaymentMode.VALITOR, PaymentMode.VIVA, PaymentMode.SSL_COMMERZ, PaymentMode.HYPERPAY, PaymentMode.FAC_3D, PaymentMode.AZUL, PaymentMode.CREDIMAX, PaymentMode.ATH, PaymentMode.PAGOPLUX, PaymentMode.MYBILLPAYMENT, PaymentMode.TWO_CHECKOUT, PaymentMode.WECHAT, PaymentMode.SQUARE, PaymentMode.INNSTAPAY, PaymentMode.PAYHERE, PaymentMode.PAY_MOB, PaymentMode.IPAY88, PaymentMode.PAYNOW, PaymentMode.PAYU, PaymentMode.PAYSTACK, PaymentMode.ETISALAT,PaymentMode.PROXYPAY, PaymentMode.CYBERSOURCE, PaymentMode.ALFALAH, PaymentMode.BANKOPEN, PaymentMode.WIPAY, PaymentMode.MPAISA, PaymentMode.CULQI, PaymentMode.NMI, PaymentMode.CHECKOUT_COM, PaymentMode.FLUTTERWAVE, PaymentMode.MPESA, PaymentMode.ADYEN, PaymentMode.PAYMARK, PaymentMode.HYPUR, PaymentMode.PAYTMV3, PaymentMode.PIXELPAY, PaymentMode.DOKU, PaymentMode.PEACH, PaymentMode.PAGUELOFACIL, PaymentMode.NOQOODY, PaymentMode.GTBANK, PaymentMode.URWAY, PaymentMode.VUKA, PaymentMode.VPOS, PaymentMode.CXPAY, PaymentMode.PAYKU, PaymentMode.BAMBORA, PaymentMode.PAYWAYONE, PaymentMode.PLACETOPAY, this.paymentMode.TELR];

    if(autoPayArray.includes(+this.selectedPaymentMode.value) && this.paymentProcessType ==2 && this.paymentResponseRecieved)
    {
      if(this.paymentResponseRecieved.status == 'error') {
        let payArray = [PaymentMode.PAY_MOB, PaymentMode.PAYNOW, PaymentMode.SSL_COMMERZ, PaymentMode.FAC_3D, PaymentMode.CHECKOUT_COM, PaymentMode.VIVA, PaymentMode.PAYHERE, PaymentMode.AZUL, PaymentMode.HYPERPAY, PaymentMode.CREDIMAX, PaymentMode.MY_FATOORAH, PaymentMode.THETELLER, PaymentMode.PAYNET, PaymentMode.TAP, PaymentMode.CURLEC, PaymentMode.WIPAY, PaymentMode.PAGAR, PaymentMode.WHOOSH, PaymentMode.PAYU,PaymentMode.MTN, PaymentMode.WECHAT, PaymentMode.ONEPAY,PaymentMode.PAGOPLUX, PaymentMode.MYBILLPAYMENT, PaymentMode.VALITOR, PaymentMode.TRUEVO, PaymentMode.PAYZEN, PaymentMode.FIRSTDATA, PaymentMode.BANKOPEN, PaymentMode.SQUARE, PaymentMode.ETISALAT, PaymentMode.SUNCASH, PaymentMode.GOCARDLESS, PaymentMode.ATH, PaymentMode.IPAY88];

        if(payArray.includes(+this.selectedPaymentMode.value) && this.sessionService.paymentWinRef) {
          this.sessionService.paymentWinRef.close();
        }
        this.popup.showPopup(MessageType.ERROR, 3000, "Transaction Failed", false);
        this.paymentResponseRecieved = '';
        return;
      }
      const msg = 'Order placed successfully.';
      this.popup.showPopup(MessageType.SUCCESS, 3000, msg, false);
      setTimeout(() => {
        this.orderPlacedCartClear();
        this.changeRoute();
      }, 3000);
      return;
    }
    if (payArr.includes(this.selectedPaymentMode.value) && this.paymentResponseRecieved) {
      if(this.paymentResponseRecieved.status == 'error') {
        let payArray = [PaymentMode.PAY_MOB, PaymentMode.PAYNOW, PaymentMode.SSL_COMMERZ, PaymentMode.FAC_3D, PaymentMode.CHECKOUT_COM, PaymentMode.VIVA, PaymentMode.PAYHERE, PaymentMode.AZUL, PaymentMode.HYPERPAY, PaymentMode.CREDIMAX, PaymentMode.MY_FATOORAH, PaymentMode.THETELLER, PaymentMode.PAYNET, PaymentMode.TAP, PaymentMode.CURLEC, PaymentMode.WIPAY, PaymentMode.PAGAR, PaymentMode.WHOOSH, PaymentMode.PAYU,PaymentMode.MTN, PaymentMode.WECHAT, PaymentMode.ONEPAY,PaymentMode.PAGOPLUX, PaymentMode.MYBILLPAYMENT, PaymentMode.VALITOR, PaymentMode.TRUEVO, PaymentMode.PAYZEN, PaymentMode.FIRSTDATA, PaymentMode.BANKOPEN, PaymentMode.SQUARE, PaymentMode.ETISALAT, PaymentMode.SUNCASH, PaymentMode.GOCARDLESS, PaymentMode.ATH, PaymentMode.IPAY88];

        if(payArray.includes(+this.selectedPaymentMode.value) && this.sessionService.paymentWinRef) {
          this.sessionService.paymentWinRef.close();
        }
        this.popup.showPopup(MessageType.ERROR, 3000, "Transaction Failed", false);
        this.paymentResponseRecieved = '';
        return;
      }
      if(this.selectedPaymentMode.value == this.paymentMode.PAYFORT) {
        this.transaction_id = data.response.transaction_id;
      }
      this.payAmount();
    } else if (this.selectedPaymentMode.value == this.paymentMode.BILLPLZ && this.paymentResponseRecieved) {
      this.afterCreateTaskSuccess('');
    }
    // else if (this.selectedPaymentMode.value == (this.paymentMode.LIME_LIGHT)) {
    //   this.payAmount();
    // }
    // else if (this.selectedPaymentMode.value == (this.paymentMode.TWO_CHECKOUT)) {
    //   this.payAmount();
    // }
  }

  /**
   * check entered promo or referral
   */
  checkPromoReferral(code) {
    if (this.billInfo.PROMOS && this.billInfo.PROMOS.length) {
      let index = this.billInfo.PROMOS.findIndex((o) => {
        return o.code.toLowerCase() === code.toLowerCase();
      });
      if (index > -1) {
        this.selectedReferralPromo['promo'] = this.billInfo.PROMOS[index].id;
        return true;
      }
    }
  }

  /**
   * check payment error
   */
  async checkPaymentError(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (this.selectedPaymentMode) {
        let pay_array1 = [this.paymentMode.STRIPE, this.paymentMode.PAYFORT, this.paymentMode.AUTHORIZE_NET, this.paymentMode.VISTA]

        let pay_array2 = [this.paymentMode.CASH, this.paymentMode.PAY_LATER, this.paymentMode.PAYTM_LINK, this.paymentMode.BILLPLZ, this.paymentMode.WALLET, this.paymentMode.FAC]

        let pay_array3 = [this.paymentMode.RAZORPAY, this.paymentMode.PAY_MOB, this.paymentMode.PAYU, this.paymentMode.PAYNOW, this.paymentMode.PAYSTACK, this.paymentMode.INNSTAPAY, this.paymentMode.VIVA, this.paymentMode.PAYFAST, this.paymentMode.MPAISA, this.paymentMode.SSL_COMMERZ, this.paymentMode.FAC_3D, this.paymentMode.CHECKOUT_COM, this.paymentMode.HYPERPAY, this.paymentMode.LIME_LIGHT, this.paymentMode.TWO_CHECKOUT, this.paymentMode.PAYHERE, this.paymentMode.AZUL, this.paymentMode.CREDIMAX, this.paymentMode.MY_FATOORAH, this.paymentMode.PAYNET, this.paymentMode.THETELLER, this.paymentMode.CURLEC, this.paymentMode.WIPAY, this.paymentMode.PAGAR, this.paymentMode.WHOOSH,this.paymentMode.MTN, this.paymentMode.WECHAT, this.paymentMode.ONEPAY,this.paymentMode.PAGOPLUX,this.paymentMode.MYBILLPAYMENT, this.paymentMode.VALITOR, this.paymentMode.TRUEVO, this.paymentMode.PAYZEN, this.paymentMode.FIRSTDATA, this.paymentMode.BANKOPEN, this.paymentMode.SQUARE, this.paymentMode.ETISALAT, this.paymentMode.SUNCASH, this.paymentMode.GOCARDLESS, this.paymentMode.ATH, this.paymentMode.IPAY88, this.paymentMode.PROXYPAY, this.paymentMode.CYBERSOURCE, this.paymentMode.ALFALAH, this.paymentMode.CULQI, this.paymentMode.NMI, this.paymentMode.FLUTTERWAVE, this.paymentMode.MPESA, this.paymentMode.ADYEN, this.paymentMode.PAYMARK, this.paymentMode.HYPUR, this.paymentMode.PAYTMV3, this.paymentMode.PIXELPAY, this.paymentMode.DOKU, this.paymentMode.PEACH, this.paymentMode.PAGUELOFACIL, this.paymentMode.NOQOODY, this.paymentMode.GTBANK, PaymentMode.URWAY, PaymentMode.VUKA, PaymentMode.VPOS, PaymentMode.CXPAY, PaymentMode.PAYKU, PaymentMode.BAMBORA, PaymentMode.PAYWAYONE, PaymentMode.PLACETOPAY]

        if (pay_array1.includes(this.selectedPaymentMode.value)) {
          if (!this.paymentResponseRecieved) {
            this.popup.showPopup(MessageType.ERROR, 2000, 'Payment info is missing.', false);
            return resolve(false);
          } else {
            return resolve(true);
          }
        }
        else if (pay_array2.includes(this.selectedPaymentMode.value)) {
          return resolve(true);
        }
        else if (pay_array3.includes(this.selectedPaymentMode.value)) {
          if (!this.paymentResponseRecieved && !this.post_payment_enable) {
            let bookingData = this.makeCreateTaskData(this.stepsArray[3].data[0]);
            await this.validateOrderDataBeforePayment(bookingData);
            let autoPayArray = [PaymentMode.RAZORPAY, PaymentMode.PAYPAL, PaymentMode.PAYZEN, PaymentMode.PAYFAST, PaymentMode.TAP, PaymentMode.CURLEC, PaymentMode.LIME_LIGHT, PaymentMode.WHOOSH, PaymentMode.PAGAR, PaymentMode.PAYNET, PaymentMode.STRIPE_IDEAL, PaymentMode.ONEPAY, PaymentMode.MTN, PaymentMode.TRUEVO, PaymentMode.FIRSTDATA, PaymentMode.MY_FATOORAH, PaymentMode.VALITOR, PaymentMode.VIVA, PaymentMode.SSL_COMMERZ, PaymentMode.HYPERPAY, PaymentMode.FAC_3D, PaymentMode.AZUL, PaymentMode.CREDIMAX, PaymentMode.ATH, PaymentMode.PAGOPLUX, PaymentMode.MYBILLPAYMENT, PaymentMode.TWO_CHECKOUT, PaymentMode.WECHAT, PaymentMode.SQUARE, PaymentMode.INNSTAPAY, PaymentMode.PAYHERE, PaymentMode.PAY_MOB, PaymentMode.IPAY88, PaymentMode.PAYNOW, PaymentMode.PAYU, PaymentMode.PAYSTACK, PaymentMode.ETISALAT, PaymentMode.PROXYPAY, PaymentMode.CYBERSOURCE, PaymentMode.BANKOPEN, PaymentMode.WIPAY, PaymentMode.MPAISA, PaymentMode.ALFALAH, PaymentMode.CULQI, PaymentMode.NMI, PaymentMode.CHECKOUT_COM, PaymentMode.FLUTTERWAVE, PaymentMode.MPESA, PaymentMode.ADYEN, PaymentMode.PAYMARK, PaymentMode.HYPUR, PaymentMode.PAYTMV3, PaymentMode.PIXELPAY, PaymentMode.DOKU, PaymentMode.PEACH, PaymentMode.PAGUELOFACIL, PaymentMode.NOQOODY, PaymentMode.GTBANK, PaymentMode.URWAY, PaymentMode.VUKA, PaymentMode.VPOS, PaymentMode.CXPAY, PaymentMode.PAYKU, PaymentMode.BAMBORA, PaymentMode.PAYWAYONE, PaymentMode.PLACETOPAY, this.paymentMode.TELR];

            if(this.paymentProcessType==2 && autoPayArray.includes(+this.selectedPaymentMode.value))
            {
             this.getOrderCreationPayload=bookingData
            }
            this.triggerPayment = Math.random();
            return resolve(false);
          } else if (!this.paymentResponseRecieved && this.post_payment_enable) {
            return resolve(true);
          } else {
            return resolve(true);
          }
        }
        else {
          this.loader.show();
          if (this.paymentResponseRecieved && this.paymentResponseRecieved.status == 'error' && !this.post_payment_enable) {
            this.paymentResponseRecieved = '';
            this.triggerPayment = '';
            resolve(false);
          }
          else if (!this.paymentResponseRecieved && !this.post_payment_enable) {
            let bookingData = this.makeCreateTaskData(this.stepsArray[3].data[0]);
            await this.validateOrderDataBeforePayment(bookingData);
            this.triggerPayment = Math.random();
            return resolve(false);
          } else if (!this.paymentResponseRecieved && this.post_payment_enable) {
            return resolve(true);
          } else {
            return resolve(true);
          }
        }
        // switch (this.selectedPaymentMode.value) {
        //   // case this.paymentMode.STRIPE:
        //   //   if (!this.paymentResponseRecieved) {
        //   //     this.popup.showPopup(MessageType.ERROR, 2000, 'Payment info is missing.', false);
        //   //     return resolve(false);
        //   //   } else {
        //   //     return resolve(true);
        //   //   }
        //   // case this.paymentMode.STRIPE_IDEAL:

        //   //   return resolve(true);

        //   // case this.paymentMode.CASH:
        //   //   return resolve(true);
        //   // case this.paymentMode.PAY_LATER:
        //   //   return resolve(true);
        //   // case this.paymentMode.PAYTM_LINK:
        //   //   return resolve(true);
        //   // case this.paymentMode.PAYFORT:
        //   //   if (!this.paymentResponseRecieved) {
        //   //     this.popup.showPopup(MessageType.ERROR, 2000, 'Payment info is missing.', false);
        //   //     return resolve(false);
        //   //   } else {
        //   //     return resolve(true);
        //   //   }
        //   // case this.paymentMode.RAZORPAY:
        //   //   if (!this.paymentResponseRecieved && !this.post_payment_enable) {
        //   //     let bookingData = this.makeCreateTaskData(this.stepsArray[3].data[0]);
        //   //     await this.validateOrderDataBeforePayment(bookingData);
        //   //     this.triggerPayment = Math.random();
        //   //     return resolve(false);
        //   //   } else if (!this.paymentResponseRecieved && this.post_payment_enable) {
        //   //     return resolve(true);
        //   //   } else {
        //   //     return resolve(true);
        //   //   }
        //   // case this.paymentMode.AUTHORIZE_NET:
        //   //   if (!this.paymentResponseRecieved) {
        //   //     this.popup.showPopup(MessageType.ERROR, 2000, 'Payment info is missing.', false);
        //   //     return resolve(false);
        //   //   } else {
        //   //     return resolve(true);
        //   //   }
        //   // case this.paymentMode.VISTA:
        //   //   if (!this.paymentResponseRecieved) {
        //   //     this.popup.showPopup(MessageType.ERROR, 2000, 'Payment info is missing.', false);
        //   //     return resolve(false);
        //   //   } else {
        //   //     return resolve(true);
        //   //   }
        //   // case this.paymentMode.FAC:
        //     // if (!this.paymentResponseRecieved) {
        //     //   this.popup.showPopup(MessageType.ERROR, 2000, 'Payment info is missing.', false);
        //     //   return resolve(false);
        //     // } else {
        //     //   return resolve(true);
        //     // }
        //     // return resolve(true);
        //   // case this.paymentMode.PAYSTACK:
        //   //   if (!this.paymentResponseRecieved && !this.post_payment_enable) {
        //   //     let bookingData = this.makeCreateTaskData(this.stepsArray[3].data[0]);
        //   //     await this.validateOrderDataBeforePayment(bookingData);
        //   //     this.triggerPayment = Math.random();
        //   //     return resolve(false);
        //   //   } else if (!this.paymentResponseRecieved && this.post_payment_enable) {
        //   //     return resolve(true);
        //   //   } else {
        //   //     return resolve(true);
        //   //   }
        //   // case this.paymentMode.INNSTAPAY:
        //   //   if (!this.paymentResponseRecieved && !this.post_payment_enable) {
        //   //     let bookingData = this.makeCreateTaskData(this.stepsArray[3].data[0]);
        //   //     await this.validateOrderDataBeforePayment(bookingData);
        //   //     this.triggerPayment = Math.random();
        //   //     return resolve(false);
        //   //   } else if (!this.paymentResponseRecieved && this.post_payment_enable) {
        //   //     return resolve(true);
        //   //   } else {
        //   //     return resolve(true);
        //   //   }
        //   // case this.paymentMode.VIVA:
        //   //   if (!this.paymentResponseRecieved && !this.post_payment_enable) {
        //   //     let bookingData = this.makeCreateTaskData(this.stepsArray[3].data[0]);
        //   //     await this.validateOrderDataBeforePayment(bookingData);
        //   //     this.triggerPayment = Math.random();
        //   //     return resolve(false);
        //   //   } else if (!this.paymentResponseRecieved && this.post_payment_enable) {
        //   //     return resolve(true);
        //   //   }
        //   //   else {
        //   //     return resolve(true);
        //   //   }
        //   case this.paymentMode.PAYPAL:
        //     if (this.paymentResponseRecieved && this.paymentResponseRecieved.status == 'error' && !this.post_payment_enable) {
        //       this.paymentResponseRecieved = '';
        //       this.triggerPayment = '';
        //       resolve(false);
        //     } else if (!this.paymentResponseRecieved && !this.post_payment_enable) {
        //       let bookingData = this.makeCreateTaskData(this.stepsArray[3].data[0]);
        //       await this.validateOrderDataBeforePayment(bookingData);
        //       this.triggerPayment = Math.random();
        //       return resolve(false);
        //     } else if (!this.paymentResponseRecieved && this.post_payment_enable) {
        //       return resolve(true);
        //     } else {
        //       return resolve(true);
        //     }
        //   // case this.paymentMode.PAYFAST:
        //   //   if (!this.paymentResponseRecieved && !this.post_payment_enable) {
        //   //     let bookingData = this.makeCreateTaskData(this.stepsArray[3].data[0]);
        //   //     await this.validateOrderDataBeforePayment(bookingData);
        //   //     this.triggerPayment = Math.random();
        //   //     return resolve(false);
        //   //   } else if (!this.paymentResponseRecieved && this.post_payment_enable) {
        //   //     return resolve(true);
        //   //   } else {
        //   //     return resolve(true);
        //   //   }

        //   // case this.paymentMode.MPAISA:
        //   //   if (!this.paymentResponseRecieved && !this.post_payment_enable) {
        //   //     let bookingData = this.makeCreateTaskData(this.stepsArray[3].data[0]);
        //   //     await this.validateOrderDataBeforePayment(bookingData);
        //   //     this.triggerPayment = Math.random();
        //   //     return resolve(false);
        //   //   } else if (!this.paymentResponseRecieved && this.post_payment_enable) {
        //   //     return resolve(true);
        //   //   } else {
        //   //     return resolve(true);
        //   //   }
        //   // case this.paymentMode.SSL_COMMERZ:
        //   //   if (!this.paymentResponseRecieved && !this.post_payment_enable) {
        //   //     let bookingData = this.makeCreateTaskData(this.stepsArray[3].data[0]);
        //   //     await this.validateOrderDataBeforePayment(bookingData);
        //   //     this.triggerPayment = Math.random();
        //   //     return resolve(false);
        //   //   } else if (!this.paymentResponseRecieved && this.post_payment_enable) {
        //   //     return resolve(true);
        //   //   }
        //   //   else {
        //   //     return resolve(true);
        //   //   }
        //   // case this.paymentMode.FAC_3D:
        //   //   if (!this.paymentResponseRecieved && !this.post_payment_enable) {
        //   //     let bookingData = this.makeCreateTaskData(this.stepsArray[3].data[0]);
        //   //     await this.validateOrderDataBeforePayment(bookingData);
        //   //     this.triggerPayment = Math.random();
        //   //     return resolve(false);
        //   //   } else if (!this.paymentResponseRecieved && this.post_payment_enable) {
        //   //     return resolve(true);
        //   //   }
        //   //   else {
        //   //     return resolve(true);
        //   //   }
        //   // case this.paymentMode.CHECKOUT_COM:
        //   //   if (!this.paymentResponseRecieved && !this.post_payment_enable) {
        //   //     let bookingData = this.makeCreateTaskData(this.stepsArray[3].data[0]);
        //   //     await this.validateOrderDataBeforePayment(bookingData);
        //   //     this.triggerPayment = Math.random();
        //   //     return resolve(false);
        //   //   } else if (!this.paymentResponseRecieved && this.post_payment_enable) {
        //   //     return resolve(true);
        //   //   }
        //   //   else {
        //   //     return resolve(true);
        //   //   }
        //   // case this.paymentMode.HYPERPAY:
        //   //   if (!this.paymentResponseRecieved && !this.post_payment_enable) {
        //   //     let bookingData = this.makeCreateTaskData(this.stepsArray[3].data[0]);
        //   //     await this.validateOrderDataBeforePayment(bookingData);
        //   //     this.triggerPayment = Math.random();
        //   //     return resolve(false);
        //   //   } else if (!this.paymentResponseRecieved && this.post_payment_enable) {
        //   //     return resolve(true);
        //   //   }
        //   //   else {
        //   //     return resolve(true);
        //   //   }
        //   // case this.paymentMode.LIME_LIGHT:
        //   //   if (!this.paymentResponseRecieved && !this.post_payment_enable) {
        //   //     let bookingData = this.makeCreateTaskData(this.stepsArray[3].data[0]);
        //   //     await this.validateOrderDataBeforePayment(bookingData);
        //   //     this.triggerPayment = Math.random();
        //   //     return resolve(false);
        //   //   } else if (!this.paymentResponseRecieved && this.post_payment_enable) {
        //   //     return resolve(true);
        //   //   }
        //   //   else {
        //   //     return resolve(true);
        //   //   }
        //   // case this.paymentMode.TWO_CHECKOUT:
        //   //   if (!this.paymentResponseRecieved && !this.post_payment_enable) {
        //   //     let bookingData = this.makeCreateTaskData(this.stepsArray[3].data[0]);
        //   //     await this.validateOrderDataBeforePayment(bookingData);
        //   //     this.triggerPayment = Math.random();
        //   //     return resolve(false);
        //   //   } else if (!this.paymentResponseRecieved && this.post_payment_enable) {
        //   //     return resolve(true);
        //   //   }
        //   //   else {
        //   //     return resolve(true);
        //   //   }
        //   // case this.paymentMode.PAYHERE:
        //   //   if (!this.paymentResponseRecieved && !this.post_payment_enable) {
        //   //     let bookingData = this.makeCreateTaskData(this.stepsArray[3].data[0]);
        //   //     await this.validateOrderDataBeforePayment(bookingData);
        //   //     this.triggerPayment = Math.random();
        //   //     return resolve(false);
        //   //   } else if (!this.paymentResponseRecieved && this.post_payment_enable) {
        //   //     return resolve(true);
        //   //   }
        //   //   else {
        //   //     return resolve(true);
        //   //   }
        //   // case this.paymentMode.AZUL:
        //   //   if (!this.paymentResponseRecieved && !this.post_payment_enable) {
        //   //     let bookingData = this.makeCreateTaskData(this.stepsArray[3].data[0]);
        //   //     await this.validateOrderDataBeforePayment(bookingData);
        //   //     this.triggerPayment = Math.random();
        //   //     return resolve(false);
        //   //   } else if (!this.paymentResponseRecieved && this.post_payment_enable) {
        //   //     return resolve(true);
        //   //   }
        //   //   else {
        //   //     return resolve(true);
        //   //   }
        //   // case this.paymentMode.CREDIMAX:
        //   //   if (!this.paymentResponseRecieved && !this.post_payment_enable) {
        //   //     let bookingData = this.makeCreateTaskData(this.stepsArray[3].data[0]);
        //   //     await this.validateOrderDataBeforePayment(bookingData);
        //   //     this.triggerPayment = Math.random();
        //   //     return resolve(false);
        //   //   } else if (!this.paymentResponseRecieved && this.post_payment_enable) {
        //   //     return resolve(true);
        //   //   }
        //   //   else {
        //   //     return resolve(true);
        //   //   }
        //   // case this.paymentMode.MY_FATOORAH:
        //   //   if (!this.paymentResponseRecieved && !this.post_payment_enable) {
        //   //     let bookingData = this.makeCreateTaskData(this.stepsArray[3].data[0]);
        //   //     await this.validateOrderDataBeforePayment(bookingData);
        //   //     this.triggerPayment = Math.random();
        //   //     return resolve(false);
        //   //   } else if (!this.paymentResponseRecieved && this.post_payment_enable) {
        //   //     return resolve(true);
        //   //   }
        //   //   else {
        //   //     return resolve(true);
        //   //   }
        //   // case this.paymentMode.PAYNET:
        //   //   if (!this.paymentResponseRecieved && !this.post_payment_enable) {
        //   //     let bookingData = this.makeCreateTaskData(this.stepsArray[3].data[0]);
        //   //     await this.validateOrderDataBeforePayment(bookingData);
        //   //     this.triggerPayment = Math.random();
        //   //     return resolve(false);
        //   //   } else if (!this.paymentResponseRecieved && this.post_payment_enable) {
        //   //     return resolve(true);
        //   //   }
        //   //   else {
        //   //     return resolve(true);
        //   //   }
        //   // case this.paymentMode.THETELLER:
        //   //   if (!this.paymentResponseRecieved && !this.post_payment_enable) {
        //   //     let bookingData = this.makeCreateTaskData(this.stepsArray[3].data[0]);
        //   //     await this.validateOrderDataBeforePayment(bookingData);
        //   //     this.triggerPayment = Math.random();
        //   //     return resolve(false);
        //   //   } else if (!this.paymentResponseRecieved && this.post_payment_enable) {
        //   //     return resolve(true);
        //   //   }
        //   //   else {
        //   //     return resolve(true);
        //   //   }
        //   // case this.paymentMode.BILLPLZ:
        //   //   return resolve(true);
        //   // case this.paymentMode.WALLET:
        //   //   return resolve(true);
        //   // case this.paymentMode.WIRE_CARD:
        //   //   if (!this.paymentResponseRecieved && !this.post_payment_enable) {
        //   //   }
        //     // break;

        //   default:
        //     this.loader.show();
        //     if (this.paymentResponseRecieved && this.paymentResponseRecieved.status == 'error' && !this.post_payment_enable) {
        //       this.paymentResponseRecieved = '';
        //       this.triggerPayment = '';
        //       resolve(false);
        //     }
        //     else if (!this.paymentResponseRecieved && !this.post_payment_enable) {
        //       let bookingData = this.makeCreateTaskData(this.stepsArray[3].data[0]);
        //       await this.validateOrderDataBeforePayment(bookingData);
        //       this.triggerPayment = Math.random();
        //       return resolve(false);
        //     } else if (!this.paymentResponseRecieved && this.post_payment_enable) {
        //       return resolve(true);
        //     } else {
        //       return resolve(true);
        //     }
        //     break;
        // }
      }
    });
  }

  /**
   * validate order data before start payment
   * @param data order data
   */

  validateOrderDataBeforePayment(data): Promise<boolean> {
    let payArray = [PaymentMode.PAY_MOB, PaymentMode.PAYNOW, PaymentMode.SSL_COMMERZ, PaymentMode.FAC_3D, PaymentMode.CHECKOUT_COM, PaymentMode.VIVA, PaymentMode.PAYHERE, PaymentMode.AZUL, PaymentMode.HYPERPAY, PaymentMode.CREDIMAX, PaymentMode.MY_FATOORAH, PaymentMode.THETELLER, PaymentMode.PAYNET, PaymentMode.TAP, PaymentMode.CURLEC, PaymentMode.WIPAY, PaymentMode.PAGAR, PaymentMode.WHOOSH, PaymentMode.PAYU,PaymentMode.MTN, PaymentMode.WECHAT, PaymentMode.ONEPAY,PaymentMode.PAGOPLUX, PaymentMode.MYBILLPAYMENT, PaymentMode.VALITOR, PaymentMode.TRUEVO, PaymentMode.PAYZEN, PaymentMode.FIRSTDATA, PaymentMode.BANKOPEN, PaymentMode.SQUARE, PaymentMode.ETISALAT, PaymentMode.SUNCASH, PaymentMode.GOCARDLESS, PaymentMode.ATH, PaymentMode.IPAY88, PaymentMode.PROXYPAY, PaymentMode.CYBERSOURCE, PaymentMode.ALFALAH, PaymentMode.CULQI, PaymentMode.NMI, PaymentMode.FLUTTERWAVE, PaymentMode.MPESA, PaymentMode.ADYEN, PaymentMode.PAYMARK, PaymentMode.HYPUR, PaymentMode.PAYTMV3, PaymentMode.PIXELPAY, PaymentMode.DOKU, PaymentMode.PEACH, PaymentMode.PAGUELOFACIL, PaymentMode.NOQOODY, PaymentMode.GTBANK, PaymentMode.URWAY, PaymentMode.VUKA, PaymentMode.VPOS, PaymentMode.CXPAY, PaymentMode.PAYKU, PaymentMode.BAMBORA, PaymentMode.PAYWAYONE, PaymentMode.PLACETOPAY]

    data['perform_validation'] = 1;
    delete data.is_payment_done;
    if(data.custom_pickup_address){
        data.custom_pickup_address = undefined;
        data.custom_pickup_longitude = undefined;
        data.custom_pickup_latitude = undefined;
    }
    return new Promise((resolve, reject) => {
      this.paymentService.validateOrderData(data).subscribe(response => {
        if (response.status === 200) {
          resolve(true);
        }
        else if (payArray.includes(this.selectedPaymentMode.value) && this.sessionService.paymentWinRef) {
          this.sessionService.paymentWinRef.close();
          this.loader.hide();
          this.popup.showPopup(MessageType.ERROR, 3000, response.message, false);
        }
        else{
          this.loader.hide();
          this.popup.showPopup(MessageType.ERROR, 3000, response.message, false);
        }
        // else {
        // if (this.selectedPaymentMode == PaymentMode.PAYU && this.sessionService.payuWinRef) {
        //   this.sessionService.payuWinRef.close();
        // }
        // if(this.selectedPaymentMode == PaymentMode.PAY_MOB && this.sessionService.payMobWinRef){
        //   this.sessionService.payMobWinRef.close();
        // }
        // if(this.selectedPaymentMode == PaymentMode.WIRE_CARD && this.sessionService.wirecardWinRef){
        //   this.sessionService.wirecardWinRef.close();
        // }
        // if(this.selectedPaymentMode == PaymentMode.SSL_COMMERZ && this.sessionService.sslCommerzWinRef){
        //   this.sessionService.sslCommerzWinRef.close();
        // }
        // if(this.selectedPaymentMode == PaymentMode.AZUL && this.sessionService.azulWinRef){
        //   this.sessionService.azulWinRef.close();
        // }
        // if(this.selectedPaymentMode == PaymentMode.CREDIMAX && this.sessionService.credimaxWinRef){
        //   this.sessionService.credimaxWinRef.close();
        // }
        // if(this.selectedPaymentMode == PaymentMode.MY_FATOORAH && this.sessionService.fatoorahWinRef){
        //   this.sessionService.fatoorahWinRef.close();
        // }
        // if(this.selectedPaymentMode == PaymentMode.PAYNET && this.sessionService.paynetWinRef){
        //   this.sessionService.paynetWinRef.close();
        // }
        // if(this.selectedPaymentMode == PaymentMode.TAP && this.sessionService.tapWinRef){
        //   this.sessionService.tapWinRef.close();
        // }
        // if(this.selectedPaymentMode == PaymentMode.CURLEC && this.sessionService.curlecWinRef){
        //   this.sessionService.curlecWinRef.close();
        // }
        // if(this.selectedPaymentMode == PaymentMode.THETELLER && this.sessionService.thetellerWinRef){
        //   this.sessionService.thetellerWinRef.close();
        // }
        // if(this.selectedPaymentMode == PaymentMode.PAYNOW && this.sessionService.paynowWinRef){
        //   this.sessionService.paynowWinRef.close();
        // }
        // if(this.selectedPaymentMode == PaymentMode.FAC_3D && this.sessionService.fac3dWinRef){
        //   this.sessionService.fac3dWinRef.close();
        // }
        // if(this.selectedPaymentMode == PaymentMode.CHECKOUT_COM && this.sessionService.checkoutComWinRef){
        //   this.sessionService.checkoutComWinRef.close();
        // }
        // if (this.selectedPaymentMode == PaymentMode.VIVA && this.sessionService.vivaComWinRef) {
        //   this.sessionService.vivaComWinRef.close();
        // }
        // if(this.selectedPaymentMode == PaymentMode.PAYHERE && this.sessionService.payHereWinRef){
        //   this.sessionService.payHereWinRef.close();
        // }
        // if(this.selectedPaymentMode == PaymentMode.HYPERPAY && this.sessionService.hyperPayWinRef){
        //   this.sessionService.hyperPayWinRef.close();
        // }
        // if(this.selectedPaymentMode == PaymentMode.WIPAY && this.sessionService.wipayWinRef){
        //   this.sessionService.wipayWinRef.close();
        // }

        // this.loader.hide();
        // this.popup.showPopup(MessageType.ERROR, 3000, response.message, false);
        // }
      });
    })
  }

  /**
   * pay amount with selected payment method
   */
  Pay() {
    this.getPaymentprocessType();
    if (this.paymentProcessType === 2) {
      this.payMoney = true;
      this.payAmount();
    } else {
      this.payAmount();
    }
  }
  async payAmount() {
    let payArray = [this.paymentMode.PAYU, this.paymentMode.PAY_MOB, this.paymentMode.SSL_COMMERZ, this.paymentMode.FAC_3D, this.paymentMode.CHECKOUT_COM, this.paymentMode.HYPERPAY, this.paymentMode.VIVA, this.paymentMode.PAYNOW, this.paymentMode.AZUL, this.paymentMode.CREDIMAX, this.paymentMode.MY_FATOORAH, this.paymentMode.PAYNET, this.paymentMode.TAP, this.paymentMode.CURLEC, this.paymentMode.WIPAY, this.paymentMode.THETELLER, this.paymentMode.PAYHERE, this.paymentMode.PAGAR, this.paymentMode.WHOOSH,this.paymentMode.MTN, this.paymentMode.WECHAT, this.paymentMode.ONEPAY,this.paymentMode.PAGOPLUX, this.paymentMode.MYBILLPAYMENT, this.paymentMode.VALITOR, this.paymentMode.TRUEVO, this.paymentMode.PAYZEN, this.paymentMode.FIRSTDATA, this.paymentMode.BANKOPEN, this.paymentMode.SQUARE, this.paymentMode.ETISALAT, this.paymentMode.SUNCASH, this.paymentMode.GOCARDLESS, this.paymentMode.ATH, this.paymentMode.IPAY88, this.paymentMode.PROXYPAY, this.paymentMode.CYBERSOURCE, this.paymentMode.ALFALAH, this.paymentMode.CULQI, this.paymentMode.NMI, this.paymentMode.FLUTTERWAVE, this.paymentMode.MPESA, this.paymentMode.ADYEN, this.paymentMode.PAYMARK, this.paymentMode.HYPUR, this.paymentMode.PAYTMV3, this.paymentMode.PIXELPAY, this.paymentMode.DOKU, this.paymentMode.PEACH, this.paymentMode.PAGUELOFACIL, this.paymentMode.NOQOODY, this.paymentMode.GTBANK, PaymentMode.URWAY, PaymentMode.VUKA, PaymentMode.VPOS, PaymentMode.CXPAY, PaymentMode.PAYKU, PaymentMode.BAMBORA, PaymentMode.PAYWAYONE, PaymentMode.PLACETOPAY];

    this.getPaymentprocessType();
    if (this.paymentProcessType === 2 && !this.payMoney && this.razorPayUrl) {
      return;
    }

    if (!this.selectedPaymentMode) {
      this.languageStrings.pls_select_payment_method = (this.languageStrings.pls_select_payment_method || "Please select Payment Method")
      .replace("PAYMENT_METHOD", this.terminology.PAYMENT_METHOD)
      const msg = this.languageStrings.pls_select_payment_method;
      this.popup.showPopup(MessageType.ERROR, 2000, msg, false);
      return false;
    }

    if (this.selectedPaymentMode.value == this.paymentMode.INNSTAPAY && this.billInfo.NET_PAYABLE_AMOUNT < 10) {
      this.popup.showPopup(MessageType.ERROR, 3000, this.languageStrings.order_amount_less_than_10_ngn || "Order of amount less than 10 NGN can only placed with Pay Via Cash", false);
      return;
    }

    if (payArray.includes(this.selectedPaymentMode.value) && this.billInfo.NET_PAYABLE_AMOUNT > 0 && !this.jobResponse && !this.paymentResponseRecieved) {
      this.openWindowInCenter('', '', 500, 600, 100);
      this.sessionService.paymentWinRef.document.title = 'Payment Process';
      this.sessionService.paymentWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
    }

    // if (this.selectedPaymentMode.value == this.paymentMode.PAYU && this.billInfo.NET_PAYABLE_AMOUNT > 0 && !this.jobResponse && !this.paymentResponseRecieved) {
    //   this.openWindowInCenter('', '', 500, 600, 100);
    //   this.sessionService.payuWinRef.document.title = 'Payment Process';
    //   this.sessionService.payuWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
    // }

    // if(this.selectedPaymentMode.value == this.paymentMode.PAY_MOB && this.billInfo.NET_PAYABLE_AMOUNT > 0 && !this.jobResponse && !this.paymentResponseRecieved){
    //   this.openWindowInCenter('', '', 500,600, 100);
    //   this.sessionService.payMobWinRef.document.title = 'Payment Process';
    //   this.sessionService.payMobWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
    // }
    // if(this.selectedPaymentMode.value == this.paymentMode.WIRE_CARD && this.billInfo.NET_PAYABLE_AMOUNT > 0 && !this.jobResponse && !this.paymentResponseRecieved){
    //   this.openWindowInCenter('', '', 500,600, 100);
    //   this.sessionService.wirecardWinRef.document.title = 'Payment Process';
    //   this.sessionService.wirecardWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
    // }
    // if(this.selectedPaymentMode.value == this.paymentMode.SSL_COMMERZ && this.billInfo.NET_PAYABLE_AMOUNT > 0 && !this.jobResponse && !this.paymentResponseRecieved){
    //   this.openWindowInCenter('', '', 500,600, 100);
    //   this.sessionService.sslCommerzWinRef.document.title = 'Payment Process';
    //   this.sessionService.sslCommerzWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
    // }
    // if(this.selectedPaymentMode.value == this.paymentMode.FAC_3D && this.billInfo.NET_PAYABLE_AMOUNT > 0 && !this.jobResponse && !this.paymentResponseRecieved){
    //   this.openWindowInCenter('', '', 500,600, 100);
    //   this.sessionService.fac3dWinRef.document.title = 'Payment Process';
    //   this.sessionService.fac3dWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
    // }
    // if(this.selectedPaymentMode.value == this.paymentMode.CHECKOUT_COM && this.billInfo.NET_PAYABLE_AMOUNT > 0 && !this.jobResponse && !this.paymentResponseRecieved){
    //   this.openWindowInCenter('', '', 500,600, 100);
    //   this.sessionService.checkoutComWinRef.document.title = 'Payment Process';
    //   this.sessionService.checkoutComWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
    // }
    // if(this.selectedPaymentMode.value == this.paymentMode.HYPERPAY && this.billInfo.NET_PAYABLE_AMOUNT > 0 && !this.jobResponse && !this.paymentResponseRecieved){
    //   this.openWindowInCenter('', '', 500,600, 100);
    //   this.sessionService.hyperPayWinRef.document.title = 'Payment Process';
    //   this.sessionService.hyperPayWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
    // }
    // if (this.selectedPaymentMode.value == this.paymentMode.VIVA && this.billInfo.NET_PAYABLE_AMOUNT > 0 && !this.jobResponse && !this.paymentResponseRecieved) {
    //   this.openWindowInCenter('', '', 500, 600, 100);
    //   this.sessionService.vivaComWinRef.document.title = 'Payment Process';
    //   this.sessionService.vivaComWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
    // }
    // if (this.selectedPaymentMode.value == this.paymentMode.PAYNOW && this.billInfo.NET_PAYABLE_AMOUNT > 0 && !this.jobResponse && !this.paymentResponseRecieved) {
    //   this.openWindowInCenter('', '', 500, 600, 100);
    //   this.sessionService.paynowWinRef.document.title = 'Payment Process';
    //   this.sessionService.paynowWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
    // }
    // if(this.selectedPaymentMode.value == this.paymentMode.AZUL && this.billInfo.NET_PAYABLE_AMOUNT > 0 && !this.jobResponse && !this.paymentResponseRecieved){
    //   this.openWindowInCenter('', '', 500,600, 100);
    //   this.sessionService.azulWinRef.document.title = 'Payment Process';
    //   this.sessionService.azulWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
    // // }
    // if(this.selectedPaymentMode.value == this.paymentMode.CREDIMAX && this.billInfo.NET_PAYABLE_AMOUNT > 0 && !this.jobResponse && !this.paymentResponseRecieved){
    //   this.openWindowInCenter('', '', 500,600, 100);
    //   this.sessionService.credimaxWinRef.document.title = 'Payment Process';
    //   this.sessionService.credimaxWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
    // }
    // if(this.selectedPaymentMode.value == this.paymentMode.MY_FATOORAH && this.billInfo.NET_PAYABLE_AMOUNT > 0 && !this.jobResponse && !this.paymentResponseRecieved){
    //   this.openWindowInCenter('', '', 500,600, 100);
    //   this.sessionService.fatoorahWinRef.document.title = 'Payment Process';
    //   this.sessionService.fatoorahWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
    // }
    // if(this.selectedPaymentMode.value == this.paymentMode.PAYNET && this.billInfo.NET_PAYABLE_AMOUNT > 0 && !this.jobResponse && !this.paymentResponseRecieved){
    //   this.openWindowInCenter('', '', 500,600, 100);
    //   this.sessionService.paynetWinRef.document.title = 'Payment Process';
    //   this.sessionService.paynetWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
    // }
    // if(this.selectedPaymentMode.value == this.paymentMode.TAP && this.billInfo.NET_PAYABLE_AMOUNT > 0 && !this.jobResponse && !this.paymentResponseRecieved){
    //   this.openWindowInCenter('', '', 500,600, 100);
    //   this.sessionService.tapWinRef.document.title = 'Payment Process';
    //   this.sessionService.tapWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
    // }
    // if(this.selectedPaymentMode.value == this.paymentMode.CURLEC && this.billInfo.NET_PAYABLE_AMOUNT > 0 && !this.jobResponse && !this.paymentResponseRecieved){
    //   this.openWindowInCenter('', '', 500,600, 100);
    //   this.sessionService.curlecWinRef.document.title = 'Payment Process';
    //   this.sessionService.curlecWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
    // }
    // if(this.selectedPaymentMode.value == this.paymentMode.WIPAY && this.billInfo.NET_PAYABLE_AMOUNT > 0 && !this.jobResponse && !this.paymentResponseRecieved){
    //   this.openWindowInCenter('', '', 500,600, 100);
    //   this.sessionService.wipayWinRef.document.title = 'Payment Process';
    //   this.sessionService.wipayWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
    // }
    // if(this.selectedPaymentMode.value == this.paymentMode.THETELLER && this.billInfo.NET_PAYABLE_AMOUNT > 0 && !this.jobResponse && !this.paymentResponseRecieved){
    //   this.openWindowInCenter('', '', 500,600, 100);
    //   this.sessionService.thetellerWinRef.document.title = 'Payment Process';
    //   this.sessionService.thetellerWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
    // }
    if (this.selectedPaymentMode.value == this.paymentMode.LIME_LIGHT && this.billInfo.NET_PAYABLE_AMOUNT > 0 && !this.jobResponse && !this.paymentResponseRecieved) {
      this.showPayButton = false;
    }
    if (this.selectedPaymentMode.value == this.paymentMode.TWO_CHECKOUT && this.billInfo.NET_PAYABLE_AMOUNT > 0 && !this.jobResponse && !this.paymentResponseRecieved) {
      this.showPayButton = false;
    }
    // if(this.selectedPaymentMode.value == this.paymentMode.PAYHERE && this.billInfo.NET_PAYABLE_AMOUNT > 0 && !this.jobResponse && !this.paymentResponseRecieved){
    //   this.openWindowInCenter('', '', 500,600, 100);
    //   this.sessionService.payHereWinRef.document.title = 'Payment Process';
    //   this.sessionService.payHereWinRef.document.body.innerHTML = "<h5>Don't close or refresh the payment window .....</h5>";
    // }

    if (this.selectedPaymentMode.value == this.paymentMode.WALLET && this.billInfo.NET_PAYABLE_AMOUNT > this.walletDetails.wallet_balance) {
      this.popup.showPopup(MessageType.ERROR, 3000, "Please add balance in Wallet.", false);
      let balance = this.billInfo.NET_PAYABLE_AMOUNT - this.walletDetails.wallet_balance;
      this.sessionService.set('walletAddMoney', { balance: balance, redirect: 'payment' });
      this.router.navigate(['wallet']);
      return;
    }

    if (!await this.checkPaymentError()) {
      this.loader.hide();
      return;
    }

    if (this.billInfo && this.billInfo.TIP_ENABLE_DISABLE === 1 &&
      this.billInfo.MINIMUM_TIP !== 0
    ) {
      if (this.billInfo.MINIMUM_TIP > 0 && !this.tipAddedTotal) {
        
        const msg = (this.languageStrings.minimum_tip_amount_should_10 || "Minimum Tip amount should be $10.")
        .replace(
          "10",
          this.billInfo.MINIMUM_TIP.toFixed(this.formSettings.decimal_display_precision_point || 2)
        );
        const msg_1 = msg.replace(
          "----",
          this.terminology.TIP
        );
        this.popup.showPopup(MessageType.SUCCESS, 3000, msg_1, false);
        return;
      }
    }

    this.bookingDataAfterValidation(this.stepsArray[3].data[0]);
  }
  /*
  * this is to check the type of payment wheteher post payment, pre payment or auto payment
  * for selectedPayment method
  */
  getPaymentprocessType() {
      this.activePaymentMethod.forEach(element => {
        if(this.selectedPaymentMode.value === element.value) {
          this.paymentProcessType = element.payment_process_type;
          this.post_payment_enable = this.paymentProcessType === 1 ? true: false;
        }
      })
  }


  /**
   * make data for payment after validation errors
   */
  async bookingDataAfterValidation(data) {
    this.loader.show();
    let bookingData = this.makeCreateTaskData(data);
  if (!this.jobResponse) {
      this.fbEventPaymentSelection(this.selectedPaymentMode);
      if(this.paymentProcessType !== 2) {
      this.jobResponse = await this.createTaskApiCall(bookingData);
      } else {
      this.makeRazorpayPayment(bookingData)
        return;
      }
      this.forCheckingPostPaymentMethods(this.jobResponse);
    } else {
      this.afterCreateTaskSuccess(this.jobResponse);
    }
  }
  makeRazorpayPayment(data) {
    this.razorPayService.makeRazorPaypayment(data).subscribe(response => {
      this.loader.hide();
      if (response.status === 200) {
        //this.cardWindowRef = window.open('','',"width=500,height=600,top=100,left=400");
        //this.cardWindowRef.document.title = 'Pay Amount';
        //this.cardWindowRef.location.href = response.data.url + "&domain_name=" + window.location.origin;
        this.razorPayUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(response.data.url + '&domain_name=' + window.location.origin);
        this.payMoney = false;
      } else {

      }
    });

  }
  getContentRazorpay(event) {
    this.onload.emit({data: true});
  }

  /**
   * create payload for booking data
   */
  makeCreateTaskData(data) {
    let obj = {};
    obj['marketplace_reference_id'] = data.marketplace_reference_id;
    obj['tip'] = this.tipAddedTotal ? this.tipAddedTotal.tip : undefined;
    obj['marketplace_user_id'] = data.marketplace_user_id;
    obj['vendor_id'] = data.vendor_id;
    obj['access_token'] = data.access_token;
    obj['currency_id'] = data.currency_id;
    obj['payment_method'] = this.selectedPaymentMode.value;
    obj['amount'] = this.billInfo.NET_PAYABLE_AMOUNT;

    obj['user_id'] = data.user_id;
    obj['AppIP'] = this.sessionService.getString("ip_address");
    obj['loyalty_points'] = this.loyaltyPointsAdded ? this.loyaltyPointsAdded.point : undefined;
    obj['has_delivery'] = data.has_delivery;
    obj['has_pickup'] = data.has_pickup;
    obj['is_scheduled'] = data.is_scheduled;
    obj['job_delivery_address'] = data.job_delivery_address;
    obj['job_delivery_datetime'] = data.job_delivery_datetime;
    obj['job_delivery_email'] = data.job_delivery_email;
    obj['job_delivery_latitude'] = data.job_delivery_latitude;
    obj['job_delivery_longitude'] = data.job_delivery_longitude;
    obj['job_delivery_name'] = data.job_delivery_name;
    obj['job_delivery_phone'] = data.job_delivery_phone;
    obj['job_pickup_address'] = data.job_pickup_address;
    obj['job_pickup_datetime'] = data.job_pickup_datetime;
    obj['job_pickup_email'] = data.job_pickup_email;
    obj['job_pickup_latitude'] = data.job_pickup_latitude;
    obj['job_pickup_longitude'] = data.job_pickup_longitude;
    obj['job_pickup_name'] = data.job_pickup_name;
    obj['job_pickup_phone'] = data.job_pickup_phone;
    obj['job_description'] = data.job_description;
    obj['products'] = data.products;
    obj['reference_id'] = data.reference_id;
    obj['timezone'] = data.timezone;

    //obj['cvv']                                            = '';

    if (this.billInfo.DELIVERY_CHARGES_FORMULA_FIELDS) {
      obj['delivery_charges_formula_fields'] = this.billInfo.DELIVERY_CHARGES_FORMULA_FIELDS;
    }

    if (this.selectedReferralPromo && this.selectedReferralPromo.promo) {
      obj['promo_id'] = this.selectedReferralPromo.promo.toString();
    } else if (this.selectedReferralPromo && this.selectedReferralPromo.promo_code) {
      if (this.checkPromoReferral(this.selectedReferralPromo.promo_code)) {
        obj['promo_id'] = this.selectedReferralPromo.promo.toString();
      } else {
        obj['referral_code'] = this.selectedReferralPromo.promo_code;
      }
    }

    const checkoutTemplate = this.sessionService.getByKey("app", "checkout_template") || [];
    obj["checkout_template"] = JSON.stringify(checkoutTemplate);

    switch (this.selectedPaymentMode.value) {
      case this.paymentMode.STRIPE:
        obj['card_id'] = this.paymentResponseRecieved.card_id;
        break;
      case this.paymentMode.AUTHORIZE_NET:
        obj['card_id'] = this.paymentResponseRecieved.card_id;
        break;
      case this.paymentMode.VISTA:
        obj['card_id'] = this.paymentResponseRecieved.card_id;
        // obj['transaction_id'] = this.paymentResponseRecieved.transaction_id;
        break;
      case this.paymentMode.PAYFORT:
        obj['card_id'] = this.paymentResponseRecieved.card.card_id;
        obj['transaction_id'] = this.paymentResponseRecieved.transaction_id;
        obj['is_payment_done'] = 1;
        break;
      case this.paymentMode.RAZORPAY:
        if (this.paymentProcessType === 0) {
          obj['transaction_id'] = this.paymentResponseRecieved.rzp_payment_id;
          obj['is_payment_done'] = 1;
        } else if(this.paymentProcessType === 1) {
          obj['transaction_id'] = undefined;
          obj['is_payment_done'] = 0;
        } 
        // else {
        //    obj['orderCreationPayload'] = data;
        //    obj['orderCreationPayload'].task_type = 3; // for Laundry it is 3 fixed
        // }
        break;
      case this.paymentMode.FAC:
        obj['card_id'] = this.card_id;
        obj['fac_payment_flow']=PaymentByUsing.USING_FAC;
        break;
      case this.paymentMode.PAYSTACK:

        if (!this.post_payment_enable) {
          obj['transaction_id'] = this.paymentResponseRecieved.transaction_id;
          obj['is_payment_done'] = 1;
        } else {
          obj['transaction_id'] = undefined;
          obj['is_payment_done'] = 0;
        }
        break;
      case this.paymentMode.PAYPAL:

        if (!this.post_payment_enable) {
          obj['transaction_id'] = this.paymentResponseRecieved.transaction_id;
          obj['is_payment_done'] = 1;
        } else {
          obj['transaction_id'] = undefined;
          obj['is_payment_done'] = 0;
        }
        break;

        // TELR
        case this.paymentMode.TELR:

        if (!this.post_payment_enable) {
          obj['transaction_id'] = this.paymentResponseRecieved.transaction_id;
          obj['is_payment_done'] = 1;
        } else {
          obj['transaction_id'] = undefined;
          obj['is_payment_done'] = 0;
        }
        break;

      case this.paymentMode.LIME_LIGHT:
        if (!this.post_payment_enable) {
          obj['transaction_id']                             = this.paymentResponseRecieved.transactionID;
          obj['is_payment_done']                            = 1;
        } else {
          obj['transaction_id']                             = undefined;
          obj['is_payment_done']                            = 0;
        }
        break;
      case this.paymentMode.TWO_CHECKOUT:
        if (!this.post_payment_enable) {
          if(this.paymentResponseRecieved.detail) {
            obj['transaction_id']                             = this.paymentResponseRecieved.detail.detail.transactionID;
            obj['is_payment_done']                            = 1;
          }
        } else {
          obj['transaction_id']                             = undefined;
          obj['is_payment_done']                            = 0;
        }
        break;
      case this.paymentMode.BILLPLZ:

        obj['transaction_id'] = undefined;
        obj['is_payment_done'] = 0;
        break;
          case this.paymentMode.PAYTM_LINK:
            obj['paytm_number']                                 = this.paytmLinkNumber;
            break;
          default:
              if (!this.post_payment_enable) {
                obj['transaction_id']                             = this.paymentResponseRecieved.transactionId ? this.paymentResponseRecieved.transactionId : this.paymentResponseRecieved.transaction_id;
                obj['is_payment_done']                            = 1;
              } else {
                obj['transaction_id']                             = undefined;
                obj['is_payment_done']                            = 0;
              }
              break;
    }


    return obj;
  }

  /**
   * create task api hit
   */
  private createTaskApiCall(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.paymentService.createTask(data).subscribe(response => {
        if (response.status === 200) {
          if(response.data.mapped_pages){
            let thankYouPageHtml = response.data.mapped_pages.find(el => el.type == PageType.THANKYOU);
            thankYouPageHtml = thankYouPageHtml ? thankYouPageHtml.template_data : undefined;
            this.sessionService.thankYouPageHtml = thankYouPageHtml;
            this.sessionService.set('OrderPlacedPage',thankYouPageHtml ? 1: 0);
          }
          resolve(response);
        }
        else {
          this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.order_created_failure, 'Order Created Failure', '', '');
          this.loader.hide();
          this.popup.showPopup(MessageType.ERROR, 3000, response.message, false);
          setTimeout(() => {
            if(response.data.debt_amount > 0){
              this.router.navigate(['/debtAmount']);
          }
          }, 3000);
        }
      });
    })
  }

  /**
   * checking for post payment enable
   */
  forCheckingPostPaymentMethods(response) {

    switch (this.selectedPaymentMode.value) {
      case this.paymentMode.CASH:
        this.afterCreateTaskSuccess(response);
        break;
      case this.paymentMode.PAYTM_LINK:
        this.afterCreateTaskSuccess(response);
        break;
      case this.paymentMode.PAY_LATER:
        this.afterCreateTaskSuccess(response);
        break;
      case this.paymentMode.STRIPE:
        this.afterCreateTaskSuccess(response);
        break;
      case this.paymentMode.AUTHORIZE_NET:
        this.afterCreateTaskSuccess(response);
        break;
      case this.paymentMode.VISTA:
        this.afterCreateTaskSuccess(response);
        break;
      case this.paymentMode.PAYFORT:
        this.afterCreateTaskSuccess(response);
        break;
      case this.paymentMode.FAC:
        this.afterCreateTaskSuccess(response);
        break;

      case this.paymentMode.WALLET:
        this.afterCreateTaskSuccess(response);
        break;
      default:
        if (this.post_payment_enable) {
          this.triggerPayment = {
            job_id: response.data.job_id
          };
          break;
        } else {
          this.afterCreateTaskSuccess(response);
          break;
        }
    }
  }

  /**
   * after task creation success
   */
  afterCreateTaskSuccess(jobResponse) {
    const data = {
      currency: this.currencyData.code,
      value: this.billInfo.NET_PAYABLE_AMOUNT
    };
    const adData = {
      currency: this.currencyData.code,
      value: this.billInfo.NET_PAYABLE_AMOUNT,
      url: window.location.href,
      id: jobResponse ? jobResponse.data.job_id : '',
      type: 'CONVERSION'
    }
    this.fbPixelService.emitEvent('Purchase', data);
    this.googleAdWordsService.loadParticularScript(adData);
    this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.order_created_success, 'Order Created Success', '', Math.round(this.billInfo.NET_PAYABLE_AMOUNT));
    
    this.languageStrings.order_placed_msg = (this.languageStrings.order_placed_msg || "Your Order has been placed.")
    .replace("ORDER_ORDER", this.terminology.ORDER) 
    const msg = this.terminology.ORDER_PLACED || this.languageStrings.order_placed_msg;
    if(this.selectedPaymentMode.value == PaymentMode.STRIPE && jobResponse.data.authentication_required == 1){
      this.makePayment(jobResponse.data, jobResponse.message);
      return;
    }
    this.popup.showPopup(MessageType.SUCCESS, 3000, msg, false);
    this.orderPlacedCartClear();
    this.changeRoute();
  }
  makePayment(data, msg?) {
    this.stripe = Stripe(this.formSettings.stripe_public_key);
    this.loader.show();

    this.stripe.handleCardPayment(
      data.client_secret,
      {
        payment_method: data.payment_method || data.card_token,
      }
    ).then((result) => {
      if (result.error) {
        // this.stripePaymentAuthorize = "initial";
        this.loader.hide();
        this.orderPlacedCartClear();
        this.changeRoute();
        msg= this.languageStrings.order_placed_but_transaction_failed = ( this.languageStrings.order_placed_but_transaction_failed || 'Order has been placed but transaction has failed.')
        .replace("ORDER_ORDER", this.terminology.ORDER) ;
        this.popup.showPopup(MessageType.SUCCESS, 3000, msg, false);
      } else {
        this.loader.hide();
        this.orderPlacedCartClear();
        this.popup.showPopup(MessageType.SUCCESS, 3000, msg, false);
        this.changeRoute();
        // The payment has succeeded. Display a success message.
      }
    });
  }
  /**
   * order placed and cart clear
   */
  orderPlacedCartClear() {
    localStorage.removeItem('tipVal');
    this.messageService.clearCartOnly();
    this.sessionService.removeByChildKey('app', 'cart');
    this.sessionService.removeByChildKey('app', 'category');
    this.sessionService.removeByChildKey('app', 'checkout');
    this.sessionService.removeByChildKey('app', 'payment');
    this.sessionService.removeByChildKey('app', 'customize');
    this.sessionService.removeByChildKey('app', 'cartProduct');
    this.sessionService.removeByChildKey('app', 'checkout_template');
    this.sessionService.remove('sellerArray');
    this.sessionService.remove('tip');
    this.sessionService.remove('laundryCheckoutSteps');
    this.sessionService.remove('laundryCheckoutData');
    this.cartService.cartClearCall();
  }

  /**
   * change route when payment not done
   */
  changeRoute() {
    setTimeout(() => {
      this.loader.hide();
      if ((this.sessionService.get('config').business_model_type === 'ECOM') &&
        (this.sessionService.get('config').nlevel_enabled === 2)) {
        this.router.navigate(['ecom/categories']);
      }
      else if ((this.sessionService.get('config').business_model_type === 'FREELANCER') && this.sessionService.get('config').custom_quotation_enabled) {
        this.router.navigate(['/freelancer']);
      }
      else {
        if (this.sessionService.get('config').is_landing_page_enabled) {
          this.router.navigate(['']);
        } else {
          this.router.navigate(['list']);
        }
      }
    }, 1000);
  }

  /**
   * fb event for payment selection
   */
  fbEventPaymentSelection(method) {
    const data = {
      value: this.billInfo?this.billInfo.NET_PAYABLE_AMOUNT:'',
      currency: this.currencyData?this.currencyData.code:''
    }
    switch (method.value) {
      case this.paymentMode.STRIPE:
        this.fbPixelService.emitEvent('AddPaymentInfo', data);
        break;
      case this.paymentMode.CASH:
   
        this.fbPixelService.emitEvent('AddPaymentInfo', data);
        break;
      case this.paymentMode.PAYTM_LINK:
       
        this.fbPixelService.emitEvent('AddPaymentInfo', data);
        break;
      case this.paymentMode.PAY_LATER:
        this.fbPixelService.emitEvent('AddPaymentInfo', data);
        break;
      case this.paymentMode.PAYTM:
       
        this.fbPixelService.emitEvent('AddPaymentInfo', data);
        break;
      default:
        this.fbPixelService.emitEvent('AddPaymentInfo', data);
        break;
    }
  }


  openWindowInCenter(url, title, w, h, t) {
    // Fixes dual-screen position                         Most browsers      Firefox
    let dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : window.screenX;
    let dualScreenTop = window.screenTop != undefined ? window.screenTop : window.screenY;

    let width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    let height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    let systemZoom = width / window.screen.availWidth;
    let left = (width - w) / 2 / systemZoom + dualScreenLeft
    let top = (height - h) / 2 / systemZoom + dualScreenTop + t;

    let payArray = [PaymentMode.PAY_MOB, PaymentMode.PAYNOW, PaymentMode.SSL_COMMERZ, PaymentMode.FAC_3D, PaymentMode.CHECKOUT_COM, PaymentMode.PAYHERE, PaymentMode.AZUL, PaymentMode.CREDIMAX, PaymentMode.MY_FATOORAH, PaymentMode.THETELLER, PaymentMode.PAYNET, PaymentMode.TAP, PaymentMode.CURLEC, PaymentMode.WIPAY, PaymentMode.PAGAR, PaymentMode.WHOOSH, PaymentMode.PAYU,PaymentMode.MTN, PaymentMode.WECHAT,PaymentMode.ONEPAY,PaymentMode.PAGOPLUX,PaymentMode.MYBILLPAYMENT, PaymentMode.VALITOR, PaymentMode.TRUEVO, PaymentMode.PAYZEN, PaymentMode.FIRSTDATA, PaymentMode.BANKOPEN, PaymentMode.SQUARE, PaymentMode.ETISALAT, PaymentMode.SUNCASH, PaymentMode.GOCARDLESS, PaymentMode.ATH, PaymentMode.IPAY88, PaymentMode.PROXYPAY, PaymentMode.CYBERSOURCE, PaymentMode.ALFALAH, PaymentMode.CULQI, PaymentMode.NMI, PaymentMode.FLUTTERWAVE, PaymentMode.MPESA, PaymentMode.ADYEN, PaymentMode.PAYMARK, PaymentMode.HYPUR, PaymentMode.PAYTMV3, PaymentMode.PIXELPAY, PaymentMode.DOKU, PaymentMode.PEACH, PaymentMode.PAGUELOFACIL, PaymentMode.NOQOODY, PaymentMode.GTBANK, PaymentMode.URWAY, PaymentMode.VUKA, PaymentMode.VPOS, PaymentMode.CXPAY, PaymentMode.PAYKU, PaymentMode.BAMBORA, PaymentMode.PAYWAYONE, PaymentMode.PLACETOPAY]

    if (payArray.includes(this.selectedPaymentMode.value)) {
      this.sessionService.paymentWinRef = window.open(url, '', 'scrollbars=yes, width=' + w / systemZoom + ', height=' + h / systemZoom + ', top=' + top + ', left=' + left);
      if (window.focus) this.sessionService.paymentWinRef.focus();
    }

    if (this.selectedPaymentMode.value == this.paymentMode.HYPERPAY) {
      // if (this.formSettings.payment_settings[0].code === 'SAR') {
        this.sessionService.paymentWinRef = window.open(url, '', 'scrollbars=yes, width=' + w / systemZoom + ', height=' + h / systemZoom + ', top=' + top + ', left=' + left);
        if (window.focus) this.sessionService.paymentWinRef.focus();
      
      // else this.popup.showPopup(MessageType.ERROR, 3000, 'Currency not supported', false);
    }

    if (this.selectedPaymentMode.value == this.paymentMode.VIVA) {
      // if (this.formSettings.payment_settings[0].code === 'EUR') {
      this.sessionService.paymentWinRef = window.open(url, '', 'scrollbars=yes, width=' + w / systemZoom + ', height=' + h / systemZoom + ', top=' + top + ', left=' + left);
      if (window.focus) this.sessionService.paymentWinRef.focus();
      // }
      // else this.popup.showPopup(MessageType.ERROR, 3000, 'Currency not supported', false);

    }
    // if (this.selectedPaymentMode.value == this.paymentMode.PAYHERE) {
    //   this.sessionService.payHereWinRef = window.open(url, '', 'scrollbars=yes, width=' + w / systemZoom + ', height=' + h / systemZoom + ', top=' + top + ', left=' + left);
    //   if (window.focus) this.sessionService.payHereWinRef.focus();
    // }
    // if (this.selectedPaymentMode.value == this.paymentMode.AZUL) {
    //   this.sessionService.azulWinRef = window.open(url, '', 'scrollbars=yes, width=' + w / systemZoom + ', height=' + h / systemZoom + ', top=' + top + ', left=' + left);
    //   if (window.focus) this.sessionService.azulWinRef.focus();
    // }
    // if (this.selectedPaymentMode.value == this.paymentMode.CREDIMAX) {
    //   this.sessionService.credimaxWinRef = window.open(url, '', 'scrollbars=yes, width=' + w / systemZoom + ', height=' + h / systemZoom + ', top=' + top + ', left=' + left);
    //   if (window.focus) this.sessionService.credimaxWinRef.focus();
    // }
    // if (this.selectedPaymentMode.value == this.paymentMode.MY_FATOORAH) {
    //   this.sessionService.fatoorahWinRef = window.open(url, '', 'scrollbars=yes, width=' + w / systemZoom + ', height=' + h / systemZoom + ', top=' + top + ', left=' + left);
    //   if (window.focus) this.sessionService.fatoorahWinRef.focus();
    // }
    // if (this.selectedPaymentMode.value == this.paymentMode.PAYNET) {
    //   this.sessionService.paynetWinRef = window.open(url, '', 'scrollbars=yes, width=' + w / systemZoom + ', height=' + h / systemZoom + ', top=' + top + ', left=' + left);
    //   if (window.focus) this.sessionService.paynetWinRef.focus();
    // }
    // if (this.selectedPaymentMode.value == this.paymentMode.TAP) {
    //   this.sessionService.tapWinRef = window.open(url, '', 'scrollbars=yes, width=' + w / systemZoom + ', height=' + h / systemZoom + ', top=' + top + ', left=' + left);
    //   if (window.focus) this.sessionService.tapWinRef.focus();
    // }
    // if (this.selectedPaymentMode.value == this.paymentMode.THETELLER) {
    //   this.sessionService.thetellerWinRef = window.open(url, '', 'scrollbars=yes, width=' + w / systemZoom + ', height=' + h / systemZoom + ', top=' + top + ', left=' + left);
    //   if (window.focus) this.sessionService.thetellerWinRef.focus();
    // }
    // if (this.selectedPaymentMode.value == this.paymentMode.CURLEC) {
    //   this.sessionService.curlecWinRef = window.open(url, '', 'scrollbars=yes, width=' + w / systemZoom + ', height=' + h / systemZoom + ', top=' + top + ', left=' + left);
    //   if (window.focus) this.sessionService.curlecWinRef.focus();
    // }
    // if (this.selectedPaymentMode.value == this.paymentMode.WIPAY) {
    //   this.sessionService.wipayWinRef = window.open(url, '', 'scrollbars=yes, width=' + w / systemZoom + ', height=' + h / systemZoom + ', top=' + top + ', left=' + left);
    //   if (window.focus) this.sessionService.wipayWinRef.focus();
    // }

    // Puts focus on the newWindow
  }

  /**
   * get wallet details
   */
  getWalletDetails() {
    const data = {
      marketplace_user_id: this.formSettings.marketplace_user_id,
      need_balance_only: 1
    };
    if (this.sessionService.get('appData')) {
      data['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      data['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    this.paymentService.getWalletBalance(data).subscribe(response => {
      if (response.status === 200) {

        this.walletDetails = response.data;
      } else {
        this.walletDetails = {};
      }
    });
  }
  successRazorpayTransaction(data) {
    let msg = 'payment Successful';
    this.popup.showPopup(MessageType.SUCCESS, 3000, msg, false);
    setTimeout(() => {
      this.razorPayUrl = ''
      this.orderPlacedCartClear();
      this.changeRoute();
    } , 3000);

  }
  close3dver() {
    setTimeout(() => {
    this.razorPayUrl = '';
  } , 3000);
}

}
