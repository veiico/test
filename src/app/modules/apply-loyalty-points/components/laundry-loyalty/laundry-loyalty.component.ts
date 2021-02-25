import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SessionService } from '../../../../services/session.service';
import { AppService } from '../../../../app.service';
import { MessageService } from '../../../../services/message.service';
import { PopUpService } from '../../../popup/services/popup.service';
import { ValidationService } from '../../../../services/validation.service';
import { LoaderService } from '../../../../services/loader.service';

@Component({
  selector: 'app-laundry-loyalty',
  templateUrl: './laundry-loyalty.component.html',
  styleUrls: ['./laundry-loyalty.component.scss'],
})
export class LaundryLoyaltyComponent implements OnInit {

  languageStrings: any={};
  public _list;
  get list() { return this._list };
  @Input() set list(val: any) {
    this._list = val;
  };

  @Output() enteredPoint: any = new EventEmitter();
  public formSettings: any;
  public terminology: any;
  public langJson: any;
  public languageSelected: string;
  public direction: string;
  public currency: string;
  public loyaltyForm: FormGroup;

  constructor(public sessionService: SessionService,
              public appService: AppService,
              public messageService: MessageService,
              protected popup: PopUpService,
              public formBuilder: FormBuilder,
              public validationService: ValidationService,
              protected loader: LoaderService) {       
  }


  ngOnInit() {
    this.setConfig();
    this.setLang();
    this.initForm();
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
     this.languageStrings.maximum_loyality_you_can_apply = (this.languageStrings.maximum_loyality_you_can_apply || "Maximum loyality point you can apply")
     .replace('LOYALTY_POINTS',this.terminology.LOYALTY_POINTS)
    });
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
  }

  /**
   * initialize form
   */
  initForm() {
    this.loyaltyForm = this.formBuilder.group({
      point: ['', [Validators.required]]
    })
  }

  /**
   * submit promo
   */
  submitLoyalty() {
    if (!this.loyaltyForm.valid) {
      return this.validationService.validateAllFormFields(this.loyaltyForm);
    }

    let point = this.loyaltyForm.controls.point.value;
    this.enteredPoint.emit({point: point});
    this.initForm();
  }

}

