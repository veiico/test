import { MessageType } from './../../../../constants/constant';
/**
 * Created by cl-macmini-51 on 28/09/18.
 */
import { Component, Output, EventEmitter, Input, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormControl } from '@angular/forms';

import { LoaderService } from '../../../../services/loader.service';
import { PopUpService } from '../../../../modules/popup/services/popup.service';
import { SessionService } from '../../../../services/session.service';
import { FavLocationService } from '../../../fav-location/fav-location.service';
import { CheckOutService } from '../../checkout.service';
import { AppService } from '../../../../app.service';
import { MessageService } from '../../../../services/message.service';
import { PhoneMinMaxValidation } from '../../../../constants/constant';
import { ValidationService } from '../../../../services/validation.service';
import { countrySortedList } from '../../../../services/countryCodeList.service';
import { ThemeService } from '../../../../services/theme.service';

import * as moment from 'moment';


@Component({
  selector: 'app-static-address',
  templateUrl: './static-address.component.html',
  styleUrls: ['./static-address.component.scss', '../../checkout.scss']
})

export class AppStaticAddress {

  @Output() onAddressSelect = new EventEmitter<any>();
  @Input() deliveryOrPickup: any; // 0 pickup, other delivery
  @Input() list: any;
  public config: any;
  public terminology: any = {};
  public langJson: any={};
  public languageSelected: string;
  public direction: string;
  public pickUpDateAndTime: Date;
  public deliveryDateAndTime: Date;
  public content: any;
  public countries: any;
  public selectedAddress: any;
  public elseTemplate: any;
  public selectedIndex: number;
  public customerDetails: FormGroup;
  public showLimit: number = 2;
  public hideSeeMore: boolean = true;
  public searchText: string = '';
  country_code = '91';
  languageStrings: any={};

  constructor(protected loader: LoaderService,
              protected popup: PopUpService,
              protected sessionService: SessionService,
              protected checkoutService: CheckOutService,
              protected appService: AppService,
              protected formBuilder: FormBuilder,
              protected themeService: ThemeService,
              protected el: ElementRef,
              private messageService: MessageService) {
  }

  ngOnInit() {
    this.content = {'add':{'styles':{}},'address':{'styles':{'address_bg_color':'white','address_desc_color':'#afafaf','address_title_color':'#333'}}};
    this.themeService.setNativeStyles(this.content, this.el);
    this.countries = countrySortedList;
    this.setConfig();
    this.setLanguage();
    this.initCustomerForm();
    this.setIntialValue();
  }

  ngAfterViewInit() {
    if (this.list && (this.list.length <= this.showLimit)) {
      this.hideSeeMore = false;
    }
  }

  /**
   * set config
   */
  setConfig() {
    this.config = this.sessionService.get('config');
    if (this.config) {
      this.config.borderColor = this.config['color'] || '#e13d36';
      this.terminology = this.config.terminology;
    }
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
     this.languageStrings.delivery_details = (this.languageStrings.delivery_details || "Delivery Details")
     .replace("DELIVERY_DELIVERY", this.terminology.DELIVERY);
     this.languageStrings.customer_details = (this.languageStrings.customer_details || "Customer details")
     .replace("CUSTOMER_CUSTOMER", this.terminology.CUSTOMER);
     this.languageStrings.change_address = (this.languageStrings.change_address || "Change Address")
     .replace("ADDRESS_ADDRESS", this.terminology.ADDRESS);
    });
  }

  /**
   * set language
   */
  setLanguage() {
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
    this.appService.langPromise.then(()=>{
    this.langJson = this.appService.getLangJsonData();
    });
  }

  /**
   * init form for customer details
   */
  private initCustomerForm() {
    this.customerDetails = this.formBuilder.group({
      'email': ['', [ValidationService.emailValidator, Validators.required]],
      'phone': ['', [Validators.required, Validators.minLength(PhoneMinMaxValidation.MIN_LENGTH), Validators.maxLength(PhoneMinMaxValidation.MAX_LENGTH)]],
      'name': ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9 ]*$/)]]
    });
  }

  /**
   * init form for customer details
   */
  private setIntialValue() {
    if (this.sessionService.get('appData')) {
      let data = this.sessionService.get('appData').vendor_details;
      this.customerDetails.controls['name'].setValue(data.first_name);
      this.customerDetails.controls['email'].setValue(data.email);
      this.customerDetails.controls['phone'].setValue(this.setPhoneNumber(data).split(' ')[1]);
      this.country_code = this.setPhoneNumber(data).split(' ')[0].split('+')[1];
      //this.addLocationForm.controls['phone'].setValue(data.phone_no.split(' ')[1]);

    }
  }

  setPhoneNumber(userData) {
    let number;
    let countryCode;
    if (userData.phone_no.indexOf(' ') > -1) {
      number = userData.phone_no.split(' ')[1];
      countryCode = userData.phone_no.split(' ')[0];
    } else {
      for (let i = 0; i < this.countries.length; i++) {
        if (userData.phone_no.indexOf(this.countries[i]) > -1) {
          const m = userData.phone_no.slice(this.countries[i].length, userData.phone_no.length );
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
          number = userData.phone_no.split(' ')[1];
          countryCode = userData.phone_no.split(' ')[0];
        }
      }
    }
    return (countryCode + ' ' + number);
  }

  /**
   * on particular address
   */
  onAddressClick(address, index) {
    let data = {
      job_pickup_latitude: address.latitude,
      job_pickup_longitude: address.longitude,
      customer_address: address.address
    };
    this.loader.show();
    this.checkoutService.validateAddress(data).subscribe((response: any) => {
      this.loader.hide();
      if (response.status === 200) {
        // console.warn('address', address);
        this.selectedIndex = index;
        this.selectedAddress = address;
        this.onAddressSelect.emit(address);
      } else {
        this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
      }
    }, error => {
      this.loader.hide();
      console.error(error, 'error');
      this.popup.showPopup(MessageType.ERROR, 2000, error.message, false);
    })

  }

  onChangeClick() {

    this.selectedAddress = null;
    this.selectedIndex = null;
    this.onAddressSelect.emit(null);
  }

  /**
   * see more
   */
  seeMore() {
    if (this.showLimit >= this.list.length) {
      this.hideSeeMore = false;
    } else {
      this.showLimit += 2;
      this.hideSeeMore = true;
      if (this.showLimit >= this.list.length) {
        this.hideSeeMore = false;
      }
    }
  }


  /**
   * set pickup time
   */
  setPickUpTime() {
    const date = new Date();
    // const minutes = date.getMinutes();
    // const hour = date.getHours();
    // if (minutes > 45) {
    //   let min = 60 - minutes;
    //   min = (15 - min);
    //   date.setMinutes(min);
    //   date.setHours(hour + 1);
    // } else if (minutes < 45 && minutes) {
    //   date.setMinutes(minutes);
    // } else {
    //   date.setMinutes(minutes);
    // }
    this.pickUpDateAndTime = date;
    return date;
  }

  /**
   * get pickup details
   * @param flag
   */
  getValueForPickUp(flag) {
    if (this.customerDetails.invalid) {
      Object.keys(this.customerDetails.controls)
        .map(controlName => this.customerDetails.controls[controlName])
        .filter(control => {
          control.markAsTouched();
          control.updateValueAndValidity();
          return !control.valid;
        });
      this.popup.showPopup(MessageType.ERROR, 2000, this.languageStrings.pls_enter_valid_customer_details || "Please enter valid customer details" , false);
      return false;
    }
    this.setPickUpTime();
    const pickUpObj = {
      'has_pickup': '1',
      'job_pickup_address': this.selectedAddress.address ? (this.selectedAddress.flat_no + ', ' + this.selectedAddress.address) : '',
      'job_pickup_email': this.customerDetails.controls.email.value || '',
      'job_pickup_phone': this.customerDetails.controls.phone.value || '',
      'job_pickup_datetime': moment(this.pickUpDateAndTime).format(),
      'job_pickup_latitude': this.selectedAddress.latitude || '',
      'job_pickup_longitude': this.selectedAddress.longitude || '',
      'job_pickup_name': this.customerDetails.controls.name.value || '',
      'pickup_custom_field_template': ''
    };
    if (this.config.userOptions && Object.keys(this.config.userOptions)) {
      const userOptions = this.config.userOptions;
      pickUpObj['pickup_custom_field_template'] = userOptions.template;
    }
    if (flag) {
      pickUpObj['has_delivery'] = '0';
    }
    return pickUpObj;
  }


  /**
   * set delivery time
   */

  setDeliveryTime() {
    const date = new Date();
    const minutes = date.getMinutes();
    const hour = date.getHours();
    // if (this.deliveryOrPickup === 2) {
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

  /**
   * get delivery details object
   * @param flag
   */
  getValueForDelivery(flag) {
    if (this.customerDetails.invalid) {
      Object.keys(this.customerDetails.controls)
        .map(controlName => this.customerDetails.controls[controlName])
        .filter(control => {
          control.markAsTouched();
          control.updateValueAndValidity();
          return !control.valid;
        });
        this.popup.showPopup(MessageType.ERROR, 2000, this.languageStrings.pls_enter_valid_customer_details || "Please enter valid customer details" , false);
      return false;
    }
    this.setDeliveryTime();
    const deliveryObj = {
      'has_delivery': '1',
      'customer_address': this.selectedAddress.address ? (this.selectedAddress.flat_no + ', ' + this.selectedAddress.address) : '',
      'customer_email': this.customerDetails.controls.email.value || '',
      'customer_phone': this.customerDetails.controls.phone.value || '',
      'customer_username': this.customerDetails.controls.name.value || '',
      'job_delivery_datetime': moment(this.deliveryDateAndTime).format(),
      'latitude': this.selectedAddress.latitude || '',
      'longitude': this.selectedAddress.longitude || '',
      //'meta_data': this.getDeliveryTaskMetaData(),
      'custom_field_template': ''
    };
    if (this.deliveryOrPickup === 2 && this.config.deliveryOptions &&
      Object.keys(this.config.deliveryOptions).length) {
      const deliveryOptions = this.config.deliveryOptions;
      deliveryObj['custom_field_template'] = deliveryOptions.template;
    }
    if (this.deliveryOrPickup !== 2 && this.config.userOptions &&
      Object.keys(this.config.userOptions).length) {
      const deliveryOptions = this.config.userOptions;
      deliveryObj['custom_field_template'] = deliveryOptions.template;
    }

    if (flag) {
      deliveryObj['has_pickup'] = '0';
    }
    return deliveryObj;
  }

  onSubmit(data) {}

}
