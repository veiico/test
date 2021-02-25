import { MessageType } from './../../../../constants/constant';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router, Route, ActivatedRoute } from "@angular/router";

import { SessionService } from '../../../../services/session.service';
import { LoaderService } from '../../../../services/loader.service';
import { AppService } from '../../../../app.service';
import { ValidationService } from '../../../../services/validation.service';
import { GiftCardService } from '../../gift-card.service';
import { PopUpService } from '../../../../modules/popup/services/popup.service';


@Component({
  selector: 'app-gift-reedem',
  templateUrl: './reedem.component.html',
  styleUrls: ['./reedem.component.scss']
})
export class GiftCardReedemComponent implements OnInit {

  public headerData: any;
  public config: any;
  public loginData: any;
  public terminology: any = {};
  public langJson: any = {};
  public languageSelected: string;
  public direction: string;
  public reedemForm: FormGroup;
  languageStrings: any={};

  constructor(private sessionService: SessionService,
              private loader: LoaderService,
              private fb: FormBuilder,
              private router: Router,
              private giftCardService: GiftCardService,
              public popup: PopUpService,
              public validationService: ValidationService,
              public appService: AppService) {

  }

  ngOnInit() {
    this.headerData = this.sessionService.get('config');
    this.setConfig();
    this.setLanguage();
    this.initForm();
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
    });
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

    this.appService.langPromise.then(() => {
      this.langJson = this.appService.getLangJsonData();
    });
  }

  /**
   * init form
   */
  initForm() {
    this.reedemForm = this.fb.group({
      'code': ['', [Validators.required]]
    })
  }

  /**
   * on submit
   */
  onSubmit() {
    if (!this.reedemForm.valid) {
      return this.validationService.validateAllFormFields(this.reedemForm);
    }

    const obj = {};
    obj['vendor_id'] = this.loginData.vendor_details.vendor_id;
    obj['marketplace_user_id'] = this.loginData.vendor_details.marketplace_user_id;
    obj['user_id'] = this.loginData.vendor_details.marketplace_user_id;
    obj['code'] = this.reedemForm.controls.code.value;
    if (this.sessionService.get('appData')) {
      obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    this.loader.show();
    this.giftCardService.reedemGiftCard(obj).subscribe((response) => {
      this.loader.hide();
      if (response.status === 200) {
        this.popup.showPopup(MessageType.SUCCESS, 2000, response.message, false);
        this.initForm();
      } else {
        this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
      }
    }, error => {
      console.error(error);
    });

  }
}
