import {
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  Input,
  AfterViewInit,
  OnDestroy
} from "@angular/core";
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
  AbstractControl
} from "@angular/forms";
import { MapsAPILoader } from "@agm/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

import * as jQuery from "jquery";
import { FavLocationService } from "../fav-location.service";
import { MessageService } from "../../../services/message.service";
import { LoaderService } from "../../../services/loader.service";
import { SessionService } from "../../../services/session.service";
import { ValidationService } from "../../../services/validation.service";
import { PopupModalService } from "../../../modules/popup/services/popup-modal.service";
import { PhoneMinMaxValidation } from "../../../constants/constant";
import { countrySortedList } from "../../../services/countryCodeList.service";
import { AppService } from '../../../app.service';
import { LocationType } from '../../../enums/enum';
import { LoadScriptsPostAppComponentLoad } from '../../../classes/load-scripts.class';
import { JwGoogleAutocompleteComponent } from '../../../modules/jw-google-autocomplete/components/autocomplete/jw-google-autocomplete.component';
declare var mapboxgl;
@Component({
  selector: "add-fav-location",
  templateUrl: "./add-fav-location.component.html",
  styleUrls: ["./add-fav-location.component.scss"]
})
export class AddFavLocationComponent implements OnInit, OnDestroy {

  
  fmPopup: any;
  flightmapMarker: any;
  marker: any;
  latlng: google.maps.LatLng;
  zoomChangeBoundsListener: google.maps.MapsEventListener;
  flightmap: any;
  phoneCopy: any;
  terminology: any;
  @Input() styles;
  addLocationForm: FormGroup;
  subscription: Subscription;
  public locationTypes: any;
  public langJson: any = {};
  workflowObj = {
    pickUpLatitude: 0,
    pickUpLongitude: 0,
    pickUpAddress: "",
    name: "",
    email: "",
    postal: "",
    phone: ""
  };
  locations;
  locationList;
  config: any = {};
  selectedLocation;
  locationType: number = 0;
  map: google.maps.Map;
  currentMarker: google.maps.Marker;
  phoneCheck = true;
  editMode = false;
  showType = false;
  public LocationType = LocationType
  selectEditAddress;
  @ViewChild("addressAutocomplete")
   public addressAutocomplete: ElementRef;
   @ViewChild('search') searchElement: JwGoogleAutocompleteComponent;
  public countries = [];
  mapOptions: any = {
    center: { lat: 30.741482, lng: 76.768066 },
    zoom: 14,
    zoomControl: true,
  };
  country_code = "91";
  public lat:any;
  public lng:any;
  public showTemplatePopup:any;
  public city:any;
  intialZoom: number = 12;


  //inputs
  private _address;
  mandatory_fields: any;
  phoneNo: any = "";
  flightmaplatlng: any = {};
  formSettings: any;
  is_google_map: boolean;
  languageStrings: any={};
  get address() {
    return this._address;
  }
  @Input()
  set address(val: any) {
    if (val) {
      this._address = val;
      if (this.addLocationForm.hasOwnProperty("controls")) {
        this.editAddress(this.address);
      }
    } else {
      this._address = null;
    }
  }

  @Output() save: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    protected formBuilder: FormBuilder,
    protected service: FavLocationService,
    protected mapsAPILoader: MapsAPILoader,
    protected ngZone: NgZone,
    protected messageService: MessageService,
    protected router: Router,
    protected loader: LoaderService,
    protected sessionService: SessionService,
    protected popup: PopupModalService,
    protected appService: AppService,
   
  ) {
    this.subscription = this.messageService.getAlert().subscribe(response => {
      this.popup.showPopup(
        response.type,
        response.timeout,
        response.msg,
        false
      );
    });
    this.countries = countrySortedList;
    this.config = this.sessionService.get('config');
    this.terminology = this.config.terminology;
    this.fetchLocations();
    this.initFavLocationForm();
    this.setIntialValue();
  }

  ngOnInit() {
    this.formSettings = this.sessionService.get('config');
    this.is_google_map = this.formSettings.map_object.map_type === 2 ? true : false;
    this.is_google_map ? this.initGoogleMap() : this.initializeFlightmap();
    this.appService.langPromise.then(() => {
      this.langJson = this.appService.getLangJsonData();

    });
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
     this.languageStrings.enter_address = (this.languageStrings.enter_address || "Enter Address")
     .replace('ADDRESS_ADDRESS',this.formSettings.terminology.ADDRESS)
     this.languageStrings.enter_postal_code = (this.languageStrings.enter_postal_code || "Enter Postal Code")
     .replace('POSTAL_CODE',this.formSettings.terminology.POSTAL_CODE)
     this.languageStrings.enter_landmark = (this.languageStrings.enter_landmark || "Enter Landmark")
     .replace('LANDMARK_LANDMARK',this.formSettings.terminology.LANDMARK)
     this.languageStrings.enter_appartment_no = (this.languageStrings.enter_appartment_no || "Enter Apartment No")
     .replace('APARTMENT_APARTMENT_NO',this.formSettings.terminology.APARTMENT_NO);
      this.languageStrings.please_ensure_you_drop_the_pin_at_the_address_where_the_order_has_to_be_delivered  = (this.languageStrings.please_ensure_you_drop_the_pin_at_the_address_where_the_order_has_to_be_delivered || "Please ensure you drop the pin at the address where the ORDER has to be delivered").replace('ORDER_ORDER',this.formSettings.terminology.ORDER)
     this.locationTypes = [
      {
        type: this.languageStrings.home || 'Home',
        value: 0
      },
      {
        type: this.languageStrings.work || 'Work',
        value: 1
      },
      {
        type: this.languageStrings.others || 'Others',
        value: 2
      }
    ];
    });
  }
  
  // ngAfterViewInit() {
  //     this.mapsAPILoader.load().then(() => {
  //         this.intializedAutoCompletePickup();
  //     });
  // }

  private initFavLocationForm() {
    const location = this.sessionService.get("location");
    const appData=this.sessionService.get("appData")
    this.mandatory_fields = this.config.signup_field;
    if(this.config.is_guest_checkout_enabled && appData && parseInt(appData.vendor_details.is_guest_account))
    {
      if(this.config.email_config_for_guest_checkout && this.config.phone_config_for_guest_checkout)
      { 
       this.mandatory_fields=2;//for email or phone both mandatory
      }
      else if(this.config.email_config_for_guest_checkout)
      {
        this.mandatory_fields=0;//for email  mandatory
      }
      else if(this.config.phone_config_for_guest_checkout)
      {
        this.mandatory_fields=1;//for  phone mandatory
      }
    }
    this.addLocationForm = this.formBuilder.group({
      email: [""],
      phone: [""],
      name: ["", [Validators.required]],
      flat_no: [""],
      address: [location ? location.city : '', [Validators.required]],
      postal: [""],
      landmark: [""]
    });
    switch (this.mandatory_fields) {
      case 0:
        {
          this.addLocationForm.controls.email.setValidators([Validators.required, ValidationService.emailValidator]);
          this.addLocationForm.controls.phone.setValidators([Validators.minLength(PhoneMinMaxValidation.MIN_LENGTH), Validators.maxLength(PhoneMinMaxValidation.MAX_LENGTH)])
          break;
        }
      case 1:
        {
          this.addLocationForm.controls.email.setValidators([ValidationService.emailValidator])
          this.addLocationForm.controls.phone.setValidators([Validators.required, Validators.minLength(PhoneMinMaxValidation.MIN_LENGTH), Validators.maxLength(PhoneMinMaxValidation.MAX_LENGTH)])
          break;
        }
      case 2:
        {
          this.addLocationForm.controls.email.setValidators([Validators.required, ValidationService.emailValidator]);
          this.addLocationForm.controls.phone.setValidators([Validators.required, Validators.minLength(PhoneMinMaxValidation.MIN_LENGTH), Validators.maxLength(PhoneMinMaxValidation.MAX_LENGTH)])
          break;
        }
      default:
        break;
    }

    this.workflowObj.pickUpLatitude = location ? location.lat : '';
    this.workflowObj.pickUpLongitude = location ? location.lng : '';
    this.workflowObj.pickUpAddress = location ? location.city : '';
    this.flightmaplatlng.lat = location ? location.lat : '';
    this.flightmaplatlng.lng = location ? location.lng : '';
    this.flightmaplatlng.address = location ? location.city : '';
    if (this.config.is_apartment_no_mandatory) {
      this.addLocationForm.controls.flat_no.setValidators([Validators.required]);
    }
    if(this.config.is_postal_code_mandatory){
      this.addLocationForm.controls.postal.setValidators([Validators.required]);
    }
    if(this.config.is_landmark_mandatory){
      this.addLocationForm.controls.landmark.setValidators([Validators.required]);
    }
  }

  private setIntialValue() {
    if (this.sessionService.get("appData")) {
      let data = this.sessionService.get("appData").vendor_details;
      this.addLocationForm.controls["name"].setValue(data.first_name);
      this.addLocationForm.controls["email"].setValue(data.email);
      if (data.phone_no) {
        this.addLocationForm.controls["phone"].setValue(
          this.phoneNumberCheck(data)
        );
      }
      else {
        this.addLocationForm.controls["phone"].setValue(data.phone_no)
      }


      //this.addLocationForm.controls['phone'].setValue(data.phone_no.split(' ')[1]);
    }
  }
  phoneNumberCheck(data) {
    const phone = data.phone_no.trim();
    if (phone.indexOf(' ') > -1) {
      this.phoneCopy = phone.split(' ')[1];
      this.addLocationForm.controls.phone.setValue(this.phoneCopy);
      this.country_code = phone.split(' ')[0].split('+')[1];
    } else {
      for (let i = 0; i < this.countries.length; i++) {
        if (phone.indexOf(this.countries[i]) > -1) {
          const m = phone.slice(this.countries[i].length, phone.length);
          if (this.countries[i] === '+1' && m.length === 10) {
            this.phoneCopy = m;
            this.addLocationForm.controls.phone.setValue(this.phoneCopy);
            this.country_code = this.countries[i].split('+')[1];
            return;
          } else if (this.countries[i] !== '+1') {
            this.phoneCopy = m;
            this.addLocationForm.controls.phone.setValue(this.phoneCopy);
            this.country_code = this.countries[i].split('+')[1];
            return;
          }
        } else {
          this.phoneCopy = phone.split(' ')[1];
          this.addLocationForm.controls.phone.setValue(this.phoneCopy);
          this.country_code = phone.split(' ')[0].split('+')[1];
        }
      }
    }
  }
  /**
   * get fav locations
   */
  fetchLocations() {
    const obj = {
      marketplace_reference_id: this.config.marketplace_reference_id,
      marketplace_user_id: this.config.marketplace_user_id,
    };
    if (this.sessionService.get('appData')) {
      obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    this.service.fetchAddresses(obj).subscribe(res => {
      this.loader.hide();
      if (res.status === 200) {
        this.locationList = res.data.favLocations;
        // if (this.locationList.length) {
        //   for (let i = 0; i < this.locationList.length; i++) {
        //     if (this.locationList[i].locType === LocationType.HOME) {
        //       this.removeLocationType(this.locationList[i].locType);
        //     } else if (this.locationList[i].locType === LocationType.WORK) {
        //       this.removeLocationType(this.locationList[i].locType);
        //     } else if (this.locationList[i].locType === LocationType.OTHERS) {
        //       this.removeLocationType(this.locationList[i].locType);
        //     }
        //   }
        // } else {
          this.showType = true;
        
      }
    });
  }

  // ===================open map for better and accurate address==========================
  // openMap() {
  //   if (this.sessionService.get('location')) {
  //       if(!this.is_google_map && this.flightmaplatlng){
  //         this.lat = this.flightmaplatlng.lat;
  //         this.lng = this.flightmaplatlng.lng;
  //       } 
  //      else if(this.is_google_map){
  //       this.lat = this.address ? +this.address.latitude : this.sessionService.get('location').lat;
  //        this.lng = this.address ? +this.address.longitude : this.sessionService.get('location').lng;
  //    }
    
  //     }
  //     this.city = this.addLocationForm.controls['address'].value;
    
  //   this.showTemplatePopup = true;
  // }

  /**
   * hide tmplate view modal
   */
  hideTempltePopup() {
    this.showTemplatePopup = false;
  }
  onMapPopupSave(event){
    if (this.is_google_map) {
      this.workflowObj.pickUpAddress = event.city;
      this.workflowObj.pickUpLatitude =event.lat;
      this.workflowObj.pickUpLongitude = event.lng;
    }else{
      this.flightmaplatlng['lat'] = event.lat
      this.flightmaplatlng['lng'] = event.lng;
      this.flightmaplatlng['address'] = event.city
    }
    this.addLocationForm.controls.address.setValue(event.city,{onlySelf: true, emitEvent:false});
    this.hideTempltePopup();
  }


  /**
   * remove location type list
   */
  removeLocationType(type) {
    let index = this.locationTypes.findIndex(o => {
      return o.type === type;
    });
    if (index > -1) {
      this.locationTypes.splice(index, 1);
    }
    for (let i = 0; i < this.locationTypes.length; i++) {
      if (this.locationTypes[i].value === LocationType.HOME) {
        this.locationType = this.locationTypes[i].value;
      } else if (this.locationTypes[i].value === LocationType.WORK) {
        this.locationType = this.locationTypes[i].value;
      } else if (this.locationTypes[i].value === LocationType.OTHERS) {
        this.locationType = this.locationTypes[i].value;
      }
    }
    console.log(this.locationType)
    this.showType = true;
  }

  setPhoneNumber(userData) {
    let number;
    let countryCode;
    if (userData.phone_no.indexOf(" ") > -1) {
      number = userData.phone_no.split(" ")[1];
      countryCode = userData.phone_no.split(" ")[0];
    } else {
      for (let i = 0; i < this.countries.length; i++) {
        if (userData.phone_no.indexOf(this.countries[i]) > -1) {
          const m = userData.phone_no.slice(
            this.countries[i].length,
            userData.phone_no.length
          );
          if (this.countries[i] === "+1" && m.length === 10) {
            number = m;
            countryCode = this.countries[i];
            break;
          } else if (this.countries[i] !== "+1") {
            number = m;
            countryCode = this.countries[i];
            break;
          }
        } else {
          number = userData.phone_no.split(" ")[1];
          countryCode = userData.phone_no.split(" ")[0];
        }
      }
    }
    return countryCode + " " + number;
  }

  // intializedAutoCompletePickup() {
  //     this.mapsAPILoader.load().then(() => {
  //         const autocomplete = new google.maps.places.Autocomplete(this.addressAutocomplete.nativeElement);
  //         autocomplete.addListener('place_changed', () => {
  //             this.ngZone.run(() => {
  //                 const place: google.maps.places.PlaceResult = autocomplete.getPlace();

  //                 if (place.geometry === undefined || place.geometry === null) {
  //                     return;
  //                 }
  //                 // console.warn(place);
  //                 const latitude = place.geometry.location.lat();
  //                 const longitude = place.geometry.location.lng();
  //                 this.workflowObj.pickUpLatitude = latitude;
  //                 this.workflowObj.pickUpLongitude = longitude;
  //                 this.workflowObj.pickUpAddress = this.addressAutocomplete.nativeElement.value;
  //                 this.addLocationForm.controls.address.patchValue(this.addressAutocomplete.nativeElement.value)

  //                 let addressComponents = place.address_components;

  //                 for (let i = 0; i < addressComponents.length; i++) {
  //                     let types = addressComponents[i].types;

  //                     if (types[0] == 'postal_code') {
  //                         this.addLocationForm.controls['postal'].setValue(addressComponents[i].long_name);
  //                         break;
  //                     }

  //                 }

  //             });
  //         });
  //     });
  // }

  saveAddress() {
    if (this.is_google_map) {
      if (!this.workflowObj.pickUpLongitude || !this.workflowObj.pickUpLatitude) {
        this.messageService.sendAlert({
          type: "danger",
          msg: "Please select a valid location.",
          timeout: 2000
        });
        return;
      } else if (!this.locationType && this.locationType != 0) {
        this.messageService.sendAlert({
          type: "danger",
          msg: "Please select location type.",
          timeout: 2000
        });
        return;
      }
    } else {
      if (!this.flightmaplatlng.lat || !this.flightmaplatlng.lng) {
        this.messageService.sendAlert({
          type: "danger",
          msg: "Please select a valid location.",
          timeout: 2000
        });
        return;
      } else if (!this.locationType && this.locationType != 0) {
        this.messageService.sendAlert({
          type: "danger",
          msg: "Please select location type.",
          timeout: 2000
        });
        return;
      }

    }
    if (this.editMode) {
      this.saveEditAddress();
    } else {
      this.addAddress();
    }
  }
  addAddress() {
    this.loader.show();

    const obj = {
      marketplace_reference_id: this.config.marketplace_reference_id,
      marketplace_user_id: this.config.marketplace_user_id,
      ...this.getFormFieldsToSend()
    };
    if (this.sessionService.get('appData')) {
      obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    this.service.saveAddress(obj).subscribe(res => {
      if (res.status === 200) {
        this.messageService.sendAlert({
          type: "success",
          msg: res.message,
          timeout: 2000
        });
        this.saveSuccess(res.data.id);
        if (!this.sessionService.get("location")) {
          let data = { ...this.getFormFieldsToSend() };
          const loc = {
            city: data.address,
            lat: data.latitude,
            lng: data.longitude
          };
          this.sessionService.set('location', loc);
        }
      }
      else {
        this.loader.hide();
        this.messageService.sendAlert({
          type: "danger",
          msg: res.message,
          timeout: 2000
        });
      }
    });
  }

  /**
   * common form data to send for add and edit
   */
  protected getFormFieldsToSend() {
    var phone_no;
    if(this.addLocationForm.value.phone && !this.addLocationForm.value.phone.startsWith("+"))
    {
      phone_no ='+' + this.country_code + ' ' + this.addLocationForm.value.phone || this.workflowObj.phone
    }
    else{
      phone_no=this.addLocationForm.value.phone || this.workflowObj.phone;
    }
    if (this.is_google_map) {
      const data = {
        address: this.workflowObj.pickUpAddress,
        phone_no:phone_no,
        postal_code: this.addLocationForm.value.postal,
        house: this.addLocationForm.value.flat_no,
        email: this.addLocationForm.value.email,
        latitude: this.workflowObj.pickUpLatitude,
        longitude: this.workflowObj.pickUpLongitude,
        name: this.addLocationForm.value.name,
        loc_type: this.locationType,
        landmark: this.addLocationForm.value.landmark
      };
      return data;
    } else {
      const data = {
        address: this.flightmaplatlng.address,
        phone_no:phone_no,
        postal_code: this.addLocationForm.value.postal,
        house: this.addLocationForm.value.flat_no,
        email: this.addLocationForm.value.email,
        latitude: this.flightmaplatlng.lat,
        longitude: this.flightmaplatlng.lng,
        name: this.addLocationForm.value.name,
        loc_type: this.locationType,
        landmark: this.addLocationForm.value.landmark
      };
      return data;
    }

  }
  saveEditAddress() {
    if (this.selectEditAddress.fav_id === "CURRENT_ADDRESS") {
      this.saveLocalSuccess();
      return;
    }
    this.loader.show();
    const obj = {
      marketplace_reference_id: this.config.marketplace_reference_id,
      marketplace_user_id: this.config.marketplace_user_id,
      fav_id: this.selectEditAddress.fav_id,
      loc_type: this.locationType,
      edit_body: { ...this.getFormFieldsToSend() }
    };
    if (this.sessionService.get('appData')) {
      obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    this.service.editAddress(obj).subscribe(res => {
      this.loader.hide();
      if (res.status === 200) {
        this.messageService.sendAlert({
          type: "success",
          msg: res.message,
          timeout: 2000
        });
        this.saveSuccess();
      } else {
        this.messageService.sendAlert({
          type: "danger",
          msg: res.message,
          timeout: 2000
        });
      }
    });
  }

  editAddress(address) {
    this.editMode = true;
    this.selectEditAddress = address;
    // this.intializedAutoCompletePickup();
    this.workflowObj.pickUpAddress = address.address;
    this.workflowObj.pickUpLatitude = address.latitude;
    this.workflowObj.pickUpLongitude = address.longitude;
    this.workflowObj.phone = address.phone_no;
    this.flightmaplatlng.lat = address.latitude;
    this.flightmaplatlng.lng = address.longitude;
    this.flightmaplatlng.address = address.address;
    let data = this.sessionService.get("appData").vendor_details;
    if (!address.phone_no && data.phone_no) {
      this.phoneNo = this.phoneNumberCheck(data)
    }
    else {
      this.phoneNo = address.phone_no;
    }

    this.addLocationForm.setValue({
      address: address.address,
      phone: this.phoneNo,
      postal: address.postal_code,
      email: address.email || data.email,
      name: address.name,
      landmark: address.landmark,
      flat_no: address.house
    });
    this.locationType = address.locType;
  }

  saveSuccess(fav_id?) {
    this.resetFrom();
    this.save.emit(true);
    if (fav_id) {
      this.service.selectDefaultAddress(fav_id);
    }
  }

  saveLocalSuccess() {
    this.service.saveLocal.emit({ ...this.getFormFieldsToSend() });
    this.resetFrom();
    this.save.emit(true);
    this.service.selectDefaultAddress(this.getFormFieldsToSend());
  }

  cancelForm() {
    this.resetFrom();

    this.address = null;
    this.save.emit(false);
  }
  resetFrom() {
    this.service.selectedFavAddressId = "";
    this.locationType = 0;
    this.addLocationForm.reset();
    this.workflowObj.phone = "";
    this.editMode = false;
    this.setIntialValue();
  }

  clearLatLng() {
    this.workflowObj["pickUpLatitude"] = null;
    this.workflowObj["pickUpLongitude"] = null;
    this.addLocationForm.controls["postal"].setValue("");
  }

  onLatLngEvent(latlng: google.maps.LatLng | any, fc: FormControl | AbstractControl) {
    this.flightmaplatlng = latlng
    if (this.is_google_map && latlng) {
      this.workflowObj["pickUpLatitude"] = latlng.lat();
      this.workflowObj["pickUpLongitude"] = latlng.lng();
      this.workflowObj["pickUpAddress"] = fc.value;
      if (this.currentMarker) {
        this.currentMarker.setMap(null);
      }
      const LatLng = {
        lat: latlng.lat(),
        lng: latlng.lng()
      }
  this.onLatLng(LatLng)

    }else if(!this.is_google_map && latlng){
      this.workflowObj["pickUpLatitude"] = latlng.lat;
      this.workflowObj["pickUpLongitude"] = latlng.lng;
      this.workflowObj["pickUpAddress"] = fc.value;
      if(this.flightmapMarker){
        this.flightmapMarker.remove();
      }
      const LatLng = {
        lat: latlng.lat,
        lng: latlng.lng
      }
      this.generateFlightMapMarker(LatLng)
    }else {
      this.clearLatLng();
    }
    
  }

   /**
   * on marker drag
   */
  listenMarkerDrag() {
    google.maps.event.addListener(this.currentMarker, 'dragend', () => {
      this.geocodePosition(this.currentMarker.getPosition());
    });
  }
    /**
   * lat lng => formatted address
   * @param map position
   */
  geocodePosition(pos) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: pos },
      responses => {
        if (responses && responses.length > 0) {
           this.updateMarkerAddress(responses[0].formatted_address, pos);
        }
      });
  }
    /**
   * update address
   * @param formattedAddress
   * @param latlng
   */
  updateMarkerAddress(formattedAddress: string, latlng: google.maps.LatLng | any) {
    this.searchElement.ctrl.control.markAsPristine();
    this.addLocationForm.controls.address.setValue(formattedAddress);
    setTimeout(() => {
      if (this.is_google_map) {
        this.latlng = latlng;
        this.workflowObj.pickUpAddress = formattedAddress;
        this.workflowObj.pickUpLatitude =latlng.lat();
        this.workflowObj.pickUpLongitude =latlng.lng();
      } else {
        this.flightmaplatlng['lat'] = latlng.lat
        this.flightmaplatlng['lng'] = latlng.lng;
        this.flightmaplatlng['address'] = formattedAddress;
      }
    }, 2000);
   
  }

  async initializeFlightmap() {
    const location = this.sessionService.get("location");
    await LoadScriptsPostAppComponentLoad.loadFlightmapJs();
    mapboxgl.accessToken = this.formSettings.map_object.webapp_map_api_key;
    this.flightmap = new mapboxgl.Map({
      container: 'map',
      hash: false,
      style: this.formSettings.marketplace_user_id==147002? 'raster.json' : 'default.json', //only file name
      center: [76.768066, 30.741482],
      // minZoom: 8,
      maxZoom: 18,
    });
    this.flightmaplatlng['lat'] =  this.address && this.address.latitude? this.address.latitude:location.lat
    this.flightmaplatlng['lng'] =  this.address && this.address.longitude? this.address.longitude:location.lng
    this.generateFlightMapMarker(this.flightmaplatlng)

  }
  generateFlightMapMarker(markerLatlng){
    
    const bounds = new mapboxgl.LngLatBounds();
    bounds.extend([parseFloat(markerLatlng.lng), parseFloat(markerLatlng.lat)])
    const el = document.createElement('div');
    el.className = 'marker-custom';
    el.innerHTML = `<span></span>`;
    el.draggable = true
    this.flightmapMarker = new mapboxgl.Marker(el, { draggable: true })
    .setLngLat([parseFloat(markerLatlng.lng), parseFloat(markerLatlng.lat)])
    .addTo(this.flightmap)
    this.dragMarkers(markerLatlng)
    this.flightmap.setCenter([parseFloat(markerLatlng.lng), parseFloat(markerLatlng.lat)])
    this.flightmap.setZoom(14)
    this.flightmapMarker.on('dragend', (res) => {
    var lngLat = this.flightmapMarker.getLngLat();
    this.dragMarkers(lngLat) 
    this.appService.flightmap_reverse_geocode(lngLat).subscribe((res: any) => {
      this.updateMarkerAddress(res.data.address,lngLat)
    })
    });
   
    this.flightmap.fitBounds(bounds, { padding: 40 ,duration: 0})
  }
  onAutocomlpeteResultSelect(result) {
    let addressComponents = result.address_components;
    for (let i = 0; i < addressComponents.length; i++) {
      let types = addressComponents[i].types;

      if (types[0] == "postal_code") {
        this.addLocationForm.controls["postal"].setValue(
          addressComponents[i].long_name
        );
        break;
      }
    }
  }
dragMarkers(markerLatlng)
{
  if(this.fmPopup)
  this.fmPopup.remove();
  this.fmPopup = new mapboxgl.Popup()
  .setLngLat([parseFloat(markerLatlng.lng), parseFloat(markerLatlng.lat)])
  .setHTML(`<span style="font-size=16px;font-family:'Poppins'">${this.formSettings.terminology.MAP_MARKER_TEXT || this.formSettings.terminology.ORDER + " will get delivered here"}</span>`)
  .addTo(this.flightmap);
}
 /**
   * to draw map
   */
  public async initGoogleMap() {
    const location = this.sessionService.get("location");
    let markerlatlong;
    await this.mapsAPILoader.load();
    this.map = new google.maps.Map(document.getElementById('static-address-map'), this.mapOptions);
    setTimeout(() => {
       if (this.address && this.address.latitude && this.address.longitude) {
           markerlatlong = {
            lat: parseFloat(this.address.latitude),
            lng: parseFloat(this.address.longitude)

          }
        }
          else{
             markerlatlong = {
              lat: parseFloat(location.lat),
              lng: parseFloat(location.lng)
  
            }
          }
          this.onLatLng(markerlatlong);
        
      })
  }
  onLatLng(e: google.maps.LatLng | any) {

    if (!e) {
      return;
    }
    this.latlng = e;
    if (this.currentMarker) {
      this.currentMarker.setMap(null);
    }
   this.currentMarker = new google.maps.Marker({
        position: this.latlng,
        map: this.map,
        optimized: false,
        draggable: true,
      });
      var infowindow = new google.maps.InfoWindow({
        content: this.formSettings.terminology.MAP_MARKER_TEXT || this.formSettings.terminology.ORDER + " will get delivered here",
      });
      infowindow.open(this.map,  this.currentMarker );
      this.listenMarkerDrag();
      const bounds = new google.maps.LatLngBounds(this.latlng);
      this.map.fitBounds(bounds);
      this.map.setZoom(16);
    
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
}
