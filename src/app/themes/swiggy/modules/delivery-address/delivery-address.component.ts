import { Component, Output, EventEmitter, Input, OnDestroy } from "@angular/core";

import { Subject } from "rxjs";
import { LoaderService } from '../../../../services/loader.service';
import { PopUpService } from '../../../../modules/popup/services/popup.service';
import { SessionService } from '../../../../services/session.service';
import { FavLocationService } from '../../../../components/fav-location/fav-location.service';
import { CheckOutService } from '../../../../components/checkout/checkout.service';
import { AppService } from '../../../../app.service';
import { ThemeService } from '../../../../services/theme.service';
import { MessageService } from '../../../../services/message.service';
import { MessageType } from '../../../../constants/constant';


@Component({
  selector: "app-delivery-address",
  templateUrl: "./delivery-address.component.html",
  styleUrls: [
    "./delivery-address.scss",
    "../../../../components/checkout/checkout.scss"
  ]
})
export class SwiggyDeliveryAddressComponent implements OnDestroy{
  @Input() deliveryOrPickup: any; // 0 pickup, other delivery
  @Output() openEditValue = new EventEmitter<any>();
  @Input() customOrder: any;
  public config: any;
  public terminology: any;
  public langJson: any={};
  public languageSelected: string;
  public direction: string;
  public pickUpDateAndTime: Date;
  public deliveryDateAndTime: Date;
  public checkForAllFavType: boolean = true;
  @Output() onAddressSelect = new EventEmitter<any>();
  @Output() onAddAddress = new EventEmitter<any>();
  @Input() fetchAddressNotify: Subject<any>;
  public savedAddresses = [];
  public selectedIndex;
  public selectedAddress;
  public content;
  public locationTypes :any;

  constructor(
    protected loader: LoaderService,
    protected popup: PopUpService,
    protected sessionService: SessionService,
    protected favLocationService: FavLocationService,
    protected checkoutService: CheckOutService,
    protected appService: AppService,
    protected themeService: ThemeService,
    protected messageService: MessageService
  ) {}

  ngOnInit() {
    this.fetchLocations();
    this.themeService.getThemeModuleData("fav").subscribe(response => {
      this.content = response;
    });
    this.fetchAddressNotify.subscribe(shouldFetch => {
      if (shouldFetch) {
        this.fetchLocations();
      }
    });
    this.setLanguage();


  }

  /**
   * set language
   */
  setLanguage() {
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
      if (this.languageSelected === "ar") {
        this.direction = "rtl";
      } else {
        this.direction = "ltr";
      }
    }
    this.appService.langPromise.then(()=>{
    this.langJson = this.appService.getLangJsonData();
    this.langJson["Delivery Details"] = this.langJson[
      "Delivery Details"
    ].replace("----", this.terminology.DELIVERY);
    this.langJson["Customer Details"] = this.langJson[
      "Customer Details"
    ].replace("----", this.terminology.CUSTOMER);

    this.locationTypes = [
        {
            label: this.langJson['Home'] || 'Home',
            icon: 'assets/img/home_gray.svg'
        },
        {
            label: this.langJson['Work'] || 'Work',
            icon: 'assets/img/work_gray.svg'
        },
        {
            label: this.langJson['Others'] || 'Others',
            icon: 'assets/img/other_gray.svg'
        },
        {
          label: ((this.langJson['Current'] || 'Current') + " " + (this.terminology.ADDRESS || 'Address'))|| 'Current Address',
          icon: 'assets/img/other_gray.svg'
      }
    ];
  });
  }

  fetchLocations() {
    const obj = {
      marketplace_reference_id: this.sessionService.getString(
        "marketplace_reference_id"
      ),
      marketplace_user_id: this.sessionService.get("appData").vendor_details
        .marketplace_user_id,
    };
    if (this.sessionService.get('appData')) {
      obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    this.favLocationService.fetchAddresses(obj).subscribe(res => {
      this.loader.hide();
      console.warn(res);
      if (res.status === 200) {
        this.savedAddresses = res.data.favLocations;
      }
    });
  }

  onAddressClick(address, index) {
    let data = {
      job_pickup_latitude: address.latitude,
      job_pickup_longitude: address.longitude,
      customer_address: address.address
    };

    this.loader.show();
    this.checkoutService.validateAddress(data).subscribe(
      (response: any) => {
        this.loader.hide();
        if (response.status === 200) {
          // console.warn('address', address);
          this.selectedIndex = index;
          this.selectedAddress = address;
          this.onAddressSelect.emit(address);
        } else {
          this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
        }
      },
      error => {
        this.loader.hide();
        this.popup.showPopup(MessageType.ERROR, 2000, error.message, false);
      }
    );
  }
  onChangeClick() {
    this.selectedAddress = null;
    this.selectedIndex = null;
    this.onAddressSelect.emit(null);
  }
  openAddAddress() {
    this.onAddAddress.emit(true);
  }
  ngOnDestroy(){

  }
}
