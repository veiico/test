import { MessageType } from './../../../../constants/constant';
import { Component, Output, EventEmitter, Input, OnInit, OnDestroy } from "@angular/core";

import { SwiggyDeliveryAddressComponent } from '../../../../themes/swiggy/modules/delivery-address/delivery-address.component';

import { LoaderService } from "../../../../services/loader.service";
import { PopUpService } from "../../../../modules/popup/services/popup.service";
import { SessionService } from "../../../../services/session.service";
import { FavLocationService } from "../../../fav-location/fav-location.service";
import { CheckOutService } from "../../checkout.service";
import { AppService } from "../../../../app.service";
import { ThemeService } from "../../../../services/theme.service";
import { MessageService } from "../../../../services/message.service";
import { GoogleAnalyticsEventsService } from '../../../../services/google-analytics-events.service';
import { GoogleAnalyticsEvent } from '../../../../enums/enum';

import * as moment from "moment";
import { countrySortedList } from "../../../../services/countryCodeList.service";
import { ISubscription } from 'rxjs/Subscription';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: "app-delivery-address",
  templateUrl: "./delivery-address.component.html",
  styleUrls: ["./delivery-address.scss", "../../checkout.scss"]
})
export class AppDeliveryAddressComponent extends SwiggyDeliveryAddressComponent
  implements OnInit,OnDestroy {
  public countries = [];
  public currentAddress;
  isPlatformServer: boolean;
  newAddressFavId: number = 0;
  @Input() laundry_pickup: boolean = false;
  @Input() laundry_delivery: boolean = false;
  @Output() markLaundryDeliverAsPickupEvent = new EventEmitter<boolean>();
  pickupDeliveryLaundryEqual: boolean = false;
  defaultSelected : any = null;
  subscription : ISubscription;
  mandatory_fields: any;
  languageStrings: any={};
  alive = true;
  isStuartEnabled: boolean = false;
  constructor(
    protected loader: LoaderService,
    protected popup: PopUpService,
    protected sessionService: SessionService,
    protected favLocationService: FavLocationService,
    protected checkoutService: CheckOutService,
    protected appService: AppService,
    protected googleAnalyticsEventsService: GoogleAnalyticsEventsService,
    protected themeService: ThemeService,
    protected messageService: MessageService
  ) {
    super(
      loader,
      popup,
      sessionService,
      favLocationService,
      checkoutService,
      appService,
      themeService,
      messageService
    );
    this.setConfig();
    this.countries = countrySortedList;
  }

  ngOnInit() {
    this.isPlatformServer = this.sessionService.isPlatformServer();
    if (!this.isPlatformServer){
      this.fetchLocations("isFirstFetch");
    }
    this.content = {
      add: { styles: {} },
      address: {
        styles: {
          address_bg_color: "white",
          address_desc_color: "#afafaf",
          address_title_color: "#333"
        }
      }
    };
    this.fetchAddressNotify.subscribe(shouldFetch => {
      if (shouldFetch) {
        this.fetchLocations();
      }
    });
    this.subscription = this.favLocationService.selectAddress.subscribe(fav_id => {
      if(fav_id){
        this.newAddressFavId = fav_id;
      }
    })
    // this.setConfig();
    this.setLanguage();
    this.onChangeLocalFavLocation();

    /**
     * listen delivery change method event
     */
    this.messageService.sendDelivery.subscribe(message => {
    });
    
  }
  setLangKeys() {
    this.languageStrings.delivery_details = (this.languageStrings.delivery_details || "delivery_details")
    .replace("DELIVERY_DELIVERY", this.terminology.DELIVERY);
    this.languageStrings.change_address = (this.languageStrings.change_address || "Change Address")
    .replace("ADDRESS_ADDRESS", this.terminology.ADDRESS);
    this.languageStrings.add_address = (this.languageStrings.add_address || "Add Address")
    .replace("ADDRESS_ADDRESS", this.terminology.ADDRESS);
    this.languageStrings.make_delivery_details_same_pickup = (this.languageStrings.make_delivery_details_same_pickup || "Make Delivery details same as Pickup")
    .replace("DELIVERY_DELIVERY", this.terminology.DELIVERY);
    this.languageStrings.make_delivery_details_same_pickup = (this.languageStrings.make_delivery_details_same_pickup || "Make Delivery details same as Pickup")
    .replace("PICKUP_PICKUP", this.terminology.PICKUP);
    

    this.checkoutService.changeAddress.pipe(takeWhile(_ => this.alive)).subscribe((data) => {
      this.onChangeClick();
    });
  }

  onChangeLocalFavLocation() {
    this.favLocationService.saveLocal.subscribe(data => {
      const localIndex = this.savedAddresses.findIndex(
        address => address.fav_id === "CURRENT_ADDRESS"
      );
      this.savedAddresses[localIndex] = {
        ...this.savedAddresses[localIndex],
        ...data
      };
      this.setCurrentAddress(this.savedAddresses[localIndex]);
      this.onAddressClick(this.savedAddresses[localIndex],localIndex);
      // this.savedAddresses[localIndex] = Object.assign({}, this.savedAddresses[localIndex] , data);
    });
  }

  setCurrentAddress(address) {
    this.currentAddress = address;
  }

  fetchLocations(isFirstFetch?: any, deleteAddress?:boolean) {
    const obj = {
      marketplace_reference_id: this.config.marketplace_reference_id,
      marketplace_user_id: this.config.marketplace_user_id,
    };
    if (this.sessionService.get('appData')) {
      obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    this.favLocationService.fetchAddresses(obj).subscribe(res => {
      this.loader.hide();

      if (res.status === 200) {
        this.savedAddresses = res.data.favLocations;
        if(this.defaultSelected){
          let index = this.savedAddresses.findIndex(el => el.fav_id == this.defaultSelected.fav_id);
          if(index>-1){
          this.onAddressClick(this.savedAddresses[index],index);
          }
        }
        if(this.newAddressFavId){
          let index = this.savedAddresses.findIndex(el => el.fav_id == this.newAddressFavId);
          if(index>-1 && !deleteAddress){
            this.onAddressClick(this.savedAddresses[index],index);
          }
        }
        if (
          this.sessionService.get("config").checkout_address_type === 1 &&
          isFirstFetch
        ) {
          this.addCurrentAddressToSaved();
          this.onAddressClick(
            this.savedAddresses[this.savedAddresses.length - 1],
            this.savedAddresses.length - 1
          );
        }
        else {
          this.addCurrentAddressToSaved(this.currentAddress);
        }
        if (this.savedAddresses && this.savedAddresses.length) {
          let data = this.sessionService.get("appData").vendor_details;
          for (let i = 0; i < this.savedAddresses.length; i++) {
            if (!this.savedAddresses[i].name) {
              this.savedAddresses[i].name = data.first_name;
            }
            if (!this.savedAddresses[i].email) {
              this.savedAddresses[i].email = data.email;
            }
            if (!this.savedAddresses[i].phone_no && data.phone_no) {
              this.savedAddresses[i].phone_no = this.setPhoneNumber(data).split(
                " "
              )[1];
            }
          }
        }
        if (this.savedAddresses.length - 1 === 3) {
          this.checkForAllFavType = false;
        } else {
          this.checkForAllFavType = true;
        }
      }
    });
  }

  addCurrentAddressToSaved(address?) {

    const customerInfo = this.sessionService.get("appData").vendor_details;
    const location = this.sessionService.get("location");
    if (location) {
      let currentAddress = {
        address: location ? location.city : '',
        latitude: location ? location.lat : '',
        longitude: location ? location.lng : '',
        current_date_time: moment(),
        default_location: 0,
        locType: 3,
        email: customerInfo.email,
        fav_id: "CURRENT_ADDRESS",
        house: "",
        landmark: "",
        name: customerInfo.first_name,
        phone_no: customerInfo.phone_no,
        postal_code: "",
        status: 1,
        vendor_id: customerInfo.vendor_id
      };
      this.setCurrentAddress(currentAddress);
      if (address) {
        this.setCurrentAddress(address);
        currentAddress = address;
      }
      this.savedAddresses.push(currentAddress);
    }

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

  /**
   * set config
   */
  setConfig() {
    this.config = this.sessionService.get("config");
    if (this.config) {
      this.config.borderColor = this.config["color"] || "#e13d36";
      this.terminology = this.config.terminology;
    }
    const addOn = this.config.addon || [];
    addOn.forEach(data=> {
      if (data.enabled && data.value === 124) {
        this.isStuartEnabled = true;
      }
    })
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
     this.setLangKeys();
    });
  }

  /**
   * on particular address
   */
  onAddressClick(address, index) {
    let data;
    this.mandatory_fields = this.config.signup_field;
    const appData=this.sessionService.get("appData")
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
    if (!address.email && this.mandatory_fields!=1) {
      this.popup.showPopup(MessageType.ERROR, 2500, 'Please enter your email in address.', false);
      this.openEditValue.emit(address);
      return;
    }
    if ((!address.phone_no) && this.mandatory_fields!=0) {
      this.popup.showPopup(MessageType.ERROR, 2500, 'Please enter your contact number in address.', false);
      this.openEditValue.emit(address);
      return;
    }
    if ((this.config.is_apartment_no_mandatory && !address.house) || (this.config.is_postal_code_mandatory && !address.postal_code) || (this.config.is_landmark_mandatory && !address.landmark)) {
          this.popup.showPopup(MessageType.ERROR, 2500, 'Please fill all mandatory details.', false);
          this.openEditValue.emit(address);
          return;
        }
if (this.config.apartment_zip_mandatory && (!address.house || !address.postal_code)) {
      this.popup.showPopup(MessageType.ERROR, 2500, 'Please fill all mandatory details.', false);
      this.openEditValue.emit(address);
      return;
    }
    data = {
      job_pickup_latitude: address.latitude,
      job_pickup_longitude: address.longitude,
      customer_address: address.address
    };

    this.loader.show();
    if (!this.customOrder) {
      this.checkoutService.validateAddress(data).subscribe(
        (response: any) => {
          this.loader.hide();
          if (response.status === 200) {
            // console.warn('address', address);
            this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.add_address, 'Address Selected', '', '');
            this.setAddress(index, address);
          } else {
            this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
          }
        },
        error => {
          this.loader.hide();
          this.popup.showPopup(MessageType.ERROR, 2000, error.message, false);
        }
      );
    } else {
      this.setAddress(index, address);
    }
  }

  private setAddress(index: any, address: any) {
    this.loader.hide();
    this.selectedIndex = index;
    this.selectedAddress = address;
    this.onAddressSelect.emit(address);
  }

  onAddressSave(e) {

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
    //   min = 15 - min;
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
    this.setPickUpTime();
    const pickUpObj = {
      has_pickup: "1",
      job_pickup_address: this.selectedAddress.address
       ? (this.selectedAddress.house
         ? this.selectedAddress.house + ", "
          : "")+(this.selectedAddress.address ? this.selectedAddress.address: "")+(this.selectedAddress.landmark ? ', ' +this.selectedAddress.landmark:'')
           + (this.selectedAddress.postal_code ? ', ' + this.selectedAddress.postal_code : "") : "",
      job_pickup_email: this.selectedAddress.email || "",
      job_pickup_phone: this.selectedAddress.phone_no || "",
      job_pickup_datetime: moment(this.pickUpDateAndTime).format(),
      job_pickup_latitude: this.selectedAddress.latitude || "",
      job_pickup_longitude: this.selectedAddress.longitude || "",
      job_pickup_name: this.selectedAddress.name || "",
      pickup_custom_field_template: ""
    };
    if(this.isStuartEnabled){
      pickUpObj.job_pickup_address = this.selectedAddress.address || "",
      pickUpObj["address_info"] = (this.selectedAddress.house? this.selectedAddress.house + ", " : "") + (this.selectedAddress.landmark ? this.selectedAddress.landmark + ', ':'') + (this.selectedAddress.postal_code ? this.selectedAddress.postal_code: "");
    }
    if (this.config.userOptions && Object.keys(this.config.userOptions)) {
      const userOptions = this.config.userOptions;
      pickUpObj["pickup_custom_field_template"] = userOptions.template;
    }
    if (flag) {
      pickUpObj["has_delivery"] = "0";
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
    //     min = 30 - min;
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
    //     min = 20 - min + min;
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
    this.setDeliveryTime();
    const deliveryObj = {
      has_delivery: "1",
      customer_address: this.selectedAddress.address
       ? (this.selectedAddress.house
         ? this.selectedAddress.house + ", "
          : "")+ (this.selectedAddress.address ? this.selectedAddress.address:"")+(this.selectedAddress.landmark?", "+this.selectedAddress.landmark:'')
           + (this.selectedAddress.postal_code ? ", " + this.selectedAddress.postal_code : "") : "",
      customer_email: this.selectedAddress.email || "",
      customer_phone: this.selectedAddress.phone_no || "",
      customer_username: this.selectedAddress.name || "",
      job_delivery_datetime: moment(this.deliveryDateAndTime).format(),
      latitude: this.selectedAddress.latitude || "",
      longitude: this.selectedAddress.longitude || "",
      //'meta_data': this.getDeliveryTaskMetaData(),
      custom_field_template: ""
    };
    if(this.isStuartEnabled){
      deliveryObj.customer_address = this.selectedAddress.address || "",
      deliveryObj["address_info"] = (this.selectedAddress.house? this.selectedAddress.house + ", " : "") + (this.selectedAddress.landmark ? this.selectedAddress.landmark + ', ':'') + (this.selectedAddress.postal_code ? this.selectedAddress.postal_code: "");
    }
    if (
      this.deliveryOrPickup === 2 &&
      this.config.deliveryOptions &&
      Object.keys(this.config.deliveryOptions).length
    ) {
      const deliveryOptions = this.config.deliveryOptions;
      deliveryObj["custom_field_template"] = deliveryOptions.template;
    }
    if (
      this.deliveryOrPickup !== 2 &&
      this.config.userOptions &&
      Object.keys(this.config.userOptions).length
    ) {
      const deliveryOptions = this.config.userOptions;
      deliveryObj["custom_field_template"] = deliveryOptions.template;
    }

    if (flag) {
      deliveryObj["has_pickup"] = "0";
    }
    return deliveryObj;
  }

  getDeleteData(event) {
    this.fetchLocations(null, true);
  }

  editAddress(event, address) {
    this.defaultSelected = address;
    this.openEditValue.emit(event);
  }

  /**
   * mark laundry delivery as pickup
   */
  markLaundryDeliverAsPickup(event){
    this.markLaundryDeliverAsPickupEvent.emit(event);
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
    this.alive = false;
  }
}
