/**
 * Created by mba-214 on 17/11/18.
 */
import { Component, OnInit, Input, EventEmitter, Output, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppService } from '../../../../app.service';
import { SessionService } from '../../../../services/session.service';
import { ValidationService } from '../../../../services/validation.service';
import { ModalType, MessageType } from '../../../../constants/constant';
import { PayfortService } from '../../payfort.service';
import { PopUpService } from '../../../popup/services/popup.service';
import { LoaderService } from '../../../../services/loader.service';

@Component({
  selector: 'app-payfort-card-list',
  templateUrl: './get-card.component.html',
  styleUrls: ['./get-card.component.scss']
})
export class PayfortCardListComponent implements OnInit, AfterViewInit, OnDestroy {

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

  constructor(private sessionService: SessionService,
              protected fb: FormBuilder,
              protected popup: PopUpService,
              protected loader: LoaderService,
              public validationService: ValidationService,
              public payfortService: PayfortService,
              private appService: AppService) {
              
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
        this.cardList[i].cvvCheck = true;
      } else {
        this.cardList[i].selected = false;
        this.cardList[i].cvvCheck = false;
      }
    }
    this.initCvvForm();
    //this.paymentMade.emit(data);
  }

  /**
   * init cvv form
   */
  initCvvForm() {
    this.cvvForm = this.fb.group({
      'cvv': ['', Validators.compose([Validators.required, ValidationService.NumberPureValidator])]
    });
  }

  /**
   * submit cvv
   */
  submitCvv(data, e) {
    e.stopPropagation();
    if (!this.cvvForm.valid) {
      return this.validationService.validateAllFormFields(this.cvvForm);
    }

    this.loader.show();
    let index = this.cardList.findIndex((o) => {
      return o.selected;
    })
    let obj = {
      access_token: this.sessionService.get("appData").vendor_details.app_access_token,
      vendor_card_id: this.cardList[index].card_id,
      payment_method: 32,
      cvv: this.cvvForm.controls.cvv.value,
      amount: this.NET_PAYABLE_AMOUNT,
      customer_ip: this.sessionService.getString("ip_address")
      // domain_name: window.location.origin
    };
    this.payfortService.payfortAuth(obj).subscribe(result => {
      this.loader.hide();
      if (!result.data["3ds_url"]) {
        this.popup.showPopup(MessageType.ERROR, 2000, this.langJson["Payment Failure"], false);
        return false;
      }

      this.secureUrl.emit({data: Math.random(), url: result.data["3ds_url"], card: this.cardList[index]});
      //this.payfort3dUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
      //  result.data["3ds_url"]
      //);
      //this.payfort3dUrlBool = true;
    });
  }

  /**
   * delete card from list
   */
  deleteCard(card, index, e) {
    e.stopPropagation();
    this.deleteCardEvent.emit({data: card});
  }
}
