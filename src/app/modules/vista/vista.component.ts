/**
 * Created by Ankit on 20/09/19.
 */
import { Component, OnInit, Input, EventEmitter, Output, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { AppService } from '../../app.service';
import { DomSanitizer } from '../../../../node_modules/@angular/platform-browser';
import { Router } from "@angular/router";
import { PopUpService } from '../popup/services/popup.service';
import { PaymentFor, PaymentMode } from './../../enums/enum';
import { VistaService } from './vista.service';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-vista',
  templateUrl: './vista.component.html',
  styleUrls: ['./vista.component.scss']
})
export class VistaComponent implements OnInit, AfterViewInit, OnDestroy {

  languageStrings: any={};
  public config: any;
  public terminology: any;
  public langJson: any;
  public languageSelected: string;
  public direction: string;
  public vistaPaymentUrl: any;
  public cardList: any = [];
  public cardWindowRef: any;
  public addCardLink: string;
  public secureUrlFrame: any;
  public hideIframe: number;
  public paymentModes = PaymentMode;
  public paymentForModes = PaymentFor;

  @Input() paymentFor: any;
  @Input() loginResponse: any;
  @Input() NET_PAYABLE_AMOUNT: number;
  @Input() deleteButton: boolean;
  @Output() paymentMadeResponse: any = new EventEmitter();

  protected _triggerPayment;
  get triggerPayment() { return this._triggerPayment };
  @Input() set triggerPayment(val: any) {
    if (val) {
      this._triggerPayment = val;
      // this.initFac();
      // this.initFacLinkWallet();
    }
  };

  constructor(protected sessionService: SessionService,
              protected popup: PopUpService,
              public vistaService: VistaService,
              public domSanitizer: DomSanitizer,
              public loader: LoaderService,
              public router: Router,
              protected appService: AppService) {
                this.setConfig();
                this.setLanguage();
              }

  ngOnInit() {
 
    this.setConfig();
    this.setLanguage();
    this.fetchCards();
    // this.initFacLinkWallet();
      /**
       * iframe events for success and failure payment
       */
        /**
       * iframe events for vista success and failure payment
     */

    window.onmessage = (event) => {
      if (typeof event.data === "object") {
        if ( event.data.payment_method == PaymentMode.VISTA) {
          if ( event.data.status === 'add_card_success') {
            this.vistaResponse(event.data);
            this.popup.showPopup("success", 2000, this.languageStrings.card_added_successfully || "Card successfully added", false);
          } else {
            this.vistaResponse(event.data);
          }
        }
        if (event.data.status === "add_card_error") {
          this.hideIframe = Math.random();
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
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
    });
  }

  /**
   * payment made event
   */
  paymentMade(data) {

    if (this.paymentFor && this.paymentFor == this.paymentForModes.REWARDS) {
      this.createChargeHit(data);
    } else {
      this.paymentMadeResponse.emit(data);
    }
  }

    /**
   * create charge hit
   */
  createChargeHit(cardData) {

    const data = {
      "card_id" : cardData.card_id,
      "amount" : this.NET_PAYABLE_AMOUNT,
      "payment_method" : 262144,
      "payment_for" : this.paymentFor,
      "marketplace_user_id" : this.loginResponse.vendor_details.marketplace_user_id,
      "vendor_id" : this.loginResponse.vendor_details.vendor_id,
      "app_access_token": this.loginResponse.vendor_details.app_access_token,
      "access_token": this.loginResponse.vendor_details.app_access_token,
      "user_id" : this.loginResponse.vendor_details.marketplace_user_id,
      "app_type": "WEB"
    };

    this.vistaService.createCharge(data).subscribe(response => {
      if (response.status === 200){

        if (response.status === 200) {
          const obj = {
            card: cardData,
            transaction_id: response.data.transaction_id
          }
          this.paymentMadeResponse.emit(obj);
        }
      } else {
        this.popup.showPopup("error", 3000, response.message, false);
      }
    });
  }

  /**
   * iframe content
   */
  getContentVista(event) {
    let frame = window.frames;
  }

  /**
   * close iframe
   */
  close3dver() {
    this.vistaPaymentUrl = '';
  }

  /**
   * success payment
   */
  vistaResponse(data) {
    this.fetchCards();
    this.hideIframe = Math.random();
  }

    /**
   * success authorize-net transaction
   */
  successVistaTransaction(data) {
    this.hideIframe = Math.random();
    data['card'] = this.secureUrlFrame.card;
    this.paymentMade(data);
  }

  /**
   * 3d url
   */
  secureUrl(data) {
    if (data.data) {
      this.addCardLink = data.url;
      this.secureUrlFrame = {count: Math.random(), card: data.card};
    } else {
      this.secureUrlFrame = 0;
    }
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
      if (this._triggerPayment.payment_for  === PaymentFor.REPAYMENT) {
        payment_params['repayment'] = 1;
      }
      if ((this.sessionService.get('config').business_model_type === 'ECOM') &&
        (this.sessionService.get('config').nlevel_enabled === 2)) {
        this.router.navigate(['ecom/categories'], {queryParams: payment_params});
      } else {
        this.router.navigate(['list'], { queryParams: payment_params});
      }
    }, 200);
  }

  /**
   * manupulate bowser history for failed payment
   */
  manupulateBrowserHistory() {
    let domain = window.location.hostname;
    let url = '';
    if ((this.sessionService.get('config').business_model_type === 'ECOM') &&
      (this.sessionService.get('config').nlevel_enabled === 2)) {
      url = 'ecom/categories';
    } else {
      url = 'list';
    }

    if (
      domain === "localhost" ||
      domain === "dev-webapp.yelo.red" ||
      domain === "beta-webapp.yelo.red" ||
      domain === "127.0.0.1" ||
      domain === "dev.yelo.red"
    ) {
      history.replaceState('', '', location.origin + '/' + url + '?payment_status=0' + (this._triggerPayment.payment_for  === PaymentFor.REPAYMENT ? '&repayment=1' : ''));
    } else {
      history.replaceState('', '', location.origin + '/' + this.languageSelected + '/' + url + '?payment_status=0' + (this._triggerPayment.payment_for  === PaymentFor.REPAYMENT ? '&repayment=1' : ''));
    }
  }


    /**
   * get all card list
   */
  fetchCards() {
    console.warn("fetchcards")
    this.loader.show();
    const data = {
      payment_method: this.paymentModes.VISTA,
      marketplace_reference_id: this.sessionService.getString('marketplace_reference_id'),
      marketplace_user_id: this.loginResponse.vendor_details.marketplace_user_id,
      vendor_id: this.loginResponse.vendor_details.vendor_id,
      access_token: this.loginResponse.vendor_details.app_access_token
    };

    this.vistaService.getAllCards(data).subscribe(response => {
      this.loader.hide();
      if (response.status === 200) {
        this.cardList = response.data.cards;
        this.addCardLink = response.data.add_card_link;
      } else {
        this.cardList = [];
        this.addCardLink = '';
      }
    });
  }

  /**
   * card added event
   */
  cardAdded(data) {
    this.fetchCards();
  }

    /**
   * window open refernece
   */
  cardWindowRefOut(data) {
    this.cardWindowRef = data.data;
  }


  /**
   * delete card hit
   */
  deleteCard(card) {
    const data = {
      marketplace_user_id: this.loginResponse.vendor_details.marketplace_user_id.toString(),
      user_id: this.sessionService.get("user_id").toString(),
      is_active: '0',
      access_token: this.loginResponse.vendor_details.app_access_token,
      card_id: card.data.card_id,
      brand: card.data.brand,
      expiry_date: card.data.expiry_date,
      last4_digits: card.data.last4_digits,
      vendor_id: this.loginResponse.vendor_details.vendor_id,
    };

    this.vistaService.removeCard(data).subscribe(response => {
      if (response.status === 200) {
        this.fetchCards();
      } else {
        this.popup.showPopup("error", 3000, response.message, false);
      }
    });
  }
}