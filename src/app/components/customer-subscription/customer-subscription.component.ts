import { MessageType } from './../../constants/constant';
/**
 * Created by mba-214 on 02/11/18.
 */
import { Component, OnDestroy, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { LoaderService } from '../../services/loader.service';
import { SessionService } from '../../services/session.service';
import { AppService } from '../../app.service';
import { CustomerSubscriptionService } from './customer-subscription.service';
import { PopUpService } from '../../modules/popup/services/popup.service';
import { PaymentMode } from '../../enums/enum';


@Component({
  selector: 'app-customer-subscription',
  templateUrl: './customer-subscription.component.html',
  styleUrls: ['./customer-subscription.component.scss']
})

export class CustomerSubscriptionComponent implements OnInit, OnDestroy, AfterViewInit {

  public config: any;
  public terminology: any;
  public langJson: any;
  public languageSelected: any;
  public direction = 'ltr';
  public curreny: string;
  public paymentMethod: number;
  public currenyId: number;
  public subscription: any;
  public payDisabled: boolean;
  public selectedDataFromPayment: any;

  @Input() loginResponse: any;
  @Output() successfullLogin: any = new EventEmitter();
  languageStrings: any={};

  constructor(protected loader: LoaderService,
              protected sessionService: SessionService,
              public router: Router,
              protected popup: PopUpService,
              public customerSubscriptionService: CustomerSubscriptionService,
              protected appService: AppService) {
  }

  ngOnInit() {
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
    });
    this.setConfig();
    this.setLanguage();
    this.initializeVariables();
    if (this.loginResponse) {
      this.filterOutSubscriptionFromResponse();
      this.paymentMethodEnable();
    }
  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {

  }

  /**
   * init variables
   */
  initializeVariables() {
    this.selectedDataFromPayment = {};
    this.payDisabled = true;
    this.paymentMethod = 0;
    this.subscription = {};
  }

  /**
   * set config
   */
  setConfig() {
    this.config = this.sessionService.get('config');
    this.terminology = this.config.terminology;
    this.curreny = this.config.payment_settings[0].symbol;
    this.currenyId = this.config.payment_settings[0].currency_id;
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
    this.appService.langPromise.then(()=>{
    this.langJson = this.appService.getLangJsonData();
    });
  }

  /**
   * filter out subscription plan details from login response
   */
  filterOutSubscriptionFromResponse() {
    this.subscription = this.loginResponse.vendor_details.subscriptionPlan[0];
  }

  /**
   * check which payment method enabled from login response
   */
  paymentMethodEnable() {
    let paymentMethod = this.loginResponse.formSettings[0].payment_methods;
    let findIndex = paymentMethod.findIndex((o) => {
      return o.value !== PaymentMode.CASH && o.enabled;
    })

    if (findIndex > -1) {
      this.paymentMethod = paymentMethod[findIndex].value;
    } else {
      this.paymentMethod = PaymentMode.CASH;
    }


    switch (this.paymentMethod) {
      case 2:
        this.payDisabled = true;
        break;
      default:
        this.payDisabled = false;
        break;
    }
  }

  /**
   * payment response
   */
  paymentMadeResponse(data) {
    if (data) {
      this.selectedDataFromPayment = data;
      this.payDisabled = false;
    }
  }

  /**
   * pay amount
   */
  pay() {

    this.loader.show();
    const obj = {
      marketplace_user_id: this.config.marketplace_user_id,
      plan_amount: this.subscription.plan_amount,
      access_token: this.loginResponse.vendor_details.app_access_token,
      vendor_id: this.loginResponse.vendor_details.vendor_id,
      payment_method: this.paymentMethod,
      currency_id: this.currenyId
    };

    if (this.paymentMethod === 2) {
      //obj['stripe_token'] = this.selectedDataFromPayment.stripe_token;
      obj['card_id'] = this.selectedDataFromPayment.card_id;
    }
    this.customerSubscriptionService.payHit(obj).subscribe(response => {
      if (response.status === 200) {
        this.loader.hide();
        this.popup.showPopup(MessageType.SUCCESS, 2000, response.message, false);
        this.successfullLogin.emit({data: true, loginData: this.loginResponse});
      } else {
        this.loader.hide();
        this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
      }
    });
  }
}
