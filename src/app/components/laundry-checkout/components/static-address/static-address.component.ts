import { MessageType } from './../../../../constants/constant';
/**
 * Created by cl-macmini-51 on 28/09/18.
 */
import { Component, Output, EventEmitter, Input, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormControl } from '@angular/forms';

import { LoaderService } from '../../../../services/loader.service';
import { PopUpService } from '../../../../modules/popup/services/popup.service';
import { SessionService } from '../../../../services/session.service';
import { CheckOutService } from '../../../checkout/checkout.service';
import { AppService } from '../../../../app.service';
import { ThemeService } from '../../../../services/theme.service';
import { MessageService } from '../../../../services/message.service';
import { ValidationService } from '../../../../services/validation.service';
import { PhoneMinMaxValidation } from '../../../../constants/constant';
import { countrySortedList } from '../../../../services/countryCodeList.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-static-address-laundry',
  templateUrl: './static-address.component.html',
  styleUrls: ['./static-address.component.scss', '../../../checkout/checkout.scss', '../../../checkout/components/static-address/static-address.component.scss']
})

export class AppStaticAddressLaundry {

  @Input() stepsArray: any;
  @Input() type: any;
  @Input() list: any;
  @Output() stepComplete: any = new EventEmitter();
  public config: any;
  public terminology: any = {};
  public langJson: any={};
  public languageSelected: string;
  public direction: string;
  public content: any;
  public countries: any;
  public latitude: number;
  public longitude: number;
  public addressForm: FormGroup;
  public selectedAddress: any;
  public phoneNumber: string;
  public selectedIndex: number;
  public showLimit: number = 2;
  public hideSeeMore: boolean = true;
  public searchText: string = '';
  public sameAsPickup: boolean;
  public country_code: string;
  languageStrings: any={};

  constructor(protected loader: LoaderService,
              protected popup: PopUpService,
              protected sessionService: SessionService,
              protected checkOutService: CheckOutService,
              protected appService: AppService,
              protected formBuilder: FormBuilder,
              protected themeService: ThemeService,
              protected el: ElementRef,
              private messageService: MessageService) {
    this.countries = countrySortedList;
  }

  ngOnInit() {

    this.content = {
      'add': {'styles': {}},
      'address': {
        'styles': {
          'address_bg_color': 'white',
          'address_desc_color': '#afafaf',
          'address_title_color': '#333'
        }
      }
    };
    this.themeService.setNativeStyles(this.content, this.el);
    this.setConfig();
    this.setLanguage();
    this.initForm();
    this.setIntialValue();
    if (this.list) {
      this.list.forEach((o) => {
        o.showAddress = '';
        o.showAddress = this.makeAddressString(o.flat_no, o.landmark, o.address);
      })
    }
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
      this.sessionService.langStringsPromise.then(() =>
      {
       this.languageStrings = this.sessionService.languageStrings;
       this.languageStrings.delivery_details = (this.languageStrings.delivery_details || 'Delivery Details')
       .replace('DELIVERY_DELIVERY', this.terminology.DELIVERY);
       this.languageStrings.customer_details = (this.languageStrings.customer_details || 'Customer Details')
       .replace('CUSTOMER_CUSTOMER', this.terminology.CUSTOMER);
       this.languageStrings.pickup_details = (this.languageStrings.pickup_details || 'Pickup Details')
       .replace('PICKUP_PICKUP', this.terminology.PICKUP);
       this.languageStrings.make_delivery_details_same_pickup = (this.languageStrings.make_delivery_details_same_pickup || 'Make Delivery details same as Pickup')
       .replace('PICKUP_PICKUP', this.terminology.PICKUP);
       this.languageStrings.make_delivery_details_same_pickup = (this.languageStrings.make_delivery_details_same_pickup || 'Make Delivery details same as Pickup')
       .replace('DELIVERY_DELIVERY', this.terminology.DELIVERY);
       
      });
    }
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
   * initialize form
   */
  initForm() {
    this.addressForm = this.formBuilder.group({
      address: ['', [Validators.required]],
      name: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.minLength(PhoneMinMaxValidation.MIN_LENGTH), Validators.maxLength(PhoneMinMaxValidation.MAX_LENGTH)]],
      email: ['', [Validators.required, ValidationService.emailValidator]],
      flat: [''],
      landmark: ['']
    })
  }

  /**
   * init form for customer details
   */
  private setIntialValue() {
    if (this.stepsArray[1].data.length && this.type === 'delivery') {
      this.addressForm.controls['address'].setValue(this.stepsArray[1].data[0].address);
      this.addressForm.controls['flat'].setValue(this.stepsArray[1].data[0].flat);
      this.addressForm.controls['landmark'].setValue(this.stepsArray[1].data[0].landmark);
      this.addressForm.controls['name'].setValue(this.stepsArray[1].data[0].name);
      this.addressForm.controls['email'].setValue(this.stepsArray[1].data[0].email);
      this.addressForm.controls['phone'].setValue(this.stepsArray[1].data[0].phone);
      this.phoneNumber = this.stepsArray[1].data[0].phone;
      this.country_code = this.stepsArray[1].data[0].country_code;
      this.latitude = this.stepsArray[1].data[0].latitude;
      this.longitude = this.stepsArray[1].data[0].longitude;
      this.sameAsPickup = this.stepsArray[1].data[0].sameAsPickup;
      this.autoSelectAddressFromList(this.stepsArray[1].data[0]);
    } else if (this.stepsArray[0].data.length && this.type === 'pickup') {
      this.addressForm.controls['address'].setValue(this.stepsArray[0].data[0].address);
      this.addressForm.controls['flat'].setValue(this.stepsArray[0].data[0].flat);
      this.addressForm.controls['landmark'].setValue(this.stepsArray[0].data[0].landmark);
      this.addressForm.controls['name'].setValue(this.stepsArray[0].data[0].name);
      this.addressForm.controls['email'].setValue(this.stepsArray[0].data[0].email);
      this.addressForm.controls['phone'].setValue(this.stepsArray[0].data[0].phone);
      this.phoneNumber = this.stepsArray[0].data[0].phone;
      this.country_code = this.stepsArray[0].data[0].country_code;
      this.latitude = this.stepsArray[0].data[0].latitude;
      this.longitude = this.stepsArray[0].data[0].longitude;
      this.autoSelectAddressFromList(this.stepsArray[0].data[0]);
    } else if (!this.stepsArray[0].data.length && this.type === 'pickup' && !this.sessionService.isPlatformServer()) {
      let data = this.sessionService.get('appData').vendor_details;
      this.addressForm.controls['name'].setValue(data.first_name);
      this.addressForm.controls['email'].setValue(data.email);
      this.addressForm.controls['phone'].setValue(this.setPhoneNumber(data).split(' ')[1]);
      this.phoneNumber = this.setPhoneNumber(data).split(' ')[1];
      this.country_code = this.setPhoneNumber(data).split(' ')[0].split('+')[1];
      //this.setInitialPickupLocation();
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
          const m = userData.phone_no.slice(this.countries[i].length, userData.phone_no.length);
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
   * on address click
   */
  onAddressClick(address, index) {
   
    this.selectedIndex = index;
    this.selectedAddress = address;
    this.addressForm.controls.address.setValue(address.address);
    this.addressForm.controls.flat.setValue(address.flat_no);
    this.addressForm.controls.landmark.setValue(address.landmark);
    this.latitude = address.latitude;
    this.longitude = address.longitude;
  }

  /**
   * on changing address
   */
  onChangeClick() {
    this.selectedAddress = null;
    this.selectedIndex = null;
    this.addressForm.controls.address.setValue('');
    this.addressForm.controls.flat.setValue('');
    this.addressForm.controls.landmark.setValue('');
    this.latitude = 0;
    this.longitude = 0;
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
   * make delivery details same as pickup
   */
  sameAsPickupDetails(event) {
    if (event.target.checked) {
      this.addPickupDetailsToDelivery();
    } else {
      this.initForm();
      this.phoneNumber = '';
      this.country_code = '+91';
      //let phone = document.getElementsByClassName('fugu-tel-input') as HTMLCollectionOf<any>;
      //for (let i = 0; i < phone.length; i++) {
      //  phone[i].value = '';
      //}
      this.selectedAddress = null;
      this.selectedIndex = null;
    }
  }

  /**
   * add pickup details to delivery details
   */
  addPickupDetailsToDelivery() {
    this.addressForm.controls['address'].setValue(this.stepsArray[0].data[0].address);
    this.addressForm.controls['flat'].setValue(this.stepsArray[0].data[0].flat);
    this.addressForm.controls['landmark'].setValue(this.stepsArray[0].data[0].landmark);
    this.addressForm.controls['name'].setValue(this.stepsArray[0].data[0].name);
    this.addressForm.controls['email'].setValue(this.stepsArray[0].data[0].email);
    this.addressForm.controls['phone'].setValue(this.stepsArray[0].data[0].phone);
    this.phoneNumber = this.stepsArray[0].data[0].phone;
    this.country_code = this.stepsArray[0].data[0].country_code;
    this.latitude = this.stepsArray[0].data[0].latitude;
    this.longitude = this.stepsArray[0].data[0].longitude;
    this.autoSelectAddressFromList(this.stepsArray[0].data[0]);
  }

  /**
   * auto select address from list
   */
  autoSelectAddressFromList(data) {
    if (data && this.list) {
      let index = this.list.findIndex((o) => {
         return (o.flat_no === data.flat && o.address === data.address && o.landmark === data.landmark);
      });
      if (index > -1) {
        this.selectedAddress = this.list[index];
        this.selectedIndex = index;
      }
    }
  }

  /**
   * continue option
   */
  continueOption() {

    if (!this.latitude && !this.longitude && this.type === 'delivery') {
      this.popup.showPopup(MessageType.ERROR, 2000, this.languageStrings.enter_valid_delivery_address || 'Enter valid delivery address.', false);
      return;
    }
    if (!this.latitude && !this.longitude && this.type === 'pickup') {
      this.popup.showPopup(MessageType.ERROR, 2000, this.languageStrings.enter_valid_pickup_address || 'Enter valid pickup address.' , false);
      return;
    }

    this.loader.show();
    const obj = this.addressForm.value;
    obj['latitude'] = this.latitude;
    obj['longitude'] = this.longitude;
    obj['country_code'] = this.country_code;
    if (this.type === 'delivery')
      obj['sameAsPickup'] = this.sameAsPickup;

    this.checkAddressAndGoToNext(obj);
  }

  /**
   * check address and go to next step
   */
  checkAddressAndGoToNext(obj) {
    this.validateServingAddress(obj).then(data => {
      this.stepsArray.forEach((o) => {
        if (o.data.length) {
          o.active = 0;
        }
      })
      if (this.type === 'delivery') {
        this.stepsArray[1].complete = 1;
        this.stepsArray[1].active = 0;
        this.stepsArray[1].data = [];
        this.stepsArray[1].data.push(obj);
      } else if (this.type === 'pickup') {
        this.stepsArray[0].complete = 1;
        this.stepsArray[0].active = 0;
        this.stepsArray[0].data = [];
        this.stepsArray[0].data.push(obj);
      }

      this.loader.hide();

      this.stepComplete.emit(this.stepsArray);
    }, error => {
      this.loader.hide();
      console.error(error, 'error');
      this.popup.showPopup(MessageType.ERROR, 2000, this.languageStrings.service_not_provided_area || 'Service is not provided in this area.' , false);
      return false;
    })
  }

  /**
   * validate address
   */
  validateServingAddress(dataGot): Observable<any> | Promise<any> | any {
    let data = {
      job_pickup_latitude: dataGot.latitude,
      job_pickup_longitude: dataGot.longitude,
      customer_address: dataGot.address
    };
    return new Promise((resolve, reject) => {
      this.checkOutService.validateAddress(data).subscribe((response: any) => {
        if (response.status === 200) {
          resolve(response);
        } else {
          reject(response);
        }
      }, error => {
        reject(error);
      })
    });
  }

  /**
   * make address string
   * @param flat
   * @param landmark
   * @param address
   */
  makeAddressString(flat: string, landmark: string, address: string): string {
    let result_address = '';
    if (flat) {
      result_address += `${flat}, `;
    }
    result_address += address;
    if (landmark) {
      result_address += `, ${landmark}`;
    }
    return result_address;
  }

}
