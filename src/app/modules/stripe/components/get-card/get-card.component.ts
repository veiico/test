/**
 * Created by mba-214 on 02/11/18.
 */
import { Component, OnInit, Input, EventEmitter, Output, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { AppService } from '../../../../app.service';
import { SessionService } from '../../../../services/session.service';

@Component({
  selector: 'app-stripe-card-list',
  templateUrl: './get-card.component.html',
  styleUrls: ['./get-card.component.scss']
})
export class StripeCardListComponent implements OnInit, AfterViewInit, OnDestroy {

  languageStrings: any={};
  public config: any;
  public terminology: any;
  public langJson: any;
  public languageSelected: string;
  public direction: string;
  public loginData: any;

  @Input() cardList: any;
  @Input() showDeleteButton: any;
  @Output() paymentMade: any = new EventEmitter();
  @Output() deleteCardEvent: any = new EventEmitter();

  constructor(private sessionService: SessionService,
              private appService: AppService) { }

  ngOnInit() {
 
    this.setConfig();
    this.setLanguage();

    if (this.cardList && this.cardList.length) {
      this.setList();
    }
  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {

  }

  /**
   * set list for cards
   */
  setList() {
    this.cardList.forEach((o) => {
      o.selected = false;
    })
  }

  /**
   * set config
   */
  setConfig() {
    this.config = this.sessionService.get('config');
    this.loginData = this.sessionService.get('appData');
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
   * select card
   */
  selectCard(data, index) {
    for (let i = 0; i < this.cardList.length; i++) {
      if (i === index) {
        this.cardList[i].selected = true;
      } else {
        this.cardList[i].selected = false;
      }
    }
    this.paymentMade.emit(data);
  }


  /**
   * delete card from list
   */
  deleteCard(card, index, e) {
    e.stopPropagation();
    this.deleteCardEvent.emit({data: card});
  }
}
