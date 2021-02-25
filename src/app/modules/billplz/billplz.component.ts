/**
 * Created by mba-214 on 02/11/18.
 */
import { Component, OnInit, Input, EventEmitter, Output, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { AppService } from '../../app.service';
import { DomSanitizer } from '../../../../node_modules/@angular/platform-browser';
import { Router } from "@angular/router";

import { LoaderService } from '../../services/loader.service';
import { BillPlzService } from './billplz.service';
import { PopUpService } from '../popup/services/popup.service';
import { PaymentMode, PaymentFor, PageType } from '../../enums/enum';
import { MessageType } from '../../constants/constant';

@Component({
  selector: 'app-billplz',
  templateUrl: './billplz.component.html',
  styleUrls: ['./billplz.component.scss']
})
export class BillPlzComponent implements OnInit, AfterViewInit, OnDestroy {

  public config: any;
  public terminology: any;
  public langJson: any;
  public languageSelected: string;
  public direction: string;
  public billplzPaymentUrl: any;
  public paymentMode = PaymentMode;
  public paymentForEnum = PaymentFor;

  @Input() loginResponse: any;
  @Input() NET_PAYABLE_AMOUNT: number;
  @Input() paymentFor: any;
  @Output() paymentMadeResponse: any = new EventEmitter();
  @Output() onload: any = new EventEmitter();

  private _triggerPayment;
  get triggerPayment() { return this._triggerPayment };
  @Input() set triggerPayment(val: any) {

    if (val) {
      this._triggerPayment = val;
  
      if (this.paymentFor == this.paymentForEnum.WALLET || this.paymentFor == this.paymentForEnum.GIFT_CARD) {
        this.initBillPlzWallet();
      } else {
        this.initBillPlz();
      }
    }
  };

  constructor(private sessionService: SessionService,
              public billPlzService: BillPlzService,
              public domSanitizer: DomSanitizer,
              protected popup: PopUpService,
              public loader: LoaderService,
              public router: Router,
              private appService: AppService) {
    this.setConfig();
    this.setLanguage();
  }

  ngOnInit() {
    this.checkForUrlParam();
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
    this.langJson = this.appService.getLangJsonData();
  }


  /**
   * init fac
   */
  initBillPlz() {
    this.loader.show();
    const data = {
      'vendor_id': this.loginResponse.vendor_details.vendor_id,
      'marketplace_user_id': this.config.marketplace_user_id,
      'user_id': this.sessionService.getString('user_id'),
      // 'domain_name': window.location.origin,
      'access_token': this.loginResponse.vendor_details.app_access_token,
      'amount': this.NET_PAYABLE_AMOUNT,
      'app_type': 'WEB',
      'payment_method': this.paymentMode.BILLPLZ
    };

    if (typeof this._triggerPayment == 'object') {
      data['job_id'] = this._triggerPayment.job_id;
      data['isEditedTask'] = this._triggerPayment.isEditedTask ? 1 :undefined;
      data['payment_for'] = this._triggerPayment.payment_for ? this._triggerPayment.payment_for :undefined;
    }

    this.billPlzService.getBillPlzLink(data).subscribe(response => {
      this.loader.hide();
      if (response.status === 200) {
        this.billplzPaymentUrl = response.data.url;
        window.open(response.data.url, '_self');
        this.onload.emit({data:true});
      } else {
        this.loader.hide();
        this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
      }
    },error=>{
      this.loader.hide();
    });
  }

  /**
   * init billplz wallet
   */
  initBillPlzWallet() {
    this.loader.show();
    const data = {
      'vendor_id': this.loginResponse.vendor_details.vendor_id,
      'marketplace_user_id': this.config.marketplace_user_id,
      'user_id': this.sessionService.getString('user_id'),
      // 'domain_name': window.location.origin,
      'app_access_token': this.loginResponse.vendor_details.app_access_token,
      'access_token': this.loginResponse.vendor_details.app_access_token,
      'amount': this.NET_PAYABLE_AMOUNT,
      'app_type': 'WEB',
      'payment_method': this.paymentMode.BILLPLZ,
      'payment_for': this.paymentFor,
      'currency': this.config.payment_settings[0].code,
      'email': this.loginResponse.vendor_details.email,
      'name': this.loginResponse.vendor_details.first_name,
      'phone': this.loginResponse.vendor_details.phone_no
    };

    if (typeof this._triggerPayment == 'object') {
      data['job_id'] = this._triggerPayment.job_id;
    }

    this.billPlzService.getBillPlzLinkWallet(data).subscribe(response => {
      this.loader.hide();
      if (response.status === 200) {
        this.billplzPaymentUrl = response.data.url;
        window.open(response.data.url, '_self');
        this.onload.emit({data:true});
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
  getContentFac(event) {
    let frame = window.frames;
  }

  /**
   * close iframe
   */
  close3dver() {
    this.billplzPaymentUrl = '';
  }

  /**
   * success payment
   */
  billPlzResponse(data) {
    setTimeout(()=>{
      // this.billplzPaymentUrl = '';
      this.paymentMade(data);
      if (data.status == 'error') {
        this.manupulateBrowserHistory();
        this.changeRouteWithParams();
      }
    },3000);
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

  /**
   * check for url params
   */
  checkForUrlParam() {
    let billUrl = decodeURIComponent(location.href);
    billUrl = billUrl.replace(/ /g, "");

    if (this.getParameterByName("billplz[id]", billUrl) && (this.paymentFor != this.paymentForEnum.WALLET && this.paymentFor != this.paymentForEnum.GIFT_CARD)) {
      const obj = {
        transaction_id: this.getParameterByName("billplz[id]", billUrl),
        marketplace_user_id: this.config.marketplace_user_id,
        vendor_id: this.loginResponse.vendor_details.vendor_id,
        access_token: this.loginResponse.vendor_details.app_access_token,
        user_id: this.sessionService.getString('user_id')
      };
      this.billPlzService.checkBillPlzStatus(obj).subscribe(response => {
          if (response.status === 200) {
            if(response.data.mapped_pages){
              let thankYouPageHtml = response.data.mapped_pages.find(el => el.type == PageType.THANKYOU);
              thankYouPageHtml = thankYouPageHtml ? thankYouPageHtml.template_data : undefined;
              this.sessionService.thankYouPageHtml = thankYouPageHtml;  
              this.sessionService.set('OrderPlacedPage',thankYouPageHtml ? 1: 0);
            }
            this.billPlzResponse({status: 'success', transactionId: this.getParameterByName("billplz[id]", billUrl)})
          } else {
            this.loader.hide();
            this.billPlzResponse({status: 'error'})
          }
        },
        error => {}
      );
    } else if (this.getParameterByName("billplz[id]", billUrl) && (this.paymentFor == this.paymentForEnum.WALLET || this.paymentFor == this.paymentForEnum.GIFT_CARD)) {
    
      this.billPlzResponse({status: 'success', transactionId: this.getParameterByName("billplz[id]", billUrl)})
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
}
