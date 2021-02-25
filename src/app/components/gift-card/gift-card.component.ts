import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router, Route, ActivatedRoute } from "@angular/router";

import { AppService } from '../../app.service';
import { LoaderService } from '../../services/loader.service';
import { SessionService } from '../../services/session.service';
import { ModalType, validations } from '../../constants/constant';
import { PaymentMode, PaymentFor, WalletStatus } from '../../enums/enum';
import { ValidationService } from '../../services/validation.service';
import { PopUpService } from '../../modules/popup/services/popup.service';
import { GiftCardService } from './gift-card.service';

@Component({
  selector: 'app-gift-card',
  templateUrl: './gift-card.component.html',
  styleUrls: ['./gift-card.component.scss']
})
export class GiftCardComponent implements OnInit {

  public headerData: any;
  public config: any;
  public loginData: any;
  public terminology: any;
  public languageSelected: string;
  public direction: string;
  public showMode: string = 'BUY';

  constructor(private sessionService: SessionService,
              private loader: LoaderService,
              private giftCardService: GiftCardService,
              private fb: FormBuilder,
              private router: Router,
              public popup: PopUpService,
              private validationService: ValidationService,
              public appService: AppService) {

  }

  ngOnInit() {
    this.headerData = this.sessionService.get('config');
    this.setConfig();
    this.setLanguage();
  }

  /**
   * set config
   */
  setConfig() {
    this.config = this.sessionService.get('config');
    this.loginData = this.sessionService.get('appData');
    if (this.config) {
      this.terminology = this.config.terminology;
    }
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
  }

  /**
   * received mode from button
   */
  sendMode(event) {
    this.showMode = event.data;
  }
}
