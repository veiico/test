import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ModalType } from '../../../../constants/constant';
import { FormGroup, FormBuilder, Validators } from '../../../../../../node_modules/@angular/forms';
import { PopUpService } from '../../../popup/services/popup.service';
import { SessionService } from '../../../../services/session.service';
import { AppService } from '../../../../app.service';
import { TimeFormat } from "../../../../enums/enum";

import * as moment from "moment";

@Component({
  selector: 'app-preorder-time',
  templateUrl: './preorder-time.component.html',
  styleUrls: ['./preorder-time.component.scss']
})
export class PreorderTimeComponent implements OnInit {

  languageStrings: any={};
  preOrderTimeSchedule: Date;
  @Input() storeData: any;
  public modalType: ModalType = ModalType;
  @Output() onClose: EventEmitter<null> = new EventEmitter<null>();
  @Output() onPreorderDateTime: EventEmitter<{ datetime: String }> = new EventEmitter<{ datetime: String }>();
  currentDateTime: Date = new Date();
  dateTimeForm: FormGroup;
  languageSelected: string;
  direction: string;
  @Input() hideClose: boolean;
  langJson: any = {};
  terminology: any = {};
  config: any = {};
  timeFormat = TimeFormat;

  constructor(protected formBuilder: FormBuilder, protected popUpService: PopUpService,
    protected sessionService: SessionService, protected appService: AppService) {
   
     }

  ngOnInit() {


    this.initDateTimeForm();
    this.setDirection();
    this.config = this.sessionService.get('config');
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
     this.languageStrings.schedule_your_delivery_for_later =( this.languageStrings.schedule_your_delivery_for_later || "Schedule your Delivery for later")
     .replace('DELIVERY_DELIVERY', this.config.terminology.DELIVERY);
    });

  }

  protected setDirection() {
    if (this.sessionService.getString('language')) {
      this.languageSelected = this.sessionService.getString('language');
      this.direction = this.languageSelected === 'ar' ? 'rtl' : 'ltr';
    } else {
      this.languageSelected = 'en';
      this.direction = 'ltr';
    }
    this.config = this.sessionService.get('config');
    this.terminology = this.config.terminology;
  }

  initDateTimeForm() {
    let storeData: any = this.sessionService.get('stores') ? this.sessionService.get('stores')[0] : undefined;
    let preOrderDatetime: any = this.sessionService.getString('preOrderTime');
    // console.log(preOrderDatetime)
    // preOrderDatetime = preOrderDatetime ? new Date(preOrderDatetime);
    if (preOrderDatetime) {
      preOrderDatetime = new Date(preOrderDatetime);
    }
    else if (storeData && storeData.instant_task==0 && storeData.scheduled_task === 1 && storeData.pre_booking_buffer) {
      preOrderDatetime = new Date(new Date().valueOf() + storeData.pre_booking_buffer * 60000);
    }
    else {
      preOrderDatetime = new Date();
    }

    this.dateTimeForm = this.formBuilder.group({
      date: [preOrderDatetime, Validators.required],
      time: [preOrderDatetime, Validators.required],
    });
   
  }

  close() {
    this.onClose.emit();
  }

  onSubmit() {
    let storeData: any = this.sessionService.get('stores') ? this.sessionService.get('stores')[0] : undefined;
    if (this.dateTimeForm.invalid) {
      return;
    }
    this.preOrderTimeSchedule = new Date(new Date().valueOf() + this.storeData.pre_booking_buffer * 60000);
    const preOrderDate = new Date(this.dateTimeForm.controls.date.value);
    const preOrderTime = new Date(this.dateTimeForm.controls.time.value);
    const preOrderSchedule: Date = new Date(preOrderDate.setHours(preOrderTime.getHours(), preOrderTime.getMinutes(), 0, 0));
    if(storeData && storeData && this.preOrderTimeSchedule > preOrderSchedule && storeData.instant_task==0 && storeData.scheduled_task === 1)
    {
      this.popUpService.showPopup("info", 2000, this.languageStrings.selected_time_should_greater_than || 'Selected time should be greater than' + ' ' + moment(this.preOrderTimeSchedule).format(this.config.date_format ? this.config.date_format.toUpperCase() : 'YYYY-MM-DD' + ' HH:mm a'), false);
      return;
    }
    const preDateOnly = preOrderDate.setHours(0, 0, 0, 0);
    const curDateOnly = (new Date()).setHours(0, 0, 0, 0);
    if (preDateOnly - curDateOnly === 0) {
      const curDateTime = new Date();
      if (preOrderTime.setSeconds(0, 0) < curDateTime.setSeconds(0, 0)) {
        this.popUpService.showPopup("info", 2000, this.languageStrings.date_time_cannot_from_past  || 'Date & Time can not be from past', false);
        return;
      }
    }

    const preOrderDateTime: Date = new Date(preOrderDate.setHours(preOrderTime.getHours(), preOrderTime.getMinutes(), 0, 0));

    this.sessionService.setString('preOrderTime', preOrderDateTime.toISOString());
    this.onPreorderDateTime.emit({ datetime: preOrderDateTime.toISOString() });
  }

}
