import { MessageType } from './../../constants/constant';
import { Component, OnDestroy, OnInit, Input, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart, NavigationEnd } from '@angular/router';
import { takeWhile } from 'rxjs/operators';

import { SessionService } from '../../services/session.service';
import { PopUpService } from '../../modules/popup/services/popup.service';
import { MessageService } from '../../services/message.service';
import { AppCartService } from '../catalogue/components/app-cart/app-cart.service';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-restaurants-new',
  templateUrl: './restaurants-new.component.html',
  styleUrls: ['./restaurants-new.component.scss']
})
export class RestaurantsNewComponent implements OnInit, AfterViewInit, OnDestroy {
  languageStrings: any={};
  sendMapInfo: number;
  mapViewCheck: boolean;
  public headerData: any;
  public config: any;
  public terminology: any;
  public langJson: any = {};
  public languageSelected: string;
  public direction: string;
  public productShowFlag: boolean = false;
  public merchantFlag: boolean = false;
  public alive: boolean = true;
  public showAddressBar: boolean = true;
  public showMultipleBanners: boolean;
  public queryParam: any;  

  constructor(public sessionService: SessionService,
              public route: ActivatedRoute,
              public popup : PopUpService,
              public appService: AppService,
              public messageService: MessageService,
              public cartService: AppCartService,
              public router: Router) {
    this.queryParam = this.route.snapshot.queryParams;
    // this.navigateEvent();
  }

  ngAfterViewInit() {
    // this.router.navigate(['/list/others'],{skipLocationChange: true,queryParamsHandling:'merge'});
  }

  ngOnInit() {
    this.headerData = this.sessionService.get('config');
    this.sessionService.remove('isReOrder');
    this.sessionService.remove('editJobId');
    this.setConfig();
    this.setLanguage();
    this.decideProductAndMerchantFlow();
  }

  ngOnDestroy() {
    this.alive = false;
    this.sessionService.resetTitle();
  }

  /**
   * set config
   */
  setConfig() {
    this.config = this.sessionService.get('config');
    if (this.config) {
      this.terminology = this.config.terminology;
      this.showMultipleBanners = this.config.is_banners_enabled ? true : false;
    }
  }

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
    this.appService.langPromise.then(() => {
      this.langJson = this.appService.getLangJsonData();
      this.checkQueryParam();
    });

  }

  /**
   * decide product and merchant flow
   */
  decideProductAndMerchantFlow() {
    if (this.config.nlevel_enabled === 1 && !this.sessionService.getString('catId') && this.config.business_model_type !== 'ECOM') {
      this.router.navigate(['categories']);
      this.productShowFlag = false;
      this.merchantFlag = false;
    } else if (this.config.nlevel_enabled === 1 && this.sessionService.getString('catId')) {
      if (this.config.product_view === 1) {
        this.productShowFlag = true;
        this.merchantFlag = false;
      } else {
        this.productShowFlag = false;
        this.merchantFlag = true;
      }
    } else {
      if (this.config.product_view === 1) {
        this.productShowFlag = true;
        this.merchantFlag = false;
      } else {
        this.productShowFlag = false;
        this.merchantFlag = true;
      }
    }
  }

  /**
   * check query param
   */
  checkQueryParam() {
    if(this.queryParam.hasOwnProperty('payment_status') && this.queryParam.payment_status == 0){
      if (this.queryParam.hasOwnProperty('repayment') && this.queryParam.repayment) {
        this.popup.showPopup(MessageType.ERROR, 3000, this.languageStrings.payment_failure || "Payment Failure", false);
      } else {
        this.popup.showPopup(MessageType.ERROR, 3000, (this.languageStrings.order_has_been_placed_but_payment_failed || 'Order has been placed but payment failed.').replace('ORDER_ORDER',this.terminology.ORDER), false);
      }
      localStorage.removeItem('tipVal');
      this.messageService.clearCartOnly();
      this.sessionService.removeByChildKey('app', 'cart');
      this.sessionService.removeByChildKey('app', 'category');
      this.sessionService.removeByChildKey('app', 'checkout');
      this.sessionService.removeByChildKey('app', 'payment');
      this.sessionService.removeByChildKey('app', 'customize');
      this.sessionService.removeByChildKey('app', 'cartProduct');
      this.sessionService.removeByChildKey('app', 'checkout_template');
      this.sessionService.remove('sellerArray');
      this.sessionService.remove('tip');
      this.cartService.cartClearCall();
      this.manupulateBrowserHistory()
    }
  }

  /**
   * manupulate browser history
   */
  manupulateBrowserHistory() {
    let domain = window.location.hostname;
    let url =''
    if ((this.sessionService.get('config').business_model_type === 'ECOM') &&
      (this.sessionService.get('config').nlevel_enabled === 2)) {
      url = 'ecom/categories';
    }
    else {
      url = 'list';
    }

    if (
      domain === "localhost" ||
      domain === "dev-webapp.yelo.red" ||
      domain === "beta-webapp.yelo.red" ||
      domain === "127.0.0.1" ||
      domain === "dev.yelo.red"
    ) {
      history.replaceState('', '', location.origin + '/'+url);
    } else {
      history.replaceState('', '', location.origin + '/'+this.languageSelected + '/'+url);
    }
  }

  /**
   * navigate event
   */
  navigateEvent() {
    // this.router.events.pipe(takeWhile(_ => this.alive)).subscribe(routerEvent => {
    //   if (routerEvent instanceof NavigationEnd) {
    //     if (routerEvent.url == "/list") {
    //       this.router.navigate(["/list/others"], {skipLocationChange: true,queryParamsHandling:'merge'})
    //     }
    //   }
    // });
  }

  mapView() {
    this.mapViewCheck = true;
  }
}
