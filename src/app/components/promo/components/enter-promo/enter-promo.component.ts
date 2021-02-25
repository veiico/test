/**
 * Created by mba-214 on 24/10/18.
 */
import { Component, Input, OnInit, OnDestroy, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, AbstractControl, FormBuilder, FormControl, Validators } from '@angular/forms';

import { SessionService } from '../../../../services/session.service';
import { AppService } from '../../../../app.service';
import { MessageService } from '../../../../services/message.service';
import { PopUpService } from '../../../../modules/popup/services/popup.service';
import { LoaderService } from '../../../../services/loader.service';
import { ValidationService } from '../../../../services/validation.service';

@Component({
  selector: 'app-promo-enter',
  templateUrl: './enter-promo.component.html',
  styleUrls: ['./enter-promo.component.scss']
})

export class PromoEnterComponent implements OnInit, OnDestroy, AfterViewInit {

  public _list;
  languageStrings: any={};
  get list() { return this._list };
  @Input() set list(val: any) {
    this._list = val;
  };

  @Output() selectedItem: any = new EventEmitter();
  public formSettings: any;
  public terminology: any;
  public langJson: any;
  public languageSelected: string;
  public direction: string;
  public currency: string;
  public promoFrom: FormGroup;
  public selectedPromoReferral;

  constructor(public sessionService: SessionService,
              public appService: AppService,
              public messageService: MessageService,
              protected router: Router,
              protected popup: PopUpService,
              public formBuilder: FormBuilder,
              public validationService: ValidationService,
              protected loader: LoaderService) {
  }


  ngOnInit() {
    this.setConfig();
    this.setLang();
    this.initForm();
  }

  ngOnDestroy() {

  }

  ngAfterViewInit() {

  }

  /**
   * setConfig
   */
  setConfig() {
    this.formSettings = this.sessionService.get('config');
    this.terminology = this.formSettings.terminology;
    this.currency = this.formSettings.payment_settings[0].symbol;
  }

  /**
   * set lang
   */
  setLang() {
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
   * initialize form
   */
  initForm() {
    this.promoFrom = this.formBuilder.group({
      code: ['', [Validators.required]]
    })
  }

  /**
   * submit promo
   */
  submitPromo() {
    if (!this.promoFrom.valid) {
      return this.validationService.validateAllFormFields(this.promoFrom);
    }

    let promo = this.promoFrom.controls.code.value;
    let val = false;

    if (this._list.PROMOS && this._list.PROMOS.length) {
      this._list.PROMOS.forEach((o) => {
        if (promo.toLowerCase() === o.code.toLowerCase()) {
          val = true;
          this.selectedPromoReferral = o.id;
        }
      });
      if (val) {
        this.selectedItem.emit({promo: this.selectedPromoReferral})
      } else {
        this.selectedPromoReferral = promo;
        this.selectedItem.emit({promo_code: this.selectedPromoReferral})
      }
    } else {
      this.selectedPromoReferral = promo;
      this.selectedItem.emit({promo_code: this.selectedPromoReferral})
    }
    this.initForm();
  }

}
