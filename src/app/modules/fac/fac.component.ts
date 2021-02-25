/**
 * Created by mba-214 on 02/11/18.
 */
import { Component, OnInit, Input, EventEmitter, Output, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { AppService } from '../../app.service';
import { DomSanitizer } from '../../../../node_modules/@angular/platform-browser';
import { Router } from "@angular/router";
import { PopUpService } from '../popup/services/popup.service';
import { PaymentFor, PaymentMode } from './../../enums/enum';
import { FacService } from './fac.service';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-fac',
  templateUrl: './fac.component.html',
  styleUrls: ['./fac.component.scss']
})
export class FacComponent implements OnInit, AfterViewInit, OnDestroy {

  languageStrings: any={};
  public config: any;
  public terminology: any;
  public langJson: any;
  public languageSelected: string;
  public direction: string;
  public facPaymentUrl: any;
  public cardList: any = [];
  public cardWindowRef: any;
  public addCardLink: string;
  public secureUrlFrame: any;
  public hideIframe: number;
  public paymentModes = PaymentMode;
  @Input() paymentFor: any;
  @Input() loginResponse: any;
  @Input() NET_PAYABLE_AMOUNT: number;
  @Input() deleteButton: boolean;
  @Output() paymentMadeResponse: any = new EventEmitter();

  protected _triggerPayment;
  get triggerPayment() { return this._triggerPayment };
  @Input() set triggerPayment(val: any) {
    if (val) {
      this._triggerPayment = val;
      // this.initFac();
      // this.initFacLinkWallet();
    }
  };

  constructor(protected sessionService: SessionService,
              protected popup: PopUpService,
              public facService: FacService,
              public domSanitizer: DomSanitizer,
              public loader: LoaderService,
              public router: Router,
              protected appService: AppService) {
    
                this.setConfig();
                this.setLanguage();
              }

  ngOnInit() {
    this.setConfig();
    this.setLanguage();
    this.fetchCards();
    // this.initFacLinkWallet();
      /**
       * iframe events for success and failure payment
       */
        /**
       * iframe events for fac success and failure payment
     */
    window.onmessage = (event) => {
      if (typeof event.data === "object") {
        if ( event.data.payment_method === 2048) {
          if ( event.data.status === 'success') {
            this.popup.showPopup("success", 2000, this.languageStrings.card_added_successfully || "Card successfully added", false);
            this.facResponse(event.data);
          } else {
            this.facResponse(event.data);
          }
        }
        if (event.data.status === "add_card_error") {
          this.hideIframe = Math.random();
        }
      }

      if (typeof event.data === "object") {
        if (event.data.name === "successPayment") {
          setTimeout(() => {
            this.cardWindowRef.close();
          }, 2000);
          this.successFacTransaction(event.data);
        }
      }
    };
  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {

  }

  /**
   * set config
   */
  setConfig() {
    this.config = this.sessionService.get('config');
    this.terminology = this.config.terminology;
  }

    /**
   * init fac wallet
  //  */
  // initFacLinkWallet() {
  //   this.loader.show();
  //   const data = {
  //     'vendor_id': this.loginResponse.vendor_details.vendor_id,
  //     'marketplace_user_id': this.config.marketplace_user_id,
  //     'user_id': this.sessionService.getString('user_id'),
  //     'vendor_card_id': localStorage.getItem('cardId'),
  //     'app_access_token': this.loginResponse.vendor_details.app_access_token,
  //     'access_token': this.loginResponse.vendor_details.app_access_token,
  //     'amount': this.NET_PAYABLE_AMOUNT,
  //     'app_type': 'WEB',
  //     'payment_method': this.paymentModes.FAC,
  //     'payment_for': 0,
  //     'currency': this.config.payment_settings[0].code,
  //     'email': this.loginResponse.vendor_details.email,
  //     'name': this.loginResponse.vendor_details.first_name,
  //     'phone': this.loginResponse.vendor_details.phone_no
  //   };

  //   if (typeof this._triggerPayment === 'object') {
  //     data['job_id'] = this._triggerPayment.job_id;
  //   }

  //   this.facService.getFacLinkWallet(data).subscribe(response => {
  //     this.loader.hide();
  //     if (response.status === 200) {
  //       this.facPaymentUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(response.data.payment_url);
  //       window.open(response.data.url, '_self');
  //       this.onload.emit({data: true});
  //     } else {
  //       this.loader.hide();
  //       this.popup.showPopup('error', 2000, response.message, false);
  //     }
  //   },error=>{
  //     this.loader.hide();
  //   });
  // }

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
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
    });
  }


  /**
   * init fac
   */
  initFac() {
    this.loader.show();
    const data = {
        'vendor_id': this.loginResponse.vendor_details.vendor_id,
        'marketplace_user_id': this.config.marketplace_user_id,
        'user_id': this.sessionService.getString('user_id')|| undefined,
        // 'domain_name': window.location.origin,
        'access_token': this.loginResponse.vendor_details.app_access_token,
        'amount': this.NET_PAYABLE_AMOUNT,
        'app_type': 'WEB'
    };

    if (typeof this._triggerPayment === 'object') {
      data['job_id'] = this._triggerPayment.job_id;
      data['isEditedTask'] = this._triggerPayment.isEditedTask ? 1 : undefined;
      data['payment_for'] = this._triggerPayment.payment_for ? this._triggerPayment.payment_for : undefined;
    }

    this.facService.getFacPayLink(data).subscribe(response => {
      this.loader.hide();
      if (response.status === 200) {
        this.facPaymentUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(response.data.paymentUrl);
      } else {
        this.loader.hide();
      }
    }, error => {
        this.loader.hide();
    });
  }

  /**
   * payment made event
   */
  paymentMade(data) {
    this.paymentMadeResponse.emit(data);
  }

  /**
   * iframe content
   */
  getContentFac(event) {
    let frame = window.frames;
  }

  /**
   * close iframe
   */
  close3dver() {
    this.facPaymentUrl = '';
  }

  /**
   * success payment
   */
  facResponse(data) {
    this.fetchCards();
    this.hideIframe = Math.random();
      setTimeout(() => {
        this.paymentMade(data);
        if (typeof this._triggerPayment === 'object' && data.status === 'error') {
          this.manupulateBrowserHistory();
          this.changeRouteWithParams();
        }
      }, 3000);
  }

    /**
   * success authorize-net transaction
   */
  successFacTransaction(data) {
    this.hideIframe = Math.random();
    data['card'] = this.secureUrlFrame.card;
    this.paymentMade(data);
  }

  /**
   * 3d url
   */
  secureUrl(data) {
    if (data.data) {
      this.addCardLink = data.url;
      this.secureUrlFrame = {count: Math.random(), card: data.card};
    } else {
      this.secureUrlFrame = 0;
    }
  }

  /**
   * change route when payment not done with payment status
   */
  changeRouteWithParams() {
    setTimeout(() => {
      this.loader.hide();
      //this.orderPlacedCartClear();
      const payment_params = {
        payment_status: 0
      };
      if (this._triggerPayment.payment_for  === PaymentFor.REPAYMENT) {
        payment_params['repayment'] = 1;
      }
      if ((this.sessionService.get('config').business_model_type === 'ECOM') &&
        (this.sessionService.get('config').nlevel_enabled === 2)) {
        this.router.navigate(['ecom/categories'], {queryParams: payment_params});
      } else {
        this.router.navigate(['list'], { queryParams: payment_params});
      }
    }, 200);
  }

  /**
   * manupulate bowser history for failed payment
   */
  manupulateBrowserHistory() {
    let domain = window.location.hostname;
    let url = '';
    if ((this.sessionService.get('config').business_model_type === 'ECOM') &&
      (this.sessionService.get('config').nlevel_enabled === 2)) {
      url = 'ecom/categories';
    } else {
      url = 'list';
    }

    if (
      domain === "localhost" ||
      domain === "dev-webapp.yelo.red" ||
      domain === "beta-webapp.yelo.red" ||
      domain === "127.0.0.1" ||
      domain === "dev.yelo.red"
    ) {
      history.replaceState('', '', location.origin + '/' + url + '?payment_status=0' + (this._triggerPayment.payment_for  === PaymentFor.REPAYMENT ? '&repayment=1' : ''));
    } else {
      history.replaceState('', '', location.origin + '/' + this.languageSelected + '/' + url + '?payment_status=0' + (this._triggerPayment.payment_for  === PaymentFor.REPAYMENT ? '&repayment=1' : ''));
    }
  }


    /**
   * get all card list
   */
  fetchCards() {
    console.warn("fetchcards")
    this.loader.show();
    const data = {
      payment_method: this.paymentModes.FAC,
      marketplace_reference_id: this.sessionService.getString('marketplace_reference_id'),
      marketplace_user_id: this.loginResponse.vendor_details.marketplace_user_id,
      vendor_id: this.loginResponse.vendor_details.vendor_id,
      access_token: this.loginResponse.vendor_details.app_access_token
    };

    this.facService.getAllCards(data).subscribe(response => {
      this.loader.hide();
      if (response.status === 200) {
        this.cardList = response.data.cards;
        this.addCardLink = response.data.add_card_link;
      } else {
        this.cardList = [];
        this.addCardLink = '';
      }
    });
  }

  /**
   * card added event
   */
  cardAdded(data) {
    this.fetchCards();
  }

    /**
   * window open refernece
   */
  cardWindowRefOut(data) {
    this.cardWindowRef = data.data;
  }


  /**
   * delete card hit
   */
  deleteCard(card) {
    const data = {
      marketplace_user_id: this.loginResponse.vendor_details.marketplace_user_id.toString(),
      user_id: this.sessionService.get("user_id").toString(),
      is_active: '0',
      access_token: this.loginResponse.vendor_details.app_access_token,
      card_id: card.data.card_id,
      brand: card.data.brand,
      expiry_date: card.data.expiry_date,
      last4_digits: card.data.last4_digits,
      vendor_id: this.loginResponse.vendor_details.vendor_id,
    };

    this.facService.removeCard(data).subscribe(response => {
      if (response.status === 200) {
        this.fetchCards();
      } else {
        this.popup.showPopup("error", 3000, response.message, false);
      }
    });
  }
}


/**
 * Created by mba-214 on 02/11/18.
 */
// import { Component, OnInit, Input, EventEmitter, Output, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
// import { SessionService } from '../../services/session.service';
// import { AppService } from '../../app.service';
// import { DomSanitizer } from '../../../../node_modules/@angular/platform-browser';

// import { FacService } from './fac.service';
// import { LoaderService } from '../../services/loader.service';

// @Component({
//   selector: 'app-fac',
//   templateUrl: './fac.component.html',
//   styleUrls: ['./fac.component.scss']
// })
// export class FacComponent implements OnInit, AfterViewInit, OnDestroy {

//   public config: any;
//   public terminology: any;
//   public langJson: any;
//   public languageSelected: string;
//   public direction: string;
//   public facPaymentUrl: any;
//   @Input() deleteButton: boolean;
//   @Input() paymentFor: any;
//   @Input() loginResponse: any;
//   @Input() NET_PAYABLE_AMOUNT: number;
//   @Output() paymentMadeResponse: any = new EventEmitter();

//   private _triggerPayment;
//   get triggerPayment() { return this._triggerPayment };
//   @Input() set triggerPayment(val: any) {
//     console.log('val', val);
//     if (val) {
//       this._triggerPayment = val;
//       this.initFac();
//     }
//   };

//   constructor(private sessionService: SessionService,
//               public facService: FacService,
//               public domSanitizer: DomSanitizer,
//               public loader: LoaderService,
//               private appService: AppService) { 
//                 this.setConfig();
//                 this.setLanguage();
//               }

//   ngOnInit() {


//       /**
//        * iframe events for success and failure payment
//        */
      
//     window.onmessage =  (event) =>{
//       if (typeof event.data == 'object') {
//         if(event.data.payment_method == 2048){
//             if(event.data.status == 'success'){
//               this.facResponse(event.data);
//             }
//             else{
//               this.facResponse(event.data);
//             }
//           }
//       }

//     };
//   }

//   ngAfterViewInit() {

//   }

//   ngOnDestroy() {

//   }

//   /**
//    * set config
//    */
//   setConfig() {
//     this.config = this.sessionService.get('config');
//     this.terminology = this.config.terminology;
//   }

//   /**
//    * set language
//    */
//   setLanguage() {
// // checks for ar translations
//     if (this.sessionService.getString('language')) {
//       this.languageSelected = this.sessionService.getString('language');
//       if (this.languageSelected === 'ar') {
//         this.direction = 'rtl';
//       } else {
//         this.direction = 'ltr';
//       }
//     } else {
//       this.languageSelected = 'en';
//       if (this.languageSelected === 'ar') {
//         this.direction = 'rtl';
//       } else {
//         this.direction = 'ltr';
//       }
//     }
//     this.langJson = this.appService.getLangJsonData();
//   }


//   /**
//    * init fac
//    */
//   initFac() {
//     this.loader.show();
//     const data = {
//         'vendor_id': this.loginResponse.vendor_details.vendor_id,
//         'marketplace_user_id': this.config.marketplace_user_id,
//         'user_id': this.sessionService.getString('user_id'),
//         'domain_name': window.location.origin,
//         'access_token': this.loginResponse.vendor_details.app_access_token,
//         'amount': this.NET_PAYABLE_AMOUNT,
//         'app_type': 'WEB',
//         'job_id': this.triggerPayment.job_id,
//     };

//     this.facService.getFacPayLink(data).subscribe(response => {
//       console.log(response);
//       this.loader.hide();
//       if (response.status === 200) {
//         this.facPaymentUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(response.data.data.payment_url);
//       } else {
//         this.loader.hide();
//       }
//     },error=>{
//         this.loader.hide();
//     });
//   }

//   /**
//    * payment made event
//    */
//   paymentMade(data) {
//     console.log(data);
//     this.paymentMadeResponse.emit(data);
//   }

//   /**
//    * iframe content
//    */
//   getContentFac(event) {
//     console.log('ifame load');
//     let frame = window.frames;
//     console.log(frame);
//   }

//   /**
//    * close iframe
//    */
//   close3dver() {
//     this.facPaymentUrl = '';
//   }

//   /**
//    * success payment
//    */
//   facResponse(data) {
//       setTimeout(()=>{
//         // this.facPaymentUrl = '';
//         this.paymentMade(data);
//       },3000);
//   }
// }

