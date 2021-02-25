/**
 * Created by mba-214 on 24/10/18.
 */
import { Component, Input, OnInit, OnDestroy, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { CheckOutService } from '../../../checkout/checkout.service';

import * as moment from 'moment';
import { AppCartService } from '../../../catalogue/components/app-cart/app-cart.service';
import { SessionService } from '../../../../services/session.service';
import { AppService } from '../../../../app.service';
import { LoaderService } from '../../../../services/loader.service';

@Component({
  selector: 'app-laundry-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})

export class CalendarLaundryComponent implements OnInit, OnDestroy, AfterViewInit {
  languageStrings: any;
  buffer_slots: any;

  @Input() numberOfDays: number;
  @Input() selectedSlots: any;
  private _changeSlot;
  get changeSlot() { return this._changeSlot };
  @Input() set changeSlot(val: any) {

    if (val.val) {
      this._changeSlot = val;
      this.getSlotsForDate();
    }
    else{
      this._changeSlot = {
        val: 0,
        data: {}
      };
    }
  };
  @Input() type: string;
  @Output() selectedValues: any = new EventEmitter();
  public width: string;
  public dateArray: any = [];
  public sliceFrom: number = 0;
  public sliceTo: number = 5;
  public slots: any = [];
  public selectedSlot: any;
  public formSettings: any;
  public storeData: any;
  public terminology: any;
  public langJson: any;
  public languageSelected: string;
  public direction: string;
  public serviceTime: number;
  public hideArrows: boolean;
  public noSlot: boolean;
  public pre_booking_buffer = 0;
  public selectedDateIndex = 0;
  @Input() customOrder : boolean;
  public isPlatformServer:boolean


  constructor(public checkOutService: CheckOutService,
              public cartService: AppCartService,
              public sessionService: SessionService,
              public appService: AppService,
              public loader: LoaderService) {

  }


  ngOnInit() {
 
    this.setConfig();
    this.setLang();
    this.makeWidthDefine();
    this.defineDateArray();
    this.isPlatformServer = this.sessionService.isPlatformServer();
    if(!this.isPlatformServer){
      if (this.selectedSlots) {
        this.checkForFilledData();
      } else {
        this.getSlotsForDate();
      }
    }
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
    });
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
    this.storeData = this.sessionService.get('info');
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
    this.langJson = this.appService.getLangJsonData();
  }

  /**
   * check for filled data
   */
  checkForFilledData() {

    this.dateArray.forEach((o,index) => {
      let startTime = this.makeUtcTime(this.selectedSlots);
      if ((o.date.getDate() === startTime.getDate()) &&
          (o.date.getMonth() === startTime.getMonth()) &&
          (o.date.getFullYear() === startTime.getFullYear())) {
        o.selected = true;
        this.selectedDateIndex = index;
      } else {
        o.selected = false;
      }
    });
    this.getSlotsForDate();
  }

  /**
   * make utc time
   */
  makeUtcTime(data) {
    let date = new Date(data.start_time);
    let localTime = date.getTime();
    let localOffset = date.getTimezoneOffset() * 60000;
    let utc = localTime + localOffset;
    return new Date(utc);
  }

  /**
   * make width defined for dates
   */
  makeWidthDefine() {
    let countOfArrows = this.numberOfDays / 5;
    if (countOfArrows > 1) {
      this.hideArrows = true;
      this.width = '20%';
    } else if (countOfArrows === 1) {
      this.hideArrows = false;
      this.width = '20%';
    } else {
      this.hideArrows = false;
      this.width = (100 / this.numberOfDays).toFixed(2) + '%';
    }
  }

  /**
   * define date array
   */
  defineDateArray() {
    for (let i = 0; i < this.numberOfDays; i++) {
      let currentDate = new Date();
      this.addDays(currentDate, i);
      this.dateArray.push({
        date: currentDate,
        selected: i === 0 ? true : false
      });
    }

  }

  /**
   * add days
   */
  addDays(date, i) {
    let newDate = date.setDate(date.getDate() + parseInt(i));
    return newDate;
  }

  /**
   * arrow hit
   */
  arrowHit(type) {
    switch (type) {
      case 1:
        if (this.sliceFrom !== 0) {
          this.sliceFrom = this.sliceFrom - 5;
          this.sliceTo = this.sliceTo - 5;
        }
        break;
      case 2:
        if (this.dateArray.length > this.sliceTo) {
          this.sliceFrom = this.sliceFrom + 5;
          this.sliceTo = this.sliceTo + 5;
        }
        break;
      default:
        break;
    }
  }

  /**
   * select Particular Date
   */
  selectDate(data, index) {
    for(let i = 0; i < this.dateArray.length; i++) {
      if ((data.date.getDate() == this.dateArray[i].date.getDate() && data.date.getMonth() == this.dateArray[i].date.getMonth() && data.date.getFullYear() == this.dateArray[i].date.getFullYear())) {
        this.dateArray[i].selected = true;
        this.selectedDateIndex = i;
      } else {
        this.dateArray[i].selected = false;
      }
    }
    this.getSlotsForDate();
  }

  /**
   * get product id
   */
  getProductId() {
    let cart = this.cartService.getCartData() || [];
    let arrayId = [];
    if (cart.length > 0) {
      cart.forEach((o) => {
        arrayId.push({id: o.id,quantity:o.quantity})
      });
    }

    return arrayId;
  }

  /**
   * hit date slots
   */
  getSlotsForDate() {
    if (this.sessionService.isPlatformServer()) return;

    let findIndex = this.selectedDateIndex;


    const obj = {
      date: moment(this.dateArray[findIndex].date).format('YYYY-MM-DD'),
      product_ids: this.getProductId(),
      is_custom_order:this.customOrder ? 1 : undefined
    }

    if (this._changeSlot && this._changeSlot.val === 1) {
      obj['datetime'] = 
      this.storeData && this.storeData.create_delivery_slots==1 ? this._changeSlot.data.end_time : this.makeLocalTimeIncludingServiceTime(this._changeSlot.data.end_time);
    }
    obj['new_flow'] = 1;
    this.loader.show();
    this.checkOutService.getLaundrySlotsForDay(obj)
      .subscribe(response => {
          try {
            if (response.status === 200) {
              this.slots = [];
              if(this.type === 'pickup'){
                response.data.slots.forEach((o) => {
                  if (this.checkPastSlots(o)) {
                    this.slots.push(o);
                  }
                });
              }else{
                response.data.delivery_slots.forEach((o) => {
                  if (this.checkPastSlots(o)) {
                    this.slots.push(o);
                  }
                });
              }
              this.serviceTime = response.data.service_time;
              this.slots.forEach((o) => {
                if (this.selectedSlots) {
                  let tempDate  = this.selectedSlots.start_time;
                  if(this.selectedSlots.start_time instanceof moment)
                  {
                      tempDate = new Date(this.selectedSlots.start_time.format()).toISOString();
                  }
                if(o.start_time === tempDate && !o.pastSlot) {
                    o.selected = true;
                  } else {
                    o.selected = false;
                  }
                } else {
                  o.selected = false;
                  //o.pastSlot = this.checkPastSlots(o);
                }
              });
              if (response.data.pre_booking_buffer) {
                this.pre_booking_buffer = response.data.pre_booking_buffer;
                this.buffer_slots = this.slots;
                let currentDate=moment(new Date()).format("YYYY-MM-DD");
                let currentDateTime = new Date().setTime(new Date().getTime() + this.pre_booking_buffer*60*1000);
                // let currentDateTime = new Date().setTime(new Date().getTime() + this.pre_booking_buffer*60*1000  -1 * new Date().getTimezoneOffset() * 60 * 1000);
                let selectedDate=moment(this.dateArray[findIndex].date).format('YYYY-MM-DD');
                if(selectedDate==currentDate){
                  this.buffer_slots = this.buffer_slots.filter( elem => {
                    return (moment(elem.start_time,'YYYY-MM-DD HH:mm') > moment(new Date(currentDateTime),'YYYY-MM-DD HH:mm'))
                  });  
              }
               for(let i= 0; i<this.buffer_slots.length;i+=1) {
                  this.buffer_slots[i]['start_time'] = moment(this.buffer_slots[i]['start_time']); 
                  this.buffer_slots[i]['end_time'] = moment(this.buffer_slots[i]['end_time']); 
              }
              this.slots = this.buffer_slots;
              
            }

              if (this._changeSlot && this._changeSlot.val === 1) {
                this.selectParticularDate(response.data);
              }

              if (this.slots && this.slots.length === 0) {
                this.noSlot = true;
              } else {
                this.noSlot = false;
              }

            } else if (response.status === 400) {
              this.noSlot = true;
            }
            this.loader.hide();
          } catch (e) {
            this.loader.hide();
            console.error(e);
          }
        },
        error => {
          this.loader.hide();
          console.error(error);
        });
  }

  /**
   * select particular date for delivery
   */
  selectParticularDate(data) {
    for(let i = 0; i < this.dateArray.length; i++) {
      let availableDates = moment(new Date(this.dateArray[i].date)).format("YYYY-MM-DD")
      if ((new Date(availableDates +' 00:00:00').getDate() == new Date(data.date +' 00:00:00').getDate()) &&
        (new Date(availableDates).getMonth() == new Date(data.date).getMonth()) &&
        (new Date(this.dateArray[i].date).getFullYear() == new Date(data.date).getFullYear())) {
      
          this.dateArray[i].selected = true;
         this.selectedDateIndex = i;
      } else {
        this.dateArray[i].selected = false;
      }
    }
  }

  /**
   * make local time including service time
   */
  makeLocalTimeIncludingServiceTime(data) {
    let date = new Date(data);
    let localTime = date.getTime();
    //let localOffset = date.getTimezoneOffset() * 60000;
    let utc = localTime + (this.serviceTime * 60000);
    return new Date(utc).toISOString();
  }

  /**
   * checkPastSlots for that
   */
  checkPastSlots(data) {
    let date = new Date(data.start_time);
    let localTime = date.getTime();
    let localOffset = date.getTimezoneOffset() * 60000;
    let utc = localTime + localOffset;
    if (new Date(utc) > new Date()) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * select particular time slot
   */
  selectTimeSlot(slot, index) {
   
    for (let i = 0; i < this.slots.length; i++) {
      if (i === index) {
        this.slots[i].selected = true;
        this.selectedSlot = this.slots[i];
      } else {
        this.slots[i].selected = false;
      }
    }



    if (this.type === 'pickup') {
      this.selectedSlot['type'] = 'pickup';
    } else {
      this.selectedSlot['type'] = 'delivery';
      this.selectedSlots = this.selectedSlot;
    }
    this.selectedValues.emit(this.selectedSlot);
  }

}
