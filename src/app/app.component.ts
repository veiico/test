/// <reference types="@types/googlemaps" />

import {
  Component,
  OnInit,
  Inject,
  AfterViewInit,
  Renderer2,
  ViewEncapsulation,
  ElementRef,
  RendererStyleFlags2
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

// import {AsyncLocalStorage} from 'angular-async-local-storage';
import { AppService } from './app.service';
import { RouteHistoryService } from './services/setGetRouteHistory.service';
import { ExternalLibService } from './services/set-external-lib.service';
import { SessionService } from './services/session.service';
import { GoogleAnalyticsEventsService } from './services/google-analytics-events.service';
import { ThemeService } from './services/theme.service';
import { ProfileService } from './components/profile/profile.service';
import { OrdersService } from './components/orders/orders.service';
import { PopUpService } from './modules/popup/services/popup.service';
import { PostedProjectService } from './components/freelancer/posted-projects/posted-projects.service';
import { LoadScriptsPostAppComponentLoad } from './classes/load-scripts.class';
import { OnboardingBusinessType, TransactionStatusEnum, AddonType, LoginBy } from './enums/enum';
import { GoogleMapsConfig } from './services/googleConfig';
import { environment } from '../environments/environment';
import { MessageType, ModalType } from './constants/constant';
import { MessageService } from './services/message.service';
import { ConfirmationService } from './modules/jw-notifications/services/confirmation.service';
import { ApiService } from './services/api.service';
import * as firebase from 'firebase/app';

import 'firebase/messaging';

declare var FB: any;
declare var ga: Function;
declare var smartech: Function;
declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss',
    "../../node_modules/primeicons/primeicons.css",
    "../../node_modules/primeng/resources/themes/omega/theme.css",
    "../../node_modules/primeng/resources/primeng.min.css"],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, AfterViewInit {
  currentRoute: string;
  modalType = ModalType;
  event: any;
  showCustomerVerificationPopUp: boolean;
  data: any;
  messageListener: Function;
  langJson: any;
  isPlatformServer: boolean;
  imageUrl: any;
  showModalMainPopup:boolean;
  constructor(
    private appService: AppService,
    //  protected storage: AsyncLocalStorage,
    private router: Router,
    @Inject(DOCUMENT) private _document: HTMLDocument,
    private titleService: Title,
    private routeHistoryService: RouteHistoryService,
    protected popup: PopUpService,
    private extService: ExternalLibService,
    public sessionService: SessionService,
    private orderService: OrdersService,
    private postedProjectService: PostedProjectService,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
    private renderer: Renderer2,
    private themeService: ThemeService,
    public profileService: ProfileService,
    public messageService: MessageService,
    private el: ElementRef,
    private googleMapsConfig: GoogleMapsConfig,
    private route: ActivatedRoute,
    public confirmationService: ConfirmationService,
    private apiService: ApiService
    ) { }

  private subscribeToRouterEvents(router: Router) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        document.getElementById('splashLoader').style.display = 'none';
        (<any>window).scrollTo(0, 0);
        $('.modal-backdrop').remove();
        $('body').removeClass('modal-open');
        this.routeHistoryService.setHistory(event.urlAfterRedirects);
        const newRoute = event.urlAfterRedirects || '/';
        if (newRoute !== this.currentRoute) {
          try {
            ga('send', 'pageview', newRoute);
            if (this.data.google_analytics_is_active) {
              this.googleAnalyticsEventsService.setUserId();
              ga('yeloClientTracker.send', 'pageview', newRoute, { sessionControl: 'start' });
            }
          } catch (e) {
          } finally {
            this.currentRoute = newRoute;
          }
        }
      }
    });
  }

  ngOnInit() {
    this.isPlatformServer = this.sessionService.isPlatformServer();
    const urlParams = new URLSearchParams(window.location.search);
    
        if(urlParams  && urlParams.get('device_token'))
        {
          this.sessionService.set("device_token_app", urlParams.get('device_token'));
        }
        if(urlParams  && urlParams.get('device_type'))
        {
          this.sessionService.set("device_type_app", Number(urlParams.get('device_type')));
        }
        if(urlParams  && urlParams.get('deviceId'))
        {
          this.sessionService.set("deviceId", Number(urlParams.get('deviceId')));
        }
        if(urlParams  && urlParams.get('pwa_app'))
        {
          this.sessionService.set("pwa_app", Number(urlParams.get('pwa_app')));
        }
        if(urlParams && urlParams.get('reference_id'))
        {
          this.sessionService.set("reference_id", Number(urlParams.get('reference_id')));
        }
    this.router.initialNavigation();
    this.sessionService.set('bId', 0);
    if(!this.sessionService.isPlatformServer())
    {
      this.firebaseInit();
    }
    this.setThemeColor();
    if (!this.sessionService.getString("ip_address")) {
      try {
        this.appService.getAlternateIP().subscribe(res => {
          this.sessionService.setString('ip_address', res.ip);
        }, err => { })
      } catch (e) { }
    }
    if (this.sessionService.get('config')) {
      this.data = this.sessionService.get('config');
      if(this.data.is_popup_enabled == 1 && this.data.popup_image_url){
       this.showModalMainPopup=true;
        this.imageUrl =  this.data.popup_redirect_link;
      }
    }
    if (!this.sessionService.isPlatformServer()) {
      this.eventForWebappLoaded();
      this.subscribeToRouterEvents(this.router);
    }
    // load hippo script
    if (!this.sessionService.isPlatformServer()) {
      if (
        this.sessionService.get('config') &&
        this.sessionService.get('config').is_fugu_chat_enabled
      ) {
        setTimeout(_ => {
          this.extService.initFuguWidget();
        }, 5000);
      }
    }
    this.appService
      .hitLangJson(this.sessionService.getString('language'))
      .subscribe(
        response => {

        },
        error => {
        }
      );
    this.appService.hitLanguageStrings();

    if (!this.isPlatformServer && this.sessionService.get('config') && this.sessionService.get('config').marketplace_user_id == 166876) {
      this.getCountryData();
    }
    this.route.queryParams.subscribe((data) => {
      if (data.access_token_web && data.vendor_id_web) {
        const obj = {
          access_token: data.access_token_web,
          vendor_id: data.vendor_id_web
        }
        if (!this.isPlatformServer) {
          this.router.navigate(['']);
          if (!this.sessionService.get('appData')) {
            this.initLoginViaAccessToken(LoginBy.QUERY_PARAMS, obj);
            this.extService.socketRegister(data.vendor_id_web);
          }
          else{
            if(this.sessionService.get('config').bumbl_domain_name && !this.sessionService.isPlatformServer())
            (<any>window).mt('send', 'pageview',{company:this.sessionService.get('config').user_id});
          }
        }
      } else {
        if (this.sessionService.get('appData')) {
          this.initLoginViaAccessToken(LoginBy.LOCAL_STORAGE);
          this.extService.socketRegister(
            this.sessionService.get('appData').vendor_details.vendor_id
          );
        }
        else{
          if(this.sessionService.get('config').bumbl_domain_name && !this.sessionService.isPlatformServer())
          {
            (<any>window).mt('send', 'pageview',{company:this.sessionService.get('config').user_id});
          }
        }
      }
    });



    this.messageListener = this.renderer.listen(
      'window',
      'message',
      this.onMessage.bind(this)
    );
    this.initChecks();
    this.messageService.userLoggedIn.subscribe(() => {
      this.initChecks();
    });
  }
  firebaseInit() {
    // firebase initialization and register service worker
    const config = {
      apiKey: "AIzaSyBsn8VuAObeTmozCbDjpW_CRyRwKmQ3zlI",
      authDomain: "yelo-pwa-f5e5b.firebaseapp.com",
      databaseURL: "https://yelo-pwa-f5e5b.firebaseio.com",
      projectId: "yelo-pwa-f5e5b",
      storageBucket: "yelo-pwa-f5e5b.appspot.com",
      messagingSenderId: "599896184843",
      appId: "1:599896184843:web:eb8bbd2c7ae34c9eb2cf0e",
      measurementId: "G-MHS94JYMMB"
    };
    if (firebase && firebase.apps.length) {
      return;
    }
    if(firebase)
    {
      firebase.initializeApp(config);
      try {
        this.firebaseUpdate()
      } catch (e) {
        console.warn(e);
      }
    }
  }
  firebaseUpdate() {
    try {
      const messaging = firebase.messaging();
      navigator.serviceWorker.register(`OneSignalSDKWorker.js`)
        .then((registration) => {
          messaging.useServiceWorker(registration);
          // Request permission and get token.....
          messaging.requestPermission()
            .then(() => {
              // console.log('Notification permission granted.');
              // TODO(developer): Retrieve an Instance ID token for use with FCM.
              // Get Instance ID token. Initially this makes a network call, once retrieved
              // subsequent calls to getToken will return from cache.
              messaging.getToken()
                .then((currentToken) => {
                  if (currentToken) {
                    // alert(currentToken)
                    if(currentToken)
                    {
                        this.sessionService.set("device_token", currentToken);
                      
                    }
                    // this.sendFCMTokenToServer(currentToken);
                  }
                })
                .catch((err) => {
                  console.log('An error occurred while retrieving token. ', err);
                });
            })
            .catch(function (err) {
              console.log('Unable to get permission to notify.', err);
            });
          // Callback fired if Instance ID token is updated.
          messaging.onTokenRefresh(function () {
            messaging.getToken()
              .then((refreshedToken) => {
                console.log(refreshedToken)
                if(refreshedToken)
                {
            
                this.sessionService.set("device_token", refreshedToken);
               
                }
              })
              .catch((err) => {
             
              });
          });
        });
    } catch (e) {
      console.warn(e);
    }
  }
  initChecks() {
    if (this.sessionService.get('appData') && parseInt(this.sessionService.getString('reg_status')) === 1) {
      if ((this.sessionService.get('config').is_customer_verification_required === 1) && (this.sessionService.get('appData').vendor_details.is_vendor_verified !== 1) &&
        (this.sessionService.get('config').is_customer_login_required == 1) &&
        (this.sessionService.get('config').is_vendor_verification_required === 1)
      ) {
        this.showCustomerVerificationPopUp = true;
      }
    }
  }

  // =======get country data ==========
  getCountryData() {
    this.apiService.getCountryInfo()
      .subscribe((response: any) => {
        this.sessionService.countryInfo.next(response.data)
      },
        error => {
          console.error(error);
        }
      )
  }
  // =======get country data ==========

  onPopUpClose() {
    this.showCustomerVerificationPopUp = false;
    this.messageService.loginWithDiffrentAccountEmitter();
  }
  eventForWebappLoaded() {
    let dashboard_url;
    if (environment.production) {
      dashboard_url = this.sessionService.get('config').ds_domain_name ? ('https://' + this.sessionService.get('config').ds_domain_name)
        : this.sessionService.get('config').dashboard_url;
    }
    else {
      dashboard_url = 'https://dev12.yelo.red';
    }
    if (window.parent != window) {
      window.parent.postMessage({ 'type': 'domContentLoaded' }, dashboard_url);
    }
  }

  onMessage(event: Event) {
    const message = event as MessageEvent;

    if (message.data === 'map_iframe_loaded') {
      this.googleMapsConfig.isIframeLoaded = Promise.resolve(true);
    }
    const dashboard_url = this.sessionService.get('config').ds_domain_name ? ('https://' + this.sessionService.get('config').ds_domain_name)
      : this.sessionService.get('config').dashboard_url;
    const domains = [
      'https://admin.yelo.red',
      'https://admin2.yelo.red',
      'https://dev1.yelo.red',
      'https://dev7.yelo.red',
      'https://dev12.yelo.red',
      'http://localhost:4200'
    ];
    if (!domains.includes(message.origin) && message.origin != dashboard_url)
      return;

    switch (message.data.type) {
      case 'Page':
        this.themeService.config = message.data;
        this.themeService.onThemeChange();
        break;
      case 'Module':
        this.themeService.onThemeChange(message.data);
        break;
      case 'scrollToView':
        this.scrollToParticularModule(message.data);
        //<any>window.scrollTo(0, document.body.scrollHeight);
        break;
      case 'navigate':
        this.themeService.previewOn();
        this.router.navigate([message.data.route]);
        break;
    }
  }

  ngAfterViewInit() {
    if (!this.sessionService.isPlatformServer()) {

      if (this.sessionService.get('config') && this.sessionService.get('config').user_id == 90531) {
        this.sessionService.is_netcore_enabled = true;
      } else {
        this.sessionService.is_netcore_enabled = false;
      }
      setTimeout(_ => {
        LoadScriptsPostAppComponentLoad.stripe(this._document, this.renderer, this.el);
      }, 2000);
    }
    LoadScriptsPostAppComponentLoad.init();
    this.paymentListener();

    this.googleAnalyticsEventsService.checkClientGAEnable();
  }

  private paymentListener() {
    document.addEventListener('paymentMessage', (e: any) => {
      if (
        this.sessionService.get('config').business_model_type ===
        'FREELANCER' &&
        this.sessionService.get('config').custom_quotation_enabled
      ) {
        this.initCustomOrderForFreelancerQuotation(e);
      } else {
        this.initCustomOrderForQuotation(e);
      }
    });
  }

  initCustomOrderForQuotation(e?) {
    let screen_location = window.location.pathname;
    this.sessionService.remove('orderType');
    let config = this.sessionService.get('config');
    if (config.onboarding_business_type === OnboardingBusinessType.LAUNDRY && e.detail.button_info.button_action.remaining_balance) {
      //console.error(e);
      //alert('5');
      this.sessionService.setByKey('app', 'payment', {
        amount: e.detail.button_info.button_action.remaining_balance,
        subtotal: e.detail.button_info.button_action.remaining_balance,
        is_custom_order: e.detail.button_info.button_action.is_custom_order ? e.detail.button_info.button_action.is_custom_order : undefined,
        job_id: e.detail.button_info.button_action.is_custom_order ? e.detail.button_info.button_action.job_id : undefined,
        additionalpaymentId: e.detail.button_info.button_action.is_custom_order ? e.detail.button_info.button_action.additionalpaymentId : undefined,
        order_id: e.detail.button_info.button_action.order_id,
        remaining_balance: e.detail.button_info.button_action.remaining_balance
      });
      const chekoutData = {
        amount: e.detail.button_info.button_action.remaining_balance
      };
      let payload = {
        return_enabled: 0,
        is_scheduled: 0
      };
      chekoutData['cart'] = payload;
      this.sessionService.setByKey('app', 'checkout', chekoutData);

    } else if (config.onboarding_business_type === OnboardingBusinessType.FREELANCER && e.detail.button_info.button_action.payment_for === 10) {

      this.sessionService.setByKey('app', 'payment', {
        amount: e.detail.button_info.button_action.total_amount,
        subtotal: e.detail.button_info.button_action.actual_amount,
        delivery_charge: e.detail.button_info.button_action.delivery_charge,
        order_id: e.detail.button_info.button_action.order_id,
        additional_amount: e.detail.button_info.button_action.additional_amount,
        payment_for: e.detail.button_info.button_action.payment_for,
        job_id: e.detail.button_info.button_action.job_id,
        title: e.detail.button_info.button_action.title,
        is_custom_order: e.detail.button_info.button_action.is_custom_order ? e.detail.button_info.button_action.is_custom_order : undefined,
        description: e.detail.button_info.button_action.description,
        additionalpaymentId: e.detail.button_info.button_action.additionalpaymentId
      });
      const chekoutData = {
        amount: e.detail.button_info.button_action.total_amount
      };
      let payload = {
        return_enabled: 0,
        is_scheduled: 0
      };
      chekoutData['cart'] = payload;
      this.sessionService.setByKey('app', 'checkout', chekoutData);
    }
    else {

      //console.error(e);
      //alert('4');
      this.sessionService.setByKey('app', 'payment', {
        amount: e.detail.button_info.button_action.total_amount,
        subtotal: e.detail.button_info.button_action.actual_amount,
        delivery_charge: e.detail.button_info.button_action.delivery_charge,
        order_id: e.detail.button_info.button_action.order_id,
        job_id: e.detail.button_info.button_action.is_custom_order ? e.detail.button_info.button_action.job_id : undefined,
        is_custom_order: e.detail.button_info.button_action.is_custom_order ? e.detail.button_info.button_action.is_custom_order : undefined,
        additionalpaymentId: e.detail.button_info.button_action.is_custom_order ? e.detail.button_info.button_action.additionalpaymentId : undefined,
        additional_amount: e.detail.button_info.button_action.additional_amount
      });
      const chekoutData = {
        amount: e.detail.button_info.button_action.total_amount
      };
      let payload = {
        return_enabled: 0,
        is_scheduled: 0
      };
      chekoutData['cart'] = payload;
      this.sessionService.setByKey('app', 'checkout', chekoutData);
    }
    const data = {
      dual_user_key: 0,
      job_id: e.detail.button_info.button_action.order_id,
      language: 'en',
      marketplace_reference_id: this.data.marketplace_reference_id,
      marketplace_user_id: this.data.marketplace_user_id,
      reference_id: this.sessionService.get('appData').vendor_details
        .reference_id,
    };
    if (this.sessionService.get('appData')) {
      data['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      data['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    if (config.onboarding_business_type === OnboardingBusinessType.FREELANCER && e.detail.button_info.button_action.payment_for === 10) {
      data['payment_for'] = e.detail.button_info.button_action.payment_for,
        data['additionalpaymentId'] = e.detail.button_info.button_action.additionalpaymentId,
        data['job_id'] = e.detail.button_info.button_action.job_id
    }
    if(this.sessionService.getByKey('app', 'payment').is_custom_order === 1 && this.sessionService.getByKey('app', 'payment').additionalpaymentId){
      let data = {
        vendor_id: this.sessionService.get('appData').vendor_details.vendor_id,
        job_id: this.sessionService.getByKey('app', 'payment').job_id,
        access_token: this.sessionService.get('appData').vendor_details.app_access_token,
        marketplace_user_id: this.sessionService.get('config').marketplace_user_id,
        additonal_payment_id: this.sessionService.getByKey('app', 'payment').additionalpaymentId
      }
      this.profileService.getPaymentInfo(data).subscribe(
        response => {
          try {
            let msg;
            if (response.status === 200) {
               if(response.data[0] && response.data[0].transaction_status === 2) {
                msg = 'Payment has already been completed for this order.';
                this.popup.showPopup(MessageType.ERROR, 2500, msg, false);
                this.sessionService.removeByChildKey('app', 'payment');
                return;
              }
              else if(response.data[0])
               this.orderDataDetails(data,e,response.data[0].transaction_status)
            }
            else{
              this.sessionService.removeByChildKey('app', 'payment');
              console.error(response.message);
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
    else{
      this.orderDataDetails(data,e,'')
    }

  }
  orderDataDetails(data,e,custm_status){
    let currentySymbol;
    if(this.sessionService.getByKey('app', 'payment').is_custom_order === 1)
      currentySymbol = e.detail.button_info.button_action.currencyObj.symbol;
    this.sessionService.remove('orderType');
    let config = this.sessionService.get('config');
    this.orderService.getOrders(data).subscribe(response => {
      if (response.status == 201 && response.message) {
        this.popup.showPopup(MessageType.ERROR, 2500, response.message, false);
        return;
      }
      if(custm_status === '' && (response.data[0].transaction_status == 2 || response.data[0].transaction_status == 1)){
        if(response.data[0].overall_transaction_status == 1 || response.data[0].overall_transaction_status == 2){
          let msg = 'Payment has already been completed for this order.';
          this.popup.showPopup(MessageType.ERROR, 2500, msg, false);
          this.sessionService.removeByChildKey('app', 'payment');
          return;
        }
      }
      if (
        !(response.data[0].transaction_status === 2 || response.data[0].transaction_status === 1) &&
        response.data[0].job_status !== 13 &&
        response.data[0].job_status !== 14 &&
        response.data[0].job_status !== 15 && custm_status == ''
      ) {
        let paymentData = this.sessionService.getByKey('app', 'payment');
        if(this.sessionService.get('config').is_multi_currency_enabled || paymentData.is_custom_order === 1){
          paymentData['custom_currency']= response.data[0].order_currency_symbol ? response.data[0].order_currency_symbol : currentySymbol;
          paymentData['user_id_merchant']= response.data[0].user_id;
          this.sessionService.setByKey('app', 'payment', paymentData);
        }

        if (paymentData && response.data[0].user_taxes) {
          paymentData['user_taxes'] = response.data[0].user_taxes;
          this.sessionService.setByKey('app', 'payment', paymentData);
        }
        //console.log(response);
        //alert('3');
        this.sessionService.set('customOrderFlow', true);
        this.router.navigate(['/payment'], {
          queryParams: { redir_source: 'CUSTOM' }
        });
        // if (screen_location == "/payment")
        // location.reload();
      }
      else if (custm_status !== 2 && response.data[0].job_status !== 13 &&
        response.data[0].job_status !== 14 && response.data[0].job_status !== 15
      ) {
        let paymentData = this.sessionService.getByKey('app', 'payment');
        if(this.sessionService.get('config').is_multi_currency_enabled || paymentData.is_custom_order === 1){
          paymentData['custom_currency']= response.data[0].order_currency_symbol ? response.data[0].order_currency_symbol : currentySymbol;
          paymentData['user_id_merchant']= response.data[0].user_id;
          this.sessionService.setByKey('app', 'payment', paymentData);
      }
        if (paymentData && response.data[0].user_taxes) {
          paymentData['user_taxes'] = response.data[0].user_taxes;
          this.sessionService.setByKey('app', 'payment', paymentData);
        }
        //console.log(response);
        //alert('3');
        this.sessionService.set('customOrderFlow', true);
        this.router.navigate(['/payment'], {
          queryParams: { redir_source: 'CUSTOM' }
        });
      }
       else {
        //console.log(response);
        //alert('2');
        let msg;
        if ((response.data[0].transaction_status === 2 || response.data[0].transaction_status === 1)) {
          if (config.onboarding_business_type === OnboardingBusinessType.LAUNDRY && e.detail.button_info.button_action.remaining_balance
            && response.data[0].overall_transaction_status === TransactionStatusEnum.PARTIAL_PAYMENT) {
            this.sessionService.set('editedOrderPayment', true);
            this.sessionService.set('customOrderFlow', true);
            this.sessionService.set('repay_merchant', response.data[0].user_id);
            if (config.merchant_select_payment_method || config.is_multi_currency_enabled) {
              this.sessionService.set('merchantPaymentMethods', response.data[0].payment_methods);
            }
            let paymentData = this.sessionService.getByKey('app', 'payment');
            if(this.sessionService.get('config').is_multi_currency_enabled || paymentData.is_custom_order === 1){
              paymentData['custom_currency']= response.data[0].order_currency_symbol ? response.data[0].order_currency_symbol : currentySymbol;
              paymentData['user_id_merchant']= response.data[0].user_id;
              this.sessionService.setByKey('app', 'payment', paymentData);
          }
            if (paymentData && response.data[0].user_taxes) {
              paymentData['user_taxes'] = response.data[0].user_taxes;
              this.sessionService.setByKey('app', 'payment', paymentData);
            }
            this.router.navigate(['/payment'], {
              queryParams: { redir_source: 'CUSTOM', is_edited_task: 1 }
            });
            // if (screen_location == "/payment")
            // location.reload();
          } else if (config.onboarding_business_type === OnboardingBusinessType.FREELANCER && e.detail.button_info.button_action.payment_for == 10) {
            this.router.navigate(['/payment'], {
              queryParams: { redir_source: 'CUSTOM' }
            });
            // if (screen_location == "/payment")
            //   location.reload();
          }
          else {
            this.sessionService.removeByChildKey('app', 'payment');
            msg = 'Payment has already been completed for this order.';
            this.popup.showPopup(MessageType.ERROR, 2500, msg, false);
          }
        } else {
          msg = 'This payment link has expired.';
          this.popup.showPopup(MessageType.ERROR, 2500, msg, false);
        }

      }
    });
  }

  initCustomOrderForFreelancerQuotation(e?) {
    //console.error(e);
    //alert('1');
    const chekoutData = {
      amount: e.detail.button_info.button_action.total_amount
    };
    let payload = {
      return_enabled: 0,
      is_scheduled: 0
    };
    chekoutData['cart'] = payload;
    this.sessionService.setByKey('app', 'checkout', chekoutData);
    this.sessionService.setString('customOrderFlow', true);
    const data = {
      domain_name: 'hungryme.taxi-hawk.com',
      dual_user_key: 0,
      filter: 1,
      language: 'en',
      project_id: e.detail.message_data.transaction_id,
      marketplace_user_id: this.data.marketplace_user_id,
    };
    if (this.sessionService.get('appData')) {
      data['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      data['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    this.postedProjectService.getProjects(data).subscribe(response => {
      this.sessionService.setByKey('app', 'payment', {
        amount: e.detail.message_data.amount,
        subtotal: e.detail.message_data.amount,
        project_id: e.detail.message_data.transaction_id, //hardcoded
        updated_description: e.detail.message_data.description,
        project_start_date: response.data.result[0].custom_object.start_date,
        project_end_date: response.data.result[0].custom_object.end_date
      });
      this.router.navigate(['/freelancer/payment'], {
        queryParams: { redir_source: 'CUSTOM' }
      });
    });
  }

  scrollToParticularModule(data) {
    const el = document.getElementById(data.module);
    if (data.module == 'signinPopup') {
      $('#loginDialog').modal('show');
    } else {
      $('#loginDialog').modal('hide');
    }
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth' });
  }

  /**
   * login via access token
   */
  initLoginViaAccessToken(type: number, data?: any) {
    const obj = {
      marketplace_reference_id: this.data.marketplace_reference_id,
      marketplace_user_id: this.data.marketplace_reference_id,
    };

    // if (this.sessionService.get('appData')) {
    //   obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
    //   obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    // }
    if (type === LoginBy.LOCAL_STORAGE) {
      if (this.sessionService.get('appData')) {
        obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
        obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
        obj['device_token']=this.sessionService.get("device_token") || this.sessionService.get("device_token_app")
      }
    } else {
      obj['vendor_id'] = data.vendor_id;
      obj['access_token'] = data.access_token;
      obj['device_token']=this.sessionService.get("device_token") || this.sessionService.get("device_token_app")
    }
   

    this.profileService.accessTokenLogin(obj).subscribe(
      response => {
        try {
          if (response.status === 200) {
            this.sessionService.set('appData', response.data);
            if(response.data && response.data.vendor_details && this.sessionService.get('config').bumbl_domain_name && !this.sessionService.isPlatformServer()){
              if(response.data.bumble_keys && response.data.bumble_keys.City)
              {
                (<any>window).mt('send', 'pageview', {email: response.data.vendor_details.email, firstname: response.data.vendor_details.first_name, phone: response.data.vendor_details.phone_no,company:this.sessionService.get('config').user_id,nooforders: response.data.bumble_keys && (response.data.bumble_keys.number_of_orders || response.data.bumble_keys.number_of_orders == 0) ? +response.data.bumble_keys.number_of_orders : undefined,itemincart:this.sessionService.getByKey('app', 'cart') && this.sessionService.getByKey('app', 'cart').length > 0 ? true : false,city_yelo: response.data.bumble_keys.City});
              }
              else{
                (<any>window).mt('send', 'pageview', {email: response.data.vendor_details.email, firstname: response.data.vendor_details.first_name, phone: response.data.vendor_details.phone_no,company:this.sessionService.get('config').user_id,nooforders: response.data.bumble_keys && (response.data.bumble_keys.number_of_orders || response.data.bumble_keys.number_of_orders == 0) ? +response.data.bumble_keys.number_of_orders : undefined,itemincart:this.sessionService.getByKey('app', 'cart') && this.sessionService.getByKey('app', 'cart').length > 0 ? true : false});
              }
            }
            if (type === LoginBy.QUERY_PARAMS) {
              this.messageService.sendLoggedIn(true);
            }
            this.extService.updateFuguWidget();
            this.redirectToDebt(response.data);
          } else {
            console.error(response.message);
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

  redirectToDebt(appData) {
    let config = this.sessionService.get('config');
    let isPayment = location.pathname.indexOf('/payment');
    if (config.is_debt_enabled && appData && appData.vendor_details && appData.vendor_details.debt_amount > 0 && (isPayment == -1) && !(config.is_guest_checkout_enabled &&  (appData && parseInt(appData.vendor_details.is_guest_account)))) {
      this.sessionService.remove('skipDebt');
      this.router.navigate(['/debtAmount']);
    }else{
      this.customerSubscription(appData)
    }
  }

  customerSubscription(appData){
    let config = this.sessionService.get('config');
    let isPayment = location.pathname.indexOf('/payment');
    if(config.is_customer_subscription_enabled && appData && parseInt(appData.vendor_details.is_customer_subscription_plan_expired) && (isPayment == -1) && !(config.is_guest_checkout_enabled && (appData && parseInt(appData.vendor_details.is_guest_account)))){
      this.sessionService.remove('customerPlanSkipped');
      this.router.navigate(['/customerSubscription/subscriptionPlan']);
    }
  }

  private setThemeColor() {
    const color = this.sessionService.get('config').color;
    this.renderer.setStyle(this.el.nativeElement, '--blue', color, RendererStyleFlags2.DashCase);
    this.renderer.setStyle(this.el.nativeElement, '--theme', color, RendererStyleFlags2.DashCase);
    this.themeService.renderer = this.renderer;
    // (this.el.nativeElement as HTMLElement).style.setProperty('--blue',color);
    // (this.el.nativeElement as HTMLElement).style.setProperty('--theme',color);
  }



  ngOnDestroy() {
    this.messageListener();
  }
  gotoImageLink() {
    if(this.imageUrl){
      this.showModalMainPopup = false;
      window.open(this.imageUrl, "_blank");
    }
  }
  closeModal($event) {
   this.showModalMainPopup=false
  }
  hideDialog(){
 this.showModalMainPopup = false;
  }
}


