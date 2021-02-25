import { MessageType, PhoneMinMaxValidation, ModalType } from './../../../../constants/constant';
/**
 * Created by mba-214 on 24/10/18.
 */
import { Component, Input, OnInit, OnDestroy, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, AbstractControl, FormBuilder, FormControl, Validators } from '@angular/forms';

import { SessionService } from '../../../../services/session.service';
import { AppService } from '../../../../app.service';
import { MessageService } from '../../../../services/message.service';
import { PopUpService } from '../../../../modules/popup/services/popup.service';
import { LoaderService } from '../../../../services/loader.service';
import { ValidationService } from '../../../../services/validation.service';
import { PaymentMode, PaymentFor } from '../../../../enums/enum';
import { countrySortedList } from '../../../../services/countryCodeList.service';

@Component({
  selector: 'app-enabled-payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.scss']
})

export class PaymentMethodsComponent implements OnInit, OnDestroy, AfterViewInit {


  public _list;
  languageStrings: any={};
  get list() { return this._list };
  @Input() set list(val: any) {
    this._list = val;
  };

  public _hideCash;
  get hideCash() { return this._hideCash };
  @Input() set hideCash(val: any) {
    this._hideCash = val;
  };

  public _hidePaytm;
  get hidePaytm() { return this._hidePaytm };
  @Input() set hidePaytm(val: any) {
    this._hidePaytm = val;
  };

  public _hidePayLater;
  get hidePayLater() { return this._hidePayLater };
  @Input() set hidePayLater(val: any) {
    this._hidePayLater = val;
  };

  public _paymentFor;
  get paymentFor() { return this._paymentFor };
  @Input() set paymentFor(val: any) {
    this._paymentFor = val;
  };

  public _walletDetails;
  get walletDetails() { return this._walletDetails };
  @Input() set walletDetails(val: any) {
    this._walletDetails = val;
  };

  public _triggerPayment;
  get triggerPayment() { return this._triggerPayment };
  @Input() set triggerPayment(val: any) {
    this._triggerPayment = val;
  };

  @Output() selectedMethod: any = new EventEmitter();
  @Output() paymentResponse: any = new EventEmitter();
  @Input() getOrderCreationPayload:any;
  public formSettings: any;
  public terminology: any;
  public langJson: any;
  public languageSelected: string;
  public direction: string;
  public currency: string;
  public loginData: any;
  public enabledPaymentMethods: any = [];
  public filteredPaymentMethods: any = {
    card: [],
    withoutCard: [],
    cash: [],
    wallets: [],
    payLater: [],
    paytm: []
  };
  public paymentMode = PaymentMode;
  public selectedPaymentMode: any;
  public holdPaymentCheck: boolean;
  public showPhoneNumberPopupForPaytm : boolean;
  public paytmNumberForm : FormGroup;
  public country_code : any;
  public phoneCopy : any;
  public countries: any = countrySortedList;
  public paytmLinkNumber : any;
  public modalType = ModalType;
  constructor(public sessionService: SessionService,
              public appService: AppService,
              public messageService: MessageService,
              protected router: Router,
              protected route: ActivatedRoute,
              protected popup: PopUpService,
              public formBuilder: FormBuilder,
              public validationService: ValidationService,
              protected loader: LoaderService) {
  }


  ngOnInit() {
    this.setConfig();
    this.setLang();
    // this.checkForEnabledPaymentMethods();
    this.checkMerchantSpecificGateways();
    //this.checkForUrlParam();
    this.subscriptionForUrlParams();
  }

  ngOnDestroy() {

  }

  ngAfterViewInit() {

  }

  /**
   * setConfig
   */
  setConfig() {
    this.formSettings = this.sessionService.get('config');
    this.loginData = this.sessionService.get('appData');
    this.terminology = this.formSettings.terminology;
    this.currency = this.formSettings.payment_settings[0].symbol;
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
     this.languageStrings.please_confirm_your_mobile_number_to_proceed_your_order_placed_right_away_but_will_be_fulfilled_subject_payment_confirmation = (this.languageStrings.please_confirm_your_mobile_number_to_proceed_your_order_placed_right_away_but_will_be_fulfilled_subject_payment_confirmation || "Please confirm your mobile number to proceed. Your ORDER_ORDER will be placed right away, but will be fulfilled subject to payment confirmation.")
     .replace("ORDER_ORDER", this.terminology.ORDER);
    });
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
    this.appService.langPromise.then(()=>{
      this.langJson = this.appService.getLangJsonData();
      this.languageStrings.pls_choose_cash_for_0_amt = (this.languageStrings.pls_choose_cash_for_0_amt || "Please choose cash for 0 amount order.")
      .replace("ORDER_ORDER", this.terminology.ORDER);
    });
  }

  /**
   * check for enabled payment methods
   */
  checkForEnabledPaymentMethods() {
    let method = this.loginData.formSettings;
    for (let i = 0; i < method[0].payment_methods.length; i++) {
      //method[0].payment_methods[i].enabled = true;
      //method[0].payment_methods[i].enabled = method[0].payment_methods[i].value == 32 ? true : method[0].payment_methods[i].enabled;
      if (method[0].payment_methods[i].enabled) {
        method[0].payment_methods[i].selected = false;
        this.enabledPaymentMethods.push(method[0].payment_methods[i]);
      }
    }
    this.filterOutPaymentMethods(this.enabledPaymentMethods);
  }

  /**
   * filter out payment methods according to add card and without add card
   */
  filterOutPaymentMethods(methods) {
    for (var i = 0; i < this.enabledPaymentMethods.length; i++) {
      switch (this.enabledPaymentMethods[i].value) {
        case this.paymentMode.STRIPE:
          this.filteredPaymentMethods.card.push(this.enabledPaymentMethods[i]);
          break;
        case this.paymentMode.CASH:
          this.filteredPaymentMethods.cash.push(this.enabledPaymentMethods[i]);
          break;
        case this.paymentMode.PAYFORT:
          this.filteredPaymentMethods.card.push(this.enabledPaymentMethods[i]);
          break;
        case this.paymentMode.AUTHORIZE_NET:
          this.filteredPaymentMethods.card.push(this.enabledPaymentMethods[i]);
          break;
        case this.paymentMode.VISTA:
          this.filteredPaymentMethods.card.push(this.enabledPaymentMethods[i]);
          break;
        case this.paymentMode.PAYTM:
          this.filteredPaymentMethods.wallets.push(this.enabledPaymentMethods[i]);
          break;
        case this.paymentMode.WALLET:
          this.filteredPaymentMethods.wallets.push(this.enabledPaymentMethods[i]);
          break;
        case this.paymentMode.FAC:
          this.filteredPaymentMethods.card.push(this.enabledPaymentMethods[i]);
          break;
        case this.paymentMode.PAY_LATER:
          this.filteredPaymentMethods.payLater.push(this.enabledPaymentMethods[i]);
          break;
        case this.paymentMode.PAYTM_LINK:
          this.filteredPaymentMethods.paytm.push(this.enabledPaymentMethods[i]);
          break;
        case this.paymentMode.BHARATPE:
          break;
        default:
          this.filteredPaymentMethods.withoutCard.push(this.enabledPaymentMethods[i]);
          break;
      }
    }
  } 

  /**
   * select payment method
   */
  selectPaymentMethod(i, type) { 
    const isCashActive = this.filteredPaymentMethods['cash'] && this.filteredPaymentMethods['cash'].length;
    const isPayLaterActive = this.filteredPaymentMethods['payLater'] && this.filteredPaymentMethods['payLater'].length;
    if (this._list.NET_PAYABLE_AMOUNT === 0 &&
        this.filteredPaymentMethods[type][i].value !== this.paymentMode.CASH &&
        this.filteredPaymentMethods[type][i].value !== this.paymentMode.PAY_LATER &&
        (isCashActive || isPayLaterActive) &&
        !this.formSettings.is_hold_amount_active) {
          if (isCashActive && isPayLaterActive) {
            const message = (this.languageStrings.please_choose_cash_or_paylater_for_0_amount_order || 'Please choose cash or paylater for 0 amount order.')
            .replace("PAY_LATER", this.terminology.PAY_LATER || 'pay later');
            this.popup.showPopup(MessageType.ERROR, 3000, message, false);
          } else if (isCashActive) {
            this.popup.showPopup(MessageType.ERROR, 3000, this.languageStrings.pls_choose_cash_for_0_amt || 'Please choose cash for 0 amount order.', false);
          } else if (isPayLaterActive) {
            const message = (this.languageStrings.please_choose_cash_or_paylater_for_0_amount_order || 'Please choose paylater for 0 amount order.')
            .replace("PAY_LATER", this.terminology.PAY_LATER || 'pay later');
            this.popup.showPopup(MessageType.ERROR, 3000, message, false);
          } else {}
      return;
    } else if (this._list.NET_PAYABLE_AMOUNT === 0 &&
      this.filteredPaymentMethods[type][i].value !== this.paymentMode.CASH &&
      this.filteredPaymentMethods[type][i].value !== this.paymentMode.PAY_LATER &&
      this.filteredPaymentMethods['cash'] &&
      this.filteredPaymentMethods['cash'].length === 0 &&
      !this.formSettings.is_hold_amount_active) {
      this.filteredPaymentMethods[type][i].selected = true;
      this.selectedPaymentMode = {
        enabled: 1,
        selected: true,
        value: 8
      };
      this.selectedMethod.emit(this.selectedPaymentMode);
      this.paymentResponse.emit('');
      return;
    }
    this.triggerPayment = '';
    this.filteredPaymentMethods[type][i].selected = true;
 
    this.removePaymentMethod(i, type);

    if (this.filteredPaymentMethods[type][i].value === this.paymentMode.PAYFORT && this._list.HOLD_PAYMENT) {
      this.holdPaymentCheck = true;
    } else {
      this.holdPaymentCheck = false;
    }

    if (this.filteredPaymentMethods[type][i].value === this.paymentMode.STRIPE && this._list.HOLD_PAYMENT) {
      this.holdPaymentCheck = true;
    } else {
      this.holdPaymentCheck = false;
    }
  }

  /**
   * remove payment method
   */
  removePaymentMethod(i, type) {
    for (let key in this.filteredPaymentMethods) {
      if (this.filteredPaymentMethods[key] && this.filteredPaymentMethods[key].length) {
        this.filteredPaymentMethods[key].forEach((o, index) => {
          if (index == i && key == type) {
            o.selected = true;
            this.selectedPaymentMode = this.filteredPaymentMethods[key][i];
          } else {
            o.selected = false;
          }
        })
      }
    }
    if(this.selectedPaymentMode.value == this.paymentMode.PAYTM_LINK){
      this.showPhoneNumberPopupForPaytm = true;
      this.initPaytmPhoneNumberForm();
    }

    this.selectedMethod.emit(this.selectedPaymentMode);
    this.paymentResponse.emit('');
  }

  /**
   * response from card payment methods when card get selected
   */
  addCardResponse(data) {
    this.paymentResponse.emit({response: data});
  }

  /**
   * subscribe url params
   */
  subscriptionForUrlParams() {
    this.route.queryParams.subscribe((response) => {
  
      if (response && response['billplz[id]']) {
        let index = this.filteredPaymentMethods.withoutCard.findIndex((o) => {
          return o.value === this.paymentMode.BILLPLZ;
        });
        if (index > -1) {
          this.filteredPaymentMethods.withoutCard[index].selected = true;
          this.selectPaymentMethod(index, 'withoutCard');
        }
      }
    })
  }

  /**
   * got it event for payment hold
   */
  gotItEvent(event) {

    this.holdPaymentCheck = false;
  }


  //checkForUrlParam() {
  //  let billUrl = decodeURIComponent(location.href);
  //  billUrl = billUrl.replace(/ /g, "");
  //  if (this.getParameterByName("billplz[id]", billUrl)) {
  //    let index = this.filteredPaymentMethods.withoutCard.findIndex((o) => {
  //      return o.value === this.paymentMode.BILLPLZ;
  //    });
  //    if (index > -1) {
  //      this.filteredPaymentMethods.withoutCard[index].selected = true;
  //      this.selectPaymentMethod(index, 'withoutCard');
  //    }
  //  }
  //}

  ///**
  // * extract params from url
  // * @param name
  // * @param url
  // * @returns {any}
  // */
  //getParameterByName(name, url) {
  //  if (!url) {
  //    url = window.location.href;
  //  }
  //  name = name.replace(/[\[\]]/g, "\\$&");
  //  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
  //    results = regex.exec(url);
  //  if (!results) {
  //    return null;
  //  }
  //  if (!results[2]) {
  //    return "";
  //  }
  //  return decodeURIComponent(results[2].replace(/\+/g, " "));
  //}

  checkMerchantSpecificGateways() {
    let method = [];
    let marketplace_user_id = this.loginData.vendor_details.marketplace_user_id;
    let merchnat_id = this.sessionService.get('user_id');
    if ((this.formSettings.merchant_select_payment_method || this.formSettings.is_multi_currency_enabled) &&
      merchnat_id != marketplace_user_id && (!+this._paymentFor || this.paymentFor == PaymentFor.REPAYMENT)) {
      if (this.sessionService.get("info") && this.sessionService.get("info").payment_methods) {
        let merchant_payment = this.sessionService.get("info").payment_methods;
        if (merchant_payment && merchant_payment.length) {
          method = this.checkCustomerMethodsOverride(merchant_payment)
          for (let i = 0; i < method.length; i++) {
            if (method[i].enabled) {
              method[i].selected = false;
              this.enabledPaymentMethods.push(method[i]);
            }
          }
          this.filterOutPaymentMethods(this.enabledPaymentMethods);
        } else {
          this.checkForEnabledPaymentMethods();
        }
      } else {
        this.checkForEnabledPaymentMethods();
      }
    } else {
      this.checkForEnabledPaymentMethods();
    }

  }

  checkCustomerMethodsOverride(methodsArray): any[] {

    methodsArray.forEach((res) => {
      if (res.value == PaymentMode.CASH && !res.enabled && this.loginData.vendor_details.vendor_cash_tag_enabled) {
        res.enabled = 1;
      }
      if (res.value == PaymentMode.PAY_LATER && !res.enabled && this.loginData.vendor_details.vendor_paylater_tag_enabled) {
        res.enabled = 1;
      }
    })

    return methodsArray
  }
  initPaytmPhoneNumberForm(){
    this.paytmNumberForm = this.formBuilder.group({
      'phone_number' : ['',[Validators.minLength(PhoneMinMaxValidation.MIN_LENGTH),
        Validators.maxLength(PhoneMinMaxValidation.MAX_LENGTH)]]
    })
    if(!this.paytmLinkNumber){
      let data = JSON.parse(JSON.stringify(this.sessionService.get('appData').vendor_details));
      this.phoneNumberCheck(data.phone_no);
    }
    else{
      this.phoneNumberCheck(this.paytmLinkNumber);
    }
    this.messageService.emitNumberForPaytm.next(this.paytmLinkNumber);
  }
  hidePaytmPhoneNumberPopup(){
    this.showPhoneNumberPopupForPaytm = false;
  }
  savePaytmNumber(){
    this.showPhoneNumberPopupForPaytm = false;
    this.paytmLinkNumber = this.paytmNumberForm.controls.phone_number.value ? '+' + this.country_code + ' ' + this.paytmNumberForm.controls.phone_number.value : '';
    this.messageService.emitNumberForPaytm.next(this.paytmLinkNumber);
  }
  phoneNumberCheck(phone_no) {
    const phone = phone_no.trim();
    if (phone.indexOf(' ') > -1) {
      this.phoneCopy = phone.split(' ')[1];
      this.paytmNumberForm.controls.phone_number.setValue(this.phoneCopy);
      this.country_code = phone.split(' ')[0].split('+')[1];
    } else {
      for (let i = 0; i < this.countries.length; i++) {
        if (phone.indexOf(this.countries[i]) > -1) {
          const m = phone.slice(this.countries[i].length, phone.length);
          if (this.countries[i] === '+1' && m.length === 10) {
            this.phoneCopy = m;
            this.paytmNumberForm.controls.phone_number.setValue(this.phoneCopy);
            this.country_code = this.countries[i].split('+')[1];
            return;
          } else if (this.countries[i] !== '+1') {
            this.phoneCopy = m;
            this.paytmNumberForm.controls.phone_number.setValue(this.phoneCopy);
            this.country_code = this.countries[i].split('+')[1];
            return;
          }
        } else {
          this.phoneCopy = phone.split(' ')[1];
          this.paytmNumberForm.controls.phone_number.setValue(this.phoneCopy);
          this.country_code = phone.split(' ')[0].split('+')[1];
        }
      }
    }
  }
}
