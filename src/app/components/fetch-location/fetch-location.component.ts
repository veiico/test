import { MessageType } from './../../constants/constant';
/**
 * Created by cl-macmini-51 on 21/05/18.
 */
import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { AutocompleteComponent } from '../autocomplete/autocomplete.component';

import { LoaderService } from '../../services/loader.service';
import { SessionService } from '../../services/session.service';
import { MessageService } from '../../services/message.service';
import { LoginService } from '../login/login.service';
import { AppService } from '../../app.service';
import { PopupModalService } from '../../modules/popup/services/popup-modal.service';
import { GoogleAnalyticsEventsService } from '../../services/google-analytics-events.service';
import { RestaurantsService } from '../restaurants-new/restaurants-new.service';
import { ExternalLibService } from '../../services/set-external-lib.service';
import { GoogleAnalyticsEvent, MarketplaceUserId, MapType } from '../../enums/enum';
import { slideInOutState } from '../../animations/slideInOut.animation';
import { flipState } from '../../animations/flip.animation';
import { Preview } from '../../themes/swiggy/modules/app/classes/preview.class';
import { ThemeService } from '../../services/theme.service';
import { BusinessCategoriesService } from '../restaurants-new/components/business-categories/business-categories.service';
import { DomSanitizer } from "@angular/platform-browser";
import { environment } from "../../../environments/environment";

declare var $: any;

// import * as $ from 'jquery';
// import { defineLocale } from 'ngx-bootstrap/chronos';
// import { arLocale, esUsLocale, frLocale } from 'ngx-bootstrap/locale';
// import { trigger, transition, useAnimation } from '@angular/animations';

@Component({
  selector: 'app-location',
  templateUrl: './fetch-location-new.component.html',
  styleUrls: ['./fetch-location-new.component.scss'],
})
// animations: [
//  trigger('shake', [transition('* => *', useAnimation(shake))])
// ],
export class FetchLocationComponent extends Preview implements OnInit, OnDestroy, AfterViewInit {

  checkForYeloDomain: boolean;
  is_google_map: boolean;
  flightMapError: boolean;
  googleKeyError: boolean;
  googleKeyErrr: any;
  @ViewChild(AutocompleteComponent)
  protected autoCompleteComponent: AutocompleteComponent;
  public subscription: Subscription;
  public locationForm: FormGroup;
  public bsRangeValue: FormControl;
  public bsRangeValue_1: FormControl;
  public config: any;
  public guestEmail: any;
  public guestPassword: any;
  public formInvalid = false;
  public businessData: any;
  public terminology: any = {};
  public bsConfig: any;
  public colorTheme = 'theme-dynamic';
  public minDate = new Date();
  public checkInDate = new Date();
  public checkOutDate = new Date();
  public dateStart = [];
  public dateEnd = [];
  public langJson: any = {};
  public languageSelected: any;
  public direction = 'ltr';
  public mobileView = false;
  public data;
  public showFindBusiness = true;
  public showDefaultCustom = false;
  public loggedIn = false;
  public content: any;
  public image_link;
  public businessCategoriesList;
  public isJini = false;
  public selectedCategory;
  public marketplaceUserIdEnum = MarketplaceUserId;
  public countryInfo;
  public alive = true;
  
  // server
  isPlatformServer: boolean;
  languageStrings: any={};
  merchant_url: string;
  constructor(protected loader: LoaderService, protected sessionService: SessionService,
    protected ngZone: NgZone, protected messageService: MessageService,
    protected router: Router, protected themeService: ThemeService,
    protected loginService: LoginService, protected googleAnalyticsEventsService: GoogleAnalyticsEventsService,
    protected appService: AppService, protected popup: PopupModalService, protected restaurantService: RestaurantsService,
    protected localeService: BsLocaleService, protected extService: ExternalLibService,
    protected activatedRoute: ActivatedRoute,protected domSanitizer: DomSanitizer, protected businessCategoriesService?: BusinessCategoriesService) {
  super(themeService);

  this.subscription = this.messageService.getMessage().pipe(takeWhile(_ => this.alive)).subscribe(message => {
      this.getRestaurants(message.lat, message.lng, message.city, '',true);
    });

    this.setConfig();
    this.setLanguage();
    this.formInitialize();
  }

  ngOnInit() {
 
     this.initchecks();
     if(this.themeService.config)
     {
      this.content = this.themeService.config;
     }
   let marketplace_reference_id = this.config.marketplace_reference_id;
     if(environment.production){
      let domain = this.config && this.config.ds_domain_name ? this.config.ds_domain_name :( environment.beta ? 'admin2.yelo.red': 'admin.yelo.red');
      this.merchant_url = 'https://' + domain + '/' + this.languageSelected +
              '/onboard/merchant-signup?marketplace_reference_id=' +
              marketplace_reference_id + '&user=' + this.terminology.MERCHANT;
    }else{
      this.merchant_url = environment.dashboard_url +
              '/onboard/merchant-signup?marketplace_reference_id=' +
              marketplace_reference_id + '&user=' + this.terminology.MERCHANT;
    }
  }
  async checkForWhiteLabelDomain()
  {
    const domainName=this.sessionService.get('config').domain_name
    if(domainName)
    {
     this.checkForYeloDomain= await this.sessionService.checkForYeloDomains(domainName);
    }
    this.googleKeyError= (this.data &&  this.is_google_map  && !this.data.webapp_google_api_key && !this.checkForYeloDomain)?true:false;
    this.flightMapError = (this.config && !this.is_google_map &&  !this.config.map_object.webapp_map_api_key  && !this.checkForYeloDomain)?true:false;
  }
  getCountryInfo(){
    this.sessionService.countryInfo.pipe(takeWhile(_ => this.alive)).subscribe((resp)=>{
      this.countryInfo=resp;
    });
  }

  trustImageUrl(value:any){
    return this.domSanitizer.bypassSecurityTrustResourceUrl(value);
  }
  
  protected initchecks() {
    this.isPlatformServer = this.sessionService.isPlatformServer();
    this.data = this.sessionService.get('config');
    this.is_google_map = this.sessionService.get('config').map_object.map_type === MapType.GOOGLEMAP ? true : false;
    this.image_link = this.data  ? this.data .web_header_logo : '';
    this.loader.hide();
    this.setCalenderValues();
    this.checkForDemoLogin();
    this.checkWidthClient();
    this.checkForWhiteLabelDomain()
    const location = this.sessionService.get('location');
    if (location) {
      this.getRestaurants(location.lat, location.lng, location.city, '');
    }
    if (this.data.is_landing_page_enabled) {
      this.showFindBusiness = false;
      this.showDefaultCustom = true;
    }

    if (!this.isPlatformServer) {
      this.subscribeLoggedIn();
      this.getCountryInfo();
    }
     this.themeService.getThemeModuleData('fetchlocation').subscribe(res => {
       this.onPreview(res);
    });

    /**
     * Fix for Jini, BusinessCategories are displayed and navigates to the
     * list page
     */
    if(this.config.marketplace_user_id == this.marketplaceUserIdEnum.JINI || this.config.show_business_categories_on_home_page){
      this.fetchBusinessCategories();
    }

  }

  fetchBusinessCategories() {
    const obj = {
      marketplace_user_id: this.config.marketplace_user_id,
      version: 2
    };
    
    this.businessCategoriesService.getBusinessCategories(obj)
    .subscribe(res => {      
      if(res.data.result.length > 0) {
        this.businessCategoriesList = res.data.result.filter(data => !data.is_custom_order_active);
        this.isJini = true;
      }      
    });
  }

  selectCategory(data) {
    this.selectedCategory = data.id;
    this.sessionService.setString('bId', this.selectedCategory);
    if(data.external_link){
      window.open(data.external_link, "_blank");
    } 
    else { 
      if(this.sessionService.get('location')){
        this.router.navigate(['list'],{queryParams: {bId: this.selectedCategory}});
      }      
    }
  }

  ngAfterViewInit() {
    // const height = $(window).innerHeight();
    // $('#fetchLocation').css('height', height - 70);
    this.afterInitchecks();

  }

  protected afterInitchecks() {
    if (this.sessionService.get('config') && this.sessionService.get('config').terminology) {
      this.terminology = this.sessionService.get('config').terminology || {};
    }
    const getElement = document.getElementById('shakeFilter');
    if (getElement) {
      getElement.addEventListener("animationend", (e) => {
        getElement.classList.remove("apply-shake");
      });
    }
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
     this.languageStrings.find_businesses = (this.languageStrings.find_businesses || 'Find Businesses')
     .replace('BUSINESSES_BUSINESSES', this.terminology.BUSINESSES ? this.terminology.BUSINESSES : 'Businesses');
     this.languageStrings.place_custom_order = (this.languageStrings.place_custom_order || 'Place Custom Order')
     .replace('CUSTOM_ORDER', this.terminology.CUSTOM_ORDER);
     this.languageStrings.order_now = (this.languageStrings.order_now || 'Order Now')
     .replace('ORDER_ORDER', this.terminology.ORDER);
 
    });

     
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
    this.sessionService.resetTitle();
    this.alive = false;
  }

  onPreview(data) {
    this.content = data;
  }

  // =============window resize event==================
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.checkWidthClient();
  }

  checkWidthClient() {
    let clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (clientWidth <= 768 && this.config.show_date_filter === 1) {
      this.mobileView = true;
    } else if (clientWidth <= 768 && this.config.show_date_filter === 0) {
      this.mobileView = false;
    } else {
      this.mobileView = false;
    }

  }

  // ============set calendar values================
  setCalenderValues() {
    const currentDate = new Date();
    this.checkOutDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
    this.dateStart = [new Date(this.checkInDate), new Date(this.checkOutDate)];
    this.dateEnd = [new Date(this.checkInDate), new Date(this.checkOutDate)];
  }

  // =================check for demo login===================
  checkForDemoLogin() {
    // try {
    //   if (this.router.url !== '/' && !this.sessionService.get('appData')) {
    //     this.guestEmail = this.router.url.split('/?')[1].split('=')[1].split('&')[0];
    //     this.guestPassword = this.router.url.split('&')[1].split('=')[1];
    //     console.log(this.guestEmail, this.guestPassword);

    //     if (this.guestEmail && this.guestPassword) {
    //       this.demoLogin(this.guestEmail, this.guestPassword);
    //     }
    //   }
    // }
    // catch (e) { }

    this.activatedRoute.queryParams.subscribe(
      (data) => {
        if (data != null) {
          this.guestEmail = data.email;
          this.guestPassword = data.password;
          if (this.guestEmail && this.guestPassword) {
            this.demoLogin(this.guestEmail, this.guestPassword);
          }
        }
      });
  }

  // ===============form initializer===================
  formInitialize() {
    this.locationForm = new FormGroup({
      bsRangeValue: new FormControl(''),
      bsRangeValue_1: new FormControl('')
    });
  }

  // ============set config for all======================
  setConfig() {
    this.config = this.sessionService.get('config');
    if (this.config) {
      this.config.borderColor = this.config['color'] || '#e13d36';
      this.terminology = this.config.terminology || {};
      // this.config.nlevel_enabled = 1;
    }

    this.bsConfig = Object.assign({}, {
      containerClass: this.colorTheme,
      showWeekNumbers: false,
      dateInputFormat: 'LL'
    }
    );
  }

  // ============set language for all======================
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
    this.appService.langPromise.then(() => {
      this.langJson = this.appService.getLangJsonData();
    })

    // const locales = [arLocale, esUsLocale, frLocale];
    // locales.forEach(locale => defineLocale(locale.abbr, locale));
    this.localeService.use(this.sessionService.getString('language'));
  }

  onSubmit(data, event, name, formCheckValue?) {

    this.formInvalid = false;

    let formCheck = this.autoCompleteComponent ? this.autoCompleteComponent.getFormStatus() : formCheckValue ;
    if (!this.showFindBusiness && !(formCheck && this.sessionService.get('location') && this.sessionService.get('location').lat)) {
      this.showFindBusiness = true;
      return;
    }
    const getElement = document.getElementById('shakeFilter');
    if (getElement) {
      getElement.classList.remove("apply-shake");
    }
    if (formCheck && this.sessionService.get('location') && this.sessionService.get('location').lat) {
      this.formInvalid = false;
      if (this.config.show_date_filter === 1) {
        const storeDate = {
          start: this.checkInDate,
          end: this.checkOutDate
        }
        this.sessionService.setString('dateFiltered', storeDate);
      }
      this.formInvalid = false;
      this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.find_business, 'List', '', '');
      if (this.config.is_customer_login_required && !this.sessionService.get('appData')) {
          $('#loginDialog').modal('show');
          return ;
      }
      if (this.config.business_model_type === 'ECOM' && this.config.nlevel_enabled === 1) {
        this.router.navigate(['list']);
      }
      // else if(this.config.business_model_type === 'ECOM' && this.config.nlevel_enabled === 2){
      //   this.router.navigate(['categories']);
      // }
      else {
        if (this.config.nlevel_enabled === 1) {
          this.router.navigate(['categories']);
        } else {
          if ((this.businessData && this.businessData.length > 1)) {
            this.router.navigate(['list']);
          } else if ((this.businessData && this.businessData.length === 0) || this.config.is_business_category_enabled || this.config.is_customer_login_required) {
            this.router.navigate(['list']);
          } else {
            if (this.config.product_view === 1) {
              this.router.navigate(['list']);
            } else {
              this.navigate(this.businessData[0]);
            }
          }
        }
      }
    } else {
      this.formInvalid = true;
      if (getElement) {
        getElement.classList.add("apply-shake");
      }
      //$('#shakeFilter').effect('shake', { times: 2 }, 1000);
      // this[name] = !this[name]; shakeFilter
    }
  }

  // =============================demo login============================
  demoLogin(email, password) {
    this.loader.show();
    const obj = {
      'email': email,
      'password': password,
      'marketplace_reference_id': this.config.marketplace_reference_id,
      // 'marketplace_reference_id': this.sessionService.getString('marketplace_reference_id')
    };
    this.loginService.login(obj)
      .subscribe(
        response => {
          try {
            if (response.status === 200) {
              try {
                if(this.sessionService.is_netcore_enabled){
                  (<any>window).smartech('identify',email);
                }
              } catch (e) {
                console.warn(e);
              } 
              this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.sign_in_success, email, '', '');
              this.sessionService.remove('email');
              this.sessionService.setToString('reg_status', response.data.vendor_details.registration_status);
              this.sessionService.set('appData', response.data);
              this.messageService.sendLoggedIn(true);
              if (response.data.vendor_details.cookie_accepted) {
                this.messageService.storageRemoved({ data: false });
              } else {
                this.sessionService.remove('cookieEnabled');
                this.messageService.storageRemoved({ data: true });
              }
              this.extService.socketRegister(this.sessionService.get('appData').vendor_details.vendor_id);
              this.extService.updateFuguWidget();
              this.popup.showPopup(MessageType.SUCCESS, 2000, this.languageStrings.logged_in_successfully || 'Logged in successfully' , false);
            } else {
              this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
            }
          } catch (e) {
            console.error(e);
            this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.sign_in_failure, email, '', '');
          }
          this.loader.hide();
        },
        error => {
          console.error(error);
          this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.sign_in_failure, email, '', '');
        }
      );
  }

  getRestaurants(lat, lng, city, search,on_subscribe?:boolean) {
    this.loader.show();
    if (this.sessionService.get('location')) {
      const obj = {
        'marketplace_reference_id': this.config.marketplace_reference_id,
        'marketplace_user_id': this.config.marketplace_user_id,
        'latitude': this.sessionService.get('location').lat,
        'longitude': this.sessionService.get('location').lng,
        'search_text': search,
        'need_eta':0,
        'limit':2
      };
      if (this.sessionService.get('appData')) {
        obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
        obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
      }
      this.restaurantService.getRestaurants(obj)
        .subscribe(
          response => {
            try {
              if (response.status === 200) {
                this.ngZone.run(() => {
                  this.businessData = response.data;
                  response.data.forEach((data) => {
                    data.latitude = Number(data.latitude);
                    data.longitude = Number(data.longitude);
                  });
                  this.sessionService.setToString('available_stores',response.data.length);
                  this.sessionService.setToString('no_of_stores', response.data.length);
                  this.sessionService.set('stores', response.data);
                  // if (response.data.length === 1) {
                  //  this.navigate(this.businessData[0]);
                  //  return;
                  // }
                  if(on_subscribe){
                    this.onSubmit('','','', true); //TODO , true set incase the value always selected from dopdown
                  }
                });
              } else if (response.status === 400) {
              }
            } catch (e) {
              console.error(e);
            }
            this.loader.hide();
          },
          error => {
            console.error(error);
          }
        );
    }
  }

  // ==================handle hide event=====================
  handlerOnHide() {
    if (this.locationForm.controls.bsRangeValue.value && this.locationForm.controls.bsRangeValue.value.length) {
      if (this.locationForm.controls.bsRangeValue.value[0] === this.locationForm.controls.bsRangeValue.value[1]) {
        this.checkInDate = this.locationForm.controls.bsRangeValue.value[0];
        const newOutDate = this.locationForm.controls.bsRangeValue.value[1];
        const currentDate = new Date();
        currentDate.setDate(newOutDate.getDate() + 1);
        currentDate.setMonth(newOutDate.getMonth());
        currentDate.setFullYear(newOutDate.getFullYear());
        this.checkOutDate = new Date(currentDate);
        this.dateStart = [new Date(this.checkInDate), new Date(this.checkOutDate)];
      } else {
        this.checkInDate = this.locationForm.controls.bsRangeValue.value[0];
        this.checkOutDate = this.locationForm.controls.bsRangeValue.value[1];
      }
    }
    this.dateEnd = [new Date(this.checkInDate), new Date(this.checkOutDate)];
  }

  showFirstCalendar() {
    this.dateStart = [new Date(this.checkInDate), new Date(this.checkOutDate)];
    this.locationForm.controls['bsRangeValue'].setValue([new Date(this.checkInDate), new Date(this.checkOutDate)]);
  }

  handlerOnHideSecond() {
    if (this.locationForm.controls.bsRangeValue_1.value && this.locationForm.controls.bsRangeValue_1.value.length) {
      if (this.locationForm.controls.bsRangeValue_1.value[0] === this.locationForm.controls.bsRangeValue_1.value[1]) {
        this.checkInDate = this.locationForm.controls.bsRangeValue_1.value[0];
        const newOutDate = this.locationForm.controls.bsRangeValue_1.value[1];
        const currentDate = new Date();
        currentDate.setDate(newOutDate.getDate() + 1);
        currentDate.setMonth(newOutDate.getMonth());
        currentDate.setFullYear(newOutDate.getFullYear());
        this.checkOutDate = new Date(currentDate);
        this.dateEnd = [new Date(this.checkInDate), new Date(this.checkOutDate)];
      } else {
        this.checkInDate = this.locationForm.controls.bsRangeValue_1.value[0];
        this.checkOutDate = this.locationForm.controls.bsRangeValue_1.value[1];
      }
    }
    this.dateStart = [new Date(this.checkInDate), new Date(this.checkOutDate)];
  }

  showSecondCalendar() {
    this.dateEnd = [new Date(this.checkInDate), new Date(this.checkOutDate)];
    this.locationForm.controls['bsRangeValue_1'].setValue([new Date(this.checkInDate), new Date(this.checkOutDate)]);
  }


  // ========================navigate to direct store if it is one=========================
  navigate(item) {
    const storeDeliveryMethod = item.home_delivery ? 1:2;
    const adminDeliveryMethod = this.config.admin_home_delivery?1:2;
    let deliveryMethod = (this.config.admin_home_delivery && this.config.admin_self_pickup)? storeDeliveryMethod : adminDeliveryMethod;
    this.sessionService.set('info', item);
    this.sessionService.setString('deliveryMethod',deliveryMethod);
    this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.restaurant_click, item.store_name, '', '');

    this.messageService.clearCartOnly();
    this.sessionService.remove('preOrderTime');
    this.router.navigate(['store', item.storepage_slug || '-', item.storefront_user_id]);
  }

  getBackgroundImage() {
    let clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (clientWidth <= 768 && this.config.mobile_background_image) {
      if (this.config.is_homepage_overlay_enabled) {
        return 'linear-gradient(0deg, rgba(38, 37, 37, 0.61), rgba(38, 37, 37, 0.66)),url(' + this.config.mobile_background_image + ')';
      } else {
        return 'url(' + this.config.mobile_background_image + ')';
      }
    } else if(clientWidth > 768 || (clientWidth <= 768 && !this.config.mobile_background_image)) {
      if (this.config.is_homepage_overlay_enabled) {
        return 'linear-gradient(0deg, rgba(38, 37, 37, 0.61), rgba(38, 37, 37, 0.66)),url(' + this.config.background_image + ')';
      } else {
        return 'url(' + this.config.background_image + ')';
      }
    }
  }

  /**
   * go to custom checkout screen
   */

  goToCustomCheckout(type) {
    if (this.sessionService.get('appData') && parseInt(this.sessionService.getString('reg_status')) === 1) {
      this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.go_to_checkout, 'Custom order checkout', '', '');
      this.router.navigate(['customCheckout']);
    } else if (this.sessionService.get('appData') && parseInt(this.sessionService.getString('reg_status')) !== 1 &&
      !this.sessionService.get('appData').signup_template_data.length) {
      this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.go_to_checkout, 'Custom order checkout', '', '');
      this.router.navigate(['customCheckout']);
    } else {
      this.messageService.getLoginSignupLocation('From Checkout Button');
      $('#loginDialog').modal('show');
    }
  }

  /**
   * go to login popup
   */
  goToLogin() {
    //this.messageService.getLoginSignupLocation('From Checkout Button');
    $('#loginDialog').modal('show');
  }

  /**
   * get logged in status
   */
  subscribeLoggedIn() {
    if (this.sessionService.get('appData')){
      this.loggedIn = true;
    }
    this.subscription = this.messageService
      .getLoggedStatus()
      .subscribe(message => {
        this.loggedIn = message.logged;
      });

    this.messageService.userLoggedOut.subscribe(() => {
      this.loggedIn = false;
    });
  }
  scrollIntoView(id,options) { 
    const element = document.getElementById(id); 
    element.scrollIntoView(options);
  }
}
