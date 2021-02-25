import { Component, OnDestroy, OnInit, AfterViewInit, Input, NgZone, Renderer2, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, concat } from 'rxjs';
import { MapsAPILoader } from '@agm/core';
import * as moment from 'moment';
import * as $ from 'jquery';
import { takeWhile, distinctUntilChanged } from 'rxjs/operators';

import { RestaurantsService } from '../../restaurants-new.service';
import { MessageService } from '../../../../services/message.service';
import { LoaderService } from '../../../../services/loader.service';
import { SessionService } from '../../../../services/session.service';
import { AppCartService } from '../../../catalogue/components/app-cart/app-cart.service';
import { GoogleAnalyticsEventsService } from '../../../../services/google-analytics-events.service';
import { FetchLocationService } from '../../../fetch-location/fetch-location.service';
import { AppService } from '../../../../app.service';
import { AppCategoryService } from '../../../catalogue/components/app-category/app-category.service';
import { PopUpService } from '../../../../modules/popup/services/popup.service';
import { FBPixelService } from '../../../../services/fb-pixel.service';
import { GoogleAnalyticsEvent } from '../../../../enums/enum';

@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.component.html',
  styleUrls: ['./restaurants.component.scss']
})
export class RestaurantsComponent implements OnInit, OnDestroy, AfterViewInit {
  mapCity: any;
  mapLng: any;
  mapLat: any;
  mapViewCheck: any;
  radiusInitial: any;
  mapView: any;
  map_view: boolean;
  defaultView: boolean = false;
  formSettings: any;
  first_radius: any;
  businessId: string;
   public mapInitCheck: boolean;

  public config: any;
  public headerData: any;
  public terminology: any;
  public categoryData: any;
  public queryParam: any;
  public langJson: any = {};
  public currency: string;
  public languageSelected: string;
  public direction: string;
  public isEcomFlow: boolean;
  public productShowFlag: boolean;
  public merchantFlag: boolean;
  public result: boolean;
  public productFlag: boolean;
  public alive: boolean = true;
  public deliveryMode: number = 0;
  public limit: number = 50;
  public offset: number = 0;
  public categoryWiseFilter;
  public subscription: Subscription;
  public filteredData: any;
  public selectedProductFilter: any;
  public parent_catalogueId: any;

  public businessData: any = { data: [] };
  public productDataFull: any;
  public checkIfProductGot: boolean;
  public paginating: boolean;
  public paginatingForMerchantList = { show: false };
  public productCount: number = 0;
  public rentalFilter: any;
  public pageSkip: number = 0;
  public pageLimit: number = 25;

  public searchTextRes:string ;
  public scrollSubscription;
  public scrollStartOn: boolean;
  public fetchedDataLengthFlag: boolean;
  public showListView: boolean = true;
  initialLoad: boolean;
  languageStrings: any={};
  // public resetList = true;

  constructor(public service: RestaurantsService,
    public messageService: MessageService,
    public loader: LoaderService,
    public router: Router,
    public sessionService: SessionService,
    public cartService: AppCartService,
    public mapsAPILoader: MapsAPILoader,
    public ngZone: NgZone,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
    public fetchLocationService: FetchLocationService,
    public appService: AppService,
    public categoryService: AppCategoryService,
    public route: ActivatedRoute,
    public popup: PopUpService,
    public fbPixelService: FBPixelService,
    protected renderer: Renderer2,
    protected cd: ChangeDetectorRef
    ) {
    // this.sessionService.setString('bId', 0);
    this.setConfig();
    this.queryParam = this.route.snapshot.queryParams;
    this.messageService.getMapView.pipe(takeWhile(_ => this.alive)).subscribe(data => {
      this.mapViewCheck = data;
      if (this.mapViewCheck === true){
        this.messageService.getChangedRadius.subscribe(val => {
          this.first_radius = val;
        });
      } else {
        // this.sessionService.setString('bId', 0);
        // const location = this.sessionService.get('location');
        // this.getRestaurants(location.lat, location.lng, '', location.city);
      }
    });
 }

  ngOnInit() {
    // this.setConfig();
    this.initialLoad = true;
    this.setLanguage();
    this.loader.hide();
    this.checkForProductAndMerchantFlow();
    this.subscriptionForListeningMessage();
    this.subscriptionForListeningDeliveryMethod();
    this.subscriptionForListeningBusinessCategory();
    this.subscriptionForListeningFilterEvent();
    this.getCollectionOfEcom();
    this.subscriptionForFilters();
    const location = this.sessionService.get('location');
    if (this.sessionService.get('mapView') == true) {
      this.mapInitCheck = true;
    } else {
      this.mapInitCheck = false;
    }
    this.messageService.getMapView
    .pipe(takeWhile(_ => this.alive))
    .subscribe(data => {
      this.mapInitCheck = data;
      if(this.mapInitCheck){
        this.getRestaurants(location.lat, location.lng, '', location.city);
      }
      });

    if (this.queryParam.lat && this.queryParam.lng && !this.sessionService.isPlatformServer()) {
      const lat = Number(this.queryParam.lat.replace('_','.'));
      const lng = Number(this.queryParam.lng.replace('_', '.'));
      if (!isNaN(lat) && !isNaN(lng)) {
        setTimeout(() => {
          this.getFullAddress(lat, lng, '');
        }, 500);
      }

    } else if (location) {
      this.onLocationFetch(location.lat, location.lng, '', location.city);
    }
  }

  initEvents() {
    if (this.mapViewCheck != true && (!this.loader.active || this.initialLoad)) {
      this.initialLoad = false;
    this.scrollSubscription = this.renderer.listen('body', 'scroll', e => {
      this.scrollInit(e);
    });
  }
  }

  ngAfterViewInit() {
    if (!this.sessionService.isPlatformServer()) {
      this.limit = 50;
      this.offset = 0;

      $('body').on('scroll', () => {
        if ($('body').scrollTop() > 270 && $(window).innerWidth() > 991) {
          $('#cart-fix-1').css({
            position: 'fixed',
            top: '80px', width: '25%'
          }); // width: '243px'
        } else {
          $('#cart-fix-1').css({
            position: 'static',
            width: '80%'
          });
        }
        const getOffset = $(document).height() - $(window).height();
        if ($('body').scrollTop() === getOffset && this.config.product_view === 1 && getOffset !== 0 && this.productCount !== 0) {
          this.ngZone.run(() => {
            this.onScrollGetData('');
          });
        }
      });
    }
    this.initEvents();
  }

  ngOnDestroy() {
    this.alive = false;
    if(this.scrollSubscription){
      this.scrollSubscription();
    }

  }
  /**
   * set config
   */
  setConfig() {
    this.headerData = this.sessionService.get('config');
    this.config = this.sessionService.get('config');
    this.config.borderColor = this.config['color'] || '#e13d36';
    this.isEcomFlow = (this.config.business_model_type === 'ECOM' && this.config.nlevel_enabled === 2);
    if (this.config) {
      this.terminology = this.config.terminology || {};
      this.currency = this.config['payment_settings'][0].symbol;
    }
  }

  /**
   * set language
   */
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
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
     this.languageStrings.we_donot_serve_in_your_delivery_areas_please_update_the_location  =  (this.languageStrings.we_donot_serve_in_your_delivery_areas_please_update_the_location || 'We don\'t serve in your delivery area. Please update the location.')
     .replace('DELIVERY_DELIVERY', this.terminology.DELIVERY);
      this.languageStrings.no_product_available  = (this.languageStrings.no_product_available || 'No Product Available.')
      .replace('PRODUCT_PRODUCT', this.terminology.PRODUCT);
      this.languageStrings.view_menu  = (this.languageStrings.view_menu  || 'View Menu')
      .replace('MENU_MENU', this.terminology.MENU ? this.terminology.MENU : 'Menu');
    });
 }

  /**
   * get collection of ecom
   */
  async getCollectionOfEcom() {
    if (this.config.business_model_type === 'ECOM' && this.config.nlevel_enabled === 1) {
      this.getCollection();
      this.service.productChangeSubject.subscribe((data: any) => {
        if (data && data.catalogue_id) {
          this.parent_catalogueId = data.catalogue_id;
          const lat = this.sessionService.get('location').lat;
          const lng = this.sessionService.get('location').lng;
          const city = this.sessionService.get('location').city;
          this.getProductList(lat, lng, '', city, '');
          this.selectedProductFilter = data.catalogue_id;
        }
      });
    }
  }

  /**
   * get collection api
   */
  getCollection() {
    const obj = {
      'marketplace_reference_id': this.sessionService.get('config').marketplace_reference_id,
      'user_id': this.sessionService.get('config').marketplace_user_id,
      'marketplace_user_id': this.sessionService.get('config').marketplace_user_id,
    };
    if (this.sessionService.get('appData')) {
      obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    this.service.getCollection(obj)
      .subscribe(
        response => {
          try {
            if (response.status === 200) {
              // this.getFilteredData(this.filteredData)
              this.filteredData = response.data.filterAndValues[0].allowed_Values;
              if (this.queryParam.id) {
                this.selectedProductFilter = this.queryParam.id;
                this.parent_catalogueId = parseInt(this.queryParam.id);
                const lat = this.sessionService.get('location').lat;
                const lng = this.sessionService.get('location').lng;
                const city = this.sessionService.get('location').city;
                this.getProductList(lat, lng, '', city, '');
              }
            }
          } catch (e) {
            console.error(e);
          }
        });
  }

  getFilteredData(catalogue_id) {
    this.service.productChangeSubject.next({
      catalogue_id: catalogue_id
    });
  }

  /**
   * listening filter select event
   */
  subscriptionForListeningFilterEvent() {
    this.messageService.applyFilterEvent
      .pipe(takeWhile(_ => this.alive))
      .subscribe((message) => {
        const location = this.sessionService.get('location');
        switch (message.event_type) {
          case 0: {
            this.categoryWiseFilter = undefined;

              this.pageSkip = 0;
              this.pageLimit = 25;
              this.getRestaurants(location.lat, location.lng, '', location.city);
            break;
          }
          case 1: {
            const filterObject = {};
            message.data.forEach((element) => {
              const keys = Object.keys(element);
              filterObject[keys[0]] = element[keys[0]];
            });
            this.categoryWiseFilter = JSON.stringify(filterObject);
              this.pageSkip = 0;
              this.pageLimit = 25;
              this.getRestaurants(location.lat, location.lng, '', location.city);
            break;
          }
          default:
            break;
        }
      });
  }

  /**
   * listen business category event
   */
  subscriptionForListeningBusinessCategory() {
    this.messageService.sendBusinessCategoryId
      .pipe(distinctUntilChanged(),takeWhile(_ => this.alive))
      .subscribe((message) => {
        const location = this.sessionService.get('location');
         this.pageSkip = 0;

         this.pageLimit = 25;

         if(!this.messageService.merchantFilterEnabled){
        setTimeout(() => this.getRestaurants(location.lat, location.lng, '', location.city), 1000);
          if(!(location === null)) {
            setTimeout(() =>
            this.getRestaurants(location.lat, location.lng, '', location.city), 1000);
          }
          else {
            this.paginatingForMerchantList.show = false;
          }
         }
        // this.getRestaurants(location.lat, location.lng, '', location.city);
      });
      this.messageService.getChangedRadius
      .pipe(takeWhile(_ => this.alive))
      .subscribe((message) => {
        this.radiusInitial = message.radius;
      });
  }
  /**
   * get delivery mode data
   */
  subscriptionForListeningDeliveryMethod() {
    this.messageService.sendDelivery
      .pipe(takeWhile(_ => this.alive))
      .subscribe((message) => {
        const location = this.sessionService.get('location');
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
          this.pageSkip = 0;
          this.pageLimit = 25;
          this.getRestaurants(location.lat, location.lng, '', location.city);
        }
      });
  }

  /**
   * subscription for listing message event
   */
  subscriptionForListeningMessage() {
    this.messageService.getMessage()
      .pipe(takeWhile(_ => this.alive)).subscribe(message => {
        if (this.config.nlevel_enabled === 1 && !this.sessionService.getString('catId') && this.config.business_model_type !== 'ECOM') {
          this.router.navigate(['categories']);
        } else if (this.config.nlevel_enabled === 1 && this.sessionService.getString('catId')) {
          if (this.config.product_view === 1) {
            this.getProductList(message.lat, message.lng, message.city, message.text, '');
          } else {
            if (this.sessionService.get('catIdChild')) {
              this.getMerchantListCat(message.lat, message.lng, message.city, message.text, this.sessionService.get('catIdChild'));
            } else {
              this.getMerchantListCat(message.lat, message.lng, message.city, message.text, this.sessionService.getString('catId'));
            }
          }
        } else {
          if (this.config.product_view === 1) {
            this.getProductList(message.lat, message.lng, message.city, message.text, '');
          } else {
            this.pageSkip = 0;
            this.pageLimit = 25;
            // this.getRestaurants(message.lat, message.lng, message.city, message.text);
            setTimeout(() => this.getRestaurants(message.lat, message.lng, message.city, message.text),1000);

          }
        }
      });
  }

  /**
   * subscription for filters
   */
  subscriptionForFilters() {
    this.messageService.sendRentalFilter
      .pipe(takeWhile(_ => this.alive)).subscribe(message => {
        if (message) {
          this.rentalFilter = message;
        }
        this.offset = 0;
        this.limit = 50;
        const lat = this.sessionService.get('location').lat;
        const lng = this.sessionService.get('location').lng;
        const city = this.sessionService.get('location').city;
        this.getProductList(lat, lng, '', city, '');
      });
  }

  /**
   * check product flow and merchant flow
   */
  checkForProductAndMerchantFlow() {
    if (this.config.nlevel_enabled === 1 && this.sessionService.getString('catId')) {
      this.getLastLevelCategories(this.sessionService.getString('catId'));
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
   * get last level categories
   */
  getLastLevelCategories(id) {
    const obj = {
      'marketplace_reference_id': this.headerData.marketplace_reference_id,
      'marketplace_user_id': this.headerData.marketplace_user_id,
      'user_id': this.headerData.marketplace_user_id,
      'parent_category_id': Number(id)
    };

    if (this.sessionService.get('appData')) {
      obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    this.service.getLastLevelCat(obj)
      .subscribe(
        response => {
          try {
            if (response.status === 200) {
              this.categoryData = response.data;
              this.categoryData.forEach((data) => {
                data.selected = false;
                if (this.sessionService.get('catIdChild')) {
                  const idArray = this.sessionService.get('catIdChild');
                  for (let i = 0; i < idArray.length; i++) {
                    if (idArray[i] === data.catalogue_id) {
                      data.selected = true;
                    }
                  }
                }
              });
              if (!this.sessionService.get('catIdChild')) {
                this.sessionService.setToString('catIdChild', id);
              }
            } else if (response.status === 400) {
            }
            this.result = true;
          } catch (e) {
            console.error(e);
          }
        },
        error => {
          console.error(error);
        }
      );
  }

  /**
   * when page scrolled
   */
  onScrollGetData(ev) {
    if (!this.productFlag) {
      this.offset = this.offset + this.limit;
      this.limit = 50;
      if (this.sessionService.get('location')) {
        const lat = this.sessionService.get('location').lat;
        const lng = this.sessionService.get('location').lng;
        const city = this.sessionService.get('location').city;
        this.getProductList(lat, lng, '', city, 'search');
      }
    }
  }

  /**
   * get restaurant list
   */
  getRestaurants(lat, lng, city, search, concat?) {
     // if (city) {
    //  if (this.sessionService.get('location')) {
    //    const c = this.sessionService.get('location').city;
    //    $('#citySearch').val(c);
    //  }
    // }
    if (!concat) {
      this.loader.show();
    }
    if (this.deliveryMode === 0) {
      if (this.config.admin_self_pickup && this.config.selected_delivery_method_for_apps ==4)
        this.deliveryMode = 2;
      else if (this.config.admin_home_delivery && this.config.selected_delivery_method_for_apps == 2)
        this.deliveryMode = 1;
      else if (this.config.admin_pick_and_drop && this.config.selected_delivery_method_for_apps == 8)
        this.deliveryMode = 8;

      else if (this.config.admin_home_delivery)
        this.deliveryMode = 1;
      else if (this.config.admin_self_pickup)
        this.deliveryMode = 2;
      else if (this.config.admin_pick_and_drop)
        this.deliveryMode = 8;

    }
    if(this.mapViewCheck === true) {
    if (this.sessionService.get('location')) {
      const obj = {
        'marketplace_reference_id': this.headerData.marketplace_reference_id,
        'marketplace_user_id': this.headerData.marketplace_user_id,
        'latitude': this.sessionService.get('location').lat,
        'longitude': this.sessionService.get('location').lng,
        'search_text': search,
        'filters': this.categoryWiseFilter,
        'skip': !this.first_radius ? this.pageSkip : undefined,
        'limit': !this.first_radius ? this.pageLimit : undefined
      };
      if (this.deliveryMode === 1) {
        obj['home_delivery'] = 1;
      } else if (this.deliveryMode === 2) {
        obj['self_pickup'] = 1;
      } else if (this.deliveryMode === 8) {
        obj['pick_and_drop'] = 1;
      }
      else if(this.config.admin_self_pickup &&  this.config.admin_home_delivery)
      {
        obj['home_delivery'] = 1;
      }
      if (this.sessionService.get('appData')) {
        obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      }

      if (this.sessionService.getString('bId') !== '0') {
        obj['business_category_id'] = this.sessionService.getString('bId');
        this.businessId = this.sessionService.getString('bId');
      }
      if (this.sessionService.get('appData')) {
        obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
      }
      setTimeout(() =>
      {
      this.showListView = false;
      this.cd.detectChanges();
      this.service.getRestaurants(obj)
        .subscribe(
          response => {
            try {
              if (response.status === 200) {
                if (this.sessionService.getString('bId') !== '0') {
                  this.messageService.merchantsLoaded.next(true);
                }
                if(!response.data.length) {
                  this.fetchedDataLengthFlag = true;
                } else {
                  this.fetchedDataLengthFlag = false;
                }

                if(!concat){

                  this.businessData.data = response.data;
                }else{
                  this.businessData.data = [...this.businessData.data, ...response.data];
                }
                setTimeout(() => {
                  this.messageService.merchantList.next(this.businessData);
                });
                this.businessData.data.forEach((data) => {

                  data.latitude = Number(data.latitude);
                  data.longitude = Number(data.longitude);
                   if(data.estimatedAddOn && data.estimatedTime)
                   {
                    data.combined_time = (data.estimatedTime || 0) + (data.order_preparation_time || 0);
                   }
                  else if (data.merchant_as_delivery_manager) {
                    data.combined_time = (data.merchant_delivery_time || 0) + (data.order_preparation_time || 0);
                  }
                  else
                    data.combined_time = (data.delivery_time || 0) + (data.order_preparation_time || 0);
                 });
                this.messageService.sendDataToMap(this.businessData);
                this.paginatingForMerchantList.show = false;
                this.sessionService.setToString('available_stores',this.businessData.data.length);
                this.sessionService.setToString('no_of_stores', this.businessData.data.length);
                this.sessionService.set('stores', this.businessData.data);

                this.scrollStartOn = false;
                if(this.config.enabled_marketplace_storefront && this.config.enabled_marketplace_storefront.length == 1){
                  this.navigate(this.businessData.data[0]);
                  return;
                }
                if (this.businessData.data.length === 1 && (!this.config.admin_home_delivery || !this.config.admin_self_pickup) &&
                  !this.config.is_business_category_enabled && !this.config.is_custom_order_active) {
                  this.navigate(this.businessData.data[0]);
                  return;
                }
              } else if (response.status === 400) {

                this.paginatingForMerchantList.show = false;
              } else {
                this.paginatingForMerchantList.show = false;


              }
              this.result = true;
            } catch (e) {
              console.error(e);
              this.paginatingForMerchantList.show = false;
              this.showListView = true;
              this.cd.detectChanges();
            }
            this.showListView = true;
            this.cd.detectChanges();
            this.loader.hide();
          },
          error => {

            this.paginatingForMerchantList.show = false;
            this.showListView = true;
            this.cd.detectChanges();
            this.loader.hide();
            console.error(error);
          }
        )
    }, 800);
    }
  }
  else {
    if (this.sessionService.get('location')) {
      const obj = {
        'marketplace_reference_id':this.headerData.marketplace_reference_id,
        'marketplace_user_id': this.headerData.marketplace_user_id,
        'latitude': this.sessionService.get('location').lat,
        'longitude': this.sessionService.get('location').lng,
        'search_text': search,
        'filters': this.categoryWiseFilter,
        'skip': this.pageSkip,
        'limit': this.pageLimit
      };
      if (this.deliveryMode === 1) {
        obj['home_delivery'] = 1;
      } else if (this.deliveryMode === 2) {
        obj['self_pickup'] = 1;
      } else if (this.deliveryMode === 8) {
        obj['pick_and_drop'] = 1;
      }
      else if( this.config.admin_self_pickup &&  this.config.admin_home_delivery)
      {
        obj['home_delivery'] = 1;
      }
      if (this.sessionService.get('appData')) {
        obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      }

      if (this.sessionService.getString('bId') !== '0') {
        obj['business_category_id'] = this.sessionService.getString('bId');
        this.businessId = this.sessionService.getString('bId');
      }
      if (this.sessionService.get('appData')) {
        obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
      }
      this.showListView = true;
      this.cd.detectChanges();
      this.service.getRestaurants(obj)
        .subscribe(
          response => {
            try {
              if (response.status === 200) {
                if (this.sessionService.getString('bId') !== '0') {
                  this.messageService.merchantsLoaded.next(true);
                }
                // setTimeout(() => {
                //   this.initAutoComplete();
                // }, 2000);
                if(!response.data.length) {
                  this.fetchedDataLengthFlag = true;
                } else {
                  this.fetchedDataLengthFlag = false;
                }

                  if(!concat){

                   this.businessData.data = response.data;
                }else{
                  this.businessData.data = [...this.businessData.data, ...response.data];
                }

                setTimeout(() => {
                  this.messageService.merchantList.next(this.businessData);
                });
                // this.resetList = true;

                this.businessData.data.forEach((data) => {

                  data.latitude = Number(data.latitude);
                  data.longitude = Number(data.longitude);
                  if(data.estimatedAddOn && data.estimatedTime)
                  {
                   data.combined_time = (data.estimatedTime || 0) + (data.order_preparation_time || 0);
                  }
                 else if (data.merchant_as_delivery_manager) {
                    data.combined_time = (data.merchant_delivery_time || 0) + (data.order_preparation_time || 0);
                  } else {
                    data.combined_time = (data.delivery_time || 0) + (data.order_preparation_time || 0);
                  }

                });
                this.messageService.sendDataToMap(this.businessData);
                this.paginatingForMerchantList.show = false;
                this.sessionService.setToString('available_stores',this.businessData.data.length);
                this.sessionService.setToString('no_of_stores', this.businessData.data.length);
                this.sessionService.set('stores', this.businessData.data);

                this.scrollStartOn = false;
                if(this.config.enabled_marketplace_storefront && this.config.enabled_marketplace_storefront.length == 1){
                  this.navigate(this.businessData.data[0]);
                  return;
                }
                if (this.businessData.data.length === 1 &&
                  !this.config.is_business_category_enabled && !this.config.is_custom_order_active) {
                  this.navigate(this.businessData.data[0]);
                  return;
                }
              } else if (response.status === 400) {

                this.paginatingForMerchantList.show = false
              } else {
                this.paginatingForMerchantList.show = false


              }
              this.result = true;
            } catch (e) {
              console.error(e);
              this.paginatingForMerchantList.show = false
              this.cd.detectChanges();
              this.showListView = true;
            }
            this.showListView = true;
            this.cd.detectChanges();
            this.loader.hide();
          },
          error => {

            this.paginatingForMerchantList.show = false;
            this.showListView = true;
            this.cd.detectChanges();
            this.loader.hide();
            console.error(error);
          }
        );
    }
  }
  }

  /**
   * get product list if product view open
   */
  getProductList(lat, lng, city, search, type) {
    if (type === 'search') {
      this.paginating = true;
    } else {
      this.loader.show();
    }
    if (this.sessionService.get('location')) {
      const obj = {
        'limit': this.limit,
        'offset': this.offset,
        'marketplace_reference_id': this.headerData.marketplace_reference_id,
        'marketplace_user_id': this.headerData.marketplace_user_id,
        'latitude': lat,
        'longitude': lng,
        'parent_category_id': this.config.business_model_type === "ECOM" ? this.parent_catalogueId : undefined
        // 'search_text': search,
      };
      if (this.sessionService.get('appData')) {
        obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
        obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
      }
      if (this.config.show_date_filter === 1 && this.sessionService.getString('dateFiltered')) {
        const dates = JSON.parse(this.sessionService.getString('dateFiltered'));
        obj['start_date'] = moment(dates.start).format('YYYY-MM-DD');
        obj['end_date'] = moment(dates.end).format('YYYY-MM-DD');
      }
      //
      if (this.sessionService.get('filter') && this.rentalFilter && this.rentalFilter.custom_fields) {
        obj['custom_fields'] = JSON.stringify(this.rentalFilter.custom_fields);
      }
      if (this.sessionService.get('filter') && this.rentalFilter && this.rentalFilter.price_range) {
        obj['price_range'] = this.rentalFilter.price_range;
      }

      if (this.sessionService.get('appData')) {
        obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      }
      this.service.getProductList(obj)
        .subscribe(
          response => {
            try {
              if (response.status === 200) {
                if (response.data && response.data.length === 0) {
                  this.productFlag = true;
                } else {
                  this.productFlag = false;
                }
                this.productCount = response.metaInfo.more_products_available;
                if (type === 'search') {
                  response.data.forEach((data) => {
                    this.productDataFull.push(data);
                  });
                } else {
                  this.productDataFull = response.data;
                }

                if (this.productDataFull && this.productDataFull.length) {
                  for (let i = 0; i < this.productDataFull.length; i++) {
                    this.productDataFull[i].layout_data.buttons = this.productDataFull[0].layout_data.buttons;
                    if (this.productDataFull[i].thumb_list && (!this.productDataFull[i].thumb_list['400x400'] ||
                      this.productDataFull[i].thumb_list['400x400'] === '')) {
                      this.productDataFull[i].thumb_list = null;
                    } else if (!this.productDataFull[i].thumb_list) {
                      this.productDataFull[i].thumb_list = null;
                    }
                  }
                  this.checkIfProductGot = false;
                } else {
                  this.checkIfProductGot = true;
                }
              } else if (response.status === 400) {
              }
              this.result = true;
            } catch (e) {
              console.error(e);
            }
            if (type === 'search') {
              this.paginating = false;
            } else {
              this.loader.hide();
            }
          },
          error => {
            console.error(error);
          }
        );
    }
  }

  /**
   * get merchant list according to cat
   */
  getMerchantListCat(lat, lng, city, search, id) {
    this.loader.show();
    const obj = {
      'marketplace_reference_id': this.headerData.marketplace_reference_id,
      'marketplace_user_id': this.headerData.marketplace_user_id,
      'user_id': this.config.marketplace_user_id,
      'catalog_ids': id.toString()
    };

    if (this.sessionService.get('appData')) {
      obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    this.showListView = false;
    this.cd.detectChanges();
    this.service.getMerchantListAccordingToCat(obj)
      .subscribe(
        response => {
          try {
            if (response.status === 200) {
              this.businessData.data = response.data;
              this.businessData.data.forEach((data) => {
                data.latitude = Number(data.latitude);
                data.longitude = Number(data.longitude);
                if (data.business_type === 2) {
                  data.available = 1;
                }
              });
              this.sessionService.setToString('no_of_stores', this.businessData.data.length);
              this.sessionService.set('stores', this.businessData.data);
            } else if (response.status === 400) {
            }
            this.result = true;
          } catch (e) {
            console.error(e);
            this.showListView = true;
            this.cd.detectChanges();
          }
          this.showListView = true;
          this.cd.detectChanges();
          this.loader.hide();
        },
        error => {
          this.showListView = true;
          this.cd.detectChanges();
          console.error(error);
        }
      );
  }

  /**
   * get address from lat lng
   * @param lat
   * @param lng
   * @param type
   */
  getFullAddress(lat, lng, type) {
    const location = { lat: lat, lng: lng };
    const geocoder = new google.maps.Geocoder;
    geocoder.geocode({ 'location': location }, (results, status) => {
      this.ngZone.run(() => {
        if (status.toString() === 'OK') {
          this.searchTextRes = results[0].formatted_address;
          const search = results[0].formatted_address;
          const lat = results[0].geometry.location.lat();
          const lng = results[0].geometry.location.lng();
          this.sessionService.set('location', { lat: lat, lng: lng, city: results[0].formatted_address });
          this.onLocationFetch(lat, lng, type, search);
          this.messageService.sendLatlng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
        } else {
          window.alert('No results found');
        }
      });
    });
  }


  /**
   * decide what to do when location get fetched
   * @param lat
   * @param lng
   * @param type
   * @param search
   */
   onLocationFetch(lat: number, lng: number, type: any, search: string) {
    if (this.config.nlevel_enabled === 1 && !this.sessionService.getString('catId') && this.config.business_model_type !== 'ECOM') {
      this.router.navigate(['categories']);
    } else if (this.config.nlevel_enabled === 1 && this.sessionService.getString('catId')) {
      if (this.config.product_view === 1) {
        this.getProductList(lat, lng, '', search, type);
      }
      else {
        if (this.sessionService.get('catIdChild')) {
          this.getMerchantListCat(lat, lng, '', search, this.sessionService.get('catIdChild'));
        }
        else {
          this.getMerchantListCat(lat, lng, '', search, this.sessionService.getString('catId'));
        }
      }
    }
    else {
      if (this.config.product_view === 1) {
        this.getProductList(lat, lng, '', search, type);
      }
      else {
        if(!this.sessionService.isPlatformServer()){
          this.getRestaurants(lat, lng, '', search);
        }
      }
    }
  }

  /**
   * navigate to product
   */
  navigate(item) {
    this.sessionService.set('info', item);
    this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.restaurant_click, item.store_name, '', '');
    this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.restaurant_detail_order_online, item.store_name, '', '');
    const id = this.sessionService.getByKey('app', 'rest_id') || undefined;
    this.sessionService.remove('preOrderTime');
    if (id !== item.storefront_user_id) {
      setTimeout(() => {
        this.messageService.clearCartOnly();
      }, 1000);
      // this.cartService.cartClearCall();
      this.router.navigate(['store', item.storepage_slug || '-', item.storefront_user_id]);
    } else {
      this.router.navigate(['store', item.storepage_slug || '-', item.storefront_user_id]);
    }

  }

  scrollInit(event) {
    const offset = event.target.scrollHeight;
    const height = event.target.scrollTop;

    if ((event.target.scrollTop + event.target.clientHeight) / event.target.scrollHeight >= 0.6) {
      this.onScroll(0);
    }
  }

  // on scroll pagination logic
  //close pagination if data length less than limit
  //or data length is 0
  onScroll(ev) {
    if (!this.scrollStartOn && this.businessData && this.businessData.data) {

      this.scrollStartOn = true;
      this.pageSkip = this.pageLimit + this.pageSkip;
      this.pageLimit = 25;
      let remaining = this.businessData.data.length % 25;
      if ( (remaining > 0 && remaining < 25) || (this.fetchedDataLengthFlag)) {
        this.paginatingForMerchantList.show = false;
      } else {
        this.paginatingForMerchantList.show = true;

        // this.resetList = false;
        this.getRestaurants('','','',this.searchTextRes, true);
      }
      this.paginatingForMerchantList.show = false;
    }


  }
}
