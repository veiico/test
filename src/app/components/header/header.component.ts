import { MessageType } from './../../constants/constant';
import {
  Component,
  ElementRef,
  Input,
  Output,
  NgZone,
  OnInit,
  OnDestroy,
  SimpleChanges,
  AfterViewInit,
  Renderer2,
  EventEmitter,
  RendererStyleFlags2
} from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { NavigationEnd, Router } from "@angular/router";

import { MessageService } from "../../services/message.service";
import { HeaderService } from "./header.service";
import { LoaderService } from "../../services/loader.service";
import { SessionService } from "../../services/session.service";
import { Subscription } from "rxjs";
import { ValidationService } from "../../services/validation.service";
import { LoginService } from "../login/login.service";
import { PopUpService } from "../../modules/popup/services/popup.service";
import { AppService } from "../../app.service";
import { PopupModalService } from "../../modules/popup/services/popup-modal.service";
import { ExternalLibService } from "../../services/set-external-lib.service";
import { throwMatDialogContentAlreadyAttachedError } from "@angular/material";
import { environment } from "../../../environments/environment";
import { GoogleAnalyticsEvent, PaymentMode, OnboardingBusinessType } from '../../enums/enum';
import { GoogleAnalyticsEventsService } from '../../services/google-analytics-events.service';
import { Routes } from '../../constants/constant';
import { takeWhile } from 'rxjs/operators';
import { fadeInOutDOM } from '../../../app/animations/fadeInOut.animation';
import { RestaurantsService } from '../restaurants-new/restaurants-new.service';

declare var $: any;

// import * as $ from 'jquery';

@Component({
  selector: "app-header",
  templateUrl: "./header-new.component.html",
  styleUrls: ["./header-new.component.scss"],
  animations: [fadeInOutDOM]
})
export class HeaderComponent implements OnInit, AfterViewInit {
  guestLoginData: any;
  mapViewFlag: Boolean = false;
  @Input() showSearch: Boolean = true;
  public _headerData;
  @Input() hideLoginBtn:boolean;
  public showOtpModal: boolean;
  languageStrings: any={};
  get headerData() { return this._headerData };
  @Input() set headerData(val: any) {
    this._headerData = val;

    this.image_link = this._headerData ? this._headerData.web_header_logo : "";
    this.title = this._headerData && this._headerData.form_name ? this._headerData.form_name + ' logo' : "company logo";

    this.bg_color = this._headerData ? this._headerData.header_color : "";
    this.profile_color = this._headerData ? this._headerData.color : "";
  };
  @Output() mapView: EventEmitter<any> = new EventEmitter<any>();
  public _showAddressBarOnlyRestaurant;
  get showAddressBarOnlyRestaurant() { return this._showAddressBarOnlyRestaurant };
  @Input() set showAddressBarOnlyRestaurant(val: any) {
    if (val) {
      this._showAddressBarOnlyRestaurant = true;
    } else {
      this._showAddressBarOnlyRestaurant = false;
    }
  };

  image_link;
  bg_color: "#fffff";
  profile_color: "#fffff";
  name;
  path;
  forgotForm;
  loggedIn = false;
  backHidden = false;
  showSearchLocal = false;
  subscription: Subscription;
  appConfig: any = {
    color: "#fff"
  };
  notificationData = [];
  offset = 0;
  limit = 7;
  notifyFlag = true;
  count = 0;
  totalCount = 0;
  showHeadingSearch: boolean;
  showFbSignIn = false;
  vendor_id: any;
  access_token: any;
  isFetchingNotification: any;
  delete_noti_id: any;
  formSettings: any;
  terminology: any = {};
  refStatus: any;
  public langJson: any = {};
  public languageArray: any;
  public languageSelected: any;
  public direction = "ltr";
  public walletEnabled: boolean;
  public paymentMode = PaymentMode;
  id: any;
  show = true;
  hideSearch = true;
  hideLogin = true;
  isEcomFlow: boolean;
  domain;
  vendor_token: any;
  _elementRef: ElementRef;
  country_code = "91";
  env = environment;
  profileImage: string;
  title: string;
  showAddressBar: boolean;
  showDeliveryMode: boolean;
  public deliveryHTMLToShow = 2;
  public hideMapIcon: boolean = true;
  public alive: boolean = true;
  public loginData: any;
  @Input() hidden: boolean;
  businessCategoryPage = false;
  businessCategoryPageHidden:boolean
  public marketplace_reference_id;
  public merchant_url;
  public config;
  public staticPages;
  //ngOnChanges(changes: SimpleChanges) {
  //  this.image_link = changes.headerData.currentValue
  //    ? changes.headerData.currentValue.web_header_logo
  //    : "";
  //  this.title = changes.headerData.currentValue && changes.headerData.currentValue.form_name
  //    ? changes.headerData.currentValue.form_name + ' logo'
  //    : "company logo";
  //
  //  this.bg_color = changes.headerData.currentValue
  //    ? changes.headerData.currentValue.header_color
  //    : "";
  //  this.profile_color = changes.headerData.currentValue
  //    ? changes.headerData.currentValue.color
  //    : "";
  //  this.headerData = changes.headerData.currentValue;
  //}

  public  otpObjectDetails;
  public showOnlyInSingleStore: boolean = false;
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
    public   headerService: HeaderService,
    protected appService: AppService,
    protected extService: ExternalLibService,
    protected renderer: Renderer2,
    protected googleAnalyticsEventsService: GoogleAnalyticsEventsService,
    protected restaurantService: RestaurantsService
  ) { }

  ngOnInit() {
    this.initContructorFunction();
    this.initChecks();
    this.config = this.sessionService.get("config")
    this.marketplace_reference_id = this.config.marketplace_reference_id;
    if(environment.production){
      let domain = this.config && this.config.ds_domain_name ? this.config.ds_domain_name :( environment.beta ? 'admin2.yelo.red': 'admin.yelo.red');
      this.merchant_url = 'https://' + domain + '/' + this.languageSelected +
              '/onboard/merchant-signup?marketplace_reference_id=' +
              this.marketplace_reference_id + '&user=' + this.terminology.MERCHANT;
    }else{
      this.merchant_url = environment.dashboard_url +
              '/onboard/merchant-signup?marketplace_reference_id=' +
              this.marketplace_reference_id + '&user=' + this.terminology.MERCHANT;
    }
    if(this.hideLoginBtn)
    { 
      this.hideLogin=false;
    }
    if(this.config && this.config.is_dynamic_pages_active){
      this.getAllStaticPages();
    }
  }

  setHeaderColor() {
    let config = this.sessionService.get("config");
    this.renderer.setStyle(this.elementRef.nativeElement, '--header_bg_color', config.header_color, RendererStyleFlags2.DashCase);
    this.renderer.setStyle(this.elementRef.nativeElement, '--header_font_color', config.header_element_color, RendererStyleFlags2.DashCase);

    // (this.elementRef.nativeElement as HTMLElement).style.setProperty('--header_bg_color', config.header_color);
    // (this.elementRef.nativeElement as HTMLElement).style.setProperty('--header_font_color', config.header_element_color);

    // document.documentElement.style.setProperty('--header_bg_color', config.header_color);
    // document.documentElement.style.setProperty('--header_font_color', config.header_element_color);
  }

  ngAfterViewInit() {
    if(this.sessionService.get("config").is_customer_subscription_enabled && this.sessionService.get("config").theme_enabled && this.loggedIn){
      this.appendCustomerSubscription();
    }
  }

  /**
   * 
   *  
   */
  getAllStaticPages(){

    const obj = {
      'marketplace_user_id': this.formSettings.marketplace_user_id,
      'user_id': this.formSettings.marketplace_user_id,
      'is_admin_page': 1,
      'source': 0
    };
    if (this.sessionService.get('appData')) {
      obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    this.headerService.getAllPages(obj)
      .subscribe(
        response => {
          try {
            if (response.status === 200) {
              response.data.template_data.forEach((o) => {
                if (location.hostname !== 'localhost') {
                  o.url = '/'+ this.sessionService.getString('language') +'/content/' + o.route;
                } else {
                  o.url = '/content/' + o.route;
                }
              })

              this.staticPages = response.data.template_data.filter((page)=>{
                  return page.is_active;
                });
              // response.data.template_data.filter((page)=>{
              //   return page.is_visible_on_apps;
              // });
            } else if (response.status === 400) {
              this.staticPages = [];
            }
          } catch (e) {
            console.error(e);
          }
        },
        error => {
          console.error(error);
        }
      );
  }

  // ================language changed===================
  languageChanged(type) {
    this.languageSelected = type;
    this.sessionService.setToString("language", this.languageSelected);
    this.appService.hitLangJson(this.languageSelected).subscribe(
      response => {
        try {
          let restorePath = location.pathname.split('/').splice(2);
          let newPath= restorePath.join('/');
          location.pathname = this.languageSelected + '/' + newPath ;
        } catch (e) {
          console.error(e);
        }
      },
      error => {
        console.error(error);
      }
    );
    this.appService.hitLanguageStrings();
    // this.apiHitForLanguageChange();
  }

  // ====================api hit for language==================
  apiHitForLanguageChange(type) {
    this.sessionService.setToString("language", this.languageSelected);
    this.appService.hitLangJson(this.languageSelected).subscribe(
      response => {
      },
      error => {
        console.error(error);
      }
    );
  }

  logout() {
    this.userLogingOut();
    this.popup.showPopup(
      MessageType.ERROR,
      2000,
      this.languageStrings.logged_out_successfully || "Logged out successfully",
      false
    );
    if(this.sessionService.get('config').bumbl_domain_name && !this.sessionService.isPlatformServer())
    {
      (<any>window).mt('send', 'pageview', {email: this.sessionService.get('appData').vendor_details.email, itemincart : false});
    }
    
    //remove bumbl keys from local storage and cookies
    let storageDeletionForBumbl=['mtc_sid','mtc_id','mautic_device_id','mautic_referer_id'];
    for(let keys of storageDeletionForBumbl)
    {    
      //cookies pending
      localStorage.removeItem(keys);
    }
    this.sessionService.remove("appData");
    localStorage.removeItem('oftenBoughtModal');
    this.sessionService.remove('previousUrl');
    this.extService.shutdownFuguWidget();
    this.extService.initFuguWidget();
    this.sessionService.remove("reg_status");
    // this.sessionService.remove('cookieEnabled');
    // this.messageService.storageRemoved({data:true});
    this.messageService.logoutUser();
    this.loggedIn = false
    if(!localStorage.getItem('appData'))
    {
      this.router.navigate(['']);
    }
    if (
      this.path === "/payment" ||
      this.path === "/profile" ||
      this.path === "/checkout" ||
      this.path === "/refer" ||
      this.path === "/settings" ||
      this.path.indexOf("orders") > -1 ||
      this.path.indexOf("store-review") > -1 ||
      this.path.indexOf("projects") > -1 ||
      this.path.indexOf("bids") > -1 ||
      this.path.indexOf("wallet") > -1 ||
      this.path.indexOf("giftCard") > -1 ||
      this.path.indexOf("profile") > -1 ||
      this.path.indexOf("settings") > -1 ||
      this.path.indexOf("rewards") > -1 ||
      this.path.indexOf("loyalty-points") > -1
    ) {
      if (
        this.formSettings.nlevel_enabled === 2 &&
        this.formSettings.business_model_type === "ECOM"
      ) {
        this.router.navigate(["ecom/categories"]);
      } else if (this.formSettings.business_model_type === "FREELANCER") {
        this.router.navigate(["/"]);//freelancer
      } else {
        this.router.navigate(["list"]);
      }
    }
  }
  userLogingOut()
  {
    this.headerService.userLogout()
    .subscribe(response => {
      }, error => {
        console.error(error);
    });
  }
  goBack() {
    event.stopPropagation();
    history.back();
  }

  /**
   * append a customer Subscription <li> in profile drop down
   */
  appendCustomerSubscription(){
    const element = document.querySelector('.profile .dropdown-menu').lastElementChild;
    const parent = document.querySelector('.profile .dropdown-menu');
    const cln = element.cloneNode(true);
    cln.childNodes
    if(cln.childNodes[0].textContent == 'Logout'){
      cln.childNodes[0].textContent = 'Subscription Plans';
    }else
    cln.childNodes[1].textContent = 'Subscription Plans';
    document.querySelector('.profile .dropdown-menu').appendChild(cln).addEventListener('click',() =>{
      this.router.navigate(["customerSubscription/subscriptionPlan"]);
    });
    parent.insertBefore(cln, parent.childNodes[6])
  }
  goToHome() {
    this.restaurantService.reloadPage.next(false);
    const obj = this.sessionService.get("config");
    /*
      hardcoded check for Hoifoods, as he is priority client. Not my jugaadu check.
      Click on logo takes on all categories.
    */
    if (obj && obj.marketplace_user_id == 48956) {
      document.getElementsByClassName('logo')[0].addEventListener("click", () => {
        const el = <any>document.getElementsByClassName('breadcrumb-item');
        if (el && el[0] && el[0].children) {
          el[0].children[0].click();
          return;
        }
      });
      // check for jobjar, opening his link, isha's client
    } else if (obj && obj.marketplace_user_id == 157388) {
      window.open('https://www.jobjar.ca/', '_self');
      return;
    }
    if (obj && obj.landing_page_url) {
      window.open(obj.landing_page_url, "_self");
    } else {
      if (
        this.formSettings.nlevel_enabled === 2 &&
        this.formSettings.business_model_type === "ECOM"
      ) {
        this.router.navigate(["categories"]);
      } else if (this.formSettings.business_model_type === "FREELANCER") {
        this.router.navigate(["/"]);//freelancer
      } else {
        if (this.formSettings.is_landing_page_enabled) {
          this.router.navigate([""]);
        } else {
          this.router.navigate(["list"]);
        }
      }
    }
  }

  forgotEmail() {
    const obj = {
      phone_no: this.forgotForm.controls.phone_email.value.is_phone
        ? this.forgotForm.controls.phone_email.value.value
        : undefined,
      email: !this.forgotForm.controls.phone_email.value.is_phone
        ? this.forgotForm.controls.phone_email.value.value
        : undefined,
      // 'email': this.forgotForm.value.email,
      marketplace_reference_id: this.sessionService.getString(
        "marketplace_reference_id"
      )
    };
    this.loginService.forgot(obj).subscribe(
      response => {
        try {
          if (response.status === 200) {
            $("#loginDialog").modal("hide");
            $("#forgotModal").modal("hide");
            this.popupModal.showPopup(MessageType.SUCCESS, 2000, response.message, false);
          } else {
            this.popupModal.showPopup(MessageType.ERROR, 2000, response.message, false);
          }
        } catch (e) {
          console.error(e);
        }
        this.loader.hide();
      },
      error => {
        $("#loginDialog").modal("hide");
        $("#forgotModal").modal("hide");
        console.error(error);
      }
    );
  }
  moveToWhatsapp(dummy_text: string, contact_number?: string) {
    window.open("https://api.whatsapp.com/send?phone=" + (contact_number ? contact_number : this.formSettings.contact_details.contact_number) + "&text=" + dummy_text)
  }

  forgotEmailOtp() {
    const obj = {
      phone: this.forgotForm.controls.phone_email.value.is_phone
        ? this.forgotForm.controls.phone_email.value.value
        : undefined,
      email: !this.forgotForm.controls.phone_email.value.is_phone
        ? this.forgotForm.controls.phone_email.value.value
        : undefined,
      // 'email': this.forgotForm.value.email,
      marketplace_reference_id: this.sessionService.getString(
        "marketplace_reference_id"
      ),
      language: this.sessionService.getString("language")
    };
    this.otpObjectDetails = {
      phone: this.forgotForm.controls.phone_email.value.is_phone
        ? this.forgotForm.controls.phone_email.value.value
        : undefined,
      email: !this.forgotForm.controls.phone_email.value.is_phone
        ? this.forgotForm.controls.phone_email.value.value
        : undefined,
      marketplace_reference_id: this.sessionService.getString("marketplace_reference_id")
    };
    this.loginService.forgotNew(obj).subscribe(
      response => {
        try {
          if (response.status === 200) {
            $("#loginDialog").modal("hide");
            $("#forgotModal").modal("hide");
            $("#otpDialog").modal("show");

            this.popupModal.showPopup(MessageType.SUCCESS, 2000, response.message, false);
          } else {
            this.popupModal.showPopup(MessageType.ERROR, 2000, response.message, false);
          }
        } catch (e) {
          console.error(e);
        }
        this.loader.hide();
      },
      error => {
        $("#loginDialog").modal("hide");
        $("#forgotModal").modal("hide");
        $("#otpDialog").modal("hide");
        console.error(error);
      }
    );
  }


  closeOTPDialog(){
    $("#otpDialog").modal("hide");
    this.messageService.onOtpModalClose.emit(true);
  }

  closePopup(e) {
    $("#loginDialog").modal("hide");
  }
  goToProfile() {
    if (
      this.formSettings.nlevel_enabled === 2 &&
      this.formSettings.business_model_type === "ECOM"
    ) {
      this.router.navigate(["profile"]);
    } else if (this.formSettings.business_model_type === "FREELANCER") {
      this.router.navigate(["profile"]);
    } else {
      this.router.navigate(["profile"]);
    }
  }

  goToFavLocation() {
    this.router.navigate(["fav"]);
  }
  goToRefer() {
    if (
      this.formSettings.nlevel_enabled === 2 &&
      this.formSettings.business_model_type === "ECOM"
    ) {
      this.router.navigate(["refer"]);
    } else if (this.formSettings.business_model_type === "FREELANCER") {
      this.router.navigate(["/refer"]);
    } else {
      this.router.navigate(["refer"]);
    }
  }

  /**
   * go to loyalty points
   */

  goToLoyaltyPoints() {
    this.router.navigate(["loyalty-points"]);
  }

  goToCustomerSubscriptionPage(){
    this.router.navigate(["customerSubscription/subscriptionPlan"]);
  }

  goToSettings() {
    if (
      this.formSettings.nlevel_enabled === 2 &&
      this.formSettings.business_model_type === "ECOM"
    ) {
      this.router.navigate(["settings"]);
    } else if (this.formSettings.business_model_type === "FREELANCER") {
      this.router.navigate(["settings"]);
    } else {
      this.router.navigate(["settings"]);
    }
  }
  goToOrders() {
    if (
      this.formSettings.nlevel_enabled === 2 &&
      this.formSettings.business_model_type === "ECOM"
    ) {
      this.router.navigate(["orders"]);
    } else if (this.formSettings.business_model_type === "FREELANCER") {
      this.router.navigate(["projects"]);
    } else {
      this.router.navigate(["orders"]);
    }
  }

  goToSubscription() {
    this.router.navigate(['/subscriptions']);
  }
  goToWallet() {
    this.sessionService.remove('walletAddMoney');
    if (
      this.formSettings.nlevel_enabled === 2 &&
      this.formSettings.business_model_type === "ECOM"
    ) {
      this.router.navigate(["wallet"]);
    } else if (this.formSettings.business_model_type === "FREELANCER") {
      this.router.navigate(["freelancer/wallet"]);
    } else {
      this.router.navigate(["wallet"]);
    }
  }

  goToGiftCard() {
    if (
      this.formSettings.nlevel_enabled === 2 &&
      this.formSettings.business_model_type === "ECOM"
    ) {
      this.router.navigate(["giftCard"]);
    } else if (this.formSettings.business_model_type === "FREELANCER") {
      this.router.navigate(["freelancer/giftCard"]);
    } else {
      this.router.navigate(["giftCard"]);
    }
  }

  goToReward() {
    if (
      this.formSettings.nlevel_enabled === 2 &&
      this.formSettings.business_model_type === "ECOM"
    ) {
      this.router.navigate(["giftCard"]);
    } else if (this.formSettings.business_model_type === "FREELANCER") {
      this.router.navigate(["freelancer/reward"]);
    } else {
      this.router.navigate(["reward"]);
    }
  }

  freelancerOrders() {
    this.router.navigate(["orders"]);
  }
  goToStripe() {
    this.router.navigate(["stripe"]);
  }

  goToSearch() {
    this.router.navigate(["search"]);
  }


  // Read notification
  read(column) {
    this.id = column.app_notif_id;
    this.vendor_id = this.sessionService.get(
      "appData"
    ).vendor_details.vendor_id;
    this.access_token = this.sessionService.get(
      "appData"
    ).vendor_details.app_access_token;
    const data = {
      access_token: this.access_token,
      vendor_id: this.vendor_id,
      push_id: this.id
    };

    this.headerService.readNotification(data).subscribe(
      data => {
        if (data.status === 200) {
          this.count = 0;
          const index = this.notificationData.indexOf(column);
          this.notificationData[index].is_read = true;
          this.sessionService.setToString("job_id", column.job_id);
          if (this.router.url === "/orders") {
            this.messageService.showOrderDetail(
              this.sessionService.getString("job_id")
            );
          }
          this.router.navigate(["orders"]);
        } else if (data.status === 101) {
          this.logout();
          return;
        } else {
          if (data.message) {
            // showFailure(data.message.toString());
          } else {
            // showFailure('Something went wrong.');
          }
        }
      },
      error => {
        // showFailure('Something went wrong.');
        // hideLoader();
      }
    );

    // switch(column.socket_type){
    //   case 20:
    //     if($state.current.name == 'app.vendor'){
    //       $state.reload();
    //     }else{
    //       $state.go('app.vendor');
    //     }
    //     break;
    //   case 10:
    //     if($state.current.name == 'app.home'){
    //       $state.reload();
    //     }else{
    //       $state.go('app.home');
    //     }
    //     break;
    // }
    // Close the popup
    $("#notificationContainer").hide();
  }

  removeThisNotification(column) {
    this.delete_noti_id = column.dashboard_notif_id;
    this.vendor_id = this.sessionService.get(
      "appData"
    ).vendor_details.vendor_id;
    this.access_token = this.sessionService.get(
      "appData"
    ).vendor_details.app_access_token;
    const data = {
      access_token: this.access_token,
      vendor_id: this.vendor_id,
      // form_id: $cookieStore.get('formId'),
      notif_id: this.delete_noti_id,
      is_delete: 1
    };

    this.headerService.removeNotifications(data).subscribe(
      data => {
        if (data.status === 200) {
          if (!column.is_read) {
            // this.count--;
          }
          this.totalCount--;
          if (this.offset > 1) {
            this.offset--;
          }
          const index = this.notificationData.indexOf(column);
          this.notificationData.splice(index, 1);
          this.notifyFlag = this.notificationData.length > 0 ? false : true;
        } else if (data.status === 101) {
          this.logout();
          return;
        } else {
          if (data.message) {
            // showFailure(data.message.toString());
          } else {
            // showFailure('Something went wrong.');
          }
        }
        this.delete_noti_id = null;
      },
      error => {
        console.error(error);
        this.delete_noti_id = null;
        // hideLoader();
      }
    );
  }

  showSignInFalse() {
    this.showFbSignIn = false;
  }

  onAccountSwitch(event) {
    if (event.target.value) {
      this.loader.show();
      this.access_token = this.sessionService.get(
        "appData"
      ).vendor_details.app_access_token;
      //(window as Window).location.href = `${environment.dashboard_url}?access_token=${this.access_token}`;
      (window as Window).location.href = `https://${
        this.formSettings.ds_domain_name || 'admin.yelo.red'
        }/?access_token=${this.access_token}`;
    }
  }

  public showChangeApiUrlPopup: boolean;
  changePort() {
    this.showChangeApiUrlPopup = true;
  }

  hideChangeProtPopup() {
    this.showChangeApiUrlPopup = false;
  }

  showOtpDialog(){
    this.showOtpModal = true;
  }
  hideOtpDialog(){
    this.showOtpModal = false;
  }

  goToLogin() {
    this.messageService.getLoginSignupLocation('From Login Button');
  }

  /**
   * check if wallet enabled
   */
  checkWalletEnabled() {
    if (this.sessionService.get('appData')) {
      const loginData = this.sessionService.get('appData');
      for (let i = 0; i < loginData.formSettings[0].payment_methods.length; i++) {
        if (loginData.formSettings[0].payment_methods[i].value === this.paymentMode.WALLET && loginData.formSettings[0].payment_methods[i].enabled) {
          this.walletEnabled = true;
        }
      }
    }
  }

  ngOnDestroy() {
    this.alive = false;
  }

  /**
   * subscribe for location changed
   */
  subscriptionForListeningMessage() {
    if (this.sessionService.get('location')) {
      this.showSearchLocal = true;
    }
    this.messageService.getMessage()
      .pipe(takeWhile(_ => this.alive)).subscribe(message => {
   
        this.showSearchLocal = true;
      });
  }

  initContructorFunction() {
    this.formSettings = this.sessionService.get("config");
    this.domain = this.formSettings.domain_name;
    this.setHeaderColor();
    this.checkWalletEnabled();
    this.showHeadingSearch =
      this.formSettings.business_model_type === "ECOM" &&
      this.formSettings.nlevel_enabled === 1;
      if (this.formSettings.map_view == 0) {
        this.sessionService.remove('mapView');
      }
    if (this.formSettings && this.formSettings.terminology) {
      this.terminology = this.formSettings.terminology || {};
    }
    if (
      this.formSettings &&
      this.formSettings.languages &&
      this.formSettings.languages.length
    ) {
      this.languageArray = this.formSettings.languages;
      if (this.sessionService.getString("language")) {
        this.languageSelected = this.sessionService.getString("language");
        // this.apiHitForLanguageChange(this.languageSelected);
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
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
     this.languageStrings.reward_plans = (this.languageStrings.reward_plans || "Reward Plan")
     .replace("REWARD_REWARD", this.terminology.REWARD);
     this.languageStrings.no_notifications_are_available = (this.languageStrings.no_notifications_are_available || "No notifications are available.")
     .replace("NOTIFICATIONS_NOTIFICATIONS", this.terminology.NOTIFICATIONS);
     this.languageStrings.switch_to_merchant_panel = (this.languageStrings.switch_to_merchant_panel || "Switch to Merchant Panel")
     .replace("MERCHANT_MERCHANT", this.terminology.MERCHANT);
    });
    this.forgotForm = this.formBuilder.group({
      phone_email: ["", [Validators.required]]
    });

    this._elementRef = this.elementRef;
    if (!this.sessionService.isPlatformServer()) {
      this.loginData = this.sessionService.get('appData');
      $(this._elementRef.nativeElement).on("hidden.bs.modal", () => {
        // $('body div').removeClass('modal-backdrop fade in');
        // $('body').removeClass('modal-open');
        this.ngZone.run(() => {
          this.messageService.sendClearForm();
          this.forgotForm.reset();
        });
      });
      this.subscriptionForListeningMessage();
    }
    // $(this._elementRef.nativeElement).on('hide.bs.modal', () => {
    //   // $('body div').removeClass('modal-backdrop fade in');
    //   // $('body').removeClass('modal-open');
    // });
    // $(this._elementRef.nativeElement).on('shown.bs.modal', () => {
    //  $('#siEmail1').focus();
    // });

    this.path = this.router.url.toString();
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
    this.isEcomFlow =
      this.formSettings.nlevel_enabled === 2 &&
      this.formSettings.business_model_type === "ECOM" &&
      this.path === "/categories";

    if ((this.formSettings.routes && this.formSettings.routes.fetchlocation == Routes.catalogRoute && this.path && this.path.includes('store/')) ||
      this.path === "/" ||
      this.path.indexOf("verify-email") > -1 || this.path.includes('freelancer/merchantProfile') ||
      this.path === "/freelancer"
    ) {
      // || this.path === '/list' || this.path === '#/list' || (this.path.indexOf('store') > -1 && this.sessionService.getString('no_of_stores') === '1')
      this.backHidden = true;
    } else {
      this.backHidden = false;
    }
    this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        this.path = val.url.toString();
        $("#myNavbarWithoutLogin").removeClass("in");
        if ((this.formSettings.routes && this.formSettings.routes.fetchlocation == Routes.catalogRoute && val.url && val.url.includes('store/')) ||
          val.url.toString() === "/" ||
          val.url.toString() === "/freelancer" || val.url.includes('freelancer/merchantProfile') ||
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

    //check for single store
    if(!this.sessionService.isPlatformServer() && location.pathname.includes('/store')) {
      this.showOnlyInSingleStore = (this.formSettings.enabled_marketplace_storefront.length == 1) ? true : false ;

    } else {
      this.showOnlyInSingleStore = false;
    }

    this.subscription = this.messageService
      .getProfileName()
      .subscribe(message => {
        this.name = this.sessionService.get(
          "appData"
        ).vendor_details.first_name;
        this.profileImage = this.sessionService.get("appData").vendor_details.vendor_image;
      });
    this.subscription = this.messageService
      .getLoggedStatus()
      .subscribe(message => {
        this.loggedIn = message.logged;
        if(this.sessionService.get("appData"))
        {
          this.guestLoginData=parseInt(this.sessionService.get("appData").vendor_details.is_guest_account);
         
        }
        this.name = this.sessionService.get(
          "appData"
        ).vendor_details.first_name;
        this.profileImage = this.sessionService.get("appData").vendor_details.vendor_image;
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
      if(this.sessionService.get("appData"))
      {
        this.guestLoginData=parseInt(this.sessionService.get("appData").vendor_details.is_guest_account);
 
      }
      this.vendor_token = this.sessionService.get(
        "appData"
      ).vendor_details.app_access_token;
    });

    if (
      this.sessionService.get("appData") &&
      parseInt(this.sessionService.getString("reg_status")) === 1
    ) {
      this.loggedIn = true;
      this.guestLoginData=parseInt(this.sessionService.get("appData").vendor_details.is_guest_account);
    
      this.vendor_token = this.sessionService.get(
        "appData"
      ).vendor_details.app_access_token;
      this.name = this.sessionService.get("appData").vendor_details.first_name;
      this.profileImage = this.sessionService.get("appData").vendor_details.vendor_image;
      this.refStatus = this.sessionService.get("appData").referral.status;
    } else if (
      this.sessionService.get("appData") &&
      parseInt(this.sessionService.getString("reg_status")) !== 1
    ) {
      this.refStatus = this.sessionService.get("appData").referral.status;
      if (!this.sessionService.get("appData").signup_template_data.length) {
        this.loggedIn = true;
          this.guestLoginData=parseInt(this.sessionService.get("appData").vendor_details.is_guest_account);
        this.name = this.sessionService.get(
          "appData"
        ).vendor_details.first_name;
        this.profileImage = this.sessionService.get("appData").vendor_details.vendor_image;
      }
    }
    const access_token = "";
    const userLocation = "";
    const user_id = "";
    const accessCrendentialsObj = this.sessionService.get("appData");

    if (accessCrendentialsObj && Object.keys(accessCrendentialsObj).length) {
      this.vendor_id = this.sessionService.get(
        "appData"
      ).vendor_details.vendor_id;
      this.access_token = this.sessionService.get(
        "appData"
      ).vendor_details.app_access_token;
    }

    // this.renderer.listen("body", "click", e => {
    //   // this.onClickOutside({ value: true });
    // });
    this.showAddressBar = this.formSettings.is_banners_enabled ? true : false;
    if (this.formSettings.admin_home_delivery && this.formSettings.admin_self_pickup) {
      this.showDeliveryMode = true;
    }
  }

  initChecks() {
    // this.getNotifications(true, 0);
    // Document Click hiding the popup
    // $(document).click(function() {
    //   $('#notificationContainer').hide();
    // });
    // ============ Login popup - Customer Verifivation

    this.messageService.openDiffrentAccount.subscribe(()=> {
      this.messageService.emitOpenLoginModalBheavior(true);
      this.logout();
    });
    this.messageService.openLoginModal.subscribe((res) => {
      if (res == true){
       setTimeout(()=>{
        this.messageService.openLoginModal.next(false);
       },0)
        $('#loginDialog').modal('show');
      }
    })
    // ============
    if (this.sessionService.get('mapView') == true) {
      this.mapViewFlag = true;
    } else {
      this.mapViewFlag = false;
    }
    this.messageService.mapListCheck(this.mapViewFlag);

    // =============

    // Popup on click
    if (!this.sessionService.isPlatformServer()) {
      $("#notificationContainer").click(function () {
        return false;
      });
    }
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
    this.showHeadingSearch =
      this.sessionService.get("config").business_model_type === "ECOM" &&
      this.sessionService.get("config").nlevel_enabled === 1;
    // ================language json manupilation======================
    this.appService.langPromise.then(() => {
      this.langJson = this.appService.getLangJsonData();
      this.langJson["No notifications are available."] = this.langJson[
        "No notifications are available."
      ].replace("----", this.terminology.NOTIFICATIONS);


    });

    if (this.formSettings) {
      this.businessCategoryPage = (this.formSettings.is_business_category_enabled && this.formSettings.business_category_page)
        ? true
        : false;
    }

    this.messageService.businessCategoryPageHidden
      .pipe(takeWhile(_ => this.alive))
      .subscribe((res) => {
        this.businessCategoryPageHidden = res;
      });

    if (this.businessCategoryPage) {
      this.messageService.merchantsLoaded
        .pipe(takeWhile(_ => this.alive))
        .subscribe((res) => {
          if (this.businessCategoryPage && res) {
            this.businessCategoryPage = false;
          }
        });
    }

  }
  goToMapView(data) {
    this.mapViewFlag = data;
    this.messageService.mapListCheck(data);
    this.sessionService.set('mapView', data);
  }
  keyDownFunction(event) {
    if(event.keyCode == 13) {
      this.forgotEmailOtp();
    }
  }

}
