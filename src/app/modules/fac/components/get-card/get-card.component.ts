/**
 * Created by mba-214 on 17/11/18.
 */
import { Component, OnInit, Input, EventEmitter, Output, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppService } from '../../../../app.service';
import { SessionService } from '../../../../services/session.service';
import { ValidationService } from '../../../../services/validation.service';
import { ModalType } from '../../../../constants/constant';
import { FacService } from '../../fac.service';
import { PopUpService } from '../../../popup/services/popup.service';
import { LoaderService } from '../../../../services/loader.service';
import { MessageService } from '../../../../services/message.service';


@Component({
  selector: 'app-fac-card-list',
  templateUrl: './get-card.component.html',
  styleUrls: ['./get-card.component.scss']
})
export class FacCardListComponent implements OnInit, AfterViewInit, OnDestroy {

  languageStrings: any={};
  public config: any;
  public terminology: any;
  public langJson: any;
  public languageSelected: string;
  public direction: string;
  public cvvForm: FormGroup;
 
  public modalType: ModalType = ModalType;

  @Input() cardList: any;
  @Input() NET_PAYABLE_AMOUNT: any;
  @Input() showDeleteButton: any;
  @Output() paymentMade: any = new EventEmitter();
  @Output() secureUrl: any = new EventEmitter();
  @Output() deleteCardEvent: any = new EventEmitter();
 
  

  constructor(protected sessionService: SessionService,
              protected fb: FormBuilder,
              protected popup: PopUpService,
              protected loader: LoaderService,
              public validationService: ValidationService,
              public facService: FacService,
              protected appService: AppService,
              protected messageService:MessageService) {
                
               }

  ngOnInit() {
    this.setConfig();
    this.setLanguage();

    if (this.cardList && this.cardList.length) {
      this.setList();
    }
  }

  ngAfterViewInit() {

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
  selectCard(data, index, e) {
    
   for (let i = 0; i < this.cardList.length; i++) {
      if (i === index) {
        this.cardList[i].selected = true;
      } else {
        this.cardList[i].selected = false;
      }
    }
    this.messageService.emitCvvForFAC.next(data.card_id);
  }
 
  /**
   * submit cvv
   */
  // cvvFacPaySubmit() {
  //   this.faccvvmodal=false;
  //   let index = this.cardList.findIndex((o) => {
  //     return o.selected;
  //   })
  //   const obj=
  //   {
  //     'cvv':this.cvvFac,
  //     'card_id':this.cardList[index].card_id
  //   }
  // //   this.messageService.emitCvvForFAC.next(obj);
  // //  this.cvvFac="";
  // }
  // hideFacCvvPopup()
  // {
  //   this.faccvvmodal=false;
  // }
 
 /**
   * delete card from list
   */
  deleteCard(card, index, e) {
    e.stopPropagation();
    this.deleteCardEvent.emit({data: card});
  }
  ngOnDestroy() {

  }
}
