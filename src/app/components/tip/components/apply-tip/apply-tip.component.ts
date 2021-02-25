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
import { MessageType } from '../../../../constants/constant';

@Component({
  selector: 'app-tip',
  templateUrl: './apply-tip.component.html',
  styleUrls: ['./apply-tip.component.scss']
})

export class ApplyTipComponent implements OnInit, OnDestroy, AfterViewInit {

  public _list;
  paymentInfo: any;
  languageStrings: any={};
  get list() { return this._list };
  @Input() set list(val: any) {
    this._list = val;
  };

  @Output() enteredTip: any = new EventEmitter();
  public formSettings: any;
  public terminology: any = {};
  public langJson: any = {};
  public languageSelected: string;
  public direction: string;
  public currency: string;
  public tipForm: FormGroup;
  public tip;
  public selectedIndex;
  tipType: number;

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
    this.setDefaultTip();
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
    this.paymentInfo = Object.assign(
      {},
      this.sessionService.getByKey("app", "payment")
    );
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
    this.tipForm = this.formBuilder.group({
      tip: ['', [Validators.required]]
    })
  }

  /**
   * submit tip
   */
  submitTip() {
    if (!this.tipForm.valid) {
      return this.validationService.validateAllFormFields(this.tipForm);
    }

    //let tip = this.tipForm.controls.tip.value;
    //this.enteredTip.emit({promo_code: tip});
    this.makeTipHit(this.tipForm);
    //this.initForm();
  }

  /**
   * set default tip
   */
  setDefaultTip() {
    if (
      this.paymentInfo['bill'] && this.paymentInfo['bill'].TIP_ENABLE_DISABLE == 1 &&
      this.formSettings.enable_default_tip === 1 &&
      !this.paymentInfo['bill'].MINIMUM_TIP
    ) {
      this.applyAutoTip();
      localStorage.setItem("tipVal", this.tip);
      this.tipForm.controls.tip.setValue(this.tip);
      this.enteredTip.emit({tip: this.tip, tip_type: 2});
      return;
    }

    if (
      this.paymentInfo['bill'] && this.paymentInfo['bill'].TIP_ENABLE_DISABLE === 1 &&
      this.paymentInfo['bill'].MINIMUM_TIP_TYPE === 2 
    ) {
      localStorage.setItem(
        "tipVal",
        JSON.stringify(this.paymentInfo['bill'].MINIMUM_TIP)
      );
    } else if (
      this.paymentInfo['bill'] && this.paymentInfo['bill'].TIP_ENABLE_DISABLE === 1 &&
      this.paymentInfo['bill'].MINIMUM_TIP_TYPE === 1 
    ) {
      let amounTip = this.paymentInfo['bill'].MINIMUM_TIP;
      localStorage.setItem("tipVal", amounTip);
    }
    if (localStorage.getItem("tipVal")) {
      this.tip = localStorage.getItem("tipVal");
      this.tipForm.controls.tip.setValue(this.tip);
      this.enteredTip.emit({tip: this.tip, tip_type: 2});
    }
  }

  /**
   * apply auto tip
   */
  applyAutoTip() {
    let sum, avg;
    //this.userPaymentData = this.sessionService.getByKey("app", "payment")[
    //  "bill"
    //  ];
    //this.userPaymentData = Object.assign(
    //  this.userPaymentData || {},
    //  this.paymentInfo
    //);
    if (this._list && this._list.TIP_OPTION_LIST && this._list.TIP_OPTION_LIST.length) {
      if (this._list.TIP_OPTION_LIST.length) {
        sum = this._list.TIP_OPTION_LIST.reduce(function(a, b) {
          return b.value + a;
        }, 0);
        avg = sum / this._list.TIP_OPTION_LIST.length;
      }
      let temp = { value: 0 };
      for (const index in this._list.TIP_OPTION_LIST) {
        if (
          avg >= this._list.TIP_OPTION_LIST[index].value &&
          temp.value < this._list.TIP_OPTION_LIST[index].value
        ) {
          temp = this._list.TIP_OPTION_LIST[index];
          this.selectedIndex = Number(index);
        }
      }
      if (this.selectedIndex >= 0) {
        if (this._list.TIP_TYPE === 1) {
          this.tip = (
            this._list.ACTUAL_AMOUNT *
            (this._list.TIP_OPTION_LIST[this.selectedIndex].value /
            100)
          ).toFixed(this.formSettings.decimal_display_precision_point || 2);
        } else {
          this.tip = this._list.TIP_OPTION_LIST[
            this.selectedIndex
            ].value;
        }
        //this._list.TIP_OPTION_LIST[
        //  this.selectedIndex
        //  ].selected = true;
      }
      // this.chooseTipOption(this.selectedIndex);
    }
  }

  /**
   * choose particular tip option
   * @param index
   */
  chooseTipOption(index) {

    //for (let i = 0; i < this._list.TIP_OPTION_LIST.length; i++) {
    //  if (i !== index) {
    //    this._list.TIP_OPTION_LIST[i].selected = false;
    //  } else {
    //    this._list.TIP_OPTION_LIST[i].selected = true;
    //  }
    //}

    this.tip = this._list.TIP_OPTION_LIST[index].amount;
    this.tipForm.controls.tip.setValue(this.tip);
    this.makeTipHit(this.tipForm);
  }

  /**
   * tip type submit
   */
  makeTipHit(value) {

    if (!this.tipForm.valid) {
      return this.validationService.validateAllFormFields(this.tipForm);
    }
    this.tip = value.value.tip;
    // this.tipValue=this.tipValue.toFixed(this.appConfig.decimal_calculation_precision_point);

    if (
      this._list.MINIMUM_TIP !== 0 &&
      this._list.MINIMUM_TIP > this.tip
    ) {
      const msg = (this.languageStrings.min_amount_should_be || "Minimum Tip amount should be $10.")
      .replace(
        "10",
        this._list.MINIMUM_TIP.toFixed(this.formSettings.decimal_display_precision_point || 2)
      );
      const msg_1 = msg.replace(
        "----",
        this.terminology.TIP
      );
      this.popup.showPopup(MessageType.SUCCESS, 3000, msg_1, false);
      return;
    }
    //let index = -1;
    //if (
    //  this._list.TIP_OPTION_LIST &&
    //  this._list.TIP_OPTION_LIST.length > 0
    //) {
    //  index = this._list.TIP_OPTION_LIST.findIndex(o => {
    //    return o.selected === true;
    //  });
    //}
    //this.getPaymentInfo(this.perTaskCost, index, this.promoReferralData);
    this.enteredTip.emit({tip: this.tip, tip_type: 2});

  }

  /**
   * change tip value
   */
  changeTipValue() {
    this.tipType = 2;
    //if (
    //  this._list.TIP_OPTION_LIST &&
    //  this._list.TIP_OPTION_LIST.length > 0
    //) {
    //  for (let i = 0; i < this._list.TIP_OPTION_LIST.length; i++) {
    //    this._list.TIP_OPTION_LIST[i].selected = false;
    //  }
    //}
  }

}
