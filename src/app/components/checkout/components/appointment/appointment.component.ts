import { MessageType } from './../../../../constants/constant';
import { Component, ElementRef, NgZone, ViewChild, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, AbstractControl, Validators, FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import * as moment from 'moment';


import { DropDownListComponent } from '../../../dropdownlist/dropdownlist.component';

import { WorkFlowAddressModel } from '../../checkout.component';
import { CheckOutService } from '../../checkout.service';
import { AppointmentService } from './appointment.service';
import { countrySortedList } from '../../../../services/countryCodeList.service';
import { SessionService } from '../../../../services/session.service';
import { PopUpService } from '../../../../modules/popup/services/popup.service';
import { ValidationService } from '../../../../services/validation.service';
import { AppService } from '../../../../app.service';

// import 'rxjs/add/operator/';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.scss', '../../checkout.scss']
})

export class AppointmentComponent implements OnInit, AfterViewInit, OnDestroy {

  dateOptions: any;
  isCustom: boolean;
  @ViewChild('pickUpSearch')
  private pickUpSearch: ElementRef;
  @ViewChild('drop-down-list')
  private dropDownList: DropDownListComponent;
  private hasDestroy: boolean;
  @ViewChild('fileUpload') private _fileUpload: ElementRef;
  private workflowObj: WorkFlowAddressModel = {};
  private qpickupTime: any;
  private storeUnsubscribe: any;

  public appointmentForm: FormGroup;
  private submitted = false;
  private countries: any = countrySortedList;
  private pickUpCountryCode: AbstractControl;

  private pickUpDateAndTime: Date;
  private deliveryDateAndTime: Date;

  private formSettings: any;
  private todayTime: Date;
  private momentValue;
  private startTimeOptions: any;
  private endTimeOptions: any;
  public templateData: any = [];
  private pickUpCustomData: any = [];
  private countryCode: any = {};
  private imgSrc: any = {};
  private imageSrc: any = {};
  private formDate: any = {};
  private imageBool: any = {};
  public langJson: any;
  public languageSelected: any;
  public direction = 'ltr';
  isPlatformServer: boolean;
  languageStrings: any={};

  constructor(protected mapsAPILoader: MapsAPILoader, protected ngZone: NgZone,
    protected sessionService: SessionService, protected popup: PopUpService, protected checkoutService: CheckOutService,
    protected appointementService: AppointmentService, public appService: AppService) {
    this.hasDestroy = false;
    this.formSettings = this.sessionService.getByKey('app', 'formsetting');
    if (!this.formSettings) {
      this.formSettings = this.sessionService.getByKey('app', 'user').formSettings;
    }
    if (this.formSettings.userOptions && Object.keys(this.formSettings.userOptions).length) {
      this.isCustom = true;
    }
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
    this.setTemplateData();
    this.setDefaultComponentData();
  }
  ngOnInit() {
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
     this.languageStrings.add_address = (this.languageStrings.add_address || "Add Address")
     .replace("ADDRESS_ADDRESS", this.formSettings.terminology.ADDRESS);
    });
    this.isPlatformServer = this.sessionService.isPlatformServer();
    // ================language json manupilation======================
    this.appService.langPromise.then(() => {
      this.langJson = this.appService.getLangJsonData();
    });
  }
  ngAfterViewInit() {
    setTimeout(() => this.intializedAutoCompletePickup(), 0);
    this.setFormData();
  }
  private setDefaultDateConfig() {
    const time = this.getDateAndTime();
    const tomorrow = new Date();
    const yesterday = this.getDateAndTime();
    const futureTime = new Date(tomorrow.setDate(time.getDate() + 1));
    futureTime.setHours(0);
    futureTime.setMinutes(0);
    const pastTime = new Date(yesterday.setDate(time.getDate() - 1));
    pastTime.setHours(0);
    pastTime.setMinutes(0);
    this.dateOptions = {
      Date: {
        singleDatePicker: true,
        timePicker: false,
        locale: {
          'format': 'DD MMM YYYY',
        },
        applyClass: 'applybtn',
      },
      date: {
        singleDatePicker: true,
        timePicker: true,
        timePickerIncrement: 15,
        minDate: time,
        startDate: time,
        locale: {
          'format': 'DD MMM YYYY, hh:mm a',
        },
        applyClass: 'applybtn',
      },
      Date_Future: {
        singleDatePicker: true,
        timePicker: false,
        minDate: futureTime,
        startDate: futureTime,
        locale: {
          'format': 'DD MMM YYYY',
        },
        applyClass: 'applybtn',
      },
      Date_Past: {
        singleDatePicker: true,
        timePicker: false,
        maxDate: pastTime,
        endDate: pastTime,
        locale: {
          'format': 'DD MMM YYYY',
        },
        applyClass: 'applybtn',
      },
      Date_Time: {
        singleDatePicker: true,
        timePicker: true,
        timePickerIncrement: 15,
        locale: {
          'format': 'DD MMM YYYY, hh:mm a',
        },
        applyClass: 'applybtn',
      },
      Datetime_Future: {
        singleDatePicker: true,
        timePicker: true,
        timePickerIncrement: 15,
        minDate: futureTime,
        startDate: futureTime,
        locale: {
          'format': 'DD MMM YYYY, hh:mm a',
        },
        applyClass: 'applybtn',
      },
      Datetime_Past: {
        singleDatePicker: true,
        timePicker: true,
        timePickerIncrement: 15,
        maxDate: pastTime,
        endDate: pastTime,
        locale: {
          'format': 'DD MMM YYYY, hh:mm a',
        },
        applyClass: 'applybtn',
      }


    };
  }
  setTemplateData() {
    this.setDefaultDateConfig();
    const controls: any = {};
    this.templateData = this.appointementService.getCustomTemplateList();
    // let dynamicForm: FormGroup = new FormGroup({});
    this.templateData.forEach(element => {
      if (element.data_type === 'Checklist' || element.data_type === 'Dropdown') {
        const tmpData = element.input.split(',');
        const tmpArray = [];
        element.data = tmpData[0];
        for (const t1 of tmpData) {
          tmpArray.push({ 'value': t1, 'label': t1 });
        }
        element.ddOptions = tmpArray;
      }
      if (element.data_type === 'Image') {
        this.imageSrc[element.label] = [];
        this.imgSrc[element.label] = [];
        this.imageBool[element.label] = true;
      }
      if (element.app_side !== '2' && (element.data_type === 'Date' || element.data_type === 'Date-Future' ||
        element.data_type === 'Date-Past' || element.data_type === 'Date-Time'
        || element.data_type === 'Datetime-Future' || element.data_type === 'Datetime-Past')) {
        const date = new Date();
        element.data = moment(date).format();
      }
      const validator = this.setCustomFieldValidators(element.data_type);
      if (element.required && element.data_type !== 'Image' && element.data_type !== 'Checklist') {
        if (validator) {
          controls[element.label] = new FormControl(element.data || '', Validators.compose([Validators.required, validator]));
        } else {
          controls[element.label] = new FormControl(element.data || '', Validators.compose([Validators.required]));
        }
      } else {
        if (validator) {
          controls[element.label] = new FormControl(element.data || '', Validators.compose([Validators.minLength(1), validator]));
        } else {
          controls[element.label] = new FormControl(element.data || '');
        }
      }
    });
    this.appointmentForm = new FormGroup(controls);
  }
  setCustomFieldValidators(type) {
    let validator;
    switch (type) {
      case 'Number':
        // validator = ValidationService.NumberValidator;
        break;
      case 'Telephone':
        validator = ValidationService.NumberValidator;
        break;
      case 'Email':
        validator = ValidationService.emailValidator;
        break;
      // case 'URL':
      //   validator = ValidationService.urlValidator;
      //   break;
      default:
    }
    return validator;
  }


  setDefaultComponentData() {
    this.appointmentForm.addControl('pickUpCountryCode', new FormControl());
    this.pickUpCountryCode = this.appointmentForm.controls['pickUpCountryCode'];
    this.pickUpCountryCode.setValue('+91');
    // this.todayTime = this.getDateAndTime();
    // this.pickUpDateAndTime = this.todayTime;
    const startTime = this.getDateAndTime();
    let endTime;
    if (startTime) {
      this.pickUpDateAndTime = startTime, endTime = this.getDateAndTime(startTime);
    }
    if (endTime) {
      this.deliveryDateAndTime = endTime;
    }
    this.startTimeOptions = {
      singleDatePicker: true,
      opens: 'right',
      drops: 'up',
      timePicker: true,
      timePickerIncrement: 15,
      minDate: startTime,
      startDate: startTime,
      locale: {
        'format': 'DD MMM YYYY,  hh:mm a',
      },
      applyClass: 'applybtn',

    };
    this.endTimeOptions = {
      singleDatePicker: true,
      opens: 'right',
      drops: 'up',
      timePicker: true,
      timePickerIncrement: 15,
      minDate: endTime,
      startDate: endTime,
      locale: {
        'format': 'DD MMM YYYY,  hh:mm a',
      },
      applyClass: 'applybtn',

    };
    // this.setPickUpTime();
  }
  checkRead(status, event) {
    if (!Number(status)) {
      event.preventDefault();
    }
  }
  getDateAndTime(time?) {
    let date;
    if (time) {
      date = new Date(time);
    } else {
      date = new Date();
    }

    // const minutes = date.getMinutes();
    // const hour = date.getHours();
    // if (minutes > 30) {
    //   let min = 60 - minutes;
    //   min = (30 - min);
    //   date.setMinutes(min);
    //   date.setHours(hour + 1);
    // } else if (minutes < 30 && minutes) {
    //   date.setMinutes(minutes + 30);
    // } else {
    //   date.setMinutes(minutes + 30);
    // }
    return date;
  }
  setPickUpTime() {
    this.pickUpDateAndTime = this.getDateAndTime();
    if (this.pickUpDateAndTime) {
      this.setDeliveryTime();
    }
  }
  setDeliveryTime() {

    this.deliveryDateAndTime = this.getDateAndTime(this.pickUpDateAndTime);


  }
  intializedAutoCompletePickup() {
    this.mapsAPILoader.load().then(() => {
      const options = {
        types: ['establishment'],
      };
      const autocomplete = new google.maps.places.Autocomplete(this.pickUpSearch.nativeElement, options);
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          // get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();

          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          // set latitude, longitude and zoom
          const latitude = place.geometry.location.lat();
          const longitude = place.geometry.location.lng();
          this.workflowObj['pickUpLatitude'] = latitude;
          this.workflowObj['pickUpLongitude'] = longitude;
          this.workflowObj['pickUpAddress'] = place.formatted_address;

        });
      });
    });
  }

  updatPickUpCode(event) {
    this.pickUpCountryCode.setValue(event);
  }

  ngOnDestroy() {
    this.hasDestroy = true;
  }

  getValueForApi() {
    const appointmentData = this.getValueForAppointment();
    return appointmentData;
  }

  getValueForAppointment() {
    if (this.appointmentForm.invalid) {
      Object.keys(this.appointmentForm.controls)
        .map(controlName => this.appointmentForm.controls[controlName])
        .filter(control => {
          control.markAsTouched();
          control.updateValueAndValidity();
          return !control.valid;
        });
      return false;
    }
    if (this.checkImageValidators()) {
      return false;
    }
    const status = this.checkTime();
    if (status && this.checkAddress()) {
      const number = this.appointmentForm.value.pickUpCountryCode + ' ' + this.appointmentForm.value.pickupPhoneNumber;
      const template = this.formSettings.deliveryOptions;
      const pickUpObj = {
        'has_pickup': '0',
        'has_delivery': '0',
        'customer_address': this.workflowObj.pickUpAddress,
        'customer_email': this.appointmentForm.value.pickupEmail,
        'customer_phone': number,
        'job_pickup_datetime': moment(this.pickUpDateAndTime).format(),
        'latitude': this.workflowObj.pickUpLatitude,
        'longitude': this.workflowObj.pickUpLongitude,
        'customer_username': this.appointmentForm.value.pickupName,
        'job_delivery_datetime': moment(this.deliveryDateAndTime).format(),
        'meta_data': this.getTaskMetaData(),
        'custom_field_template': ''
      };
      if (this.formSettings.userOptions && Object.keys(this.formSettings.userOptions)) {
        const userOptions = this.formSettings.userOptions;
        pickUpObj['custom_field_template'] = userOptions.template;
      }
      return pickUpObj;
    } else {
      return false;
    }

  }

  setMomentForDelivery(moment1: any) {
    this.deliveryDateAndTime = moment1;
  }
  setMomentForPickUp(moment2: any) {
    this.pickUpDateAndTime = moment2;
  }
  checkTime() {
    if (this.deliveryDateAndTime.getTime() <= this.pickUpDateAndTime.getTime()) {
      this.popup.showPopup(MessageType.ERROR, 2500, this.languageStrings.end_time_greater || "END_TIME should greater than START_TIME.", false);
      return false;
    } else {
      return true;
    }
  }
  checkAddress() {
    if (!this.workflowObj.pickUpLatitude) {
      this.popup.showPopup(MessageType.ERROR, 2500, this.languageStrings.pls_enter_valid_address || "Please enter a valid email address.", false);
      return false;
    } else {
      return true;
    }
  }

  setFormData() {
    const showPrefilled = this.formSettings.show_prefilled_data;
    // if (showPrefilled) {
    //   let userData = this.sessionService.getByKey('app', 'user', 'vendor_details');
    //   let number = userData.phone_no.split(' ')[1];
    //   let countryCode = userData.phone_no.split(' ')[0];
    //   this.appointmentForm.controls['pickupName'].setValue(userData.first_name);
    //   this.appointmentForm.controls['pickupPhoneNumber'].setValue(number);
    //   this.appointmentForm.controls['pickupEmail'].setValue(userData.email);
    //   this.appointmentForm.controls['pickUpCountryCode'].setValue(countryCode);
    //   this.dropDownService.changeStatus(countryCode);
    // }
  }
  private setMoment(moment3: any): any {
    this.momentValue = moment3;
    // Do whatever you want to the return object 'moment'
  }
  // hideDropDown(){
  //   this.dropDownService.changeStatus(true);
  // }
  selectedStartDate(value: any) {
    this.pickUpDateAndTime = new Date(value.start);

  }
  selectedEndDate(value: any) {
    this.deliveryDateAndTime = new Date(value.start);

  }
  selectedDate(value: any, label) {
    const date = new Date(value.start);
    this.appointmentForm.controls[label].setValue(moment(date).format());

  }
  updatCC(event, label) {
    this.countryCode[label] = event;
  }
  get_img(event, label) {
    const files = event.target.files;
    const target = event.target || event.srcElement;
    if (files.length) {
      const file = files[0];
      let extension = '';
      if (file && file.name) {
        extension = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
      }
      if (extension === 'gif' || extension === 'png' || extension === 'bmp'
        || extension === 'jpeg' || extension === 'jpg' || extension === 'svg') {
        const fd = new FormData;
        fd.append('ref_image', file);
        this.imageBool[label] = false;
        this.checkoutService.imageUpload(fd).subscribe(response => {
          if (response.status === 200) {
            this.imageSrc[label].push(response.data.ref_image), target.value = '';
          } else {
            this.popup.showPopup('error', 3000, response.message, false);
          }
        });
      } else {
        this.popup.showPopup('error', 3000, this.languageStrings.pls_upload_valid_image || "Please upload a valid image file", false);
      }
    }
  }

  read_sp_image(file: File, label): void {
    const reader = new FileReader();
    reader.addEventListener('load', (event: Event) => {
      this.imageSrc[label].push((<any>event.target).result);
    }, false);
    reader.readAsDataURL(file);
  }

  removeImage(label, index: number): void {
    this.imageSrc[label].splice(index, 1);
    if (!this.imageSrc[label].length) {
      this.imageBool[label] = true;
    }
    // this.imgSrc[label].splice(index, 1);
    this._fileUpload.nativeElement.value = '';
  }
  getTaskMetaData() {
    if (!this.isCustom) {
      return [];
    }
    let metaData;
    const items = this.formSettings.userOptions.items;
    metaData = this.getMetaData(items, this.appointmentForm.value);
    return JSON.stringify(metaData);
  }
  getMetaData(items, formValue) {
    const objArray = [];
    const self = this;
    items.forEach(val => {
      const obj = {};
      obj['label'] = val.label;
      if (val.data_type === 'Image') {
        obj['data'] = self.imageSrc[val.label];
      } else if (val.data_type === 'Telephone' && formValue[val.label]) {
        obj['data'] = (this.countryCode[val.label] || this.pickUpCountryCode.value) + ' ' + formValue[val.label] || '';
      } else {
        obj['data'] = formValue[val.label] || '';
      }
      if (val.label !== 'Task_Details' || val.label !== 'subtotal') {
        objArray.push(obj);
      }
    });
    return objArray;
  }
  checkImageValidators() {
    let status = false;
    for (const prop of this.imageBool) {
      if (this.imageBool[prop]) {
        status = true;
      }
    }
    return status;
  }
  onSubmit(data) {
  }
}
