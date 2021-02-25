
import { Component, ElementRef, NgZone, ViewChild, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, AbstractControl, FormControl, Validators } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import * as moment from 'moment';

import { CheckOutService } from '../../checkout.service';
import { WorkFlowAddressModel } from '../../checkout.component';
import { DeliveryService } from './delivery.service';
import { countrySortedList } from '../../../../services/countryCodeList.service';
import { SessionService } from '../../../../services/session.service';
import { PopUpService } from '../../../../modules/popup/services/popup.service';
import { ValidationService } from '../../../../services/validation.service';
import { DropDownListService } from '../../../dropdownlist/dropdownlist.service';
import { AppService } from '../../../../app.service';
import { MessageService } from '../../../../services/message.service';
import { LoaderService } from '../../../../services/loader.service';
import { PhoneMinMaxValidation, MessageType } from '../../../../constants/constant';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.html',
  styleUrls: ['./delivery.scss', '../../checkout.scss']
})

export class DeliveryComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('deliverySearch')
  public deliverySearch: ElementRef;
  @ViewChild('fileUpload') public _fileUpload: ElementRef;
  public hasDestroy: boolean;
  public appConfig: any = {
    color: ''
  };
  public workflowObj: WorkFlowAddressModel = {};
  public isCustom = false;
  public storeUnsubscribe: any;

  public deliveryForm: FormGroup;

  public countries: any = countrySortedList;

  public deliveryCountryCode: AbstractControl;

  public deliveryDateAndTime: Date;

  public restaurantInfo: any;
  public formSettings: any;
  public todayTime: Date;

  public pickUpOrDeliveryBool: number;
  public pickUpAndDeliveryBool: number;
  public options: any;
  public dateOptions: any;
  public dynamicForm: FormGroup;
  public deliveryCustomData: any = [];
  public templateData: any = [];
  private customData: any = [];
  public countryCode: any = {};
  public imgSrc: any = {};
  public imageSrc: any = {};
  public terminology: any;
  public langJson: any = {};
  public languageSelected: any;
  public direction = 'ltr';
  public selectedDialCode = '91';
  public is_google_map: boolean;

  isPlatformServer: boolean;
  languageStrings: any={};
  constructor(protected mapsAPILoader: MapsAPILoader, protected ngZone: NgZone,
    protected dropDownService: DropDownListService,
    protected sessionService: SessionService, protected popup: PopUpService,
    protected deliveryService: DeliveryService,
    protected checkoutService: CheckOutService, public appService: AppService, public messageService: MessageService, protected loader: LoaderService) {
    this.hasDestroy = false;
    this.loader.show();
    this.formSettings = this.sessionService.get('config');
    if (this.formSettings.terminology) {
      this.terminology = this.formSettings.terminology;
    }
    this.pickUpAndDeliveryBool = this.formSettings.force_pickup_delivery;
    this.pickUpOrDeliveryBool = this.formSettings.pickup_delivery_flag;
    if (this.pickUpOrDeliveryBool === 2 && this.formSettings.deliveryOptions &&
      Object.keys(this.formSettings.deliveryOptions).length) {
      this.isCustom = true;
      this.customData = this.formSettings.deliveryOptions.items;
    }
    if (this.pickUpOrDeliveryBool !== 2 && this.formSettings.userOptions &&
      Object.keys(this.formSettings.userOptions).length) {
      this.isCustom = true;
      this.customData = this.formSettings.userOptions.items;
    }

    this.setTemplateData();
    this.setDefaultComponentData();
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

    /**
     * listen delivery change method event
     */
    this.messageService.sendDelivery.subscribe(message => {
      this.setTemplateData();
      this.setDefaultComponentData();
      this.setFormData();
    })
  }
  ngOnInit() {
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
     this.languageStrings.delvery_details = (this.languageStrings.delivery_details || "DELIVERY_DELIVERY Details")
     .replace('DELIVERY_DELIVERY', this.terminology.DELIVERY);
    });
    this.isPlatformServer = this.sessionService.isPlatformServer();
    this.is_google_map = this.formSettings.map_object.map_type === 2 ? true : false;
    // this.intializedAutoCompleteDelivery();
    this.getLocation();
    // ================language json manupilation======================
    this.appService.langPromise.then(() => {
      this.langJson = this.appService.getLangJsonData();
    });
  }

  getFormSettings() {
    this.formSettings = this.sessionService.get('config');
    if (this.formSettings.product_view === 1) {
      this.restaurantInfo = this.sessionService.get('config');
      this.restaurantInfo.self_pickup = this.restaurantInfo.admin_self_pickup;
      this.restaurantInfo.home_delivery = this.restaurantInfo.admin_home_delivery;
    } else {
      this.restaurantInfo = this.sessionService.get('info');
    }
    this.pickUpAndDeliveryBool = this.formSettings.force_pickup_delivery;
    this.pickUpOrDeliveryBool = this.formSettings.pickup_delivery_flag;
  }

  setDefaultComponentData() {
    this.deliveryForm.addControl('deliveryCountryCode', new FormControl());
    this.deliveryCountryCode = this.deliveryForm.controls['deliveryCountryCode'];

    this.deliveryCountryCode.setValue('+' + this.selectedDialCode);
    const time = this.setDeliveryTime();
    this.options = {
      singleDatePicker: true,
      opens: 'right',
      drops: 'up',
      timePicker: true,
      timePickerIncrement: 15,
      minDate: time,
      startDate: time,
      locale: {
        'format': 'DD MMM YYYY,  hh:mm a',
      },
      applyClass: 'applybtn',

    };
  }

  getLocation() {
    this.mapsAPILoader.load().then(() => {
      if (navigator.geolocation) {
        const geocoder = new google.maps.Geocoder;
        navigator.geolocation.getCurrentPosition((position) => {

          const latlng = { lat: position.coords.latitude, lng: position.coords.longitude };

          geocoder.geocode({ 'location': latlng }, (results, status) => {

            this.loader.hide();
            if (status.toString() === 'OK') {
              let address = results[0].formatted_address;
              this.ngZone.run(() => {

                this.workflowObj['deliveryLatitude'] = results[0].geometry.location.lat();
                this.workflowObj['deliveryLongitude'] = results[0].geometry.location.lng();

                let element = this.templateData.findIndex((element) => element.data_type == 'deliveryAddress');
                if (element) {
                  this.workflowObj['deliveryAddress'] = address;
                  this.deliveryForm.controls[element.label].setValue(address);
                }

              })

            }
          });
        }, (error) => {
          this.loader.hide();

        });
      } else {

        this.loader.hide();
        console.log('Geolocation is not supported by this browser.');
      }
    });
  }


  setTemplateData() {
    this.setDateDefaultData();
    const controls: any = {};
    this.templateData = this.deliveryService.getCustomDeliveryTemplateList();
    const dynamicForm: FormGroup = new FormGroup({});
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
      }

      if (element.app_side !== '2' && element.app_side !== '0' && (element.data_type === 'Date' ||
        element.data_type === 'Date-Future' || element.data_type === 'Date-Past' || element.data_type === 'Date-Time'
        || element.data_type === 'Datetime-Future' || element.data_type === 'Datetime-Past')) {
        const date = new Date();
        element.data = moment(date).format();
      }
      const validator = this.setCustomFieldValidators(element.data_type);
      if (element.required && element.data_type !== 'Image' && element.data_type !== 'Checklist' && element.data_type !== 'Telephone') {
        if (validator) {
          controls[element.label] = new FormControl(element.data || '', Validators.compose([Validators.required, validator]));
        } else {
          controls[element.label] = new FormControl(element.data || '', Validators.compose([Validators.required]));
        }
      } else if (element.required && element.data_type === 'Telephone') {
        if (validator) {
          controls[element.label] = new FormControl(element.data || '', Validators.compose([Validators.required, validator, Validators.minLength(PhoneMinMaxValidation.MIN_LENGTH), Validators.maxLength(PhoneMinMaxValidation.MAX_LENGTH)]));
        } else {
          controls[element.label] = new FormControl(element.data || '', Validators.compose([Validators.required, Validators.minLength(PhoneMinMaxValidation.MIN_LENGTH), Validators.maxLength(PhoneMinMaxValidation.MAX_LENGTH)]));
        }
      } else {
        if (validator) {
          controls[element.label] = new FormControl(element.data || '', Validators.compose([Validators.minLength(1), validator]));
        } else {
          controls[element.label] = new FormControl(element.data || '');
        }
      }
    });
    this.deliveryForm = new FormGroup(controls);
  }

  /**
   * check delivery method and show address input according to it
   */
  checkDeliveryMethod() {
    let method = this.sessionService.getString('deliveryMethod');
    if (method) {
      switch (Number(method)) {
        case 1:
          break;
        case 2:
          this.deliveryForm.controls.selfpickupAddress.setValue(this.restaurantInfo.address);
          this.workflowObj['deliveryLatitude'] = this.restaurantInfo.latitude;
          this.workflowObj['deliveryLongitude'] = this.restaurantInfo.longitude;
          this.workflowObj['deliveryAddress'] = this.restaurantInfo.address;
          break;
      }
    }
  }

  setCustomFieldValidators(type) {
    let validator;
    switch (type) {
      // case 'Number':
      //   validator = ValidationService.NumberValidator;
      //   break;
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
  setDeliveryTime() {
    const date = new Date();
    const minutes = date.getMinutes();
    const hour = date.getHours();
    // if (this.pickUpOrDeliveryBool === 2) {
    //   if (minutes > 30) {
    //     let min = 60 - minutes;
    //     min = (30 - min);
    //     date.setMinutes(min);
    //     date.setHours(hour + 1);
    //   } else if (minutes < 30 && minutes) {
    //     date.setMinutes(minutes + 30);
    //   } else {
    //     date.setMinutes(minutes + 30);
    //   }
    // } else {
    //   if (minutes > 40) {
    //     let min = 60 - minutes;
    //     min = (20 - min) + min;
    //     date.setMinutes(min);
    //     date.setHours(hour + 1);
    //   } else if (minutes < 40 && minutes) {
    //     date.setMinutes(minutes + 15);
    //   } else {
    //     date.setMinutes(minutes + 15);
    //   }
    // }
    this.deliveryDateAndTime = date;
    return date;
  }
  checkRead(status, event) {
    if (!Number(status)) {
      event.preventDefault();
    }
  }
  // intializedAutoCompleteDelivery() {
  //   this.mapsAPILoader.load().then(() => {
  //     const options = {
  //       types: ['establishment'],
  //     };
  //     const autocomplete = new google.maps.places.Autocomplete(this.deliverySearch.nativeElement, options);
  //     autocomplete.addListener('place_changed', () => {
  //       this.ngZone.run(() => {
  //         // get the place result
  //         const place: google.maps.places.PlaceResult = autocomplete.getPlace();

  //         // verify result
  //         if (place.geometry === undefined || place.geometry === null) {
  //           return;
  //         }

  //         // set latitude, longitude and zoom
  //         const latitude = place.geometry.location.lat();
  //         const longitude = place.geometry.location.lng();
  //         this.workflowObj['deliveryLatitude'] = latitude;
  //         this.workflowObj['deliveryLongitude'] = longitude;
  //         this.workflowObj['deliveryAddress'] = place.formatted_address;

  //       });
  //     });
  //   });
  // }

  updateDeliveryCode(event) {
    this.deliveryCountryCode.setValue(event);
  }


  ngOnDestroy() {
    this.hasDestroy = true;
  }

  onSubmit(formValue): void {
    if (this.deliveryForm.valid) {
      const payload = this.getValueForApi(formValue);
      // this.store.dispatch({
      //   type: checkout.actionTypes.VENDOR_CHECKOUT,
      //   payload: payload
      // });
    } else {
      this.deliveryForm.markAsTouched();
    }
  }
  getValueForApi(formValue) {
    return this.getValueForPickUpAndDelivery(formValue);
  }
  getValueForPickUpAndDelivery(formValue) {
    const defaultData = this.getDefaultApiValue(formValue);
    const deliveryData = this.getValueForDelivery(formValue);
    const apiObj = Object.assign({}, defaultData, deliveryData);

    return apiObj;
  }
  getDefaultApiValue(formValue) {
    const timezone = new Date().getTimezoneOffset();
    const defaultApiObj = {
      'layout_type': this.formSettings.work_flow,
      // "vendor_id": this.sessionService.getByKey('app', 'user', 'vendor_details').vendor_id,
      'description': formValue.notes || '',
      'timezone': timezone,
      'auto_assignment': this.formSettings.auto_assign,
      'payment_method': 8
    };
    return defaultApiObj;
  }

  getValueForDelivery(flag?: boolean) {
    if (this.deliveryForm.invalid) {
      Object.keys(this.deliveryForm.controls)
        .map(controlName => this.deliveryForm.controls[controlName])
        .filter(control => {
          control.markAsTouched();
          control.updateValueAndValidity();
          return !control.valid;
        });
      return false;
    }
    const formValue = this.deliveryForm.value;
    if (!this.pickUpAndDeliveryBool) {
      if (!formValue.deliveryEmail && !formValue.deliveryPhoneNumber && !formValue.deliveryName &&
        (!this.workflowObj.deliveryLatitude || !formValue.deliveryAddress)) {
        const apiObj: any = {};
        apiObj.status = 0;
        apiObj.data = this.getDeliveryApiData(formValue, flag);
        return apiObj;
      } else if (formValue.deliveryEmail && formValue.deliveryPhoneNumber && this.workflowObj.deliveryLatitude &&
        formValue.deliveryName && formValue.deliveryAddress) {
        const apiObj: any = {};
        apiObj.status = 1;
        apiObj.data = this.getDeliveryApiData(formValue, flag);
        return apiObj;
      } else if (formValue.deliveryEmail || formValue.deliveryPhoneNumber || this.workflowObj.deliveryLatitude ||
        formValue.deliveryName || formValue.deliveryAddress) {
        const apiObj: any = {};
        apiObj.status = 2;
        apiObj.data = this.getDeliveryApiData(formValue, flag);
        if (this.pickUpOrDeliveryBool !== 2) {
          this.checkAddress();
        }
        return apiObj;
      }

    }
    if (this.checkAddress()) {
      const apiObj = this.getDeliveryApiData(formValue, flag);
      return apiObj;
    }
  }


  setDateDefaultData() {

    const time = this.setDeliveryTime();
    const tomorrow = this.setDeliveryTime();
    const yesterday = this.setDeliveryTime();
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
  getDeliveryApiData(formValue, flag?) {
    let number;
    if (formValue.deliveryPhoneNumber) {
      number = formValue.deliveryCountryCode + ' ' + formValue.deliveryPhoneNumber;
    }

    const deliveryObj = {
      'has_delivery': '1',
      'customer_address': this.workflowObj.deliveryAddress || '',
      'customer_email': formValue.deliveryEmail || '',
      'customer_phone': number || '',
      'customer_username': formValue.deliveryName || '',
      'job_delivery_datetime': moment(this.deliveryDateAndTime).format(),
      'latitude': this.workflowObj.deliveryLatitude || '',
      'longitude': this.workflowObj.deliveryLongitude || '',
      'meta_data': this.getDeliveryTaskMetaData(),
      'custom_field_template': ''
    };
    if (this.pickUpOrDeliveryBool === 2 && this.formSettings.deliveryOptions &&
      Object.keys(this.formSettings.deliveryOptions).length) {
      const deliveryOptions = this.formSettings.deliveryOptions;
      deliveryObj['custom_field_template'] = deliveryOptions.template;
    }
    if (this.pickUpOrDeliveryBool !== 2 && this.formSettings.userOptions &&
      Object.keys(this.formSettings.userOptions).length) {
      const deliveryOptions = this.formSettings.userOptions;
      deliveryObj['custom_field_template'] = deliveryOptions.template;
    }

    if (flag) {
      deliveryObj['has_pickup'] = '0';
    }
    return deliveryObj;
  }
  setMomentForDelivery(moment1: any) {
    this.deliveryDateAndTime = moment1;
  }
  ngAfterViewInit() {
    this.setFormData();
  }
  checkAddress() {
    if (!this.workflowObj.deliveryLatitude) {
      this.popup.showPopup(MessageType.ERROR, 2500, this.languageStrings.enter_valid_delivery_address || "Please enter valid delivery address",  false);
      return false;
    } else {
      return true;
    }
  }
  setFormData() {
    const showPrefilled = this.formSettings.show_prefilled_data;
    const checkOutStatus = this.sessionService.getByKey('app', 'checkout');
    // if (showPrefilled && this.pickUpOrDeliveryBool != 2) {
    //   let userData = this.sessionService.getByKey('app', 'user', 'vendor_details');
    //   let number = userData.phone_no.split(' ')[1];
    //   let countryCode = userData.phone_no.split(' ')[0];
    //   this.deliveryForm.controls['deliveryName'].setValue(userData.first_name);
    //   this.deliveryForm.controls['deliveryPhoneNumber'].setValue(number);
    //   this.deliveryForm.controls['deliveryEmail'].setValue(userData.email);
    //   this.deliveryForm.controls['deliveryCountryCode'].setValue(countryCode);

    //   this.dropDownService.changeStatus(countryCode);
    // }
    if (checkOutStatus && checkOutStatus.cart) {
      this.setCheckoutDetails();
    }
  }

  hideDropDown() {
    this.dropDownService.changeStatus('');
  }

  selectedDate(value: any, label) {
    const date = new Date(value.start);
    if (label !== 'deliveryTime') {
      this.deliveryForm.controls[label].setValue(moment(date).format());
    } else {
      this.deliveryDateAndTime = date;
    }
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
        this.checkoutService.imageUpload(fd).subscribe(response => {
          if (response.status === 200) {
            this.imageSrc[label].push(response.data.ref_image);
            target.value = '';
          } else {
            this.popup.showPopup(MessageType.ERROR, 3000, response.message, false);
          }
        });
      } else {
        this.popup.showPopup(MessageType.ERROR, 3000, this.languageStrings.pls_upload_valid_image || "Please upload a valid image file", false);
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
    // this.imgSrc[label].splice(index, 1);
    this._fileUpload.nativeElement.value = '';
  }
  getDeliveryTaskMetaData() {
    if (!this.isCustom) {
      return [];
    }
    let metaData;

    const items = this.customData;
    metaData = this.getMetaData(items, this.deliveryForm.value);
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
        obj['data'] = (this.countryCode[val.label] || this.deliveryCountryCode.value) + ' ' + formValue[val.label] || '';
      } else {
        obj['data'] = formValue[val.label] || '';
      }
      if (val.label !== 'Task_Details' && val.label !== 'subtotal') {
        objArray.push(obj);
      }
    });
    return objArray;
  }
  setCheckoutDetails() {
    const checkoutData = this.sessionService.getByKey('app', 'checkout', 'cart');

    if (checkoutData.customer_username) {
      this.deliveryForm.controls['deliveryName'].setValue(checkoutData.customer_username);
    }
    if (checkoutData.customer_email) {
      this.deliveryForm.controls['deliveryEmail'].setValue(checkoutData.customer_email);
    }
    if (checkoutData.customer_address) {
      this.deliveryForm.controls['deliveryAddress'].setValue(checkoutData.customer_address);
    }
    // if (checkoutData.job_delivery_datetime) this.deliveryDateAndTime = new Date(checkoutData.job_delivery_datetime);
    if (checkoutData.latitude) {
      this.workflowObj.deliveryLatitude = checkoutData.latitude;
      this.workflowObj.deliveryLongitude = checkoutData.longitude;
      this.workflowObj.deliveryAddress = checkoutData.customer_address;
    }
    // this.deliveryForm.controls['deliveryTime'].setValue(checkoutData.job_delivery_datetime);
    if (checkoutData.customer_phone) {
      let number;
      let countryCode;
      if (checkoutData.customer_phone.indexOf(' ') > -1) {
        number = checkoutData.customer_phone.split(' ')[1];
        countryCode = checkoutData.customer_phone.split(' ')[0];
      } else {
        for (let i = 0; i < this.countries.length; i++) {
          if (checkoutData.customer_phone.indexOf(this.countries[i]) > -1) {
            let m = checkoutData.customer_phone.slice(this.countries[i].length, checkoutData.customer_phone.length);
            if (this.countries[i] === '+1' && m.length === 10) {
              number = m;
              countryCode = this.countries[i];
              break;
            } else if (this.countries[i] !== '+1') {
              number = m;
              countryCode = this.countries[i];
              break;
            }
          } else {
            number = checkoutData.customer_phone.split(' ')[1];
            countryCode = checkoutData.customer_phone.split(' ')[0];
          }
        }
      }
      //const number = checkoutData.customer_phone.split(' ')[1];
      //const countryCode = checkoutData.customer_phone.split(' ')[0];
      this.deliveryForm.controls['deliveryPhoneNumber'].setValue(number);
      this.deliveryForm.controls['deliveryCountryCode'].setValue(countryCode);
      this.dropDownService.changeStatus(countryCode);
    }
  }

  clearLatLng() {
    this.workflowObj["pickUpLatitude"] = null;
    this.workflowObj["pickUpLongitude"] = null;
  }

  onLatLngEvent(latlng: google.maps.LatLng | any, fc: FormControl) {
    if (this.is_google_map && latlng) {
      this.workflowObj['deliveryLatitude'] = latlng.lat();
      this.workflowObj['deliveryLongitude'] = latlng.lng();
      this.workflowObj['deliveryAddress'] = fc.value
    }else if(!this.is_google_map && latlng) {
      this.workflowObj['deliveryLatitude'] = latlng.lat;
      this.workflowObj['deliveryLongitude'] = latlng.lng;
      this.workflowObj['deliveryAddress'] = fc.value
    }
    else {
      this.clearLatLng();
    }
  }
}
