/**
 * Created by mba-214 on 24/10/18.
 */
import { Component, Input, ViewChild, OnInit, OnDestroy, AfterViewInit, ElementRef, NgZone, Output, EventEmitter } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { PhoneMinMaxValidation, MessageType } from '../../../../constants/constant';
import { ValidationService } from '../../../../services/validation.service';
import { countrySortedList } from '../../../../services/countryCodeList.service';
import { SessionService } from '../../../../services/session.service';
import { PopUpService } from '../../../../modules/popup/services/popup.service';
import { AppService } from '../../../../app.service';
import { Observable } from 'rxjs';
import { CheckOutService } from '../../../checkout/checkout.service';
import { LoaderService } from '../../../../services/loader.service';

@Component({
  selector: 'app-laundry-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})

export class AddressLaundryComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() stepsArray: any;
  @Input() type: any;
  @Output() stepComplete: any = new EventEmitter();
  public addressForm: FormGroup;
  public country_code: string;
  public phoneNumber: string;
  public latitude: number;
  public longitude: number;
  public countries: any;
  public minDate: Date = new Date();
  public sameAsPickup: boolean;
  public formSettings: any;
  public terminology: any = {};
  public langJson: any = {};
  public languageSelected: string;
  public direction: string;
  public lat:any;
  public lng:any;
  public showTemplatePopup:any;
  public address:any;
  public sameAddressSelected: boolean;
  public alreadyHaveAddress: {} = {};
  public is_google_map: boolean;
  languageStrings: any={};

  constructor(public formBuilder: FormBuilder,
    public sessionService: SessionService,
    public mapsAPILoader: MapsAPILoader,
    protected ngZone: NgZone,
    protected popup: PopUpService,
    protected loader: LoaderService,
    protected checkOutService: CheckOutService,
    public appService: AppService) {
    this.countries = countrySortedList;
  }


  ngOnInit() {

    this.setConfig();
    this.setLang();
    this.initForm();
    this.setIntialValue();
    this.is_google_map = this.formSettings.map_object.map_type === 2 ? true : false;
    // this.intializedAutoComplete();
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
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
    this.setLangKeys();
    });
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
    this.appService.langPromise.then(() => {
      this.langJson = this.appService.getLangJsonData();
    });
  }
  setLangKeys() {
    this.languageStrings.delivery_details = (this.languageStrings.delivery_details || "DELIVERY_DELIVERY Details")
    .replace('DELIVERY_DELIVERY', this.terminology.DELIVERY);
    this.languageStrings.pickup_details = (this.languageStrings.pickup_details || "Pickup Details")
    .replace('PICKUP_PICKUP', this.terminology.PICKUP);
    this.languageStrings.make_delivery_details_same_pickup = (this.languageStrings.make_delivery_details_same_pickup || "Make DELIVERY_DELIVERY details same as PICKUP_PICKUP")
    .replace('DELIVERY_DELIVERY', this.terminology.DELIVERY);
    this.languageStrings.make_delivery_details_same_pickup = this.languageStrings.make_delivery_details_same_pickup
    .replace('PICKUP_PICKUP', this.terminology.PICKUP);
    this.languageStrings.pickup_address = (this.languageStrings.pickup_address || "PICKUP_PICKUP Address")
    .replace('PICKUP_PICKUP',this.terminology.PICKUP );
    this.languageStrings.delivery_address = (this.languageStrings.delivery_address || "DELIVERY_DELIVERY Address")
    .replace('DELIVERY_DELIVERY',this.terminology.DELIVERY );
  }

  /**
   * initialize form
   */
  initForm() {
    this.addressForm = this.formBuilder.group({
      address: ['', [Validators.required]],
      name: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.minLength(PhoneMinMaxValidation.MIN_LENGTH), Validators.maxLength(PhoneMinMaxValidation.MAX_LENGTH)]],
      email: ['', [Validators.required, ValidationService.emailValidator]],
      flat: [''],
      landmark: ['']
    })

    if (this.formSettings.is_apartment_no_mandatory) {
      this.addressForm.controls.flat.setValidators([Validators.required]);
    }
    if(this.formSettings.is_landmark_mandatory){
      this.addressForm.controls.landmark.setValidators([Validators.required]);
    }
  }

    // ===================open map for better and accurate address==========================
    openMap() {
  
      if (this.sessionService.get('location')) {
        if(this.alreadyHaveAddress && this.alreadyHaveAddress['lat'] && this.alreadyHaveAddress['lng']){
          this.lat = this.alreadyHaveAddress['lat'];
          this.lng = this.alreadyHaveAddress['lng'];
          this.address = this.addressForm.controls['address'].value;
        }else if (this.stepsArray[1].data.length && this.type === 'delivery') {
          this.address = this.stepsArray[1].data[0].address;
          this.lat = this.stepsArray[1].data[0].latitude;
          this.lng = this.stepsArray[1].data[0].longitude;
        }else if (this.stepsArray[0].data.length && this.type === 'pickup' || this.sameAddressSelected) {
          this.address = this.stepsArray[0].data[0].address;
          this.lat = this.stepsArray[0].data[0].latitude;
          this.lng = this.stepsArray[0].data[0].longitude;
        }else{
          this.lat = this.sessionService.get('location').lat;
          this.lng = this.sessionService.get('location').lng;
          this.address = this.sessionService.get('location').city;
        }
      }
  
      this.showTemplatePopup = true;
    }
  
    /**
     * hide tmplate view modal
     */
    hideTempltePopup() {
      this.showTemplatePopup = false;
    }
    onMapPopupSave(event){
      this.addressForm.controls['address'].setValue(event.city,{onlySelf: true, emitEvent:false});
      this.latitude = event.lat;
      this.longitude = event.lng;
      this.hideTempltePopup();
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
      this.addressForm.controls['lastName'].setValue(this.stepsArray[1].data[0].lastName);
      this.addressForm.controls['email'].setValue(this.stepsArray[1].data[0].email);
      this.addressForm.controls['phone'].setValue(this.stepsArray[1].data[0].phone);
      this.phoneNumber = this.stepsArray[1].data[0].phone;
      this.country_code = this.stepsArray[1].data[0].country_code;
      this.latitude = this.stepsArray[1].data[0].latitude;
      this.longitude = this.stepsArray[1].data[0].longitude;
      this.sameAsPickup = this.stepsArray[1].data[0].sameAsPickup;
    } else if (this.stepsArray[0].data.length && this.type === 'pickup') {
      this.addressForm.controls['address'].setValue(this.stepsArray[0].data[0].address);
      this.addressForm.controls['flat'].setValue(this.stepsArray[0].data[0].flat);
      this.addressForm.controls['landmark'].setValue(this.stepsArray[0].data[0].landmark);
      this.addressForm.controls['name'].setValue(this.stepsArray[0].data[0].name);
      this.addressForm.controls['lastName'].setValue(this.stepsArray[0].data[0].lastName);
      this.addressForm.controls['email'].setValue(this.stepsArray[0].data[0].email);
      this.addressForm.controls['phone'].setValue(this.stepsArray[0].data[0].phone);
      this.phoneNumber = this.stepsArray[0].data[0].phone;
      this.country_code = this.stepsArray[0].data[0].country_code;
      this.latitude = this.stepsArray[0].data[0].latitude;
      this.longitude = this.stepsArray[0].data[0].longitude;
    } else if (!this.stepsArray[0].data.length && this.type === 'pickup' && !this.sessionService.isPlatformServer()) {

      let data = this.sessionService.get('appData').vendor_details;
      let firstName = '';
      let lastName;
      const trimString = data.first_name.trim();
      const splitString = trimString.split(' ');
      if (splitString.length > 1) {
        lastName = splitString.pop();
        firstName = splitString.join(" ")
      } else {
        firstName = splitString.join(" ")
      }
      this.addressForm.controls['name'].setValue(data.last_name ? data.first_name : firstName);
      this.addressForm.controls['lastName'].setValue(data.last_name ? data.last_name : lastName);
      this.addressForm.controls['email'].setValue(data.email);
      this.addressForm.controls['phone'].setValue(this.setPhoneNumber(data).split(' ')[1]);
      this.phoneNumber = this.setPhoneNumber(data).split(' ')[1];
      this.country_code = this.setPhoneNumber(data).split(' ')[0].split('+')[1];
      this.setInitialPickupLocation();
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
   * initialize auto complete
   */
  // intializedAutoComplete() {
  //   this.mapsAPILoader.load().then(() => {
  //     const autocomplete = new google.maps.places.Autocomplete(this.addressSearch.nativeElement, {});
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
  //         this.latitude = latitude;
  //         this.longitude = longitude;
  //         this.addressForm.controls.address.setValue(place.formatted_address);
  //       });
  //     });
  //   });
  // }

  /**
   * continue option
   */
  continueOption() {
    
    if (!this.latitude && !this.longitude && this.type === 'delivery') {
      this.popup.showPopup(MessageType.ERROR, 2000, this.languageStrings.enter_valid_delivery_address || "Please enter valid delivery address", false);
      return;
    }
    if (!this.latitude && !this.longitude && this.type === 'pickup') {
      this.popup.showPopup(MessageType.ERROR, 2000, this.languageStrings.enter_valid_pickup_address || "Please enter valid delivery address", false);
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
      this.sameAddressSelected = false;
      this.stepComplete.emit(this.stepsArray);
    }, error => {
      this.loader.hide();
      console.error(error, 'error');
      this.popup.showPopup(MessageType.ERROR, 2000, this.languageStrings.service_not_provided_area || "Service is not provided in this area.", false);
      return false;
    })
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
    this.addressForm.controls['lastName'].setValue(this.stepsArray[0].data[0].lastName);
    this.addressForm.controls['email'].setValue(this.stepsArray[0].data[0].email);
    this.addressForm.controls['phone'].setValue(this.stepsArray[0].data[0].phone);
    this.phoneNumber = this.stepsArray[0].data[0].phone;
    this.country_code = this.stepsArray[0].data[0].country_code;
    this.latitude = this.stepsArray[0].data[0].latitude;
    this.longitude = this.stepsArray[0].data[0].longitude;
    this.sameAddressSelected = true;
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

  clearLatLng() {
    this.latitude = null;
    this.longitude = null;
  }

  onLatLngEvent(latlng: google.maps.LatLng | any) {
    if (this.is_google_map && latlng) {
      this.alreadyHaveAddress['lat'] = latlng.lat();
      this.alreadyHaveAddress['lng'] = latlng.lng();
      this.latitude = latlng.lat();
      this.longitude = latlng.lng();
    }else if(!this.is_google_map && latlng){
      this.alreadyHaveAddress['lat'] = latlng.lat;
      this.alreadyHaveAddress['lng'] = latlng.lng;
      this.latitude = latlng.lat;
      this.longitude = latlng.lng;
    }
    else {
      this.clearLatLng();
    }
  }

  /**
   * set initial pickup location
   */
  setInitialPickupLocation() {
    let location = this.sessionService.get('location');
    if (this.type === 'pickup' && location && location.lat && location.lng) {
      this.latitude = location.lat;
      this.longitude = location.lng;
      this.addressForm.controls['address'].setValue(location.city);
    }
  }

}
