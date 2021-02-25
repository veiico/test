/**
 * Created by cl-macmini-51 on 18/07/18.
 */
import {
  Component,
  OnDestroy,
  OnInit,
  AfterViewInit,
  Input,
  ElementRef,
  Renderer2,
  ChangeDetectorRef
} from '@angular/core';
import { Router } from '@angular/router';

import { SessionService } from '../../../../services/session.service';
import { LoaderService } from '../../../../services/loader.service';
import { AppService } from '../../../../app.service';
import { MessageService } from '../../../../services/message.service';
import { GoogleAnalyticsEventsService } from '../../../../services/google-analytics-events.service';
import { GoogleAnalyticsEvent } from '../../../../enums/enum';
import { slideInOutState } from '../../../../animations/slideInOut.animation';
import { PopUpService } from '../../../../modules/popup/services/popup.service';
import { Preview } from '../../../../themes/swiggy/modules/app/classes/preview.class';
import { ThemeService } from '../../../../services/theme.service';
import { takeWhile } from 'rxjs/operators';
import { OnboardingBusinessType } from '../../../../enums/enum';
import { DecimalConfigPipe } from '../../../../pipes/decimalConfig.pipe';
import { minutesDaysPipe }  from '../../../../pipes/minutesDays.pipe';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss'],
  animations: [slideInOutState]
})
export class ListViewComponent extends Preview
  implements OnInit, OnDestroy, AfterViewInit {
  public config: any;
  public langJson: any = {};
  public terminology: any = {};
  public currency: string;
  public languageSelected: string;
  public direction: string;
  public businessEnabled: boolean;
  public onboardingBusinessType = OnboardingBusinessType;
  public deliveryContent;
  public lat;
  public lng;
  public businessData: any = { data: [] };
  check_home_delivery: boolean;
  check_self_pickup: boolean;
  deliveryMethod: number;
  deliveryModeForMinimumOrder: number;
  deliveryMode: number;
  // get businessData() {
  //   return this._businessData;
  // }
  // @Input() set businessData(val: any) {
  //   if (val) {
  //     this._businessData = val;
  //   }
  //   this.cd.detectChanges();
  // }

  @Input() categoryDataChild: any;
  decimalPipe = new DecimalConfigPipe(this.sessionService);
  minutesPipe = new minutesDaysPipe(this.appService);
  @Input('paginatingList') paginatingList: any;

  public showFilterArea = false;
  public showFilterIcon = false;
  isPlatformServer: boolean;
  hideClosedPreorder = false;
  public content: any = {};
  public showPreOrderTag;
  public alive: boolean = true;
  public categoryName: string = 'All';
  public mapInitCheck: Boolean = false;
  public categoryHidden:boolean;
  public showCategoriesBusinessCategoriesPage:boolean
  public result:boolean=false;
  isBusinessCategoryEnabled: boolean;
  languageStrings: any={};
  mapViewFlag: any = {};


  constructor(
    protected themeService: ThemeService,
    protected appService: AppService,
    public loader: LoaderService,
    protected sessionService: SessionService,
    protected popupService: PopUpService,
    protected googleAnalyticsEventsService: GoogleAnalyticsEventsService,
    protected messageService: MessageService,
    protected router: Router,
    protected el: ElementRef,
    protected cd: ChangeDetectorRef
  ) {
    super(themeService);
    this.setConfig();
    this.setLanguage();

    this.messageService.getMapView
      .pipe(takeWhile(_ => this.alive))
      .subscribe(data => {
        this.mapInitCheck = data;
        this.cd.detectChanges();
      });
  }

  // ===================life cycles=====================
  ngOnInit() {
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
     this.languageStrings.we_donot_serve_in_your_delivery_areas_please_update_the_location = (this.languageStrings.we_donot_serve_in_your_delivery_areas_please_update_the_location ||  "We don't serve in your delivery areas. Please update the location.")
     .replace('DELIVERY_DELIVERY', this.terminology.DELIVERY);
     this.languageStrings.currently_no_restaurant_is_available_for_self_pickup = (this.languageStrings.currently_no_restaurant_is_available_for_self_pickup ||  'Currently, no restaurant is available for Self_pickup.')
     .replace('MERCHANT_MERCHANT', this.terminology.MERCHANT);
     this.languageStrings.currently_no_restaurant_is_available_for_self_pickup  = this.languageStrings.currently_no_restaurant_is_available_for_self_pickup
     .replace('SELF_PICKUP', this.terminology.SELF_PICKUP);
     this.languageStrings.no_product_available  = (this.languageStrings.no_product_available || "No Product Available.")
     .replace('PRODUCT_PRODUCT', this.terminology.PRODUCT);
     this.languageStrings.view_menu = (this.languageStrings.view_menu || 'View Menu')
     .replace(
       'MENU_MENU',
       this.terminology.MENU ? this.terminology.MENU : 'Menu'
     );
     this.languageStrings.no_merchant_to_display_for_the_selected_category = (this.languageStrings.no_merchant_to_display_for_the_selected_category || 'No Merchant to display for the selected category')
     .replace(
       'MERCHANT_MERCHANT',
       this.terminology.MERCHANT ? this.terminology.MERCHANT : 'Merchant'
     );
     this.languageStrings.currently_no_restaurant_is_available_for_pickup_and_drop = (this.languageStrings.currently_no_restaurant_is_available_for_pickup_and_drop || 'Currently, no restaurant is available for Pickup and Drop')
     .replace(
       'PICKUP_AND_DROP',
       this.terminology.PICKUP_AND_DROP ? this.terminology.PICKUP_AND_DROP : 'PICKUP AND DROP'
     );
     this.categoryName=this.languageStrings.all || 'All';
    });
  this.initConstructorEvents();
    this.initEvents();
    if (this.sessionService.get('location')) {
      this.lat = this.sessionService.get('location').lat;
      this.lng = this.sessionService.get('location').lng;
    }
    if (this.sessionService.get('mapView') == true) {
      this.mapInitCheck = true;
    } else {
      this.mapInitCheck = false;
    }

    this.mapViewCheck();

  
    }
  mapViewCheck() {
    if (this.sessionService.get('mapView') == true) {
      this.mapViewFlag = true;
    } else {
      this.mapViewFlag = false;
    }
  }
  initConstructorEvents() {
    /**
     * event to listen business category selection
     */
    this.messageService.sendBusinessCategoryId
      .pipe(takeWhile(_ => this.alive))
      .subscribe(message => {
        if (this.sessionService.getString('bId') !== '0') {
          this.businessEnabled = true;
        } else {
          this.businessEnabled = false;
        }
        this.cd.detectChanges();
      });

  this.messageService.sendCategoryNameLabel
      .pipe(takeWhile(_ => this.alive))
      .subscribe(message => {

        this.categoryName = message;
         });

    this.messageService.applyFilterEvent
    .pipe(takeWhile(_=>this.alive))
    .subscribe(message => {
      this.showFilterArea = false;
      this.cd.detectChanges();
    });
    this.messageService.showFilterIcon
    .pipe(takeWhile(_=>this.alive))
    .subscribe(response => {
      if (response) {
        this.showFilterIcon = true;
      } else {
        this.showFilterIcon = false;
      }
      this.cd.detectChanges();
    });
    this.subscriptionForListeningDeliveryMethod();
    this.messageService.getMapView
      .pipe(takeWhile(_ => this.alive))
      .subscribe(data => {
        this.mapInitCheck = data;
        this.cd.detectChanges();
      });
  }

  // ===================life cycles=====================
  initEvents() {
    window['x'] = this;

    if (this.config.selected_delivery_method_for_apps == 4)
      this.deliveryMode = 2;
    else if (this.config.selected_delivery_method_for_apps == 2)
      this.deliveryMode = 1;
    else if (this.config.selected_delivery_method_for_apps == 8)
      this.deliveryMode = 8;
    else
      this.deliveryMode = Number(this.sessionService.getString('deliveryMethod'));

    this.isPlatformServer = this.sessionService.isPlatformServer();
    this.hideClosedPreorder = this.config.marketplace_user_id === 60863;
    this.themeService.getThemeModuleData('storeCard').subscribe(res => {
      this.onPreview(res);

    });
    if (this.config) {
      this.showCategoriesBusinessCategoriesPage = (this.config.is_business_category_enabled && this.config.business_category_page)
        ? true
        : false;
    }

  }

  onPreview(data) {
    if (data.preorder_tag) {
      this.content = data;
      this.themeService.setNativeStyles(
        this.content.show_location.styles,
        this.el
      );
      this.themeService.setNativeStyles(
        this.content.show_rating.styles,
        this.el
      );
    }
    if (data.show_delivery_time) {
      this.deliveryContent = data;
      this.themeService.setNativeStyles(
        this.deliveryContent.show_delivery_time.styles,
        this.el
      );
    }
  }

  ngOnDestroy() {
    this.alive = false;
  }

  ngAfterViewInit() {
   this.messageService.merchantList
    .pipe(takeWhile(_=>this.alive))
    .subscribe(
      (res) => {
        if(res) {
          this.businessData=res;
         if(this.businessData.data.length==0)
         {
           this.result=true;
           this.cd.detectChanges();
         }
          this.businessData.data = this.businessData.data.map(item => {
                  if(isNaN(parseFloat(item.merchantMinimumOrder)) || parseFloat(item.merchantMinimumOrder) == 0){
                    item.merchantMinimumOrder = 0;
                    return item;
                  }
                  item.merchantMinimumOrder = (typeof(item.merchantMinimumOrder) == 'string') ? item.merchantMinimumOrder :  this.decimalPipe.transform(item.merchantMinimumOrder) ;
                  item.merchantMinimumOrder = item.merchantMinimumOrder ? item.merchantMinimumOrder : 0;
                  item.show_delivery_charge = false;
                  return item;
                });
            }
        // this.cd.detectChanges();
      });
  }

  // ===============set config for all====================
  setConfig() {
    this.config = this.sessionService.get('config');
    this.check_home_delivery = this.config.admin_home_delivery;
    this.check_self_pickup = this.config.admin_self_pickup;
    if (this.config) {
      this.config.borderColor = this.config['color'] || '#e13d36';
      this.terminology = this.config.terminology;
      this.currency = this.config['payment_settings'][0].symbol;
    }

    if (
      this.sessionService.getString('bId') !== '0' &&
      this.config.is_business_category_enabled
    ) {
      this.businessEnabled = true;
     } else {
      this.businessEnabled = false;
      }
  }

  // ===============set language and direction====================
  async setLanguage() {
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
    await this.appService.langPromise;
    this.langJson = this.appService.getLangJsonData();
  }

  // ========================navigate to direct store if it is one=========================
  navigate(item) {
    // if (!item.available && !item.scheduled_task) {
    //   this.popupService.showPopup('info', 2000, this.langJson['Sorry! this --- is closed for now.'].replace(
    //     '---', this.terminology.MERCHANT), false);
    //   return;
    // }

    this.sessionService.set('info', item);
    this.googleAnalyticsEventsService.emitEvent(
      GoogleAnalyticsEvent.restaurant_click,
      item.store_name,
      '',
      ''
    );
    this.googleAnalyticsEventsService.emitEvent(
      GoogleAnalyticsEvent.restaurant_detail_order_online,
      item.store_name,
      '',
      ''
    );
    const id = this.sessionService.getByKey('app', 'rest_id') || undefined;
    this.sessionService.remove('preOrderTime');
    if (id !== item.storefront_user_id) {
      this.messageService.clearCartOnly();
      this.router.navigate([
        'store',
        item.storepage_slug || '-',
        item.storefront_user_id
      ]);
    } else {
      this.router.navigate([
        'store',
        item.storepage_slug || '-',
        item.storefront_user_id
      ]);
    }
  }

  /**
   * get delivery mode data
   */
  subscriptionForListeningDeliveryMethod() {
    this.messageService.sendDelivery
      .pipe(takeWhile(_ => this.alive))
      .subscribe(message => {
        if (!message.checkout) {
          switch (message.type) {
            case 1:
              this.deliveryMode = 1;
              break;
            case 2:
              this.deliveryMode = 2;
              break;
            case 8:
              this.deliveryMode = 8;
              break;
          }
        }
         this.cd.detectChanges();
      });
  }
  /**
   * hide category if businesscategory page enabled
   */
  hideCategories(event){
    this.result=false
    this.categoryHidden = event
    this.cd.detectChanges();
    this.messageService.businessCategoryPageHidden.next(true);
  }

  goToMapView(data) {
    this.mapViewFlag = data;
    this.messageService.mapListCheck(data);
    this.sessionService.set('mapView', data);
  }
}
