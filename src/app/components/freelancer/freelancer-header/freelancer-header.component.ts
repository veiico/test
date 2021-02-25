import {
  Component,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  SimpleChanges,
  AfterViewInit,
  Renderer2
} from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { NavigationEnd, Router } from "@angular/router";
// import { } from 'googlemaps';

import { MessageService } from "../../../services/message.service";
import { LoaderService } from "../../../services/loader.service";
import { SessionService } from "../../../services/session.service";
import { Subscription } from "rxjs";
import { ValidationService } from "../../../services/validation.service";
import { LoginService } from "../../login/login.service";
import { AppService } from "../../../app.service";
import { ExternalLibService } from "../../../services/set-external-lib.service";
import { throwMatDialogContentAlreadyAttachedError } from "@angular/material";
import { environment } from "../../../../environments/environment";
import { HeaderComponent } from "../../header/header.component";
import { HeaderService } from "../../header/header.service";
import { PopUpService } from "../../../modules/popup/services/popup.service";
import { PopupModalService } from "../../../modules/popup/services/popup-modal.service";
import { GoogleAnalyticsEventsService } from '../../../services/google-analytics-events.service';
import { RestaurantsService } from '../../restaurants-new/restaurants-new.service';

declare var $: any;

// import * as $ from 'jquery';

@Component({
  selector: "app-freelancer-header",
  templateUrl: "./freelancer-header.component.html",
  styleUrls: [
    "./freelancer-header.component.scss",
    "../../header/header.component.scss"
  ]
})
export class FreelancerHeaderComponent extends HeaderComponent
  implements OnInit, OnChanges, AfterViewInit {
  @Input()
  headerData;
  image_link = "";
  profile_color: "#fffff";
  name;
  path;
  public domainName = window.location.hostname;
  public marketplace_reference_id;
  public selectedLanguage;

  forgotForm;
  loggedIn = false;
  backHidden = false;
  subscription: Subscription;
  appConfig: any = {
    color: "#fff"
  };
  notificationData = [];
  offset = 0;
  limit = 7;
  showHeadingSearch: boolean;
  notifyFlag = true;
  count = 0;
  totalCount = 0;
  showFbSignIn = false;
  vendor_id: any;
  access_token: any;
  isFetchingNotification: any;
  delete_noti_id: any;
  formSettings: any;
  terminology: any;
  refStatus: any;
  public langJson: any;
  public languageArray: any;
  public languageSelected: any;
  public direction = "ltr";
  id: any;
  show = true;
  hideSearch = true;
  hideLogin = true;
  isEcomFlow: boolean;
  domain;
  vendor_token: any;
  _elementRef: ElementRef;
  public merchant_signup_terminolgy;
  merchant_url: string;
  languageStrings: any={};

  ngOnChanges(changes: SimpleChanges) {
    this.image_link = changes.headerData.currentValue
      ? changes.headerData.currentValue.web_header_logo
      : "assets/img/group-7.png";
    this.bg_color = changes.headerData.currentValue
      ? changes.headerData.currentValue.header_color
      : "#2296ff";
    this.profile_color = changes.headerData.currentValue
      ? changes.headerData.currentValue.color
      : "";
    this.headerData = changes.headerData.currentValue;
  }

  constructor(
    protected ngZone: NgZone,
    protected messageService: MessageService,
    public router: Router,
    protected loader: LoaderService,
    public sessionService: SessionService,
    protected formBuilder: FormBuilder,
    protected loginService: LoginService,
    protected popup: PopUpService,
    protected elementRef: ElementRef,
    protected popupModal: PopupModalService,
    public  headerService: HeaderService,
    protected appService: AppService,
    protected extService: ExternalLibService,
    public renderer: Renderer2,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
    protected restaurantService: RestaurantsService
  ) {
    // tslint:disable-next-line:max-line-length
    super(
      ngZone,
      messageService,
      router,
      loader,
      sessionService,
      formBuilder,
      loginService,
      popup,
      elementRef,
      popupModal,
      headerService,
      appService,
      extService,
      renderer,
      googleAnalyticsEventsService,
      restaurantService
    );
    this.domain = window.location.hostname;
    this.formSettings = this.sessionService.get("config");
    this.showHeadingSearch =
      this.formSettings.business_model_type === "ECOM" &&
      this.formSettings.nlevel_enabled === 1;
    if (this.formSettings && this.formSettings.terminology) {
      this.terminology = this.formSettings.terminology;
    }
    if (
      this.formSettings &&
      this.formSettings.languages &&
      this.formSettings.languages.length
    ) {
      this.languageArray = this.formSettings.languages;
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
    }

    this.forgotForm = this.formBuilder.group({
      email: ["", [Validators.required, ValidationService.emailValidator]]
    });
    this._elementRef = elementRef;
    $(this._elementRef.nativeElement).on("hidden.bs.modal", () => {
      $("body div").removeClass("modal-backdrop fade in");
      $("body").removeClass("modal-open");
      this.ngZone.run(() => {
        this.messageService.sendClearForm();
        if (this.forgotForm.value.email) {
          this.forgotForm.value.email = null;
          this.forgotForm.reset();
        }
      });
    });

    $(this._elementRef.nativeElement).on("hide.bs.modal", () => {
      $("body div").removeClass("modal-backdrop fade in");
      $("body").removeClass("modal-open");
    });
    // $(this._elementRef.nativeElement).on('shown.bs.modal', () => {
    //  $('#siEmail1').focus();
    // });

    this.path = this.router.url.toString();
    // tslint:disable-next-line:max-line-length
    if (
      this.path === "/checkout" ||
      this.path === "/payment" ||
      this.path === "/search" ||
      this.path.indexOf("verify-email") > -1
    ) {
      // this.path.indexOf('store') > -1 ||
      this.hideSearch = false;
    } else {
      this.hideSearch = true;
    }
    if (this.path.indexOf("verify-email") > -1) {
      this.hideLogin = false;
    } else {
      this.hideLogin = true;
    }
    // tslint:disable-next-line:max-line-length
    this.isEcomFlow =
      this.formSettings.nlevel_enabled === 2 &&
      this.formSettings.business_model_type === "ECOM" &&
      this.path === "/categories";

    // tslint:disable-next-line:max-line-length
    if (
      this.path === "/" ||
      this.path.indexOf("verify-email") > -1 ||
      this.path === "/freelancer"
    ) {
      // || this.path === '/list' || this.path === '#/list' || (this.path.indexOf('store') > -1 && this.sessionService.getString('no_of_stores') === '1')
      this.backHidden = true;
    } else {
      this.backHidden = false;
    }
    router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        this.path = val.url.toString();
        $("#myNavbarWithoutLogin").removeClass("in");
        // tslint:disable-next-line:max-line-length
        if (
          val.url.toString() === "/" ||
          val.url.toString() === "/freelancer" ||
          val.url.toString().indexOf("verify-email") > -1
        ) {
          // || val.url.toString() === '/list' || (this.path.indexOf('store') > -1 && this.sessionService.getString('no_of_stores') === '1')
          this.backHidden = true;
        } else {
          this.backHidden = false;
          // if (this.sessionService.getString('no_of_stores') === '1') {
          //  this.backHidden = true;
          // }
        }

        // tslint:disable-next-line:max-line-length
        if (
          val.url.toString() === "/checkout" ||
          val.url.toString() === "/payment" ||
          val.url.toString() === "/search" ||
          val.url.toString().indexOf("verify-email") > -1
        ) {
          // val.url.indexOf('store') > -1 ||
          this.hideSearch = false;
        } else {
          this.hideSearch = true;
        }

        if (val.url.toString().indexOf("verify-email") > -1) {
          this.hideLogin = false;
        } else {
          this.hideLogin = true;
        }
      }
    });
    this.subscription = this.messageService
      .getProfileName()
      .subscribe(message => {
        this.name = this.sessionService.get(
          "appData"
        ).vendor_details.first_name;
      });
    this.subscription = this.messageService
      .getLoggedStatus()
      .subscribe(message => {
        this.loggedIn = message.logged;
        this.name = this.sessionService.get(
          "appData"
        ).vendor_details.first_name;
        this.refStatus = this.sessionService.get("appData").referral.status;
        if (
          this.path.indexOf("order") > -1 &&
          this.sessionService.getByKey("app", "cart") &&
          this.sessionService.getByKey("app", "cart").length
        ) {
          this.router.navigate(["checkout"]);
        }
      });

    this.messageService.userLoggedIn.subscribe(() => {
      this.loggedIn = true;
      this.vendor_token = this.sessionService.get(
        "appData"
      ).vendor_details.app_access_token;
    });

    // tslint:disable-next-line:radix
    if (
      this.sessionService.get("appData") &&
      parseInt(this.sessionService.getString("reg_status")) === 1
    ) {
      this.loggedIn = true;
      this.vendor_token = this.sessionService.get(
        "appData"
      ).vendor_details.app_access_token;
      this.name = this.sessionService.get("appData").vendor_details.first_name;
      this.refStatus = this.sessionService.get("appData").referral.status;
      // tslint:disable-next-line:radix
    } else if (
      this.sessionService.get("appData") &&
      parseInt(this.sessionService.getString("reg_status")) !== 1
    ) {
      this.refStatus = this.sessionService.get("appData").referral.status;
      if (!this.sessionService.get("appData").signup_template_data.length) {
        this.loggedIn = true;
        this.name = this.sessionService.get(
          "appData"
        ).vendor_details.first_name;
      }
    }
    const access_token = "";
    const userLocation = "";
    const user_id = "";
    const accessCrendentialsObj = this.sessionService.get("appData");
    if (this.sessionService.getString("language") != undefined) {
      this.selectedLanguage = this.sessionService.getString("language");
    }
    this.merchant_signup_terminolgy = this.terminology.MERCHANT;
    this.marketplace_reference_id = this.formSettings.reference_id;

    if (accessCrendentialsObj && Object.keys(accessCrendentialsObj).length) {
      this.vendor_id = this.sessionService.get(
        "appData"
      ).vendor_details.vendor_id;
      this.access_token = this.sessionService.get(
        "appData"
      ).vendor_details.app_access_token;
    }
    this.merchant_url =
      "https://" +
      this.domainName +
      "/" +
      this.selectedLanguage +
      "/onboard/merchant-signup?marketplace_reference_id=" +
      this.marketplace_reference_id +
      "&user=" +
      this.merchant_signup_terminolgy;
  }

  ngOnInit() {
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
     this.languageStrings.no_notification_avail = (this.languageStrings.no_notification_avail || "No notifications are available.")
     .replace("NOTIFICATIONS_NOTIFICATIONS", this.terminology.NOTIFICATIONS);
    });
    // this.getNotifications(true, 0);
    // Document Click hiding the popup
    // $(document).click(function() {
    //   $('#notificationContainer').hide();
    // });
    this.sessionService.get("appData");
    // this.selectedLanguage = this.commonService.loginData.language || 'en'
    // this.merchant_signup_terminolgy = this.commonService.loginData.terminology.MERCHANT;

    // Popup on click
    $("#notificationContainer").click(function () {
      return false;
    });
    // tslint:disable-next-line:curly
    if (this.sessionService.get("appData"))
      this.vendor_token = this.sessionService.get(
        "appData"
      ).vendor_details.app_access_token;

    this.messageService.addNotificationData.subscribe(data => {
      data.is_read = false;
      data.is_delete = false;
      this.notificationData.unshift(data);
      this.offset++;
      this.count++;
      this.totalCount++;
      this.loader.hide();
    });
    // tslint:disable-next-line:max-line-length
    this.showHeadingSearch =
      this.sessionService.get("config").business_model_type === "ECOM" &&
      this.sessionService.get("config").nlevel_enabled === 1;
    // ================language json manupilation======================
    this.langJson = this.appService.getLangJsonData();
  }

  ngAfterViewInit() {
    // tslint:disable-next-line:max-line-length
    this.appService.langPromise.then(() => {

    });
  }

  goToLogin() {
    this.messageService.getLoginSignupLocation('From Login Button');
  }
}
