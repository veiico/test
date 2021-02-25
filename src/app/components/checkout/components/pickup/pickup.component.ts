import { MessageType } from './../../../../constants/constant';
import {
  Component,
  ElementRef,
  NgZone,
  ViewChild,
  OnInit,
  AfterViewInit,
  OnDestroy,
  Input
} from "@angular/core";
import {
  FormGroup,
  AbstractControl,
  FormBuilder,
  Validators,
  FormControl
} from "@angular/forms";
import { MapsAPILoader } from "@agm/core";
import * as moment from "moment";

import { WorkFlowAddressModel } from "../../checkout.component";
import { PickUpService } from "./pickup.service";
import { CheckOutService } from "../../checkout.service";
import { countrySortedList } from "../../../../services/countryCodeList.service";
import { SessionService } from "../../../../services/session.service";
import { PopUpService } from "../../../../modules/popup/services/popup.service";
import { ValidationService } from "../../../../services/validation.service";
import { DropDownListService } from "../../../dropdownlist/dropdownlist.service";
import { AppService } from "../../../../app.service";
import { MessageService } from "../../../../services/message.service";
import { LoaderService } from "../../../../services/loader.service";
import { PhoneMinMaxValidation } from "../../../../constants/constant";
import { OnboardingBusinessType } from "../../../../enums/enum";

@Component({
  selector: "app-pickup",
  templateUrl: "./pickup.component.html",
  styleUrls: ["./pickup.scss", "../../checkout.scss"]
})
export class PickUpComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild("fileUpload")
  public _fileUpload: ElementRef;
  @Input()
  isCustomPickup: any;

  public hasDestroy: boolean;

  public workflowObj: WorkFlowAddressModel = {};
  public qpickupTime: any;
  public storeUnsubscribe: any;

  public pickupForm: FormGroup;
  public isCustom = false;
  public pickUpCountryCode: AbstractControl;
  public formSettings: any;
  public restaurantInfo: any;
  public pickUpDateAndTime: Date;
  public todayTime: Date;
  public momentValue;
  public pickUpOrDeliveryBool: number;
  public pickUpAndDeliveryBool: number;
  public options: any;
  public dateOptions: any;
  public dynamicForm: FormGroup;
  public deliveryCustomData: any = [];
  public templateData: any = [];
  public pickUpCustomData: any = [];
  public countryCode: any = {};
  public imgSrc: any = {};
  public imageSrc: any = {};
  public formDate: any = {};
  public langJson: any = {};
  public terminology: any;
  public languageSelected: any;
  public direction = "ltr";
  public countries = [];
  public isLaundryFlow: boolean;
  public lat:any;
  public lng:any;
  public showTemplatePopup:any;
  public address:any;
  public selectedAddress: {} = {};
  public is_google_map: boolean;

  isPlatformServer: boolean;
  languageStrings: any={};

  constructor(
    protected fb: FormBuilder,
    protected mapsAPILoader: MapsAPILoader,
    protected ngZone: NgZone,
    protected dropDownService: DropDownListService,
    protected sessionService: SessionService,
    protected popup: PopUpService,
    protected pickUpService: PickUpService,
    protected checkoutService: CheckOutService,
    public appService: AppService,
    public messageService: MessageService,
    protected loader: LoaderService
  ) { }
  ngOnInit() {

    this.isPlatformServer = this.sessionService.isPlatformServer();
    this.countries = countrySortedList;
    this.formSettings = this.sessionService.get("config");
    if (this.formSettings.terminology) {
      this.terminology = this.formSettings.terminology;
    }
    this.isLaundryFlow = this.sessionService.get('config').onboarding_business_type === OnboardingBusinessType.LAUNDRY;
    this.activate();
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
     this.languageStrings.customer_details = (this.languageStrings.customer_details || "Customer Details")
     .replace('CUSTOMER_CUSTOMER', this.terminology.CUSTOMER);
     this.languageStrings.pickup_details = (this.languageStrings.pickup_details || "Pickup Details")
     .replace('PICKUP_PICKUP', this.terminology.PICKUP);
    });
    // checks for ar translations
    if (this.sessionService.getString("language")) {
      this.languageSelected = this.sessionService.getString("language");
      if (this.languageSelected === "ar") {
        this.direction = "rtl";
      } else {
        this.direction = "ltr";
      }
    } else {
      this.languageSelected = "en";
      this.direction = "ltr";
    }
    /**
     * listen delivery change method event
     */
    this.messageService.sendDelivery.subscribe(message => {
      this.activate();
      this.setFormData();
      //  if (message.type === 1) {
      //    setTimeout(() => {
      //      this.intializedAutoCompletePickup();
      //      this.getLocation();
      //    }, 400);
      //  }
    });

    // ================language json manupilation======================
    this.appService.langPromise.then(() => {
      this.langJson = this.appService.getLangJsonData();
    });
    this.is_google_map = this.formSettings.map_object.map_type === 2 ? true : false;

  }
      // ===================open map for better and accurate address==========================
      openMap() {
        if (this.sessionService.get('location')) {
            this.lat = this.selectedAddress && this.selectedAddress['lat'] ? this.selectedAddress['lat'] : this.sessionService.get('location').lat;
            this.lng = this.selectedAddress && this.selectedAddress['lng'] ? this.selectedAddress['lng'] : this.sessionService.get('location').lng;
            this.address = this.selectedAddress && this.selectedAddress['city'] ? this.selectedAddress['city'] : this.sessionService.get('location').city;
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
        this.pickupForm.controls["pickupAddress"].setValue(event.city);
        this.workflowObj["pickUpLatitude"] = event.lat;
        this.workflowObj["pickUpLongitude"] = event.lng;
        this.workflowObj["pickUpAddress"] = event.city
        this.hideTempltePopup();
      }

  setCustomFormValues() {
    let storeData = this.sessionService.get('noProductStoreData');
    if(storeData.display_merchant_address) {
      this.pickupForm.controls["pickupAddress"].setValue(storeData.address);
      this.workflowObj["pickUpLatitude"] = storeData.lat;
      this.workflowObj["pickUpLongitude"] = storeData.lng;
      this.workflowObj["pickUpAddress"] = storeData.address;
    }
    if(storeData.display_merchant_phone) {
      let number;
      let countryCode;
      if (storeData.phone.indexOf(" ") > -1) {
        number = storeData.phone.split(" ")[1];
        countryCode = storeData.phone.split(" ")[0];
      } else {
        for (let i = 0; i < this.countries.length; i++) {
          if (storeData.phone.indexOf(this.countries[i]) > -1) {
            const m = storeData.phone.slice(
              this.countries[i].length,
              storeData.phone.length
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
            number = storeData.phone.split(" ")[1];
            countryCode = storeData.phone.split(" ")[0];
          }
        }
      }
      if( this.pickupForm.controls["pickupPhoneNumber"]){
        this.pickupForm.controls["pickupPhoneNumber"].setValue(number);
      }
      if( this.pickupForm.controls["pickUpCountryCode"]){
        this.pickupForm.controls["pickUpCountryCode"].setValue(countryCode);
      }
      if(this.pickupForm.controls["pickupEmail"]){
        this.pickupForm.controls["pickupEmail"].setValue(storeData.email);
      }
    }
    if(this.pickupForm.controls["pickupName"]){
      this.pickupForm.controls["pickupName"].setValue(storeData.name);
    }
  } 

  activate() {
    this.hasDestroy = false;
    if (
      this.formSettings.userOptions &&
      Object.keys(this.formSettings.userOptions).length
    ) {
      this.isCustom = true;
    }
    if (this.formSettings.product_view === 1) {
      this.restaurantInfo = this.sessionService.get("config");
      this.restaurantInfo.self_pickup = this.restaurantInfo.admin_self_pickup;
      this.restaurantInfo.home_delivery = this.restaurantInfo.admin_home_delivery;
    } else {
      this.restaurantInfo = this.sessionService.get("info");
    }
    // if (this.isCustom) this.getCustomFormData();
    this.pickUpAndDeliveryBool = this.formSettings.force_pickup_delivery;
    this.pickUpOrDeliveryBool = this.formSettings.pickup_delivery_flag;
    this.setTemplateData();
  }
  setDefaultComponentData() {
    this.pickupForm.addControl("pickUpCountryCode", new FormControl());
    this.pickUpCountryCode = this.pickupForm.controls["pickUpCountryCode"];
    this.pickUpCountryCode.setValue("+91");
  }
  checkRead(status, event) {
    if (!Number(status) && event) {
      event.preventDefault();
    }
  }

  getLocation() {
    this.loader.show();
    this.mapsAPILoader.load().then(() => {
      if (navigator.geolocation) {
        const geocoder = new google.maps.Geocoder();
        navigator.geolocation.getCurrentPosition(
          position => {
            const latlng = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            geocoder.geocode({ location: latlng }, (results, status) => {
              this.loader.hide();
              if (status.toString() === "OK") {
                let address = results[0].formatted_address;
                this.ngZone.run(() => {
                  this.workflowObj[
                    "pickUpLatitude"
                  ] = results[0].geometry.location.lat();
                  this.workflowObj[
                    "pickUpLongitude"
                  ] = results[0].geometry.location.lng();
                  let element = this.templateData.find(
                    element => element.data_type == "pickupAddress"
                  );
                  if (element) {
                    this.pickupForm.controls[element.label].setValue(address);
                    this.workflowObj["pickUpAddress"] = address;
                  }
                });
              }
            });
          },
          error => {
            this.loader.hide();
          }
        );
      } else {
        this.loader.hide();
      }
    });
  }

  async setTemplateData() {
    this.setDefaultDateConfig();
    const controls: any = {};
    this.templateData = await this.pickUpService.getCustomTemplateList(
      this.isCustomPickup
    );
    // let dynamicForm: FormGroup = new FormGroup({});
    this.templateData.forEach(element => {
      if (
        element.data_type === "Checklist" ||
        element.data_type === "Dropdown"
      ) {
        const tmpData = element.input.split(",");
        const tmpArray = [];
        element.data = tmpData[0];
        for (const t1 of tmpData) {
          tmpArray.push({ value: t1, label: t1 });
        }
        element.ddOptions = tmpArray;
      }
      if (element.data_type === "Image") {
        this.imageSrc[element.label] = [];
        this.imgSrc[element.label] = [];
      }

      if (
        element.app_side !== "2" &&
        element.app_side !== "0" &&
        (element.data_type === "Date" ||
          element.data_type === "Date-Future" ||
          element.data_type === "Date-Past" ||
          element.data_type === "Date-Time" ||
          element.data_type === "Datetime-Future" ||
          element.data_type === "Datetime-Past")
      ) {
        const date = new Date();
        element.data = moment(date).format();
      }
      const validator = this.setCustomFieldValidators(element.data_type);
      if (
        element.required &&
        element.data_type !== "Image" &&
        element.data_type !== "Checklist" &&
        element.data_type !== "Telephone" && ( !this.isCustomPickup || (element.visibility && this.isCustomPickup))
      ) {
        if (validator) {
          controls[element.label] = new FormControl(
            element.data || "",
            Validators.compose([Validators.required, validator])
          );
        } else {
          controls[element.label] = new FormControl(
            element.data || "",
            Validators.compose([Validators.required])
          );
        }
      } else if (element.required && element.data_type === "Telephone" && ( !this.isCustomPickup || (element.visibility && this.isCustomPickup))) {
        if (validator) {
          controls[element.label] = new FormControl(
            element.data || "",
            Validators.compose([
              Validators.required,
              validator,
              Validators.minLength(PhoneMinMaxValidation.MIN_LENGTH),
              Validators.maxLength(PhoneMinMaxValidation.MAX_LENGTH)
            ])
          );
        } else {
          controls[element.label] = new FormControl(
            element.data || "",
            Validators.compose([
              Validators.required,
              Validators.minLength(PhoneMinMaxValidation.MIN_LENGTH),
              Validators.maxLength(PhoneMinMaxValidation.MAX_LENGTH)
            ])
          );
        }
      } else if (!this.isCustomPickup || (element.visibility && this.isCustomPickup)) {
        if (validator) {
          controls[element.label] = new FormControl(
            element.data || "",
            Validators.compose([Validators.minLength(1), validator])
          );
        } else {
          controls[element.label] = new FormControl(element.data || "");
        }
      }
    });
    this.pickupForm = new FormGroup(controls);




    if (!this.isCustomPickup) {
      this.checkDeliveryMethod();
    }
    this.setDefaultComponentData();
    this.setFormData();

  }

  /**
   * check delivery method and show address input according to it
   */
  checkDeliveryMethod() {
    let method = this.sessionService.getString("deliveryMethod");
    if (method) {
      switch (Number(method)) {
        case 1:
          break;
        case 2:
            if (this.restaurantInfo.display_address) {
              this.pickupForm.controls.selfpickupAddress.setValue(
                this.restaurantInfo.display_address
              );
            }
            else {
              this.pickupForm.controls.selfpickupAddress.setValue(
                this.restaurantInfo.address
              );
            }
          this.workflowObj["pickUpLatitude"] = this.restaurantInfo.latitude;
          this.workflowObj["pickUpLongitude"] = this.restaurantInfo.longitude;
          this.workflowObj["pickUpAddress"] = this.restaurantInfo.address;
          break;
      }
    }
  }

  setCustomFieldValidators(type) {
    let validator;
    switch (type) {
      case "Number":
        // validator = ValidationService.NumberValidator;
        break;
      case "Telephone":
        validator = ValidationService.NumberValidator;
        break;
      case "Email":
        validator = ValidationService.emailValidator;
        break;
      // case 'URL':
      //   validator = ValidationService.urlValidator;
      //   break;
      default:
    }
    return validator;
  }
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

  // intializedAutoCompletePickup() {
  //   this.mapsAPILoader.load().then(() => {
  //     const autocomplete = new google.maps.places.Autocomplete(
  //       this.pickUpSearch.nativeElement,
  //       {}
  //     );
  //     autocomplete.addListener("place_changed", () => {
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
  //         this.workflowObj["pickUpLatitude"] = latitude;
  //         this.workflowObj["pickUpLongitude"] = longitude;
  //         this.workflowObj["pickUpAddress"] = place.formatted_address;
  //       });
  //     });
  //   });
  // }
  ngAfterViewInit() {
    
  }

  updatPickUpCode(event) {
    this.pickUpCountryCode.setValue(event);
  }

  ngOnDestroy() {
    this.hasDestroy = true;
  }

  getValueForPickUp(flag?: boolean) {
    if (this.pickupForm.invalid) {
      Object.keys(this.pickupForm.controls)
        .map(controlName => this.pickupForm.controls[controlName])
        .filter(control => {
          control.markAsTouched();
          control.markAsDirty();
          control.updateValueAndValidity();
          return !control.valid;
        });
      return false;
    }
    const formValue = this.pickupForm.value;
    if (!this.pickUpAndDeliveryBool) {
      if (
        !formValue.pickupEmail &&
        !formValue.pickupPhoneNumber &&
        !this.workflowObj.pickUpLatitude &&
        !formValue.pickupName &&
        !formValue.pickupAddress
      ) {
        const apiObj: any = {};
        apiObj.status = 0;
        apiObj.data = this.getPickUpAPIData(formValue, flag);
        return apiObj;
      } else if (
        formValue.pickupEmail &&
        formValue.pickupPhoneNumber &&
        this.workflowObj.pickUpLatitude &&
        formValue.pickupName &&
        formValue.pickupAddress
      ) {
        const apiObj: any = {};
        apiObj.status = 1;
        apiObj.data = this.getPickUpAPIData(formValue, flag);
        return apiObj;
      } else if (
        formValue.pickupEmail ||
        formValue.pickupPhoneNumber ||
        this.workflowObj.pickUpLatitude ||
        formValue.pickUpAddress ||
        formValue.pickupName
      ) {
        const apiObj: any = {};
        apiObj.status = 2;
        apiObj.data = this.getPickUpAPIData(formValue, flag);
        if (this.pickUpOrDeliveryBool !== 2) {
          this.checkAddress();
        }
        return apiObj;
      }
    }
    if (this.checkAddress()) {
      const apiObj = this.getPickUpAPIData(formValue, flag);
      return apiObj;
    }
  }
  getPickUpAPIData(formValue, flag?) {
    let number;
    if (formValue.pickupPhoneNumber) {
      number = formValue.pickUpCountryCode + " " + formValue.pickupPhoneNumber;
    }
    const pickUpObj = {
      has_pickup: "1",
      job_pickup_address: this.workflowObj.pickUpAddress || "",
      job_pickup_email: formValue.pickupEmail || "",
      job_pickup_phone: number || "",
      job_pickup_datetime: moment(this.pickUpDateAndTime).format(),
      job_pickup_latitude: this.workflowObj.pickUpLatitude || "",
      job_pickup_longitude: this.workflowObj.pickUpLongitude || "",
      job_pickup_name: formValue.pickupName || "",
      pickup_meta_data: this.getPickUpTaskMetaData(),
      pickup_custom_field_template: ""
    };
    if (
      this.formSettings.userOptions &&
      Object.keys(this.formSettings.userOptions)
    ) {
      const userOptions = this.formSettings.userOptions;
      pickUpObj["pickup_custom_field_template"] = userOptions.template;
    }

    if (flag) {
      pickUpObj["has_delivery"] = "0";
    }
    return pickUpObj;
  }
  checkAddress() {
    if (!this.workflowObj.pickUpAddress || !this.workflowObj.pickUpLatitude) {
      this.popup.showPopup(
        MessageType.ERROR,
        2500,
        this.languageStrings.pls_enter_valid_address || "Please enter a valid email address.",
        false
      );
      return false;
    } else {
      return true;
    }
  }
  setFormData() {
    const time = this.setPickUpTime();
    this.options = {
      singleDatePicker: true,
      opens: "right",
      drops: "up",
      timePicker: true,
      timePickerIncrement: 15,
      minDate: time,
      startDate: time,
      locale: {
        format: "DD MMM YYYY,  hh:mm a"
      },
      applyClass: "applybtn"
    };
    const showPrefilled = this.formSettings.show_prefilled_data;
    if (showPrefilled) {
      const userData = this.sessionService.get("appData").vendor_details;
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

      if (!this.isCustomPickup) {
        this.pickupForm.controls["pickupName"].setValue(userData.first_name);
        this.pickupForm.controls["pickupPhoneNumber"].setValue(number);
        this.pickupForm.controls["pickupEmail"].setValue(userData.email);
        this.pickupForm.controls["pickUpCountryCode"].setValue(countryCode);
      }

      if(this.sessionService.get('noProductStoreData')) {
        this.setCustomFormValues();
       }

      this.dropDownService.changeStatus(countryCode);
    }
  }
  setMomentForPickUp(moment1: any) {
    this.pickUpDateAndTime = moment1;
  }
  public setMoment(moment2: any): any {
    this.momentValue = moment2;
    // Do whatever you want to the return object 'moment'
  }
  selectedDate(value: any, label) {
    const date = new Date(value.start);
    if (label !== "pickupTime") {
      this.pickupForm.controls[label].setValue(moment(date).format());
    } else {
      this.pickUpDateAndTime = date;
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
      let extension = "";
      if (file && file.name) {
        extension = file.name
          .substring(file.name.lastIndexOf(".") + 1)
          .toLowerCase();
      }
      if (
        extension === "gif" ||
        extension === "png" ||
        extension === "bmp" ||
        extension === "jpeg" ||
        extension === "jpg" ||
        extension === "svg"
      ) {
        const fd = new FormData();
        fd.append("ref_image", file);
        this.checkoutService.imageUpload(fd).subscribe(response => {
          if (response.status === 200) {
            this.imageSrc[label].push(response.data.ref_image);
            target.value = "";
          } else {
            this.popup.showPopup(MessageType.ERROR, 3000, response.message, false);
          }
        });
      } else {
        this.popup.showPopup(
          MessageType.ERROR,
          3000,
          this.languageStrings.pls_upload_valid_image || "Please upload a valid image file",
          false
        );
      }
    }
  }

  read_sp_image(file: File, label): void {
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      (event: Event) => {
        this.imageSrc[label].push((<any>event.target).result);
      },
      false
    );
    reader.readAsDataURL(file);
  }

  removeImage(label, index: number): void {
    this.imageSrc[label].splice(index, 1);
    // this.imgSrc[label].splice(index, 1);
    this._fileUpload.nativeElement.value = "";
  }
  getPickUpTaskMetaData() {
    if (!this.isCustom) {
      return [];
    }
    let metaData;
    const items = this.formSettings.userOptions.items;
    metaData = this.getMetaData(items, this.pickupForm.value);
    return JSON.stringify(metaData);
  }
  getMetaData(items, formValue) {
    const objArray = [];
    const self = this;
    items.forEach(val => {
      const obj = {};
      obj["label"] = val.label;
      if (val.data_type === "Image") {
        obj["data"] = self.imageSrc[val.label];
      } else if (val.data_type === "Telephone" && formValue[val.label]) {
        obj["data"] =
          (this.countryCode[val.label] || this.pickUpCountryCode.value) +
          " " +
          formValue[val.label] || "";
      } else {
        obj["data"] = formValue[val.label] || "";
      }
      if (val.label !== "Task_Details" && val.label !== "subtotal") {
        objArray.push(obj);
      }
    });
    return objArray;
  }

  private setDefaultDateConfig() {
    const time = this.setPickUpTime();
    const tomorrow = this.setPickUpTime();
    const yesterday = this.setPickUpTime();
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
          format: "DD MMM YYYY"
        },
        applyClass: "applybtn"
      },
      date: {
        singleDatePicker: true,
        timePicker: true,
        timePickerIncrement: 15,
        minDate: time,
        startDate: time,
        locale: {
          format: "DD MMM YYYY, hh:mm a"
        },
        applyClass: "applybtn"
      },
      Date_Future: {
        singleDatePicker: true,
        timePicker: false,
        minDate: futureTime,
        startDate: futureTime,
        locale: {
          format: "DD MMM YYYY"
        },
        applyClass: "applybtn"
      },
      Date_Past: {
        singleDatePicker: true,
        timePicker: false,
        maxDate: pastTime,
        endDate: pastTime,
        locale: {
          format: "DD MMM YYYY"
        },
        applyClass: "applybtn"
      },
      Date_Time: {
        singleDatePicker: true,
        timePicker: true,
        timePickerIncrement: 15,
        locale: {
          format: "DD MMM YYYY, hh:mm a"
        },
        applyClass: "applybtn"
      },
      Datetime_Future: {
        singleDatePicker: true,
        timePicker: true,
        timePickerIncrement: 15,
        minDate: futureTime,
        startDate: futureTime,
        locale: {
          format: "DD MMM YYYY, hh:mm a"
        },
        applyClass: "applybtn"
      },
      Datetime_Past: {
        singleDatePicker: true,
        timePicker: true,
        timePickerIncrement: 15,
        maxDate: pastTime,
        endDate: pastTime,
        locale: {
          format: "DD MMM YYYY, hh:mm a"
        },
        applyClass: "applybtn"
      }
    };
  }
  onSubmit(data) { }

  clearLatLng() {
    this.workflowObj["pickUpLatitude"] = null;
    this.workflowObj["pickUpLongitude"] = null;
    this.selectedAddress['lat'] = null;
    this.selectedAddress['lng'] = null;
  }
  onLatLngEvent(latlng: google.maps.LatLng | any, fc: FormControl) {
    if (this.is_google_map && latlng) {
      this.selectedAddress['lat'] = latlng.lat();
      this.selectedAddress['lng'] = latlng.lng();
      this.selectedAddress['city'] = fc.value;
      this.workflowObj["pickUpLatitude"] = latlng.lat();
      this.workflowObj["pickUpLongitude"] = latlng.lng();
      this.workflowObj["pickUpAddress"] = fc.value
    }else if(!this.is_google_map && latlng){
      this.selectedAddress['lat'] = latlng.lat;
      this.selectedAddress['lng'] = latlng.lng;
      this.selectedAddress['city'] = fc.value;
      this.workflowObj["pickUpLatitude"] = latlng.lat;
      this.workflowObj["pickUpLongitude"] = latlng.lng;
      this.workflowObj["pickUpAddress"] = fc.value
    }
    else {
      this.clearLatLng();
    }
  }
}
