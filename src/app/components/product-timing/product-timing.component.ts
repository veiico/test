import { MessageType } from './../../constants/constant';
/**
 * Created by cl-macmini-51 on 08/05/18.
 */
import { Component, HostListener, Input, OnDestroy, OnInit, ChangeDetectorRef, Output, EventEmitter, Inject } from '@angular/core';
import { FormGroup, AbstractControl, NG_VALUE_ACCESSOR, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { GoogleAnalyticsEventsService } from '../../services/google-analytics-events.service';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { DateTimeAdapter } from 'ng-pick-datetime';
import { defineLocale } from 'ngx-bootstrap';
import * as de from 'ngx-bootstrap/locale';
import * as moment from 'moment';

import { AppCartService } from '../catalogue/components/app-cart/app-cart.service';
import { PopUpService } from '../../modules/popup/services/popup.service';
import { SessionService } from '../../services/session.service';
import { PopupModalService } from '../../modules/popup/services/popup-modal.service';
import { CartModel } from '../catalogue/components/app-cart/app-cart.model';
import { ProductTimingService } from './product-timing.service';
import { AppService } from '../../app.service';
import { TimeFormat } from "../../enums/enum";
import { ISubscription } from 'rxjs/Subscription';
import { distinctUntilChanged } from 'rxjs/operators';
import { LoaderService } from '../../services/loader.service';
import { DOCUMENT } from '@angular/common';
import { ConfirmationService } from '../../modules/jw-notifications/services/confirmation.service';

declare var $: any;

// import { defineLocale } from 'ngx-bootstrap/chronos';
// import { arLocale, esUsLocale, frLocale } from 'ngx-bootstrap/locale';
// import * as $ from 'jquery';

@Component({
  selector: 'app-product-timing',
  templateUrl: './product-timing.html',
  styleUrls: ['./product-timing.scss']
})
export class AppProductTimingComponent implements OnInit, OnDestroy {
  surgeAmountData: any;
  public profile_color = '#fff';
  public formSetting: any;
  public terminology: any;
  public timingForm: any;
  public restaurantInfo: any;
  public date: Date = new Date();
  public startDate: Date = new Date();
  public endDate: Date = new Date();
  public openSlots = false;
  public openEndSlots = false;
  public openStartSlots = false;
  public minDate: Date = new Date();
  public minDateAgent: Date = new Date();
  public minStartDate: Date = new Date();
  public minEndDate: Date = new Date();
  public maxDate: Date;
  public maxStartDate: Date;
  public maxEndDate: Date;
  public time;
  public startTime;
  public startEndTime;
  public endTime;
  public bsConfig;
  public bsValue: Date = new Date();
  public bsStartValue: Date = new Date();
  public bsEndValue: Date = new Date();
  public tFormat;
  public tStartFormat;
  public tEndFormat;
  public morningSBool = false;
  public afterNoonSBool = false;
  public eveningSBool = false;
  public morningEBool = false;
  public afterNoonEBool = false;
  public eveningEBool = false;
  agent: any;
  slotDataAgent: any;
  currency: any;
  public colorTheme = 'theme-dynamic';
  public unit_count = 0;
  public pre_booking_buffer = 0;
  public showTimeSlots = true;
  public invalidDates = [];
  public invalidDatesGot: any;
  public availableDates: any;
  stars: number[] = [1, 2, 3, 4, 5];
  readOnly: boolean = true;
  public slots = {
    morning: new Set(),
    afternoon: new Set(),
    evening: new Set()
  };
  public startSlots = {
    morning: new Set(),
    afternoon: new Set(),
    evening: new Set()
  };
  public agentStartSlots = {
    morning: new Set(),
    afternoon: new Set(),
    evening: new Set()
  };
  public agentEndSlots = {
    morning: new Set(),
    afternoon: new Set(),
    evening: new Set()
  };
  public langJson: any;
  public languageSelected: any;
  public direction = 'ltr';
  public localeLang: any;
  public buttonDisabled = false;

  // doppler keys
  protected isDoppler = true;
  public evening_slot: any = [];
  public slotsCombined: any = [];
  public morningslotsCombined: any = [];
  public afternoonslotsCombined: any = [];
  public timeFormat = TimeFormat;
  public agentList : any;
  public selectAgentModal = 0;
  subscription: ISubscription;
  @Input() product: any;
  @Input() productIndex: any;
  @Input() storeIndex: any;
  @Output() sendDataForProduct: EventEmitter<number> = new EventEmitter<number>();
  selectedAgentIndex: number = -1;
  selectedAgent: any;
  isPlatformServer: boolean;
  previousagent: any;
  languageStrings: any={};

  constructor(protected route: ActivatedRoute, protected router: Router, protected sessionService: SessionService,
    protected popup: PopupModalService, protected cartService: AppCartService, protected formBuilder: FormBuilder,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService, protected ref: ChangeDetectorRef,
    protected productTimingService: ProductTimingService, public appService: AppService,
    protected localeService: BsLocaleService, protected dateTimeAdapter: DateTimeAdapter<any>, protected loader: LoaderService,public confirmationService : ConfirmationService) {
    this.timingForm = this.formBuilder.group({
      'time': [''],
      'date': [''],
      'startDate': [''],
      'startTime': [''],
      'startEndTime': [''],
      'endDate': [''],
      'endTime': ['']
    });
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

  ngOnInit() {
    // const locales = [arLocale, esUsLocale, frLocale];
    // locales.forEach(locale => defineLocale(locale.abbr, locale));
    this.isPlatformServer = this.sessionService.isPlatformServer();
    let language = this.sessionService.getString('language');
    language = this.defineLangLocale(language);
    this.localeService.use(language);
    this.dateTimeAdapter.setLocale(language);

    this.formSetting = this.sessionService.get('config');
    const currency = this.formSetting.payment_settings;
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
     this.languageStrings.no_agent_available = (this.languageStrings.no_agent_available || "No Agent Available")
     .replace('AGENT_AGENT', this.terminology.AGENT);
    });
    if (currency) {
      this.currency = currency[0];
    }
    if (this.formSetting.product_view === 1) {
      this.restaurantInfo = this.sessionService.get('config');
    } else {
      this.restaurantInfo = this.sessionService.get('info');
    }
    this.profile_color = this.sessionService.get('config') ? this.sessionService.get('config').color : '';
    if (this.formSetting.terminology) {
      this.terminology = this.formSetting.terminology;
    }

    // this.getAvailableDates();
    $('#timeSelection').on('shown.bs.modal', () => {
      this.buttonDisabled = true;
      this.agentList = null;
      this.subscription = this.productTimingService.addService.pipe(distinctUntilChanged()).subscribe(res => {
        this.product = res.productSelectedToAdd;
        this.productIndex = res.indexGot
      });
      if (this.formSetting.product_view === 1) {
        this.restaurantInfo = this.sessionService.get('config');
      } else {
        this.restaurantInfo = this.sessionService.get('info');
      }

      if (this.formSetting.show_date_filter === 1 && this.sessionService.get('dateFiltered')) {
        this.getAvailableDates();
        const storeDates = this.sessionService.get('dateFiltered');
        this.startDate = new Date(storeDates.start);
        this.endDate = new Date(storeDates.end);
        this.bsStartValue = new Date(storeDates.start);
        this.bsEndValue = new Date(storeDates.end);
        this.bsValue = new Date(storeDates.end);
        this.date = new Date(storeDates.end);
        this.localeLang = this.sessionService.getString('language');
      }
      if (this.product && !this.product.is_agents_on_product_tags_enabled && !this.product.enable_tookan_agent && this.product.unit_type !== 1 && this.formSetting.business_model_type != 'ECOM') {
        this.getProductTimeSlots(0);
        this.getProductTimeSlots('Start');
        this.selectAgentModal = 1;
      } else if (this.product && this.product.enable_tookan_agent){
        this.maxEndDate = new Date();
        this.getProductTimeSlots('Agent');
       } else if (this.product && this.product.is_agents_on_product_tags_enabled) {
        //this.maxStartDate = new Date();
        this.maxEndDate = new Date();
        if(document.getElementById('selectAgent')){
          this.getAgents();
          this.selectAgentModal = 2;
        } else {
          this.getProductTimeSlots('Agent');
        }
      } else if (this.product && this.product.unit_type !== 1) {
        this.getProductTimeSlots(0);
        this.getProductTimeSlots('Start');
        this.selectAgentModal = 1;
      } else if (this.product && this.product.unit_type === 1 && this.restaurantInfo.pd_or_appointment === 2) {
        this.getProductTimeSlots(0);
        this.getProductTimeSlots('Start');
        this.selectAgentModal = 1;
      } else {
        this.buttonDisabled = false;
        this.selectAgentModal = 1;
      }
      if (this.product && !this.product.enable_tookan_agent && this.restaurantInfo.pd_or_appointment == 1 && this.formSetting.business_model_type == 'ECOM') {
        //this.getProductTimeSlots(0);
        this.getProductTimeSlots('Start');
      }
    });

    $('#timeSelection').on('hidden.bs.modal', () => {
      this.date = new Date();
      this.startDate = new Date();
      this.endDate = new Date();
      this.openSlots = false;
      this.openEndSlots = false;
      this.openStartSlots = false;
      this.minDate = new Date();
      this.minDateAgent = new Date();
      this.minStartDate = new Date();
      this.minEndDate = new Date();
      this.bsValue = new Date();
      this.bsStartValue = new Date();
      this.bsEndValue = new Date();
      this.maxDate = moment(this.bsValue).add('29', 'days').toDate();
      this.maxStartDate = moment(this.bsStartValue).add('29', 'days').toDate();
      this.maxEndDate = moment(this.bsEndValue).add('29', 'days').toDate();
      this.time = '';
      this.startTime = '';
      this.startEndTime = '';
      this.endTime = '';
      this.tFormat = '';
      this.tStartFormat = '';
      this.tEndFormat = '';
      this.morningSBool = false;
      this.afterNoonSBool = false;
      this.eveningSBool = false;
      this.morningEBool = false;
      this.afterNoonEBool = false;
      this.eveningEBool = false;
      this.buttonDisabled = false;
      this.unit_count = 0;
      this.showTimeSlots = true;
      this.invalidDates = [];
      this.invalidDatesGot = [];
      this.pre_booking_buffer = 0;
      this.slots = {
        morning: new Set(),
        afternoon: new Set(),
        evening: new Set()
      };
      this.startSlots = {
        morning: new Set(),
        afternoon: new Set(),
        evening: new Set()
      };
      this.agentStartSlots = {
        morning: new Set(),
        afternoon: new Set(),
        evening: new Set()
      };
      this.agentEndSlots = {
        morning: new Set(),
        afternoon: new Set(),
        evening: new Set()
      };
    });



    this.bsConfig = Object.assign({}, {
      containerClass: this.colorTheme, showWeekNumbers: false,
      dateInputFormat: 'll'
    });
    // ================language json manupilation======================
    this.langJson = this.appService.getLangJsonData();
  }


  defineLangLocale(language) {
    if (language == 'zh-Hant' || language == 'zh-Hans') {
      defineLocale('zh-cn', de.zhCnLocale);
      return 'zh-cn';
    }
    else if (language == 'el' || language == 'es-mx' || language == 'nl' || language == 'pt-br' || language == 'sv' || language == 'pt'|| language == 'es' || language == 'th' ||  language == 'mr' || language == 'hi' || language == 'ru' || language =='ar-sa' || language =='tr' || language =='lv' || language =='nb'|| language == 'lo' || language == 'vi' || language == 'it' || language == 'fr-ch' || language == 'ro') {
       // fallback for all languages which are not valid for bsdatepicker
      return 'en';
    }
    else {
      return this.sessionService.getString('language');
    }
  }


  checkIfToShowSlots(type) {
    if (this.product.unit_type === 4 && this.restaurantInfo.buffer_schedule === 1440) {
      // if (this.formSetting.business_model_type === 'RENTAL' || this.formSetting.business_model_type === 'ECOM') {
      this.showTimeSlots = false;
      this.setTimeValue(type);
    } else {
      this.showTimeSlots = true;
      this.buttonDisabled = false;
    }
  }

  setTimeValue(type) {
    if (type === 0) {
      if (this.startSlots.morning.size) {
        this.buttonDisabled = false;
        this.startTime = Array.from(this.startSlots.morning)[0];
        this.tStartFormat = this.formSetting.time_format === this.timeFormat.TWELVE_HOURS ? 'AM' : '';
      } else if (this.startSlots.afternoon.size) {
        this.buttonDisabled = false;
        this.startTime = Array.from(this.startSlots.afternoon)[0];
        this.tStartFormat = this.formSetting.time_format === this.timeFormat.TWELVE_HOURS ? 'PM' : '';
      } else if (this.startSlots.evening.size) {
        this.buttonDisabled = false;
        this.startTime = Array.from(this.startSlots.evening)[0];
        this.tStartFormat = this.formSetting.time_format === this.timeFormat.TWELVE_HOURS ? 'PM' : '';
      }
      if (!this.startTime) {
        this.buttonDisabled = true;
        const msg = this.languageStrings.no_slot_avail_for_start || 'No slot available for start date' + ' ' + moment(this.bsStartValue).format('ll');
        this.popup.showPopup(MessageType.ERROR, 2000, msg, false);
        return false;
      }
    }


    if (type === 1) {
      if (this.slots.morning.size) {
        this.buttonDisabled = false;
        this.endTime = Array.from(this.slots.morning)[0];
        this.tEndFormat = this.formSetting.time_format === this.timeFormat.TWELVE_HOURS ? 'AM' : '';
      } else if (this.slots.afternoon.size) {
        this.buttonDisabled = false;
        this.endTime = Array.from(this.slots.afternoon)[0];
        this.tEndFormat = this.formSetting.time_format === this.timeFormat.TWELVE_HOURS ? 'PM' : '';
      } else if (this.slots.evening.size) {
        this.buttonDisabled = false;
        this.endTime = Array.from(this.slots.evening)[0];
        this.tEndFormat = this.formSetting.time_format === this.timeFormat.TWELVE_HOURS ? 'PM' : '';
      }
      if (!this.endTime) {
        this.buttonDisabled = true;
        const msg = this.languageStrings.no_slot_avail_for_end || 'No slot available for end date' + ' ' + moment(this.bsEndValue).format('ll');
        this.popup.showPopup(MessageType.ERROR, 2000, msg, false);
        return false;
      }
    }
  }

  setTimeFormat(type, value) {
    switch (type) {
      case 'start':
        if (this.formSetting.time_format === this.timeFormat.TWELVE_HOURS) {
          this.tStartFormat = value;
        } else {
          this.tStartFormat = '';
        }
        break;
      case 'end':
        if (this.formSetting.time_format === this.timeFormat.TWELVE_HOURS) {
          this.tEndFormat = value;
        } else {
          this.tEndFormat = '';
        }
        break;
      default:
        break;

    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getDisableDate() {
    if (this.availableDates) {
      this.invalidDatesGot = this.invalidDates;
      this.maxStartDate = new Date(this.availableDates.end_date);
      if (new Date() >= new Date(this.availableDates.start_date)) {
        this.minStartDate = new Date();
      } else {
        this.minStartDate = new Date(this.availableDates.start_date);
      }
    }
  }

  getDisableDateEnd() {
    if (this.availableDates) {
      this.invalidDatesGot = this.invalidDates;
      this.maxEndDate = new Date(this.availableDates.end_date);
      this.minEndDate = new Date(this.bsStartValue);
    }
  }

  dateChanged() {
    this.maxDate = moment(this.bsValue).add('29', 'days').toDate();
    this.time = '';
    this.slots = {
      morning: new Set(),
      afternoon: new Set(),
      evening: new Set()
    };
    this.buttonDisabled = true;
    this.getProductTimeSlots(0);
  }
  dateStartChanged() {
    $('body').css('position', 'relative');
    this.maxStartDate = moment(this.bsStartValue).add('29', 'days').toDate();
    if (this.product.unit_type === 4 && this.restaurantInfo.buffer_schedule === 1440) {
      const newEndDate = new Date(this.bsStartValue);
      const nextNewDate = new Date();
      nextNewDate.setDate(newEndDate.getDate());
      this.minEndDate = nextNewDate;
    }
    this.startTime = '';
    this.startSlots = {
      morning: new Set(),
      afternoon: new Set(),
      evening: new Set()
    };
    this.buttonDisabled = true;
    this.getProductTimeSlots('Start');
  }

  startDateChanged() {
    this.startTime = '';
    this.startEndTime = '';
    this.startSlots = {
      morning: new Set(),
      afternoon: new Set(),
      evening: new Set()
    };
    this.buttonDisabled = true;
    this.getProductTimeSlots('Start');
  }

  endDateChanged() {
    this.endTime = '';
    this.slots = {
      morning: new Set(),
      afternoon: new Set(),
      evening: new Set()
    };
    this.buttonDisabled = true;
    this.getProductTimeSlots('End');
  }

  dateEndChanged() {
    $('body').css('position', 'relative');
    this.maxEndDate = moment(this.bsEndValue).add('29', 'days').toDate();
    this.endTime = '';
    this.slots = {
      morning: new Set(),
      afternoon: new Set(),
      evening: new Set()
    };
    this.buttonDisabled = true;
    this.getProductTimeSlots('End');
  }

  dateAgentStartChanged() {
    $('body').css('position', 'relative');
    //this.maxStartDate = new Date();
    this.maxEndDate = new Date(this.bsStartValue);
    this.minDateAgent = new Date(this.bsStartValue);
    this.bsEndValue = this.bsStartValue;
    this.startTime = '';
    this.agentStartSlots = {
      morning: new Set(),
      afternoon: new Set(),
      evening: new Set()
    };
    this.buttonDisabled = true;
    this.getProductTimeSlots('Agent');

    // if(document.getElementById('selectAgent') && this.product.is_agents_on_product_tags_enabled){
    //   this.getAgents();
    //   this.selectAgentModal = 2;
    // } else {
    //   this.getProductTimeSlots('Agent');
    // }
  }
  dateAgentEndChanged() {
    $('body').css('position', 'relative');
   this.maxEndDate = new Date(this.bsStartValue);
   this.bsEndValue = this.bsStartValue;
    this.endTime = '';
    this.agentEndSlots = {
      morning: new Set(),
      afternoon: new Set(),
      evening: new Set()
    };
  }

  checkIfStartSelected() {
    this.openStartSlots = false;
    if (this.startTime) {
      this.agentEndSlots = {
        morning: new Set(),
        afternoon: new Set(),
        evening: new Set()
      };
      this.makeEndSlotsForAgent();
      this.openEndSlots = !this.openEndSlots;
    } else {
      this.appService.langPromise.then(() => {
        this.languageStrings.pls_select_start_time = (this.languageStrings.pls_select_start_time || 'Please select start time first.')
        .replace('START_TIME', this.terminology.START_TIME);
        const msg = this.languageStrings.pls_select_start_time;
        this.popup.showPopup(MessageType.ERROR, 2500, msg, false);
      })

      return;
    }
  }

  onDatePickerShown() {
    $('body').css('position', 'initial');
  }

  makeEndSlotsForAgent() {
    const startDateTime = moment(moment(this.bsStartValue).format('YYYY-MM-DD') + this.startTime.split('-')[0],
    'YYYY-MM_DDhh:mma').format(('YYYY-MM-DD')+'THH:mm:ss.SSS[Z]');
    const indexGot = this.slotDataAgent.findIndex(function (o: any) { return o.slot_start_time === startDateTime; });
    for (let i = indexGot + 1; i < this.slotDataAgent.length; i++) {
      const current = moment(this.slotDataAgent[i].start);
      const end = moment(this.slotDataAgent[i].end);
      if (!moment().isAfter(current) && this.slotDataAgent[i].available_status === 0) {
        if (current.hours() < 12) {
          if (this.formSetting.time_format === this.timeFormat.TWELVE_HOURS) {
            //this.agentEndSlots.morning.add(current.format('hh:mm A') + ' - ' + end.format('hh:mm A'));
            this.agentEndSlots.morning.add(current.format('hh:mm A'));
          } else {
            //this.agentEndSlots.morning.add(current.format('HH:mm') + ' - ' + end.format('HH:mm'));
            this.agentEndSlots.morning.add(current.format('HH:mm'));
          }
        } else if (current.hours() >= 12 && current.hours() < 17) {
          if (this.formSetting.time_format === this.timeFormat.TWELVE_HOURS) {
            //this.agentEndSlots.afternoon.add(current.format('hh:mm A') + ' - ' + end.format('hh:mm A'));
            this.agentEndSlots.afternoon.add(current.format('hh:mm A'));
          } else {
            //this.agentEndSlots.afternoon.add(current.format('HH:mm') + ' - ' + end.format('HH:mm'));
            this.agentEndSlots.afternoon.add(current.format('HH:mm'));
          }
        } else {
          if (this.formSetting.time_format === this.timeFormat.TWELVE_HOURS) {
            //this.agentEndSlots.evening.add(current.format('hh:mm A') + ' - ' + end.format('hh:mm A'));
            this.agentEndSlots.evening.add(current.format('hh:mm A'));
          } else {
            //this.agentEndSlots.evening.add(current.format('HH:mm') + ' - ' + end.format('HH:mm'));
            this.agentEndSlots.evening.add(current.format('HH:mm'));
          }
        }
      } else {
        return;
      }
    }
  }

  getAvailableDates() {
    const data: any = {};
    const productData = this.product;
    data.product_id = productData.product_id;
    this.productTimingService.availableDates(data)
      .subscribe(response => {
        try {
          if (response.status === 200) {
            this.availableDates = response.data;
            if (response.data.not_available_dates && response.data.not_available_dates.length > 0) {
              response.data.not_available_dates.forEach((date) => {
                const h = new Date().getHours();
                const m = new Date().getMinutes();
                const s = new Date().getSeconds();
                const dateF = new Date(date);
                dateF.setHours(h);
                dateF.setMinutes(m);
                dateF.setSeconds(s);
                this.invalidDates.push(dateF);
              });
              // let today = new Date();
              // let invalidDate = new Date();
              // invalidDate.setDate(today.getDate() - 1);
              // this.invalidDates = [invalidDate,today];
            }
          } else if (response.status === 400) {
          }
        } catch (e) {
          console.error(e);
        }
      },
        error => {
          console.error(error);
        });
  }

  getProductTimeSlots(type) {

    const data: any = {};
    const productData = this.product;
    if (type === 'Agent') {
      data.date = moment(this.bsStartValue).format('YYYY-MM-DD');
      data.product_id = productData.product_id;
    } else {
      if (type === 'Start') {
        data.date = moment(this.bsStartValue).format('YYYY-MM-DD');
        data.product_id = productData.product_id;
      } else if (type === 'End') {
        data.date = moment(this.bsEndValue).format('YYYY-MM-DD');
        data.product_id = productData.product_id;
      } else if (!type) {
        data.date = moment(this.bsValue).format('YYYY-MM-DD');
        data.product_id = productData.product_id;
      }

    }
    if(this.restaurantInfo && this.restaurantInfo.self_pickup){
      if (this.sessionService.getString("deliveryMethod")) {
        const method = Number(this.sessionService.getString("deliveryMethod"));
        if((method == 1 || method == 8) && (!this.restaurantInfo.available && this.restaurantInfo.scheduled_task)){
          data["self_pickup"] = 0;
        }
        else{
          data["self_pickup"] = 1;
        }
      }
    }
    if(this.selectedAgent && this.product.is_agents_on_product_tags_enabled){
      data.agent_id = this.selectedAgent.fleet_id;
    }
    data.user_id = this.product.user_id;
    data.marketplace_user_id = this.sessionService.get('config').marketplace_user_id;
    this.loader.show();
    this.productTimingService.getSlotsForDayForProduct(data)
      .subscribe(response => {
        try {
          if (response.status === 200) {
            let date_format = this.formSetting.date_format;
            let date_array=["dd-MMM-yyyy","dd-MM-yy","dd-MM-yyyy","MMMM dd yyyy"];
            if(date_array.includes(date_format))
            {
              date_format=date_format.toUpperCase();
            }

            this.loader.hide();
            if (type === 'Agent') {
              if (response.data && response.data.length === 0) {
                this.popup.showPopup(MessageType.ERROR, 2500, this.languageStrings.no_slot_avail || 'No slots are available.', false);
                return;
              }
              this.selectAgentModal = 1;
              const data = response.data.is_google_calendar_active ? this.makeSlots(response.data.slots,'is_booked','start_time','end_time',0,'hh:mm A') : this.makeSlots(response.data,'available_status','slot_start_time','slot_end_time',0,'hh:mm A');
              const newSlots = data.newSlots;
              this.slotDataAgent = data.slotList;
              this.agentStartSlots = data.availableSlots;
              if (newSlots && newSlots.length === 0) {
                this.popup.showPopup(MessageType.ERROR, 2500, this.languageStrings.no_slot_avail || 'No slots are available.', false);
                return;
              }
              this.buttonDisabled = false;
            } else {
              if (response.data && response.data.slots) {
                if (response.data.pre_booking_buffer) {
                  this.pre_booking_buffer = response.data.pre_booking_buffer;
                }
                if( response.data.is_google_calendar_active){
                  const slotsData = this.makeSlots(response.data.slots,'is_booked','start_time','end_time',this.pre_booking_buffer,'hh:mm');
                  if (type === 'Start'){
                    this.startSlots = slotsData.availableSlots;
                    this.checkIfToShowSlots(0);
                  } else {
                    this.slots = slotsData.availableSlots;
                    this.checkIfToShowSlots(1);
                  }
                } else {
                  response.data.slots.map((item) => {
                    const buffer = item.buffer_schedule ? item.buffer_schedule : this.restaurantInfo.buffer_schedule;
                      this.intervals(item.start_time, item.end_time, buffer, type);
                  });
                  if (type === 'Start') {
                    this.startSlots.morning = new Set(Array.from(new Set(this.startSlots.morning)).sort());
                    this.startSlots.afternoon = new Set(Array.from(new Set(this.startSlots.afternoon)).sort());
                    this.startSlots.evening = new Set(Array.from(new Set(this.startSlots.evening)).sort());
                    let slot = new Set();
                      this.startSlots.morning.forEach((item, index) => {
                        if (this.formSetting.time_format === this.timeFormat.TWELVE_HOURS) {
                          slot.add(moment(item,`${date_format} hh:mm`).format('hh:mm'));
                        } else {
                          slot.add(moment(item,`${date_format} hh:mm`).format('HH:mm'));
                        }
                      });
                      this.startSlots.morning = slot;
                      slot = new Set();
                      this.startSlots.afternoon.forEach((item, index) => {
                        if (this.formSetting.time_format === this.timeFormat.TWELVE_HOURS) {
                          slot.add(moment(item,`${date_format} hh:mm`).format('hh:mm'));
                        } else {
                          slot.add(moment(item,`${date_format} hh:mm`).format('HH:mm'));
                        }
                      });
                      this.startSlots.afternoon = slot;

                      slot = new Set();
                      this.startSlots.evening.forEach((item, index) => {
                        if (this.formSetting.time_format === this.timeFormat.TWELVE_HOURS) {
                          slot.add(moment(item,`${date_format} hh:mm`).format('hh:mm'));
                        } else {
                          slot.add(moment(item,`${date_format} hh:mm`).format('HH:mm'));
                        }
                      });
                      this.startSlots.evening = slot;

                    this.checkIfToShowSlots(0);
                  } else {
                    this.slots.morning = new Set(Array.from(new Set(this.slots.morning)).sort());
                    this.slots.afternoon = new Set(Array.from(new Set(this.slots.afternoon)).sort());
                    this.slots.evening = new Set(Array.from(new Set(this.slots.evening)).sort());
                    let slot = new Set();
                    this.slots.morning.forEach((item, index) => {
                      if (this.formSetting.time_format === this.timeFormat.TWELVE_HOURS) {
                        slot.add(moment(item,`${date_format} hh:mm`).format('hh:mm'));
                      } else {
                        slot.add(moment(item,`${date_format} hh:mm`).format('HH:mm'));
                      }
                    });
                    this.slots.morning = slot;
                    slot = new Set();
                    this.slots.afternoon.forEach((item, index) => {
                      if (this.formSetting.time_format === this.timeFormat.TWELVE_HOURS) {
                        slot.add(moment(item,`${date_format} hh:mm`).format('hh:mm'));
                      } else {
                        slot.add(moment(item,`${date_format} hh:mm`).format('HH:mm'));
                      }
                    });
                    this.slots.afternoon = slot;
                    slot = new Set();
                    this.slots.evening.forEach((item, index) => {
                      if (this.formSetting.time_format === this.timeFormat.TWELVE_HOURS) {
                        slot.add(moment(item,`${date_format} hh:mm`).format('hh:mm'));
                      } else {
                        slot.add(moment(item,`${date_format} hh:mm`).format('HH:mm'));
                      }
                    });
                    this.slots.evening = slot;
                    this.checkIfToShowSlots(1);
                  }
                }
              }
            }
            this.buttonDisabled = false;
          } else if (response.status === 400) {
            this.loader.hide();
          }
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

  addTimeSlotsForProduct(type, current) {
    if (type === 'Start') {
      if (current.hours() < 12) {
        this.startSlots.morning.add(current.format((this.formSetting.date_format ? this.formSetting.date_format.toUpperCase() : 'YYYY-MM-DD')+' HH:mm'));
        // this.morningSlots.add(current.format('hh:mm a'));
      } else if (current.hours() >= 12 && current.hours() < 17) {
        this.startSlots.afternoon.add(current.format((this.formSetting.date_format ? this.formSetting.date_format.toUpperCase() : 'YYYY-MM-DD')+' HH:mm'));
        // this.afternoonSlots.add(current.format('hh:mm a'));
      } else {
        this.startSlots.evening.add(current.format((this.formSetting.date_format ? this.formSetting.date_format.toUpperCase() : 'YYYY-MM-DD')+' HH:mm'));
        // this.eveningSlots.add(current.format('hh:mm a'));
      }
    } else {
      if (current.hours() < 12) {
        this.slots.morning.add(current.format((this.formSetting.date_format ? this.formSetting.date_format.toUpperCase() : 'YYYY-MM-DD')+' HH:mm'));
        // this.morningSlots.add(current.format('hh:mm a'));
      } else if (current.hours() >= 12 && current.hours() < 17) {
        this.slots.afternoon.add(current.format((this.formSetting.date_format ? this.formSetting.date_format.toUpperCase() : 'YYYY-MM-DD')+' HH:mm'));
        // this.afternoonSlots.add(current.format('hh:mm a'));
      } else {
        let evening_slot;
        this.slots.evening.add(current.format((this.formSetting.date_format ? this.formSetting.date_format.toUpperCase() : 'YYYY-MM-DD')+' HH:mm'));
      }
    }

  }

  intervals(startString, endString, buffer_schedule, type) {
    let start, end, startEnd;
    if (type === 'Start') {
      start = moment(moment(this.bsStartValue).format(this.formSetting.date_format ? this.formSetting.date_format.toUpperCase() : 'YYYY-MM-DD') + ' ' + startString, (this.formSetting.date_format ? this.formSetting.date_format.toUpperCase() : 'YYYY-MM-DD') +' HH:mm');
      end = moment(moment(this.bsStartValue).format(this.formSetting.date_format ? this.formSetting.date_format.toUpperCase() : 'YYYY-MM-DD') + ' ' + endString, (this.formSetting.date_format ? this.formSetting.date_format.toUpperCase() : 'YYYY-MM-DD') +' HH:mm');

    } else if (type === 'End') {
      start = moment(moment(this.bsEndValue).format(this.formSetting.date_format ? this.formSetting.date_format.toUpperCase() : 'YYYY-MM-DD') + ' ' + startString, (this.formSetting.date_format ? this.formSetting.date_format.toUpperCase() : 'YYYY-MM-DD') +' HH:mm');
      end = moment(moment(this.bsEndValue).format(this.formSetting.date_format ? this.formSetting.date_format.toUpperCase() : 'YYYY-MM-DD') + ' ' + endString, (this.formSetting.date_format ? this.formSetting.date_format.toUpperCase() : 'YYYY-MM-DD') +' HH:mm');
    } else if (!type) {
      start = moment(moment(this.bsValue).format(this.formSetting.date_format ? this.formSetting.date_format.toUpperCase() : 'YYYY-MM-DD') + ' ' + startString, (this.formSetting.date_format ? this.formSetting.date_format.toUpperCase() : 'YYYY-MM-DD') +' HH:mm');
      end = moment(moment(this.bsValue).format(this.formSetting.date_format ? this.formSetting.date_format.toUpperCase() : 'YYYY-MM-DD') + ' ' + endString, (this.formSetting.date_format ? this.formSetting.date_format.toUpperCase() : 'YYYY-MM-DD') +' HH:mm');
    }



    // round starting minutes up to nearest 15 (12 --> 15, 17 --> 30)
    // note that 59 will round up to 60, and moment.js handles that correctly
    // start.minutes(Math.ceil(start.minutes() / 15) * 15);
    const result = [];
    const current = moment(start);
    if (type === 'Start') {
      while (current <= end) {

        if (this.formSetting.business_model_type !== 'RENTAL') {
          if (!moment().add(this.pre_booking_buffer, 'minutes').isAfter(current)) {
            this.addTimeSlotsForProduct(type, current);
          }
        } else if (this.formSetting.business_model_type === 'RENTAL' && this.product.unit_type >= 4) {
          this.addTimeSlotsForProduct(type, current);
        } else if (this.formSetting.business_model_type === 'RENTAL' && this.product.unit_type < 4) {
          if (!moment().add(this.pre_booking_buffer, 'minutes').isAfter(current)) {
            this.addTimeSlotsForProduct(type, current);
          }
        }

        current.add(buffer_schedule, 'minutes');
      }
    } else {
      while (current <= end) {
        if (this.formSetting.business_model_type !== 'RENTAL') {
          if (!moment().add(this.pre_booking_buffer, 'minutes').isAfter(current)) {
            this.addTimeSlotsForProduct(type, current);
          }
        } else if (this.formSetting.business_model_type === 'RENTAL' && this.product.unit_type >= 4) {
          this.addTimeSlotsForProduct(type, current);
        } else if (this.formSetting.business_model_type === 'RENTAL' && this.product.unit_type < 4) {
          if (!moment().add(this.pre_booking_buffer, 'minutes').isAfter(current)) {
            this.addTimeSlotsForProduct(type, current);
          }
        }

        current.add(buffer_schedule, 'minutes');
      }
    }
  }

  getSlots(startTime, endTime, slotInterval, type, date) {
   
    if (isNaN(Date.parse(startTime)) || isNaN(Date.parse(endTime))) {
  
      return [];
    }
    let durationMinutes = moment(endTime).diff(startTime, 'm');
    if (durationMinutes < 0) {
  
      return [];
    }
    let slotsLength;
    if (slotInterval != 0) {
      slotsLength = durationMinutes / slotInterval;
    } else {
      slotsLength = 0;
    }
    let slots = [];
    for (var index = 0; index < slotsLength; index++) {
      let slot = {
        startTime: moment(startTime).add(index * slotInterval, 'm'),
        endTime: moment(startTime).add((index + 1) * slotInterval, 'm')
      }
      if (moment(startTime).add(index * slotInterval, 'm').hours() < 12 && type == 0 && this.checkIsFurureTimeSlot(slot.startTime, date)) {
        slots.push(slot.startTime.format("HH:mm") + '-' + slot.endTime.format("HH:mm"));
      } else if (moment(startTime).add(index * slotInterval, 'm').hours() >= 12 && moment(startTime).add(index * slotInterval, 'm').hours() < 17 && type == 1 && this.checkIsFurureTimeSlot(slot.startTime, date)) {
        slots.push(slot.startTime.format("HH:mm") + '-' + slot.endTime.format("HH:mm"));
      } else if (moment(startTime).add(index * slotInterval, 'm').hours() >= 17 && type == 2 && this.checkIsFurureTimeSlot(slot.startTime, date)) {
        slots.push(slot.startTime.format("HH:mm") + '-' + slot.endTime.format("HH:mm"));
      }


    }

    return slots;
  }

  // checkIsFurureTimeSlot(slot): boolean {
  //   if (moment(slot, 'HH:mm').isAfter(moment())) {
  //     return true;
  //   } else {
  //     return false;
  //   }

  // }
  checkIsFurureTimeSlot(slot, date): boolean {
    if ((moment(date, 'YYYY-MM-DD').isSame(moment(), 'day') && moment(slot).isAfter(moment())) || moment(date, 'YYYY-MM-DD').isAfter(moment(), 'day')) {
      if (!moment().add(this.pre_booking_buffer, 'minutes').isAfter(moment(slot))) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }


  // ECOM Slot Interval
  slotIntervals(startString, endString, buffer_schedule, type) {

 
    let start, end, startEnd;
    if (type === 'Start') {
      start = moment(moment(this.bsStartValue).format('YYYY-MM-DD') + ' ' + startString, 'YYYY-MM-DD HH:mm');
      end = moment(moment(this.bsStartValue).format('YYYY-MM-DD') + ' ' + endString, 'YYYY-MM-DD HH:mm');

    } else if (type === 'End') {
      start = moment(moment(this.bsEndValue).format('YYYY-MM-DD') + ' ' + startString, 'YYYY-MM-DD HH:mm');
      end = moment(moment(this.bsEndValue).format('YYYY-MM-DD') + ' ' + endString, 'YYYY-MM-DD HH:mm');
    } else if (!type) {
      start = moment(moment(this.bsValue).format('YYYY-MM-DD') + ' ' + startString, 'YYYY-MM-DD HH:mm');
      end = moment(moment(this.bsValue).format('YYYY-MM-DD') + ' ' + endString, 'YYYY-MM-DD HH:mm');
    }
    // round starting minutes up to nearest 15 (12 --> 15, 17 --> 30)
    // note that 59 will round up to 60, and moment.js handles that correctly
    // start.minutes(Math.ceil(start.minutes() / 15) * 15);
    const result = [];
    const current = moment(start);
    if (type === 'Start') {
      while (current <= end) {
        if (current.hours() < 12) {

          this.startSlots.morning.add(current.format((this.formSetting.date_format ? this.formSetting.date_format.toUpperCase() : 'YYYY-MM-DD')+' HH:mm'));
          // this.morningSlots.add(current.format('hh:mm a'));
        } else if (current.hours() >= 12 && current.hours() < 17) {
          this.startSlots.afternoon.add(current.format((this.formSetting.date_format ? this.formSetting.date_format.toUpperCase() : 'YYYY-MM-DD')+' HH:mm'));
          // this.afternoonSlots.add(current.format('hh:mm a'));
        } else {
          this.startSlots.evening.add(current.format((this.formSetting.date_format ? this.formSetting.date_format.toUpperCase() : 'YYYY-MM-DD')+' HH:mm'));
          // this.slotsCombined.push(current.format('YYYY-MM-DD HH:mm'))
          // this.slotsCombined.push(current.format('HH:mm'));
        }
        current.add(buffer_schedule, 'minutes');

      }
    } else {
      while (current <= end) {

        if (current.hours() < 12) {
          this.slots.morning.add(current.format((this.formSetting.date_format ? this.formSetting.date_format.toUpperCase() : 'YYYY-MM-DD')+' HH:mm'));
          // this.morningSlots.add(current.format('hh:mm a'));
        } else if (current.hours() >= 12 && current.hours() < 17) {
          this.slots.afternoon.add(current.format((this.formSetting.date_format ? this.formSetting.date_format.toUpperCase() : 'YYYY-MM-DD') +' HH:mm'));
          // this.afternoonSlots.add(current.format('hh:mm a'));
        } else {

          this.slots.evening.add(current.format((this.formSetting.date_format ? this.formSetting.date_format.toUpperCase() : 'YYYY-MM-DD')+' HH:mm'));
          // this.slotsCombined.push(current.format('YYYY-MM-DD HH:mm'))
          // this.slotsCombined.push(current.format('HH:mm'));
        }

        current.add(buffer_schedule, 'minutes');
      }
    }
  }




  highlightSlot(event, slot): void {
    if (this.formSetting.business_model_type == 'ECOM') {
      $('div.slot-ui').each(function () {
        $(this).removeClass('selected-slot-ui-ecom');
      });
      $(event.target).addClass('selected-slot-ui-ecom');

    } else {
      $('div.slot-ui').each(function () {
        $(this).removeClass('selected-slot-ui');
      });
      $(event.target).addClass('selected-slot-ui');
    }


  }

  resetDialog() {
    $('#timeSelection').modal('hide');
    this.selectedAgent = null;
    this.selectedAgentIndex = -1;
    this.selectAgentModal = 0;
  }

  addTimings() {
    this.buttonDisabled = true;
    // ECOM flow
    if (this.formSetting.business_model_type == 'ECOM') {
      this.bsEndValue = this.bsStartValue;
      this.tEndFormat = this.tStartFormat;
      let startTimeToSend, endTimeToSend;
      if (this.startEndTime) {
        startTimeToSend = this.startEndTime.split('-')[0];
        endTimeToSend = this.startEndTime.split('-')[1];
        this.endTime = endTimeToSend;
        this.startTime = startTimeToSend;
      }

      const dataGot: any = this.pushSelectedDateToPayload();
      dataGot.product = this.product;
      dataGot.index = this.productIndex;
      dataGot.storeIndex = this.storeIndex;
      dataGot.unit_count = this.unit_count;
      dataGot.user_id = this.product.user_id;
      this.checkAvailabilityOfSlots(dataGot)
    } else {
      if (this.product.enable_tookan_agent || this.product.is_agents_on_product_tags_enabled) {
        const dataGot: any = this.pushSelectedDateToPayload();
        if (dataGot.start) {
          dataGot.product = this.product;
          dataGot.index = this.productIndex;
          dataGot.storeIndex = this.storeIndex;
          dataGot.unit_count = this.unit_count;
          dataGot.user_id = this.product.user_id;
          if(this.selectedAgent && this.product.is_agents_on_product_tags_enabled){
            dataGot.product.agent_id = this.selectedAgent.fleet_id;
          }
          this.checkAvailabilityOfSlots(dataGot);
        } else {
          return;
        }
      } else {
        if (this.product.unit_type === 1 && this.restaurantInfo.pd_or_appointment === 1) {
          if (!this.startTime) {
            this.buttonDisabled = false;
            const msg = this.languageStrings.pls_select_time_slot || 'Please select a time slot.';
            this.popup.showPopup(MessageType.ERROR, 2000, msg, false);
            return;
          } else if (new Date() > this.makeDateTimeFormat(this.bsStartValue, this.startTime)) {
            this.buttonDisabled = false;
            const msg = this.languageStrings.pls_select_time_greater_than_current || 'Please select time greater than current time.';
            this.popup.showPopup(MessageType.ERROR, 2000, msg, false);
            return;
          } else {
            const dataGot: any = {};
            dataGot.product = this.product;
            dataGot.index = this.productIndex;
            dataGot.storeIndex = this.storeIndex;
            dataGot.unit_count = this.unit_count;
            dataGot.user_id = this.product.user_id;
            dataGot.start = moment(this.makeDateTimeFormat(this.bsStartValue, this.startTime)).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
            dataGot.end = moment(this.makeDateTimeFormat(this.bsStartValue, this.startTime)).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
            this.checkAvailabilityOfSlots(dataGot);
          }
        } else {
          const dataGot: any = this.pushSelectedDateToPayload();
          if (dataGot.start) {
            dataGot.product = this.product;
            dataGot.index = this.productIndex;
            dataGot.storeIndex = this.storeIndex;
            dataGot.unit_count = this.unit_count;
            dataGot.user_id = this.product.user_id;
            this.checkAvailabilityOfSlots(dataGot);
          } else {
            return;
          }
        }
      }
    }
  }

  // ======================check availability of slots========================

  checkAvailabilityOfSlots(data) {

    const dataSend = {
      product_id: data.product.product_id,
      start_time: data.start,
      end_time: data.end,
      currency_id: this.currency.currency_id,
      user_id: this.product.user_id,
      marketplace_user_id: this.sessionService.get('config').marketplace_user_id
    };
    if (this.sessionService.get('appData')) {
      dataSend['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      dataSend['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    if(data.product.agent_id && this.product.is_agents_on_product_tags_enabled){
      dataSend['agent_id']= data.product.agent_id;
    }
    this.productTimingService.checkTimeSlots(dataSend)
      .subscribe(response => {
        try {
          if (response.status === 200) {
            this.buttonDisabled = true;
            $('#timeSelection').modal('hide');
        if(response.data.surge_amount)
        {
          data.product.surge_amount=response.data.surge_amount;
          this.surgeAmountData=data;
          this.openSurgePopup();
        }
        else
        {
            this.sendDataForProduct.emit(data);
        }
          } else if (response.status === 400) {
            this.buttonDisabled = false;
            this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
          } else {
            this.buttonDisabled = false;
            this.popup.showPopup(MessageType.ERROR, 2500, response.message, false);
          }
        } catch (e) {
          console.error(e);
        }
      },
        error => {
          console.error(error);
        });
  }
  /*
  open SurgePopUp
  */
  openSurgePopup()
  {
    this.confirmationService.confirm({
    header: 'Confirm',
    message: this.terminology.SURGE_APPLIED,
    confirmBtnText: status ? (this.languageStrings.cancel ||'Cancel') : (this.languageStrings.continue ||'Continue'),
    accept: () => {
      this.sendDataForProduct.emit(this.surgeAmountData);
    },
    reject: () => {
       }
  });

  }
  pushSelectedDateToPayload() {
    let status = true;
    let newStatus = true;
    let dateStartTime, dateEndTime, totalData;

    if (!this.startTime) {
      this.buttonDisabled = false;
      this.languageStrings.pls_select_start_time = (this.languageStrings.pls_select_start_time || 'Please select a start time slot.')
      .replace('START_TIME', this.terminology.START_TIME);
      const msg = this.languageStrings.pls_select_start_time;
      this.popup.showPopup(MessageType.ERROR, 2000, msg, false);
      return false;
    } else if (!this.endTime && !this.product.service_time) {
      this.buttonDisabled = false;

      this.languageStrings.pls_select_end_time = (this.languageStrings.pls_select_end_time || 'Please select a end time slot.')
      .replace('END_TIME', this.terminology.END_TIME);
      const msg = this.languageStrings.pls_select_end_time;
      this.popup.showPopup(MessageType.ERROR, 2000, msg, false);
      return false;
    } else {
      this.buttonDisabled = true;





      if (this.product.enable_tookan_agent) {
        dateStartTime = moment(moment(this.bsStartValue).format('YYYY-MM-DD') +
          this.startTime.split('-')[0], 'YYYY-MM_DDhh:mma').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        if (this.product.service_time) {
          dateEndTime = moment(dateStartTime).add(this.product.service_time, "minutes");
        } else {
          dateEndTime = moment(moment(this.bsEndValue).format('YYYY-MM-DD') +
            this.endTime.split('-')[0], 'YYYY-MM_DDhh:mma').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        }
      } else {
        if (this.product.unit_type !== 1) {
          dateStartTime = moment(moment(this.bsStartValue).format('YYYY-MM-DD') +
            this.startTime + this.tStartFormat, 'YYYY-MM_DDhh:mma').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
          if (this.product.service_time) {
            dateEndTime = moment(dateStartTime).add(this.product.service_time, "minutes");
          } else {
            dateEndTime = moment(moment(this.bsEndValue).format('YYYY-MM-DD') +
              this.endTime + this.tEndFormat, 'YYYY-MM_DDhh:mma').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
          }
        } else if (this.product.unit_type === 1 && this.restaurantInfo.pd_or_appointment === 1) {
          dateStartTime = moment(this.makeDateTimeFormat(this.bsStartValue, this.startTime)).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
          if (this.product.service_time) {
            dateEndTime = moment(dateStartTime).add(this.product.service_time, "minutes");
          } else {
            dateEndTime = moment(this.makeDateTimeFormat(this.bsEndValue, this.endTime)).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
          }
        } else {
          dateStartTime = moment(moment(this.bsStartValue).format('YYYY-MM-DD') +
            this.startTime + this.tStartFormat, 'YYYY-MM_DDhh:mma').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
          if (this.product.service_time) {
            dateEndTime = moment(dateStartTime).add(this.product.service_time, "minutes");
          } else {
            dateEndTime = moment(moment(this.bsEndValue).format('YYYY-MM-DD') +
              this.endTime + this.tEndFormat, 'YYYY-MM_DDhh:mma').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
          }
        }
      }



      status = this.checkStartEndDate(dateStartTime, dateEndTime);


      if (status && this.restaurantInfo.business_type === 2) {
        newStatus = this.checkAccordingToBusiness(dateStartTime, dateEndTime);
      }

      if (status && newStatus) {
        totalData = {
          start: dateStartTime,
          end: dateEndTime
        };
        return totalData;
      } else {
        return false;
      }
    }
  }

  makeDateTimeFormat(date, time) {
    date.setHours(time.getHours());
    date.setMinutes(time.getMinutes());
    date.setSeconds(0);
    date.setMilliseconds(0);
    const newDateFormat = new Date(date);
    return newDateFormat;
  }

  checkStartEndDate(startDate, endDate) {
    const offset: any = new Date().getTimezoneOffset();
    const startDateTime: any = new Date(startDate);
    const endDateTime = new Date(endDate);
    const today = new Date(moment().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'));
    // const t1 = new Date(startDateTime + (offset * 60000));

    if (endDateTime.getTime() <= startDateTime.getTime()) {
      this.buttonDisabled = false;
      this.languageStrings.end_time_should_greater_than_start = (this.languageStrings.end_time_should_greater_than_start || 'End Time should greater than Start time.')
      .replace('END_TIME', this.terminology.END_TIME);
      this.languageStrings.end_time_should_greater_than_start = this.languageStrings.end_time_should_greater_than_start
      .replace('START_TIME', this.terminology.START_TIME);
      const msg = this.languageStrings.end_time_should_greater_than_start;
      this.popup.showPopup(MessageType.ERROR, 2500, msg, false);
      return false;
    } else if ((startDateTime.setSeconds(0) - today.setSeconds(0)) < 180000) {
      this.buttonDisabled = false;
      this.languageStrings.start_time_should_3_min_greater = (this.languageStrings.start_time_should_3_min_greater || 'Start Time should be 3 minutes greater than current time.')
      .replace('START_TIME', this.terminology.START_TIME);
      const msg = this.languageStrings.start_time_should_3_min_greater;
      this.popup.showPopup(MessageType.ERROR, 2500, msg, false);
      return false;
    } else if (((endDateTime.setSeconds(0) - startDateTime.setSeconds(0)) / 60000) < 2) {
      this.buttonDisabled = false;
      this.languageStrings.end_time_should_2_min_greater = (this.languageStrings.end_time_should_2_min_greater || 'End Time should be 2 minutes greater than Start Time.')
      .replace('END_TIME', this.terminology.END_TIME);
      this.languageStrings.end_time_should_2_min_greater = this.languageStrings.end_time_should_2_min_greater
      .replace('START_TIME', this.terminology.START_TIME);
      const msg = this.languageStrings.end_time_should_2_min_greater;
      this.popup.showPopup(MessageType.ERROR, 2500, msg, false);
      return false;
    } else {
      this.buttonDisabled = true;
      return true;
    }
  }

  checkAccordingToBusiness(startDate, endDate) {
    const offset: any = new Date().getTimezoneOffset();
    const startDateTime: any = new Date(startDate).setSeconds(0);
    const endDateTime: any = new Date(endDate).setSeconds(0);
    const start: any = new Date(startDateTime).getTime();
    const end: any = new Date(endDateTime).getTime();
    const startD: any = new Date(start + (offset * 60000));
    const endD: any = new Date(end + (offset * 60000));
    if (this.product.unit_type === 2) {// MINUTE
      if (this.getTimeDifference(startD, endD, 'seconds', 'minute', this.product.unit_type)) {
        return true;
      } else {
        return false;
      }
    } else if (this.product.unit_type === 3) {// HOUR
      if (this.getTimeDifference(startD, endD, 'seconds', 'hour', this.product.unit_type)) {
        return true;
      } else {
        return false;
      }
    } else if (this.product.unit_type === 4) {// DAY
      if (this.getTimeDifference(startD, endD, 'seconds', 'day', this.product.unit_type)) {
        return true;
      } else {
        return false;
      }
    } else if (this.product.unit_type === 5) {// WEEK
      if (this.getTimeDifference(startD, endD, 'days', 'week', this.product.unit_type)) {
        return true;
      } else {
        return false;
      }
    } else if (this.product.unit_type === 6) {// MONTH
      if (this.getTimeDifference(startD, endD, 'days', 'month', this.product.unit_type)) {
        return true;
      } else {
        return false;
      }
    } else if (this.product.unit_type === 7) {// YEAR
      if (this.getTimeDifference(startD, endD, 'days', 'year', this.product.unit_type)) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }



  getTimeDifference(startD, endD, differType, unitTypeString, unitType) {
    const timeDifference: any = moment(endD).set('second', 0).diff(moment(startD).set('second', 0), differType);
    let checkMultiples: any;
    switch (unitType) {
      case 2:
        this.unit_count = (timeDifference / 60) / this.product.unit;
        checkMultiples = (timeDifference / 60) % this.product.unit;
        break;
      case 3:
        this.unit_count = (timeDifference) / (this.product.unit * 3600);
        checkMultiples = (timeDifference) % (this.product.unit * 3600);
        break;
      case 4:
        this.unit_count = (timeDifference) / (86400);
        checkMultiples = (timeDifference) % (86400);
        break;
      case 5:
        if (timeDifference === 0) {
          this.unit_count = 1;
          checkMultiples = 1;
        } else {
          this.unit_count = (timeDifference) / (7);
          checkMultiples = (timeDifference) % (7);
        }
        break;
      case 6:
        if (timeDifference === 0) {
          this.unit_count = 1;
          checkMultiples = 1;
        } else {
          this.unit_count = (timeDifference) / (30);
          checkMultiples = (timeDifference) % (30);
        }
        break;
      case 7:
        if (timeDifference === 0) {
          this.unit_count = 1;
          checkMultiples = 1;
        } else {
          this.unit_count = (timeDifference) / (365);
          checkMultiples = (timeDifference) % (365);
        }
        break;
    }
    if (checkMultiples) {
      this.buttonDisabled = false;
      this.languageStrings.start_time_end_time_should_be_multiple_1 = (this.languageStrings.start_time_end_time_should_be_multiple_1 || 'Start time & End Time should be multiple of 1 minute(s).')
      .replace('START_TIME', this.terminology.START_TIME);
      this.languageStrings.start_time_end_time_should_be_multiple_1 = this.languageStrings.start_time_end_time_should_be_multiple_1 || 'Start time & End Time should be multiple of 1 minute(s).'
      .replace('END_TIME', this.terminology.END_TIME);
      this.languageStrings.start_time_end_time_should_be_multiple_1 = this.languageStrings.start_time_end_time_should_be_multiple_1 || 'Start time & End Time should be multiple of 1 minute(s).'
      .replace('1 minute(s)', this.product.unit + ' ' + unitTypeString + '(s)');
      const msg = this.languageStrings.start_time_end_time_should_be_multiple_1;
      this.popup.showPopup(MessageType.ERROR, 2500, msg, false);
      return false;
    } else {
      this.buttonDisabled = true;
      return true;
    }

  }
  /**
   * Get list of tookan agents available for scheduling
   */
  getAgents(){
    // this.loader.show();
    const obj = {
      marketplace_user_id : this.sessionService.get('config').marketplace_user_id,
      product_id : this.product.product_id,
      user_id : this.product.user_id,
      language : this.sessionService.getString('language')
    }
    if(this.sessionService.get('appData') && this.sessionService.get('appData').vendor_details){
      obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    if(this.sessionService.get('location')){
      obj['latitude'] = this.sessionService.get('location').lat;
      obj['longitude']= this.sessionService.get('location').lng;
    }
    this.productTimingService.getAgentList(obj).subscribe(res=>{
      // this.loader.hide();
      if(res.status == 200){
        this.agentList = res.data;
      } else {
        this.agentList = [];
      }
    }, err =>{
      // this.loader.hide();
      console.error(err);
    })
  }
  /**
   * on selecting an agent
   */
  onSelectAgent(agent, index){
    this.selectedAgentIndex = index;
    this.selectedAgent = agent;
    this.getProductTimeSlots('Agent');
  }
  makeSlots(slotList,checkAvailibiltyKey,startTimeKey, endTimeKey,buffer, dateFormatter){
    const offset = new Date().getTimezoneOffset();
    let newSlots = [];
    let  availableSlots = {
      morning: new Set(),
      afternoon: new Set(),
      evening: new Set()
    };
    for (let i = 0; i < slotList.length; i++) {
      if (slotList[i][checkAvailibiltyKey] === 0) {
        const slotStartTime: any = new Date(slotList[i][startTimeKey]).getTime();
        const actualStartSlot: any = new Date(slotStartTime + (offset * 60000));
        const slotEndTime: any = new Date(slotList[i][endTimeKey]).getTime();
        const actualEndSlot: any = new Date(slotEndTime + (offset * 60000));
        slotList[i].start = moment(actualStartSlot).format((this.formSetting.date_format ? this.formSetting.date_format.toUpperCase() : 'YYYY-MM-DD') +' HH:mm');
        slotList[i].end = moment(actualEndSlot).format((this.formSetting.date_format ? this.formSetting.date_format.toUpperCase() : 'YYYY-MM-DD') + ' HH:mm');
        newSlots.push(slotList[i]);
        let date_format = this.formSetting.date_format;
        let date_array=["dd-MMM-yyyy","dd-MM-yy","dd-MM-yyyy","MMMM dd yyyy"];
        if(date_array.includes(date_format))
        {
          date_format=date_format.toUpperCase();
        }
        let date;
        if (this.formSetting.time_format === this.timeFormat.TWELVE_HOURS) {
          date = moment(slotList[i].start,`${date_format} ${dateFormatter}`);
        } else {
          date = moment(slotList[i].start,`${date_format} HH:mm`);
        }
        const current = date
        if (!moment().add(buffer, 'minutes').isAfter(current)) {
          if (current.hours() < 12) {
            if (this.formSetting.time_format === this.timeFormat.TWELVE_HOURS) {
              availableSlots.morning.add(moment(current._i,`${date_format} ${dateFormatter}`).format(dateFormatter));
            } else {
              availableSlots.morning.add(moment(current._i,`${date_format} HH:mm`).format('HH:mm'));
            }
          } else if (current.hours() >= 12 && current.hours() < 17) {
            if (this.formSetting.time_format === this.timeFormat.TWELVE_HOURS) {
              availableSlots.afternoon.add(moment(current._i,`${date_format} ${dateFormatter}`).format(dateFormatter));
            } else {
              availableSlots.afternoon.add(moment(current._i,`${date_format} HH:mm`).format('HH:mm'));
            }
          } else {
            if (this.formSetting.time_format === this.timeFormat.TWELVE_HOURS) {
              availableSlots.evening.add(moment(current._i,`${date_format} ${dateFormatter}`).format(dateFormatter));
            } else {
              availableSlots.evening.add(moment(current._i,`${date_format} HH:mm`).format('HH:mm'));
            }
          }
        }
      }
    }
    const returnObject = {
      availableSlots,
      newSlots,
      slotList
    }
    return returnObject;
  }
  onhideViewMore(agent) {
    this.previousagent.show = false;
  }

  onViewMore(agent) {
    if (this.previousagent && this.previousagent.show) {
      this.previousagent.show = false;
    }
    agent.show = true;
    this.previousagent = agent;
  }
  parseDateTime(data, type) {
    let value = new Date(data).toString();
          let valueArray = value.split(" ");
          if (type === "Date") {
            valueArray = valueArray.slice(0,4);
          } else {
            valueArray = valueArray.slice(0, 5);
          }
          value = valueArray.join().replace(/\,/g," ");
          return value;
  }

}
