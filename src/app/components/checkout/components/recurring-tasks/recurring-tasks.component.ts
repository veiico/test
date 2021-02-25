import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { debounceTime, takeWhile } from 'rxjs/operators';

import { AppService } from '../../../../../app/app.service';
import { WeekDays, MessageType } from '../../../../constants/constant';
import { DAY, TimeFormat } from '../../../../enums/enum';
import { PopUpService } from '../../../../modules/popup/services/popup.service';
import { SessionService } from '../../../../services/session.service';
import { CheckOutService } from '../../checkout.service';
import { LoaderService } from '../../../../services/loader.service';

declare var $: any;

@Component({
    selector: 'app-recurring-tasks',
    templateUrl: 'recurring-tasks.component.html',
    styleUrls: ['./recurring-tasks.scss']
})

export class RecurringTasksComponent {
    @Input() deliveryAddress: any;
    @Input() pickupDropAddress: any;
    public openSlots = false;
    public disableSchedulingInput: boolean;
    recurStartTime: string;
    public disableRecInput;
    public disableEndDate: boolean = false;
    public slots = {
        morning: new Set(),
        afternoon: new Set(),
        evening: new Set()
    };
    public recurringEndType = 'date';
    public bsRecurStartDate = new Date();
    public bsRecurEndDate = new Date(new Date().setDate(new Date().getDate() + 8));

    public colorTheme = 'theme-dynamic';
    public morning = [];
    public afternoon = [];
    public weekDays = WeekDays;
    public evening = [];
    recurrenceRule = 0;
    selectedWeekDays = {};
    restaurantRecData;
    disableRecOccInput = false;
    bsConfig: { containerClass: string; showWeekNumbers: boolean; dateInputFormat: string; };
    showWeekendOption: boolean;
    showWeekDaysOption: boolean;
    maxEndDate = new Date(new Date().setDate(new Date().getDate() + 97));
    minEndDate = new Date(new Date().setDate(new Date().getDate() + 9));
    maxStartDate;
    minStartDate = new Date();
    occurrence;
    langJson;
    recurringForm: FormGroup;
    recurringValueChanges = new Subject();
    alive = true;
    tFormat;
    direction = 'ltr';
    timeFormat = TimeFormat;
    config
    public restaurantInfo: any;
    public deliverySurgeList: any = [];
    public currency: string;
    public showRecurrTime: string;
  terminology: any;
    languageStrings: any={};
    constructor(protected sessionService: SessionService, private checkoutService: CheckOutService,
        private appService: AppService, private popup: PopUpService,  protected loader: LoaderService) {
          this.setConfig();
    }

    ngOnChanges() {
        if(this.deliveryAddress || this.pickupDropAddress.lat){
           this.deliverySurgeChargeList();
        }
     }

    ngOnInit() {

        this.config = this.sessionService.get('config');
 
        this.restaurantInfo = this.sessionService.get('info') || {};
        this.appService.langPromise.then(() => {
            this.langJson = this.appService.getLangJsonData();
        });
        this.bsConfig = Object.assign({}, {
            containerClass: this.colorTheme, showWeekNumbers: false,
            dateInputFormat: 'LL'
        });
        this.currency = this.config.payment_settings[0].symbol;
        // this.createRecurringForm();
        this.setListenerForValueChanges();
        this.getSlots();
        this.setLanguage();
        this.sessionService.langStringsPromise.then(() =>
        {
         this.languageStrings = this.sessionService.languageStrings;
         this.languageStrings.delivery_charge = (this.languageStrings.delivery_charge || "Delivery Charge")
         .replace('DELIVERY_DELIVERY', this.config.terminology.DELIVERY)
        });
    }

    setLanguage() {
        let languageSelected;
        if (this.sessionService.getString('language')) {
            languageSelected = this.sessionService.getString('language');
            if (languageSelected === 'ar') {
                this.direction = 'rtl';
            } else {
                this.direction = 'ltr';
            }
        } else {
            languageSelected = 'en';
            if (languageSelected === 'ar') {
                this.direction = 'rtl';
            } else {
                this.direction = 'ltr';
            }
        }
    }

    // createRecurringForm(){
    //     this.recurringForm= this.fb.group({
    //         'startTime': [''],
    //         'endDate': [''],
    //         'startTime': [''],
    //         'occurrence': ['', Validators.compose([Validators.required])]
    //     })
    // }


    getSlots() {
        const data: any = {};
        data.date=moment(this.bsRecurStartDate).format('YYYY-MM-DD');
        this.checkoutService.getSlotsForRecurring(data)
            .subscribe(response => {
                if (response.status == 200) {
                    this.restaurantRecData = response.data;
                    this.setWeekDays();
                    this.setSlots();
                }
            });
    }

    /** set Active week days */
    setWeekDays() {
        this.restaurantRecData.active_days.forEach((day) => {
            this.weekDays[day.day_id].is_active = !!day.is_active;
        })
        // this.weekDays.forEach((day))
        if (this.weekDays[DAY.SUNDAY].is_active || this.weekDays[DAY.SATURDAY].is_active) {
            this.showWeekendOption = true
        }
        else {
            this.showWeekendOption = false;
        }
        if (this.weekDays[DAY.MONDAY].is_active || this.weekDays[DAY.TUESDAY].is_active || this.weekDays[DAY.WEDNESDAY].is_active
            || this.weekDays[DAY.THURSDAY].is_active || this.weekDays[DAY.FRIDAY].is_active) {
            this.showWeekDaysOption = true
        }
        else {
            this.showWeekDaysOption = false;
        }
        this.setRecurrenceRule(0);
    }

  /**
   * set config
   */
    setConfig() {
      this.config = this.sessionService.get("config");
      if (this.config) {
        this.config.borderColor = this.config["color"] || "#e13d36";
        this.terminology = this.config.terminology;
      }
    }
    setSlots() {
        this.afternoon = [];
        this.morning = [];
        this.evening = [];
        this.restaurantRecData.slots_array.map((item) => {
            this.intervalsNew(item);
        });

        this.slots.morning = new Set(Array.from(new Set(this.slots.morning)).sort());
        this.slots.afternoon = new Set(Array.from(new Set(this.slots.afternoon)).sort());
        this.slots.evening = new Set(Array.from(new Set(this.slots.evening)).sort());
        let slot = new Set();
        let date,date_format = this.config.date_format;
        let date_array=["dd-MMM-yyyy","dd-MM-yy","dd-MM-yyyy","MMMM dd yyyy"];
        if(date_array.includes(date_format))
        {
          date_format=date_format.toUpperCase();
        }
        this.slots.morning.forEach((item, index) => {
            if (this.config.time_format === this.timeFormat.TWELVE_HOURS) {
                slot.add(moment(item,`${date_format} hh:mm`).format('hh:mm'));
            } else {
                slot.add(moment(item,`${date_format} HH:mm`).format('HH:mm'));
            }
        });
        this.slots.morning = slot;
        slot = new Set();
        this.slots.afternoon.forEach((item, index) => {
            if (this.config.time_format === this.timeFormat.TWELVE_HOURS) {
                slot.add(moment(item,`${date_format} hh:mm`).format('hh:mm'));
            } else {
                slot.add(moment(item,`${date_format} HH:mm`).format('HH:mm'));
            }
        });
        this.slots.afternoon = slot;
        slot = new Set();
        this.slots.evening.forEach((item, index) => {
            if (this.config.time_format === this.timeFormat.TWELVE_HOURS) {
                slot.add(moment(item,`${date_format} hh:mm`).format('hh:mm'));
            } else {
                slot.add(moment(item,`${date_format} HH:mm`).format('HH:mm'));
            }
        });
        this.slots.evening = slot;
    }


    intervalsNew(date) {

        let start = moment(date, 'YYYY-MM-DD HH:mm');

        const result = [];
        const current = moment(start);
        if(!moment().isAfter(current)){
            if (current.hours() < 12) {
                if (this.config.time_format === this.timeFormat.TWELVE_HOURS) {
                    this.morning.push(current.format((this.config.date_format ? this.config.date_format.toUpperCase() : 'YYYY-MM-DD')+ ' hh:mm A'));
                } else {
                    this.morning.push(current.format((this.config.date_format ? this.config.date_format.toUpperCase() : 'YYYY-MM-DD') + ' HH:mm'));
                }
                this.slots.morning = new Set(this.getFilterOutDuplicate(this.morning));
            } else if (current.hours() >= 12 && current.hours() < 17) {
                if (this.config.time_format === this.timeFormat.TWELVE_HOURS) {
                    this.afternoon.push(current.format((this.config.date_format ? this.config.date_format.toUpperCase() : 'YYYY-MM-DD')+' hh:mm A'));
                } else {
                    this.afternoon.push(current.format((this.config.date_format ? this.config.date_format.toUpperCase() : 'YYYY-MM-DD')+' HH:mm'));
                }
                this.slots.afternoon = new Set(this.getFilterOutDuplicate(this.afternoon));
            } else {
                if (this.config.time_format === this.timeFormat.TWELVE_HOURS) {
                    this.evening.push(current.format((this.config.date_format ? this.config.date_format.toUpperCase() : 'YYYY-MM-DD')+' hh:mm A'));
                } else {
                    this.evening.push(current.format((this.config.date_format ? this.config.date_format.toUpperCase() : 'YYYY-MM-DD')+' HH:mm'));
                }
                this.slots.evening = new Set(this.getFilterOutDuplicate(this.evening));
            }
        }
    }

    deliverySurgeChargeList(){
        let day_array = [];
        this.weekDays.forEach((day) => {
            if (day.is_selected) {
                day_array.push(day.day_id);
            }
        });
        if(day_array.length && this.recurStartTime){
            let schedule_time = moment(moment().format('YYYY-MM-DD') + this.recurStartTime + this.tFormat, 'YYYY-MM_DDhh:mma').format('HH:mm');
            this.showRecurrTime = moment(moment().format('YYYY-MM-DD') + this.recurStartTime + this.tFormat, 'YYYY-MM_DDhh:mma').format('hh:mm A');
            const obj = {
                marketplace_user_id: this.config.marketplace_user_id,
                language: this.sessionService.getString('language'),
                user_id: this.restaurantInfo['storefront_user_id'],
                schedule_time: schedule_time,
                marketplace_reference_id: this.config.marketplace_reference_id,
                latitude: this.deliveryAddress ? this.deliveryAddress.latitude : this.sessionService.get('location').lat,
                longitude: this.deliveryAddress ? this.deliveryAddress.longitude : this.sessionService.get('location').lng,
                day_ids: day_array,
                job_pickup_datetime: moment().format( "YYYY-MM-DDTHH:mm:ss.SSS[Z]")
            }
            if (this.sessionService.get('appData')) {
                obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
                obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
            }
            if(this.pickupDropAddress.address && this.pickupDropAddress.lat && this.pickupDropAddress.lng){
               obj['custom_pickup_address'] = this.pickupDropAddress.address;
               obj['custom_pickup_latitude'] = this.pickupDropAddress.lat;
               obj['custom_pickup_longitude'] = this.pickupDropAddress.lng;
               obj['pick_and_drop'] = 1;
            }
            this.loader.show();
            this.checkoutService.getdeliverySurgeChargeList(obj).subscribe(res => {
                this.loader.hide();
                if (res.status == 200) {
                    let surgeResponse = res.data.data;
                    this.deliverySurgeList = [];
                    surgeResponse.forEach((element) => {
                        this.deliverySurgeList.push({
                            day: this.weekDays[element.day_id].day_name,
                            charge: element.delivery_charges,
                            day_id: element.day_id
                        })
                    })
                } else {
                    this.popup.showPopup(MessageType.ERROR, 2000, res.message, false);
                }
            }, err => {
                this.loader.hide();
                this.popup.showPopup(MessageType.ERROR, 2000, err.message, false);
                return false;
            })
        }
      }


    getFilterOutDuplicate(data) {
        const uniq = {};
        let arrFiltered = data.filter(obj => !uniq[obj] && (uniq[obj] = true));
        return arrFiltered;
    }

    highlightSlot(event, slot): void {
        $('div.slot-ui').each(function () {
            $(this).removeClass('selected-slot-ui');
        });
        $(event.target).addClass('selected-slot-ui');
        this.valueChanges();
        this.deliverySurgeChargeList();
    }


    toggleSlotPicker() {
        if (!this.disableSchedulingInput) {
            this.openSlots = !this.openSlots;

        }
    }

    onDatePickerShown() {
        $('body').css('position', 'initial');
        // this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.choose_date_slots, 'Date Field Opened', 'Date Field Opened', '');
    }

    dateChanged() {
        $('body').css('position', 'relative');
        this.minEndDate = moment(this.bsRecurStartDate).add('7', 'days').toDate();
        this.bsRecurEndDate = moment(this.bsRecurStartDate).add('7', 'days').toDate();
        this.maxEndDate = moment(this.bsRecurStartDate).add('90', 'days').toDate();

        this.recurStartTime = '';
        this.slots = {
            morning: new Set(),
            afternoon: new Set(),
            evening: new Set()
        };
        this.getSlots();
    }

    endDateChanged() {
        $('body').css('position', 'relative');
        // this.minStartDate = moment(this.bsRecurStartDate).add('29', 'days').toDate();
    }


    disableoccurrenceInp() {
        this.disableRecOccInput = true;
    }

    stopPropagation(e) {
        e.stopPropagation();
    }

    selectWeekDay(day) {

        if (this.weekDays[day].is_selected)
            this.weekDays[day].is_selected = false;
        else
            this.weekDays[day].is_selected = true;

        this.recurrenceRule = -1;
        this.valueChanges();
        this.deliverySurgeChargeList();
    }

    setRecurrenceRule(type) {

        this.recurrenceRule = type;
        switch (type) {
            case 0:
                this.weekDays.forEach((day) => day.is_active ? day.is_selected = true : '');
                break;

            case 1:
                this.weekDays.forEach((day) => {
                    if (day.is_active && day.day_id == DAY.MONDAY || day.day_id == DAY.TUESDAY || day.day_id == DAY.WEDNESDAY ||
                        day.day_id == DAY.THURSDAY || day.day_id == DAY.FRIDAY) {
                        day.is_selected = true;
                    }
                    else {
                        day.is_selected = false
                    }

                });
                break;
            case 2:
                this.weekDays.forEach((day) => (day.is_active && day.day_id == DAY.SATURDAY || day.day_id == DAY.SUNDAY)
                    ? day.is_selected = true : day.is_selected = false);
                break;

            default:
                this.weekDays.forEach((day) => day.is_selected = false)
        }
        this.valueChanges();
    }

    checkValidationForRecData(showError) {
        let day_array = [];
        this.weekDays.forEach((day) => {
            if (day.is_selected) {
                day_array.push(day.day_id);
            }
        });
        if (day_array.length == 0) {
            showError ? this.popup.showPopup('error', 2000, this.languageStrings.pls_select_atleast_one_day || 'Please select atleast one day.', false) : '';
            return false;
        }
        if (!this.recurStartTime) {
            showError ? this.popup.showPopup('error', 2000, this.languageStrings.pls_select_time_slot || 'Please select a time slot.', false) : '';
            return false;
        }

        if (this.recurringEndType == 'occurrence' && this.occurrence < 1) {
            showError ? this.popup.showPopup('error', 2000, this.languageStrings.pls_enter_number_of_occurrences || 'Please enter number of occurrences.', false) : '';
            return false;
        }

        return true;
    }

    getRecurringTaskData() {

        const recurrenceData: any = {};
        let day_array = [];
        this.weekDays.forEach((day) => {
            if (day.is_selected && day.is_active) {
                day_array.push(day.day_id);
            }
        });
        recurrenceData['day_array'] = day_array;
        recurrenceData['start_schedule'] = moment(this.bsRecurStartDate).format('YYYY-MM-DD');
        recurrenceData['schedule_time'] = this.recurStartTime;
        let schedule_time_24 = moment(moment().format('YYYY-MM-DD') +
            this.recurStartTime + this.tFormat, 'YYYY-MM_DDhh:mma').format('HH:mm');
        recurrenceData['schedule_time'] = schedule_time_24;
        recurrenceData['is_recurring_enabled'] = true;
        if (this.recurringEndType == 'date') {
            recurrenceData['end_schedule'] = moment(this.bsRecurEndDate).format('YYYY-MM-DD');
            // recurrenceData['occurrence_count'] = '';
        }
        else {
            recurrenceData['occurrence_count'] = this.occurrence.toString();
            // recurrenceData['end_schedule'] = '';
        }
        return recurrenceData;
    }

    valueChanges() {
        if (+this.occurrence > 90) {
            this.occurrence = 90
        }
        this.recurringValueChanges.next();
    }

    private setListenerForValueChanges() {
        this.recurringValueChanges.pipe(
            takeWhile(() => this.alive),
            debounceTime(400),
            // distinctUntilChanged(),
            // skip(1)
        )
            .subscribe((data: any) => {

                let recurringData;
                if (this.checkValidationForRecData(false)) {
                    recurringData = this.getRecurringTaskData();
                    this.checkoutService.recurringTaskDataChange.emit(recurringData);
                }
            });
    }

    /**
    * SET TIME FORMAT
    */
    setTimeFormat(value) {
        if (this.config.time_format === this.timeFormat.TWELVE_HOURS) {
            this.tFormat = value;
        } else {
            this.tFormat = '';
        }
    }
}

