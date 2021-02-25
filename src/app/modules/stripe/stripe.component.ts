/**
 * Created by mba-214 on 02/11/18.
 */
import { Component, OnInit, Input, EventEmitter, Output, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { AppService } from '../../app.service';
import { StripeService } from './stripe.service';
import { PopUpService } from '../popup/services/popup.service';
import { PaymentFor } from '../../enums/enum';
import { MessageType } from '../../constants/constant';
declare var Stripe: any;

@Component({
  selector: 'app-stripe',
  templateUrl: './stripe.component.html',
  styleUrls: ['./stripe.component.scss']
})
export class StripeComponent implements OnInit, AfterViewInit, OnDestroy {

  languageStrings: any={};
  public config: any;
  public terminology: any;
  public langJson: any;
  public languageSelected: string;
  public direction: string;
  public addCardLink: string;
  public cardList: any = [];
  public paymentForModes = PaymentFor;
  public stripe;
  @Input() loginResponse: any;
  @Input() paymentFor: any;
  @Input() deleteButton: boolean;
  @Input() NET_PAYABLE_AMOUNT: any;
  @Output() paymentMadeResponse: any = new EventEmitter();
  @Output() onload: any = new EventEmitter();

  constructor(private sessionService: SessionService,
              public stripeService: StripeService,
              public popup: PopUpService,
              private appService: AppService) { 
           
              }

  ngOnInit() {
    this.setConfig();
    this.setLanguage();
    this.fetchCards();
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
    this.stripe = Stripe(this.config.stripe_public_key);
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
   * get all card list
   */
  fetchCards() {
    const data = {
      payment_method: 2,
      marketplace_reference_id: this.config.marketplace_reference_id,
      marketplace_user_id: this.loginResponse.vendor_details.marketplace_user_id,
      vendor_id: this.loginResponse.vendor_details.vendor_id,
      access_token: this.loginResponse.vendor_details.app_access_token
    }

    this.stripeService.getAllCards(data).subscribe(response => {
      if (response.status === 200) {
        this.cardList = response.data.cards;
        this.addCardLink = response.data.add_card_link;
      } else {
        this.cardList = [];
        this.addCardLink = '';
      }
      this.onload.emit({data: true});
    });
  }

  /**
   * card added event
   */
  cardAdded(data) {
    this.fetchCards();
  }

  /**
   * payment made event in whhich selected card data present
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
      "payment_method" : 2,
      "payment_for" : this.paymentFor,
      "marketplace_user_id" : this.loginResponse.vendor_details.marketplace_user_id,
      "vendor_id" : this.loginResponse.vendor_details.vendor_id,
      "app_access_token": this.loginResponse.vendor_details.app_access_token,
      "access_token": this.loginResponse.vendor_details.app_access_token,
      "user_id" : this.loginResponse.vendor_details.marketplace_user_id,
      "app_type": "WEB"
    };

    this.stripeService.createCharge(data).subscribe(response => {
      if (response.status === 200){
     
        if (response.status === 200) {
          const obj = {
            card: cardData,
            transaction_id: response.data.transaction_id
          }
          if(response.data.authentication_required == 1){
            this.makePayment(response.data,response.message);
          } else{
            this.paymentMadeResponse.emit(obj);
          }
        }
      } else {
        this.popup.showPopup(MessageType.ERROR, 3000, response.message, false);
      }
    });
  }
/**
  * stripe make paymemt
  */
 makePayment(data, msg) {
  this.stripe.handleCardPayment(
    data.client_secret,
    {
      payment_method: data.payment_method || data.card_token,
    }
  ).then((result) => {
    if (result.error) {
      // this.stripePaymentAuthorize = "initial";
      this.paymentMadeResponse.emit(1);
      this.popup.showPopup(MessageType.SUCCESS, 2000, msg, false);
    } else {
      this.paymentMadeResponse.emit(1);
      this.popup.showPopup(MessageType.SUCCESS, 2000, msg, false);
      // The payment has succeeded. Display a success message.
    }
  });
}
  /**
   * delete card hit
   */
  deleteCard(card) {
    const data = {
      payment_method: 2,
      marketplace_reference_id: this.config.marketplace_reference_id,
      marketplace_user_id: this.loginResponse.vendor_details.marketplace_user_id,
      vendor_id: this.loginResponse.vendor_details.vendor_id,
      access_token: this.loginResponse.vendor_details.app_access_token,
      card_id: card.data.card_id
    };

    this.stripeService.removeCard(data).subscribe(response => {
      if (response.status === 200) {
        this.fetchCards();
      } else {
        this.popup.showPopup(MessageType.ERROR, 3000, response.message, false);
      }
    });
  }
}
