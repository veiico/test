/**
 * Created by mba-214 on 17/11/18.
 */
import { Component, OnInit, Input, EventEmitter, Output, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { AppService } from '../../app.service';
import { AuthorizeNetService } from './authorize-net.service';
import { PopUpService } from '../popup/services/popup.service';
import { PaymentMode } from '../../enums/enum';
import { LoaderService } from '../../services/loader.service';
import { MessageType } from '../../constants/constant';

@Component({
  selector: 'app-authorize-net',
  templateUrl: './authorize-net.component.html',
  styleUrls: ['./authorize-net.component.scss']
})
export class AuthorizeNetComponent implements OnInit, AfterViewInit, OnDestroy {

  languageStrings: any={};
  public config: any;
  public terminology: any;
  public langJson: any;
  public languageSelected: string;
  public direction: string;
  public addCardLink: string;
  public hideIframe: number;
  public secureUrlFrame: any;
  public cardList: any = [];
  public cardWindowRef: any;
  public paymentModes = PaymentMode;

  @Input() paymentFor: any;
  @Input() loginResponse: any;
  @Input() NET_PAYABLE_AMOUNT: any;
  @Input() deleteButton: boolean;
  @Output() paymentMadeResponse: any = new EventEmitter();

  constructor(private sessionService: SessionService,
              protected popup: PopUpService,
              public authorizeNetService: AuthorizeNetService,
              private loader: LoaderService,
              private appService: AppService) {
             
               }
  ngOnInit() {
    this.setConfig();
    this.setLanguage();
    this.fetchCards();

    /**
     * events for authorize-net success and error
     */
    window.onmessage = (event) => {
      if (typeof event.data == "object") {

        if (event.data.status == "add_card_success") {
          this.popup.showPopup(MessageType.SUCCESS, 2000, this.languageStrings.card_added_successfully || "Card successfully added", false);
          this.successEventPayfort();
        }
        if (event.data.status === "add_card_error") {
          this.hideIframe = Math.random();
        }
      }

      if (typeof event.data == "object") {
        if (event.data.name === "successPayment") {
          setTimeout(()=>{
            this.cardWindowRef.close();
          },2000);
          this.successPayfortTransaction(event.data.data);
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
   * get all card list
   */
  fetchCards() {
    this.loader.show();
    const data = {
      payment_method: this.paymentModes.AUTHORIZE_NET,
      marketplace_reference_id: this.config.marketplace_reference_id,
      // marketplace_reference_id: this.sessionService.getString('marketplace_reference_id'),
      marketplace_user_id: this.loginResponse.vendor_details.marketplace_user_id,
    };
    if (this.sessionService.get('appData')) {
      data['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      data['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }

    this.authorizeNetService.getAllCards(data).subscribe(response => {
      this.loader.hide();
      if (response.status === 200) {
        this.cardList = response.data.cards;
        this.addCardLink = response.data.add_card_link;
        // if (this.cardList && this.cardList.length) {
        //   this.cardList.forEach((o) => {
        //     o.cvvCheck = false;
        //   })
        // }
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
   * payment made event in which selected card data present
   */
  paymentMade(data) {
    this.paymentMadeResponse.emit(data);
  }

  /**
   * success event authorize-net
   */
  successEventPayfort() {
    this.fetchCards();
    this.hideIframe = Math.random();
  }

  /**
   * error event authorize-net
   */
  errorEventPayfort() {
    //this.fetchCards();
    this.hideIframe = Math.random();
  }

  /**
   * success authorize-net transaction
   */
  successPayfortTransaction(data) {
    this.hideIframe = Math.random();
    data['card'] = this.secureUrlFrame.card;
    this.paymentMade(data);
  }

  /**
   * 3d url
   */
  secureUrl(data){
    if (data.data){
      this.addCardLink = data.url;
      this.secureUrlFrame = {count: Math.random(), card: data.card};
    } else {
      this.secureUrlFrame = 0;
    }
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

    this.authorizeNetService.removeCard(data).subscribe(response => {
      if (response.status === 200) {
        this.fetchCards();
      } else {
        this.popup.showPopup(MessageType.ERROR, 3000, response.message, false);
      }
    });
  }
}
