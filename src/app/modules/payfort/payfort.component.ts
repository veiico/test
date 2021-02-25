/**
 * Created by mba-214 on 17/11/18.
 */
import { Component, OnInit, Input, EventEmitter, Output, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { AppService } from '../../app.service';
import { PayfortService } from './payfort.service';
import { PopUpService } from '../popup/services/popup.service';
import { MessageType } from '../../constants/constant';

@Component({
  selector: 'app-payfort',
  templateUrl: './payfort.component.html',
  styleUrls: ['./payfort.component.scss']
})
export class PayfortComponent implements OnInit, AfterViewInit, OnDestroy {

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

  @Input() paymentFor: any;
  @Input() loginResponse: any;
  @Input() NET_PAYABLE_AMOUNT: any;
  @Input() deleteButton: boolean;
  @Output() paymentMadeResponse: any = new EventEmitter();
  @Output() onload: any = new EventEmitter();

  constructor(private sessionService: SessionService,
              protected popup: PopUpService,
              public payfortService: PayfortService,
              private appService: AppService) {
              
               }

  ngOnInit() {
    this.setConfig();
    this.setLanguage();
    this.fetchCards();

    /**
     * events for payfort success and error
     */
    window.onmessage = (event) => {
      if (typeof event.data == "string") {
        if (event.data === "errorAddCard") {
          if(this.cardWindowRef){
            this.cardWindowRef.close();
          }
          this.popup.showPopup(MessageType.ERROR, 2000,this.languageStrings.unable_to_add_card || 'Unable to add card', false);
          this.errorEventPayfort();
        }
        if (event.data === "successAddCard") {
          if(this.cardWindowRef){
            this.cardWindowRef.close();
          }
          this.popup.showPopup(MessageType.SUCCESS, 2000, this.languageStrings.card_added_successfully || "Card successfully added", false);
          this.successEventPayfort();
        }
        if (event.data === "errorPayment") {
          if (this.cardWindowRef) {
            setTimeout(()=>{
              this.cardWindowRef.close();
              this.popup.showPopup(MessageType.ERROR,2000,this.languageStrings.payment_failure || "Payment Failure", false);
            },2000);
          }
          this.hideIframe = Math.random();
        }
      }

      if (typeof event.data == "object") {
        if (event.data.name === "successPayment") {
          setTimeout(()=>{
            this.cardWindowRef.close();
          },2000);
          //thisLocal.transactionIdPayfort = event.data.data.transaction_id;
          this.successPayfortTransaction(event.data) ;
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
    const data = {
      payment_method: 32,
      marketplace_reference_id: this.config.marketplace_reference_id,
      marketplace_user_id: this.loginResponse.vendor_details.marketplace_user_id,
      vendor_id: this.loginResponse.vendor_details.vendor_id,
      access_token: this.loginResponse.vendor_details.app_access_token
    }

    this.payfortService.getAllCards(data).subscribe(response => {
      if (response.status === 200) {
        this.cardList = response.data.cards;
        this.addCardLink = response.data.add_card_link;
        if (this.cardList && this.cardList.length) {
          this.cardList.forEach((o) => {
            o.cvvCheck = false;
          })
        }
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
   * payment made event in which selected card data present
   */
  paymentMade(data) {
    this.paymentMadeResponse.emit(data);
  }

  /**
   * success event payfort
   */
  successEventPayfort() {
    this.fetchCards();
    this.hideIframe = Math.random();
  }

  /**
   * error event payfort
   */
  errorEventPayfort() {
    //this.fetchCards();
    this.hideIframe = Math.random();
  }

  /**
   * success payfort transaction
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
      // this is to make create task hit but settimeout is to get the payfort success response
    //   setTimeout(() => {
    //     this.successPayfortTransaction(data);
    // }, 20000); 


      
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
      payment_method: 32,
      marketplace_reference_id: this.config.marketplace_reference_id,
      marketplace_user_id: this.loginResponse.vendor_details.marketplace_user_id,
      vendor_id: this.loginResponse.vendor_details.vendor_id,
      access_token: this.loginResponse.vendor_details.app_access_token,
      card_id: card.data.card_id
    };

    this.payfortService.removeCard(data).subscribe(response => {
      if (response.status === 200) {
        this.fetchCards();
      } else {
        this.popup.showPopup(MessageType.ERROR, 3000, response.message, false);
      }
    });
  }
}
