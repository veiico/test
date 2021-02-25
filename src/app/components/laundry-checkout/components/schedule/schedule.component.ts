import { MessageType } from './../../../../constants/constant';
/**
 * Created by mba-214 on 24/10/18.
 */
import { Component, Input, OnInit, OnDestroy, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { CheckOutService } from '../../../checkout/checkout.service';
import { SessionService } from '../../../../services/session.service';
import { PopUpService } from '../../../../modules/popup/services/popup.service';
import {AppService} from "../../../../app.service";

@Component({
  selector: 'app-laundry-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})

export class ScheduleLaundryComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() stepsArray: any;
  @Output() stepComplete: any = new EventEmitter();
  public numberOfDays: number;
  public changeSlot: {
    val: number,
    data: any
  } = {
    val: 0,
    data: {}
  };
  public pickSlots: any;
  public deliverySlots: any;
  public formSettings: any;
  public terminology: any = {};
  public langJson: any = {};
  public direction: string;
  public languageSelected: string;
  public selectedValuesArray: any = [];
  @Input() customOrder : boolean;
  @Output() customSlotEvent = new EventEmitter();
  languageStrings: any={};

  constructor(public checkOutService: CheckOutService,
              public sessionService: SessionService,
              protected popup: PopUpService,
              public appService: AppService) {
                if(this.sessionService.get('info')){
                  this.numberOfDays = this.sessionService.get('info').days_to_display ? this.sessionService.get('info').days_to_display : 5;
                }else{
                  this.numberOfDays = 5;
                }

  }


  ngOnInit() {
    this.setConfig();
    this.setLang();
    if (!this.customOrder && this.stepsArray[2].data.length) {
      this.selectedValuesArray = this.stepsArray[2].data[0];
      let pickIndex = this.stepsArray[2].data[0].findIndex((o) => {
        return o.type === 'pickup';
      });
      let deliveryIndex = this.stepsArray[2].data[0].findIndex((o) => {
        return o.type === 'delivery';
      });
      this.pickSlots = this.stepsArray[2].data[0][pickIndex];
      this.deliverySlots = this.stepsArray[2].data[0][deliveryIndex];
    }
  }

  ngOnDestroy() {

  }

  ngAfterViewInit() {

  }

  /**
   * set config
   */
  setConfig() {
    this.formSettings = this.sessionService.get('config');
    this.terminology = this.formSettings.terminology;
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
     this.languageStrings.select_pickup_time = (this.languageStrings.select_pickup_time || 'Select a Pickup Time')
     .replace('PICKUP_PICKUP', this.terminology.PICKUP);
     this.languageStrings.select_delivery_time = (this.languageStrings.select_delivery_time || 'Select a Delivery Time')
     .replace('DELIVERY_DELIVERY', this.terminology.DELIVERY);
    });
    this.appService.langPromise.then(()=> {
      this.langJson = this.appService.getLangJsonData();
    });
  }

  /**
   * selected values
   */
  selectedValues(data) {
 
    let index = -1;
    //this.checkSelectedHasValues(data);
    switch (data.type){
      case 'pickup':
        this.changeSlot = {
          val: 1,
          data: data
        };
        index = this.selectedValuesArray.findIndex((o) => {
          return o.type == 'pickup';
        });
        if (index > -1) {
          this.selectedValuesArray.splice(index, 1);
        }
        this.selectedValuesArray.push(data)
        break;
      case 'delivery':
        index = this.selectedValuesArray.findIndex((o) => {
          return o.type == 'delivery';
        });
        if (index > -1) {
          this.selectedValuesArray.splice(index, 1);
        }
        this.selectedValuesArray.push(data);
        break;
      default:
        break;
    }
    if(this.customOrder){
      this.emitSelectedValuesForCustomOrder(this.selectedValuesArray);
    }
  }

  /**
   * selected array has values
   */
  checkSelectedHasValues(data) {
    if (this.selectedValuesArray.length && data.type === 'pickup') {
      this.selectedValuesArray = [];

    }
  }

  /**
   * continue option
   */
  continueOption() {

    
    if (this.selectedValuesArray.length !== 2) {
      this.popup.showPopup(MessageType.ERROR, 2000, this.languageStrings.pls_select_time_slot || 'Please select time slots.', false);
      return;
    }

    this.stepsArray.forEach((o) => {
      if (o.data.length) {
        o.active = 0;
      }
    })

    const obj = this.selectedValuesArray;

    this.stepsArray[2].complete = 1;
    this.stepsArray[2].active = 0;
    this.stepsArray[2].data = [];
    this.stepsArray[2].data.push(obj);

    this.stepComplete.emit(this.stepsArray);
  }

  emitSelectedValuesForCustomOrder(data){
    this.customSlotEvent.emit(data);
  }

}
