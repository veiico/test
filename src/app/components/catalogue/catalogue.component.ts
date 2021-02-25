import { MessageType, ModalType } from './../../constants/constant';
/* tslint:disable:max-line-length */

import {
  Component,
  NgZone,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  AfterViewInit,
  Renderer2,
  OnDestroy,
  EventEmitter,
  Output,
  ChangeDetectorRef
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeWhile } from 'rxjs/operators';
import { MapsAPILoader } from '@agm/core';
// import * as $ from 'jquery';

import { MessageService } from '../../services/message.service';
import { CatalogueService } from './catalogue.service';

import { SessionService } from '../../services/session.service';
import { RestaurantsService } from '../restaurants-new/restaurants-new.service';
import { AppProductComponent } from './components/app-product/app-product.component';
import { AppCategoryService } from './components/app-category/app-category.service';
import { LoaderService } from '../../services/loader.service';
import { AppCartService } from './components/app-cart/app-cart.service';
import { GoogleAnalyticsEventsService } from '../../services/google-analytics-events.service';
import { AppService } from '../../app.service';
import { GoogleAnalyticsEvent, OnboardingBusinessType } from '../../enums/enum';
import { PopUpService } from '../../modules/popup/services/popup.service';
import { FBPixelService } from '../../services/fb-pixel.service';
import { GeoLocationService } from '../../services/geolocation.service';
import { slideUpDownDOM } from '../../animations/slideUpDown.animation';
import { NLevelCategoryData } from '../../modules/n-level-catalogue/interface/n-level-category.interface';
import { IProdultListPageData } from '../../themes-custom/interfaces/interface';
import { element } from '@angular/core/src/render3';
import { style } from '@angular/animations';
import { relative } from 'path';

declare var $: any;

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [slideUpDownDOM]
})
export class CatalogueComponent implements OnInit, AfterViewInit, OnDestroy {
  deliveryMethods: number;
  customOrderDescription: any;
  laundry_flow: boolean;
  @ViewChild(AppProductComponent)
  private appProductComponent: AppProductComponent;
  form = new FormGroup({
    searchControl: new FormControl()
  });
  searchText = '';
  user_id;
  catHead: any;
  searchOn: any;
  currentCategoryName: any;
  productList: any = [];
  oldProductList: any = [];
  subscription: Subscription;
  productData: any;
  paginating: boolean;
  productbool = false;
  showNoProduct = true;
  showloader: boolean;
  pageoffset: any;
  pagelimit: any;
  latitude;
  longitude;
  public count: any;
  productCount: any;
  prevCatId: any;
  categoryForPagination: any;
  public parentCategoryId: any;
  public onboardingBusinessType: OnboardingBusinessType;
  public dataBool: boolean;
  public categoryForm: FormGroup;
  public currentCategory: string;
  public modalType = ModalType;
  public appConfig: any = {
    color: ''
  };
  public noOffering: boolean;
  public categoryList: any;
  public storeUnsubscribe: any;
  public allCategoryData: any;
  public loopData: any;
  public storeLogo: any;
  public categoryId: string;
  public routeSubsriber: any;
  public formSettings: any;
  public terminology: any;
  public result: any;
  public restaurantData: any;
  public restaurantInfo: any;
  public catBgColor: string;
  public mobileView: boolean;
  public data = {
    category: [],
    product: []
  };
  cardInfo;
  hideCategory = false;
  alive = true;
  // @ViewChild('search')
  // public searchElementRef: ElementRef;
  public searchControl: FormControl;
  public checkCartData = [];
  public langJson: any = {};
  public languageSelected: any;
  public direction = 'ltr';

  public onlyVegCheck = false;
  public preOnlyVegCheck = false;
  public headerData;
  public scrollSubscription;
  public showAddressBarOnlyRestaurant: boolean;
  public showPreorderTimeSelection: boolean;
  preOrderDatetime: any;
  isPreorderTimeRequired: boolean;
  hideClosePreorder: boolean;
  showPreorderInfo: boolean;
  product_has_images: number;
  showAskLocationPopup: boolean;
  showFetchLocationPopup: boolean;
  showNotDiliverable: boolean;
  public isPlatformServer;
  public categoryShimmer: boolean = true;
  public productShimmer: boolean = true;
  public cartShimmer: boolean = true;
  public interval: any;

  public category_depth_limit: number = 2;
  public current_category_depth: number = 0;
  public n_level_parent_category_id: number;
  public categoryPathData: any;
  public product_layout_type: number;
  public all_category_depth: number = 3;
  scrollEvent = new EventEmitter<number>();
  public showMultipleBanners: boolean;
  @Output() toggle: EventEmitter<string> = new EventEmitter<string>();
  public newList = [];
  public bannerImage;
  public originalBannerImage = '';
  catalogueList: boolean = false;
  searchItems: boolean = true;
  prodname: boolean = false;
  parent_cat_id: any = '';
  resturantOff: boolean = false;
  languageStrings: any = {};
  constructor(
    protected messageService: MessageService,
    protected zone: NgZone,
    protected sessionService: SessionService,
    public appCategoryService: AppCategoryService,
    protected router: Router,
    protected service: CatalogueService,
    protected route: ActivatedRoute,
    protected mapsAPILoader: MapsAPILoader,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
    protected loader: LoaderService,
    protected restaurantService: RestaurantsService,
    protected cartService: AppCartService,
    public appService: AppService,
    protected renderer: Renderer2,
    protected popUpService: PopUpService,
    protected fbPixelService: FBPixelService,
    protected geolocation: GeoLocationService,
    protected cd: ChangeDetectorRef
  ) {
    this.headerData = this.sessionService.get('config');
    this.showAddressBarOnlyRestaurant = [0, 1].includes(this.sessionService.get('available_stores')) ? true : false;
  }
  ngAfterViewInit() {
    if (!this.pagelimit) {
      this.pagelimit = 0;
    }
    this.pageoffset = this.pagelimit;
    this.pagelimit = this.pageoffset + 25;
  }

  oscrollFun() {
    const clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const bannerWrapper = document.querySelector('#banner-parent') as HTMLElement;
    const banner = document.querySelector('#banner-footer') as HTMLElement;
    const bannerDiv = document.querySelector('.new-main-banner') as HTMLElement;
    const imageBanner = document.querySelector('#image-banner') as HTMLElement;
    const newBackgroundImage = document.querySelector('.new-background-image') as HTMLElement;
    const bannerHeading = document.querySelector('.banner-heading') as HTMLElement;
    const header = document.querySelector('.top-header') as HTMLElement;
    const closedRestro = document.querySelector('.closedRestro') as HTMLElement;
    const carouselIndicators = document.querySelector('.carousel-indicators') as HTMLElement;
    const multiBanner = document.querySelector('#multiBanner') as HTMLElement;

    if (clientWidth > 768) {
      if (bannerWrapper && bannerWrapper.getBoundingClientRect().top <= 40) {
        bannerWrapper.style.zIndex = '1005';
        (newBackgroundImage && this.restaurantInfo && this.restaurantInfo.description) ? newBackgroundImage.style.background = 'black' : '';
        if (bannerHeading) {
          bannerHeading.style.display = 'inline-block';
        }
        bannerDiv.classList.add("banner-transition")
        if (imageBanner && this.restaurantInfo && this.restaurantInfo.description) {
          imageBanner.style.opacity = '0.5';
          imageBanner.style.transition = 'opacity 800ms ease'
        }
        if (multiBanner && this.restaurantInfo && this.restaurantInfo.description) {
          multiBanner.style.opacity = '0.5';
          multiBanner.style.transition = 'opacity 800ms ease'
        }
        banner.style.transform = clientWidth >  1200 ? 'translateY(-40px) translateX(60px)' : 'translateY(-20px)';
        if (header) {
          header.style.display = 'none';
        }
        if (closedRestro) {
          closedRestro.style.zIndex = '1006'
        }
        if (carouselIndicators) {
          carouselIndicators.style.display = 'none'
        }
      } else if (bannerWrapper && bannerWrapper.getBoundingClientRect().top > 40) {
        newBackgroundImage.style.background = 'transparent'
        bannerWrapper.style.zIndex = '1';
        if (bannerHeading) {
          bannerHeading.style.display = 'none';
        }
        if (header) {
          header.style.display = 'flex';
        }
        if (carouselIndicators) {
          carouselIndicators.style.display = 'inline'
        }
        bannerDiv.classList.remove("banner-transition");
        if (imageBanner) {
          imageBanner.style.transition = 'opacity 800ms ease'
          imageBanner.style.opacity = '1';
        }
        if (multiBanner) {
          multiBanner.style.opacity = '1';
          multiBanner.style.transition = 'opacity 800ms ease'
        }
        banner.style.transform = 'translateY(0px)';
      }
    }
  }

  async initFunction() {
    this.isPlatformServer = this.sessionService.isPlatformServer();
    this.formSettings = this.sessionService.get('config');
    this.deliveryMethods = Number(
      this.sessionService.getString('deliveryMethod')
    );
    const clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (clientWidth > 768) {
      this.mobileView = false;
    } else {
      const category = document.getElementsByClassName('select_category')
      if (category && category.length) {
        category[0].scrollIntoView({ behavior: "smooth", block: "end" });
      }
      this.mobileView = true;
    }
    this.laundry_flow = this.formSettings.onboarding_business_type === OnboardingBusinessType.LAUNDRY
    if (this.formSettings && this.formSettings.terminology) {
      this.terminology = this.formSettings.terminology;
    }
    this.customOrderDescription = this.terminology && this.terminology.READY_TO_PLACE_YOUR_ORDER ? true : false;
    if (!this.sessionService.get('location')) {
      this.geolocation.fetchLocation();
    }

    this.user_id = parseInt(this.route.snapshot.params['id']) ? parseInt(this.route.snapshot.params['id']) : this.sessionService.getString('user_id');
    if (!this.user_id || isNaN(this.user_id)) {
      if (this.sessionService.isMerchantDomain()) {
        this.user_id = this.appConfig.merchant_domain_obj.merchant_user_id;
      } else {
        this.router.navigate(['']);
      }
    }
    await this.getRestaurantsForBrowser(false);
    if (!this.isPlatformServer) {
      if (document.body.clientWidth < 800) {
        this.category_depth_limit = 1;
      }
    }

    const cartData = this.cartService.getCartData();
    if (cartData && cartData.length > 0) {
      if (cartData[0].user_id && cartData[0].user_id !== this.user_id) {
        this.cartService.cartClearCall();
      }
    }

    this.currentCategory = '';
    this.count = 0;

    this.form
      .get('searchControl')
      .valueChanges.pipe(debounceTime(1000))
      .subscribe(res => {
        this.searchItems = true;
        this.cd.detectChanges();
        this.searchText = res.trim();
        if (!this.searchText.length && !res.length) {

          this.hideCategory = false;
          this.searchOn = 0;
          this.productList = this.oldProductList;

          // -------------- data handing for element product list --------------//
          const dataObj: IProdultListPageData = {
            productList: this.productList,
            currentCategoryName: this.currentCategoryName,
            searchProducts: this.searchOn,
            cardInfo: this.cardInfo,
            paginating: this.paginating,
            hasImages: this.product_has_images,
            layout_type: this.product_layout_type,
            isRestaurantActive:
              this.restaurantInfo.available ||
              this.restaurantInfo.scheduled_task
          };

          this.service.productList.next(JSON.parse(JSON.stringify(dataObj)));
          // -------------- data handing for element product list --------------//

          // this.showSearch({'data':[],'search':0});
          // this.showProduct(this.selectedItem);
        } else if (this.searchText.length) {
          this.searchOn = 1;
          this.search();
        }
      });

    this.messageService.clearCartData.subscribe(() => {
      // const cartData = this.cartService.getCartData();
      if (cartData && cartData.length > 0) {
        this.cartService.cartClearCall();
      }
    });
    this.subscription = this.messageService.getMessage().subscribe(message => {
      this.messageService.setCityInRestaurant(message);

      // this.router.navigate(['list']);
    });

    // if (this.restaurantData && this.restaurantData.length >0 &&
    //   (!this.sessionService.get('info') ||
    //   (!this.sessionService.get('info').available &&
    //     !this.sessionService.get('info').scheduled_task))
    // ) {
    //   this.sessionService.set('location', '');
    //   this.router.navigate(['']);
    //   return;
    // }
    this.currentCategory = this.formSettings ? this.formSettings.form_name : '';

    this.cartService.currentStatus.subscribe(() => {
      this.checkCartData = this.cartService.getCartData();
    });
    if (this.restaurantInfo && this.restaurantInfo.instant_task == 0 && this.restaurantInfo.scheduled_task === 1 && this.restaurantInfo.pre_booking_buffer) {
      this.preOrderDatetime = new Date(new Date().valueOf() + this.restaurantInfo.pre_booking_buffer * 60000);
    }
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

    this.scrollSubscription = this.renderer.listen('body', 'scroll', e => {
      this.scrollInit(e);
      if ((window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) > 768) {
        this.oscrollFun();
      }
    });

    /**
     * event to trigger fb pixel viewContent
     */
    this.fbPixelService.emitEvent('ViewContent', '');

    return Promise.resolve(true);
  }

  async ngOnInit() {
    this.subscriptionForListeningMessage();
    this.appConfig = this.sessionService.get('config');
    window['cc'] = this;
    await this.initFunction();
    this.pageoffset = this.pagelimit;
    this.pagelimit = this.pageoffset + 25;
    this.scrollHandler();
    // this.loader.show();
    this.searchControl = new FormControl();
    this.cardInfo = this.restaurantInfo;
    this.getOffering();
    if (this.route.snapshot.params['id']) {
      this.user_id = parseInt(this.route.snapshot.params['id']);
    } else {
      this.user_id = this.sessionService.getString('user_id');
    }
    if (this.user_id){
      this.user_id = parseInt(this.user_id);
    }
    this.sessionService.set(
      'user_id',
      this.user_id
    );

    this.sessionService.setByKey('app', 'rest_id', this.user_id);
    // this.restaurantInfo = this.sessionService.get('info');
    if (!this.isPlatformServer) {
      if (
        this.formSettings.is_menu_enabled &&
        this.restaurantInfo &&
        this.restaurantInfo.is_menu_enabled &&
        this.restaurantInfo.scheduled_task
      ) {
        // this.preOrderDatetime = (new Date()).toISOString();
        // this.sessionService.setString('preOrderTime', this.preOrderDatetime);
        let prevPreorderTime: any = this.sessionService.getString(
          'preOrderTime'
        );
        if (prevPreorderTime) {
          prevPreorderTime = new Date(prevPreorderTime);
          if (prevPreorderTime > new Date()) {
            this.preOrderDatetime = prevPreorderTime;
            this.showPreorderInfo = true;
            setTimeout(() => {
              this.showPreorderInfo = false;
            }, 5000);
          } else {
            this.sessionService.remove('preOrderTime');
          }
        }
        this.isPreorderTimeRequired = true;
        if (!this.restaurantInfo || !this.restaurantInfo.available) {
          this.hideClosePreorder = true;
          // this.loader.hide();
          this.productShimmer = false;
          this.categoryShimmer = false;
          this.cartShimmer = false;
          this.showPreorderTimeSelectionModal();
        } else {
          this.getAppCatalogue();
        }
      } else if (this.restaurantInfo && this.restaurantInfo.has_categories) {
        this.getAppCatalogue();
      } else {
        this.categoryShimmer = false;
        this.pageoffset = 0;
        this.pagelimit = this.pageoffset + 25;
        this.getProducts({
          page_no: Math.floor(this.pageoffset / 25) + 1,
          offset: this.pageoffset,
          limit: 25
        });
      }
    }


    // ================language json manupilation======================
    this.appService.langPromise.then(() => {
      this.langJson = this.appService.getLangJsonData();
      this.langJson['Search Product'] = this.langJson['Search Product'].replace(
        '----',
        this.terminology.PRODUCT
      );
      this.langJson['No Product Available.'] = this.langJson[
        'No Product Available.'
      ].replace('----', this.terminology.PRODUCT);
    });

    if(this.route.snapshot.queryParams['prodname'] && this.formSettings.is_product_share_enabled){
      this.parent_cat_id = this.route.snapshot.queryParams['pordCat'] ? this.route.snapshot.queryParams['pordCat'] : undefined;
      this.prodname = true;
      this.categoryShimmer = false;
      this.pageoffset = 0;

      const obj: any = {
        marketplace_user_id: this.formSettings.marketplace_user_id,
        user_id: this.sessionService.getString('user_id'),
        catalogue_id:this.parent_cat_id
      };
      let data = {
        user_id:this.sessionService.getString('user_id'),
        catalogue_id:this.parent_cat_id,
        marketplace_user_id: this.formSettings.marketplace_user_id,
      };
      if (this.sessionService.get('appData')) {
        obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
        obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
        data['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
        data['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
      }
      if(this.parent_cat_id){
        this.service.nLevelCategory(data).subscribe(
          response => {
            if (response.status === 200) {
              this.categoryPathData = [];
              let categoryData = response.data;
              this.categoryPathData.push(
                {
                  name:'All',
                  catalogue_id: null,
                  parent_category_id: null,
                  depth: categoryData.max_depth + 1
                }
              )
              for(let i =0;i < categoryData.result.length;i++){
                this.categoryPathData.push({
                  catalogue_id: categoryData.result[i].catalogue_id,
                  has_products: categoryData.result[i].has_products,
                  has_children: categoryData.result[i].has_children,
                  name: categoryData.result[i].name,
                  parent_category_id: categoryData.result[i].parent_category_id,
                  depth: categoryData.result.length - i
                })

              }
              this.all_category_depth = categoryData.max_depth;
              this.current_category_depth = categoryData.max_depth;
            }
          },
          error => {
            this.loader.hide();
            this.popUpService.showPopup(MessageType.ERROR, 2000, error.message, false);
            this.showloader = false;
          })
      }
      if(this.parent_cat_id){
        this.pagelimit = this.pageoffset + 25;
        this.getProducts({
          page_no: Math.floor(this.pageoffset / 25) + 1,
          offset: this.pageoffset,
          parent_category_id: this.parent_cat_id,
          limit: 25
        });
      }
    }
this.setLangKeys()
  
  }
setLangKeys()
{
  this.sessionService.langStringsPromise.then(() => {
    this.languageStrings = this.sessionService.languageStrings;
    this.languageStrings.schedule_order = (this.languageStrings.schedule_order || 'Schedule Order')
      .replace(
        'ORDER_ORDER',
        this.terminology.ORDER
      );
    this.languageStrings.no_product_available = (this.languageStrings.no_product_available || 'No Product Available.')
      .replace('PRODUCT_PRODUCT', this.terminology.PRODUCT);
      this.languageStrings.sorry_merchant_closed_at_the_moment_try_again_later = (this.languageStrings.sorry_merchant_closed_at_the_moment_try_again_later || 'Sorry merchant is closed at the moment. Try again later.')
      .replace('MERCHANT_MERCHANT', this.terminology.MERCHANT);
      this.languageStrings.instant_order = (this.languageStrings.instant_order || 'Instant Order')
      .replace('ORDER_ORDER', this.terminology.ORDER);
  });
}
  /**
  * subscription for listing message event
  */
  subscriptionForListeningMessage() {
    this.messageService.getMessage()
      .pipe(takeWhile(_ => this.alive)).subscribe(message => {
        if (!this.showFetchLocationPopup) {
          this.getRestaurantsForBrowser(true);
        }
      });
  }
  getRestaurantsForBrowser(redirectToStoreListPage?:boolean) {
    const lat = this.sessionService.get('location')
      ? this.sessionService.get('location').lat
      : 0;
    const lng = this.sessionService.get('location')
      ? this.sessionService.get('location').lng
      : 0;
    const obj = {
      marketplace_reference_id: this.formSettings.marketplace_reference_id,
      marketplace_user_id: this.formSettings.marketplace_user_id,
      latitude: lat,
      longitude: lng,
      user_id: this.user_id,
    };
    if (this.sessionService.get('appData')) {
      obj['vendor_id'] = this.sessionService.get(
        'appData'
      ).vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get(
        'appData'
      ).vendor_details.app_access_token;
    }
    if (
      this.formSettings.is_business_category_enabled === 1 &&
      this.sessionService.getString('bId') &&
      this.sessionService.getString('bId') !== '0'
    ) {
      obj['business_category_id'] = this.sessionService.getString('bId');
    }
    if (this.sessionService.get('editJobId')) {
      obj['skip_geofence'] = 1;
    }
    return this.service
      .getSingleRestaturant(obj)
      .toPromise()
      .then(response => {
        try {
          if (response.status === 200) {
            this.zone.run(() => {
              this.restaurantData = response.data;
              this.showAddressBarOnlyRestaurant = [0,1].includes(this.sessionService.get('available_stores')) ? true :  false;
              this.sessionService.setToString(
                'no_of_stores',
                this.restaurantData.length
              );
              this.sessionService.set('requiredCategories', this.restaurantData[0].requiredCatalogues);
              this.sessionService.set('info', this.restaurantData[0]);
              this.restaurantInfo = this.restaurantData[0];
              if(this.formSettings && this.formSettings.webapp_bg_color){
                this.catBgColor = response.data[0].merchant_page_bg_color || this.formSettings.webapp_bg_color || 'rgb(243, 243, 243)';
              }
              if (this.restaurantInfo && this.restaurantInfo.merchant_page_bg_color) {
                const el = document.querySelector(".change-color-bg") as HTMLElement;
                if (el) {
                  el.style.backgroundColor = response.data[0].merchant_page_bg_color;
                }
              }
              if (this.restaurantInfo) {
                const color = this.restaurantInfo.merchant_rating_bar_color || this.appConfig.admin_rating_bar_color;
                document.documentElement.style.setProperty('--rating-bar-color', color);
              }
              this.getMerchantBanner();
              this.storeLogo = this.formSettings.webapp_logo;
              this.sessionService.set('stores', this.restaurantData);
              this.product_layout_type = this.restaurantInfo.product_layout_type;
              this.all_category_depth = this.restaurantInfo.max_depth;
              if (this.restaurantData.length === 1) {

                const deliveryMethod = Number(
                  this.sessionService.getString('deliveryMethod')
                );
                this.deliveryMethods=deliveryMethod;
                if ((!this.restaurantData[0].can_serve && lat && lng && deliveryMethod == 1) && this.sessionService.get('config').enabled_marketplace_storefront && this.sessionService.get('config').enabled_marketplace_storefront.length > 1 && redirectToStoreListPage){
                  this.router.navigate(['list']);
                  return ;
                }
                if (
                  !this.restaurantData[0].can_serve &&
                  lat &&
                  lng &&
                  (deliveryMethod == 1 || deliveryMethod == 8)
                ) {
                  this.showNotDiliverable = true;
                } else {
                  this.showNotDiliverable = false;
                }
                const userID = this.route.snapshot.params['id'] ? this.route.snapshot.params['id'] : (this.sessionService.getString('user_id'));
                if (
                  Number(userID) !==
                  Number(this.restaurantData[0].storefront_user_id)
                ) {
                  this.sessionService.set('location', '');
                  this.router.navigate(['']);
                  return;
                }
                // this.navigate(this.restaurantData[0]);
                return;
              } else {
                const userID = this.route.snapshot.params['id'] ? this.route.snapshot.params['id'] : (this.sessionService.getString('user_id'));

                const store = this.restaurantData.filter(
                  o =>
                    Number(o.storefront_user_id) ===
                    Number(userID)
                );
                if(this.showNotDiliverable && this.sessionService.get('config').enabled_marketplace_storefront && this.sessionService.get('config').enabled_marketplace_storefront.length > 1 && redirectToStoreListPage){
                  this.router.navigate(['list']);
                  return ;
                }
                if (store && store.length) {
                  this.sessionService.set('info', store[0]);
                } else {
                  this.router.navigate(['']);
                }
              }
            });
          } else if (response.status === 400) {
          }
          else if(response.status == 201){
            this.resturantOff = true;
          }
          this.result = true;
        } catch (e) {
          console.error(e);
        }
        // this.loader.hide();
      })
      .catch(error => {
        console.error(error);
      });
    // }
  }

  navigate(item) {
    this.sessionService.set('info', item);
    this.googleAnalyticsEventsService.emitEvent(
      GoogleAnalyticsEvent.restaurant_click,
      item.store_name,
      '',
      ''
    );
    const id = this.sessionService.getByKey('app', 'rest_id') || undefined;
    if (id !== item.storefront_user_id) {
      try {
        this.cartService.cartClearCall();
      } catch (e) {}
    }
    this.sessionService.remove('preOrderTime');
    this.router.navigate([
      'store',
      item.storepage_slug || '-',
      item.storefront_user_id
    ]);
  }

  search() {
    const obj: any = {
      marketplace_user_id: this.formSettings.marketplace_user_id,
      search_text: this.searchText,
      user_id: this.sessionService.getString('user_id')
    };
    if (this.sessionService.get('appData')) {
      obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    if (this.onlyVegCheck) {
      obj['is_veg'] = 1;
    }

    if (this.isPreorderTimeRequired) {
      obj.date_time = this.preOrderDatetime || new Date().toISOString();
      // obj.is_scheduled = 1;
    } else {
      obj.date_time = new Date().toISOString();
    }

    this.appCategoryService.searchProducts(obj).subscribe(response => {
      if (response.status === 200) {
        this.searchOn = 1;
        // this.oldProductList = this.productList;
        this.hideCategory = true;
        const bannerWrapper = document.querySelector('#banner-parent') as HTMLElement;
        const productListView = document.querySelector('.cls-p-cnt-div') as HTMLElement;
        const productGridView = document.querySelector('.home-fluid-thumbnail-grid-item') as HTMLElement;
        const noProductDiv = document.querySelector('.no-prod-text') as HTMLElement;
        const clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        if((clientWidth > 768) && (bannerWrapper && bannerWrapper.getBoundingClientRect().top <= 40)){
          // $('body').animate({
          //   scrollTop: $(".cls-home-cat").offset().top
          //   }, 1000);
          productGridView ? productGridView.scrollIntoView({behavior: "smooth", block: "end"}) : '';
          productListView ? productListView.scrollIntoView({behavior: "smooth", block: "end"}) : '';
          noProductDiv ? noProductDiv.scrollIntoView({behavior: "smooth", block: "end"}) : '';
        }
        this.productList = response.data.result;
        if(this.productList.length<=0)
        {
          this.searchItems=false;
          this.cd.detectChanges();
        }
        for (let i = 0; i < this.productList.length; i++) {
          this.productList[
            i
          ].long_description = this.service.convertStringToBreakHTML(
            this.productList[i].long_description
          );

          if(this.productList[i].layout_data.lines &&
            this.productList[i].layout_data.lines[1] &&
            this.productList[i].layout_data.lines[1].data ){
            this.productList[i].layout_data.lines[1].data = this.service.convertStringToBreakHTML(this.productList[i].layout_data.lines[1].data);
          }
          if (
            this.productList[i].thumb_list &&
            (!this.productList[i].thumb_list['400x400'] ||
              this.productList[i].thumb_list['400x400'] === '')
          ) {
            this.productList[i].thumb_list = null;
          } else if (!this.productList[i].thumb_list) {
            this.productList[i].thumb_list = null;
          }
        }

        // -------------- data handing for element product list --------------//
        const dataObj: IProdultListPageData = {
          productList: this.productList,
          currentCategoryName: this.currentCategoryName,
          searchProducts: this.searchOn,
          cardInfo: this.cardInfo,
          paginating: this.paginating,
          hasImages: this.product_has_images,
          layout_type: this.product_layout_type,
          isRestaurantActive:
            this.restaurantInfo.available || this.restaurantInfo.scheduled_task
        };

        this.service.productList.next(JSON.parse(JSON.stringify(dataObj)));
        this.productShimmer = false;
        // -------------- data handing for element product list-------------//

        this.checkCartData = this.cartService.getCartData();
        // this.showSearch({'data':response.data.result,'search':1});
      }
    });
  }
  fetchViaIp() {
    const that = this;
    $.get(
      'https://ipinfo.io',
      function(response) {
        const lats = response.loc.split(',')[0];
        const lngs = response.loc.split(',')[1];
        this.sessionService.set('location', {
          lat: lats,
          lng: lngs,
          city: response.city
        });
        that.sendMessage(lats, lngs, response.city);
      },
      'jsonp'
    );
  }
  getOffering() {
    let offering = this.sessionService.get('config');
    if (offering) {
      offering = offering['is_nlevel'];
    }
    this.noOffering = parseInt(offering) === 1 ? true : false;
  }
  getSubChildData(value) {
    const copyData = value.slice();
    const categoryObj: any = {};
    let finalArray = [];

    copyData.forEach((val, parentIndex) => {
      const catArray = [];
      val = val.slice(0);
      val.forEach(function(element, index) {
        if (element.parent_category_id) {
          const obj = {};
          obj[element.catalogue_id] = element;
          if (categoryObj[element.parent_category_id]) {
            element['layout_type'] = copyData[parentIndex][0].layout_type;
            if (element.has_children) {
              categoryObj[element.catalogue_id] = element;
            }
            if (categoryObj[element.parent_category_id].child) {
              if (!element.is_dummy) {
                categoryObj[element.parent_category_id].child.push(element);
              }
            } else {
              if (!element.is_dummy) {
                const localArray = [];
                localArray.push(element);
                categoryObj[element.parent_category_id].child = localArray;
              }
            }
          }
        } else {
          if (!element.is_dummy) {
            categoryObj[element.catalogue_id] = element;
            catArray.push(element);
          }
        }
      });
      if (catArray.length) {
        finalArray = catArray;
      }
    });

    this.categoryList = finalArray;
    this.loopData = finalArray;
    this.service.categoryList.next(JSON.parse(JSON.stringify(this.loopData)));
    this.allCategoryData = JSON.parse(JSON.stringify(categoryObj));
    this.goToCategory();
  }

  getColourRed(rating) {
    if (rating === 1) {
      return true;
    } else {
      return false;
    }
  }

  getColourGreen(rating) {
    if (rating > 4) {
      return true;
    } else {
      return false;
    }
  }

  getColourYellow(rating) {
    if (rating > 1 && rating < 4) {
      return true;
    } else {
      return false;
    }
  }

  goToCategory() {
    const previousCategory: any = this.sessionService.get('category');

    if (this.categoryId) {
      this.backToParent(this.categoryId);
    } else {
      this.selectParentData(0);
    }
  }

  selectParentData(index) {
    this.loopData = this.categoryList;
    this.service.categoryList.next(JSON.parse(JSON.stringify(this.loopData)));
    this.currentCategory = this.formSettings ? this.formSettings.form_name : '';
  }
  backToParent(id) {
    const categoryChildData = JSON.parse(
      JSON.stringify(this.allCategoryData[id])
    );
    this.currentCategory = categoryChildData.layout_data.lines[0].data;

    if (!categoryChildData.parent_category_id) {
      const parentIndex = this.allCategoryData[id].parent_index;
      const currentCatgoryData: any = {
        name: this.currentCategory,
        id: id,
        index: parentIndex,
        parent: true
      };
      this.sessionService.set('category', currentCatgoryData);
    }
    this.loopData = categoryChildData.child;
    this.service.categoryList.next(JSON.parse(JSON.stringify(this.loopData)));
  }

  updateSearchProducts(data: any) {
    this.productList = data.data;
    this.searchOn = data.search;
    // -------------- data handing for element product list --------------//
    const dataObj: IProdultListPageData = {
      productList: this.productList,
      currentCategoryName: this.currentCategoryName,
      searchProducts: this.searchOn,
      cardInfo: this.cardInfo,
      paginating: this.paginating,
      hasImages: this.product_has_images,
      layout_type: this.product_layout_type,
      isRestaurantActive:
        this.restaurantInfo.available || this.restaurantInfo.scheduled_task
    };

    this.service.productList.next(JSON.parse(JSON.stringify(dataObj)));
    // -------------- data handing for element product list --------------//
  }

  updateProductStatus(data, pgOff) {
    const productListView = document.querySelector('.cls-p-cnt-div') as HTMLElement;
    const productGridView = document.querySelector('.home-fluid-thumbnail-grid-item') as HTMLElement;
    const bannerWrapper = document.querySelector('#banner-parent') as HTMLElement;
    const clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const noProductDiv = document.querySelector('.no-prod-text') as HTMLElement;
    if((clientWidth > 768) && (bannerWrapper && bannerWrapper.getBoundingClientRect().top <= 40)){
      productGridView ? productGridView.scrollIntoView({behavior: "smooth", block: "end"}) : '';
      productListView ? productListView.scrollIntoView({behavior: "smooth", block: "end"}) : '';
      noProductDiv ? noProductDiv.scrollIntoView({behavior: "smooth", block: "end"}) : '';
      //   $('body').animate({
      //     scrollTop: '65px'
      //     }, 200);
    }else{
      const OldBanner = document.getElementsByClassName('bannerDiv-old-ui');
      if(OldBanner && OldBanner.length && pgOff == 0){
        OldBanner[0].scrollIntoView({behavior: "smooth", block: "end"});
      }
    }
    if (!this.searchOn) {
      if (!pgOff) {
        pgOff = 0;
      }
      // this.loader.show();
      this.categoryForPagination = data;
      this.showloader = true;
      this.currentCategoryName = data.name;
      this.productShimmer = true;
      // if (this.formSettings.nlevel_enabled === 1) {
      //  this.parentCategoryId = this.sessionService.getString('catIdChild');
      // } else {
      //  this.parentCategoryId = data.catalogue_id;
      // }

      this.parentCategoryId = data.catalogue_id;
      this.manageBreadCrumb(data);

      const payload = {
        parent_category_id:
          this.formSettings.nlevel_enabled === 1
            ? this.sessionService.getString('catIdChild').toString()
            : data.catalogue_id,
        page_no: Math.floor(pgOff / 25) + 1,
        offset: pgOff,
        limit: 25
      };
      this.getProducts(payload);
    }
  }

  showMerchantReviews() {
    this.router.navigate(['store-review', this.appConfig.marketplace_user_id]);
  }
  addMerchantReviews() {
    if (!this.sessionService.get('appData')) {
      $('#loginDialog').modal('show');
    } else {
      this.messageService.getLoginSignupLocation('From Rate and Review');
      this.router.navigate([
        'store-review',
        this.appConfig.marketplace_user_id
      ]);
    }
  }
  getAppCatalogue() {
    const obj: any = {
      marketplace_reference_id: this.formSettings.marketplace_reference_id,
      marketplace_user_id: this.formSettings.marketplace_user_id,
      user_id: +this.user_id,
    };
    if (this.sessionService.get('appData')) {
      obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }

    if (
      this.formSettings.is_business_category_enabled === 1 &&
      this.restaurantInfo &&
      this.restaurantInfo.business_catalog_mapping_enabled === 1 &&
      this.sessionService.getString('bId') &&
      this.sessionService.getString('bId') !== '0'
    ) {
      obj['business_category_id'] = this.sessionService.getString('bId');
    }

    if (this.isPreorderTimeRequired) {
      obj.date_time = this.preOrderDatetime || new Date().toISOString();
      // obj.is_scheduled = 1;
    } else {
      obj.date_time = new Date().toISOString();
    }

    if (this.current_category_depth <= this.category_depth_limit) {
      obj.show_all_sub_categories = 1;
    }

    if (this.n_level_parent_category_id) {
      obj['parent_category_id'] = this.n_level_parent_category_id;
    }

    // if (this.route.snapshot.queryParams['pordCat']) {
    //   obj['parent_category_id'] = Number(this.route.snapshot.queryParams['pordCat']);
    // }
    this.service.getAllCategory(obj).subscribe(
      response => {
        if (response.status === 200) {
          this.cartShimmer = false;
          this.productShimmer = false;
          this.data.category = response.data.result;
          if (response.data.max_depth) {
            this.current_category_depth = response.data.max_depth;
            // this.all_category_depth = response.data.max_depth;
          }
          this.updateData(this.data);
          this.categoryShimmer = false;
          if (response.data.result.length) {
            this.sessionService.setByKey(
              'app',
              'category',
              response.data.result
            );
          } else {
            this.pageoffset = 0;
            this.pagelimit = this.pageoffset + 25;
            let parent_cat_id =  this.route.snapshot.queryParams['pordCat'] ? Number(this.route.snapshot.queryParams['pordCat']) : '';

            this.getProducts({
              page_no: Math.floor(this.pageoffset / 25) + 1,
              offset: this.pageoffset,
              limit: 25,
              parent_category_id: parent_cat_id
            });
          }
          this.loader.hide();
        } else {
          this.categoryShimmer = false;
          this.cartShimmer = false;
          this.popUpService.showPopup(MessageType.ERROR, 2000, response.message, false);
          this.loader.hide();
        }
      },
      error => {
        this.categoryShimmer = false;
        this.cartShimmer = false;
        this.popUpService.showPopup(MessageType.ERROR, 2000, error.message, false);
        this.loader.hide();
      }
    );
  }
  onScroll(ev) {
    if (!this.searchOn) {
      this.pageoffset = this.pagelimit;
      if (this.productCount > this.pageoffset) {
        // this.updateProductStatus(this.categoryForPagination, this.pageoffset);
        if (!this.pageoffset) {
          this.pageoffset = 0;
        }
        this.pagelimit = this.pageoffset + 25;
        this.paginating = true;
        this.showloader = true;
        if (this.categoryForPagination) {
          this.categoryForPagination = this.categoryForPagination;
          this.currentCategoryName = this.categoryForPagination.name;
          this.parentCategoryId = this.categoryForPagination.catalogue_id;
        }
        const payload = {
          page_no: Math.floor(this.pageoffset / 25) + 1,
          offset: this.pageoffset,
          limit: 25
        };
        if (this.categoryForPagination) {
          payload['parent_category_id'] =
            this.formSettings.nlevel_enabled === 1
              ? this.sessionService.getString('catIdChild').toString()
              : this.categoryForPagination.catalogue_id;
        }
        this.getProducts(payload);
      }
    }
  }

  getProducts(data) {
    data.marketplace_reference_id = this.formSettings.marketplace_reference_id;
    data.marketplace_user_id = this.formSettings.marketplace_user_id;
    data.user_id = this.user_id;
    if (this.sessionService.get('appData')) {
      data['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      data['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    if (this.onlyVegCheck && this.formSettings.enable_veg_non_veg_filter) {
      data['is_veg'] = 1;
    }
    if (this.isPreorderTimeRequired) {
      data.date_time = this.preOrderDatetime || new Date().toISOString();
      // data.is_scheduled = 1;
    } else {
      data.date_time = new Date().toISOString();
    }
    this.service.getProduct(data).subscribe(
      response => {
        if(response.data && response.data.length > 0){
          this.catalogueList=true;
        }
        else{
          this.catalogueList=false;
        }

        this.cd.detectChanges();
        if (response.metaInfo) {
          if (response.metaInfo.total_count !== -1) {
            this.productCount = response.metaInfo.total_count;
          }
        }
        if (this.restaurantInfo && this.restaurantInfo.business_type === 2) {
          for (let i = 0; i < response.data.length; i++) {
            response.data[i].inventory_enabled = 0;
          }
        }
        for (let i = 0; i < response.data.length; i++) {
          response.data[
            i
          ].long_description = this.service.convertStringToBreakHTML(
            response.data[i].long_description
          );

          if(response.data[i].layout_data.lines &&
            response.data[i].layout_data.lines[1] &&
            response.data[i].layout_data.lines[1].data ){
              response.data[i].layout_data.lines[1].data = this.service.convertStringToBreakHTML(response.data[i].layout_data.lines[1].data);
          }
          if (
            response.data[i].thumb_list &&
            (!response.data[i].thumb_list['400x400'] ||
              response.data[i].thumb_list['400x400'] === '')
          ) {
            response.data[i].thumb_list = null;
          } else if (!response.data[i].thumb_list) {
            response.data[i].thumb_list = null;
          }
        }
        this.checkCartData = this.cartService.getCartData();
        this.data.product = response;
        this.updateData(this.data);
        if (response.status === 200) {
          let productData = this.sessionService.getByKey('app', 'product');

          if (productData) {
            productData[data.parent_category_id] = response.data;
          } else {
            productData = {};
            productData[data.parent_category_id] = response.data;
          }
          this.sessionService.setByKey('app', 'product', productData);
        } else {
          this.popUpService.showPopup(MessageType.ERROR, 2000, response.message, false);
        }
        this.loader.hide();
        this.productShimmer = false;
        this.cartShimmer = false;
        this.paginating = false;
      },
      error => {
        this.loader.hide();
        this.popUpService.showPopup(MessageType.ERROR, 2000, error.message, false);
        this.showloader = false;
      }
    );
  }
  updateData(data) {
    const clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const oldBannerUi = document.getElementsByClassName('bannerDiv-old-ui')
    if(clientWidth < 768 && oldBannerUi && oldBannerUi.length && this.pageoffset == 0){
      oldBannerUi[0].scrollIntoView({behavior: "smooth", block: "end"});
    }
    if (data.category.length && !this.dataBool) {
      const categoryList = JSON.parse(JSON.stringify(data.category));
      if (!categoryList.length) {
        this.showloader = false;
        return false;
      }
      if(!this.route.snapshot.queryParams['prodname'])
        this.prodname = false;
      // this.getSubChildData(this.categoryList);
      this.categoryList = categoryList;
      this.loopData = categoryList;
      this.service.categoryList.next(JSON.parse(JSON.stringify(this.loopData)));

      const categoryObj = {};
      categoryList.forEach(cat => {
        categoryObj[cat.catalogue_id] = cat;
      });

      this.allCategoryData = JSON.parse(JSON.stringify(categoryObj));
      // this.goToCategory();

      if (
        !this.productbool &&
        this.current_category_depth <= this.category_depth_limit
      ) {
        let newData = data.category[0];
        this.manageBreadCrumb(newData);
        setTimeout(() => {
          if (newData.has_products) {
            this.getProductsOfCategoryChange(newData);
          } else {
            if (newData.sub_categories[0]) {
              newData = newData.sub_categories[0];
            }
            this.manageBreadCrumb(newData);
            this.getProductsOfCategoryChange(newData);
          }
        }, 100);
      }
      this.dataBool = true;
    }
    if (data.product) {
      if (this.productList[0] === undefined) {
        this.productList = [];
        this.oldProductList = this.productList;
      }
      if (this.preOnlyVegCheck !== this.onlyVegCheck) {
        this.productList = [];
        this.preOnlyVegCheck = this.onlyVegCheck;
      }
      if (this.prevCatId === undefined) {
        if (this.parentCategoryId) {
          this.productList = [];
          this.prevCatId = this.parentCategoryId;
        }
        if (data.product.data) {
          this.productList = this.productList.concat(data.product.data);
        }
        this.oldProductList = this.productList;
        this.count = 0;
        this.showloader = false;
      } else {
        if (this.parentCategoryId !== this.prevCatId) {
          // this.count = 1;
          $('.product-app').scrollTop(0);
          this.productList = [];
          if (data.product.data) {
            this.productList = this.productList.concat(data.product.data);
          }
          this.oldProductList = this.productList;
          this.pageoffset = 0;
          this.pagelimit = 25;
          this.prevCatId = this.parentCategoryId;
        } else {
          // if(this.count == 1){
          if (this.productList.length && data.product.data.length) {
            if (
              !(
                this.productList[this.productList.length - 1].product_id ===
                data.product.data[data.product.data.length - 1].product_id
              )
            ) {
              if (data.product.data) {
                this.productList = this.productList.concat(data.product.data);
              }
              this.oldProductList = this.productList;
              this.count = 0;
            }
          } else {
            if (data.product.data) {
              this.productList = this.productList.concat(data.product.data);
            }
            this.oldProductList = this.productList;
            this.count = 0;
          }
          this.showloader = false;
          // }
          // else{
          if (this.productList.length) {
            if (
              this.productList[this.productList.length - 1]
                .parent_category_id !== this.parentCategoryId
            ) {
              this.productList = [];
              this.oldProductList = this.productList;
              $('.product-app').scrollTop(0);
            }
          }
          //  this.count++;
          // }
        }
      }

      if (data.product.metaInfo) {
        if (data.product.metaInfo.total_count !== -1) {
          this.productCount = data.product.metaInfo.total_count;
          this.product_has_images = data.product.metaInfo.show_images;
        }
      }
      if (this.productList.length || this.dataBool) {
        this.productbool = true;
        this.showNoProduct = true;
      } else {
        this.showNoProduct = false;
        if (
          this.restaurantInfo &&
          this.restaurantInfo.is_menu_enabled &&
          this.appConfig.is_menu_enabled
        ) {
          try {
            this.cartService.cartClearCall();
          } catch (e) {}
        }
      }

      this.catHead = this.currentCategoryName;

    }

   

    // -------------- data handing for element product list --------------//
    this.paginating=false;
    const dataObj: IProdultListPageData = {
      productList: this.productList,
      currentCategoryName: this.currentCategoryName,
      searchProducts: this.searchOn,
      cardInfo: this.cardInfo,
      paginating: this.paginating,
      hasImages: this.product_has_images,
      layout_type: this.product_layout_type,
      isRestaurantActive: this.restaurantInfo
        ? this.restaurantInfo.available || this.restaurantInfo.scheduled_task
        : false
    };

    this.service.productList.next(JSON.parse(JSON.stringify(dataObj)));
    // -------------- data handing for element product list --------------//
  }
  /**
   * get product hit on category change
   * @param data
   */
  getProductsOfCategoryChange(data: any) {
    this.pageoffset = 0;
    this.pagelimit = 25;
    this.categoryForPagination = data;
    this.updateProductStatus(data, this.pageoffset);
  }

  sendMessage(lat, lng, city): void {
    // send message to subscribers via observable subject
    // this.sessionService.setString('location', {lat: lat, lng: lng, city: city});
    this.messageService.sendMessage(lat, lng, city, '');
  }

  onVegOnlyCheckChange(event) {
    const payload = {
      parent_category_id: this.parentCategoryId || '',
      page_no: 1,
      offset: 0,
      limit: 25
    };
    // tslint:disable-next-line:triple-equals
    if (this.searchOn == 1) {
      this.search();
    } else {
      this.getProducts(payload);
    }
  }
  navigateToList(){
    this.resturantOff = false;
    this.router.navigate(['list']);
  }
  clearSearch() {
    this.searchText = '';
    this.form.get('searchControl').setValue('');
    this.searchOn = 0;
    this.productList = this.oldProductList;

    // -------------- data handing for element product list --------------//
    const dataObj: IProdultListPageData = {
      productList: this.productList,
      currentCategoryName: this.currentCategoryName,
      searchProducts: this.searchOn,
      cardInfo: this.cardInfo,
      paginating: this.paginating,
      hasImages: this.product_has_images,
      layout_type: this.product_layout_type,
      isRestaurantActive:
        this.restaurantInfo.available || this.restaurantInfo.scheduled_task
    };

    this.service.productList.next(JSON.parse(JSON.stringify(dataObj)));
    // -------------- data handing for element product list --------------//
  }
  scrollInit(event) {

    const offset = event.target.scrollHeight;
    const height = event.target.scrollTop;

    if ((event.target.scrollTop + event.target.clientHeight) / event.target.scrollHeight >= 0.75) {
      this.onScroll(0);
    }
  }

  showPreorderTimeSelectionModal() {
    this.showPreorderTimeSelection = true;
  }

  onClosePreorder() {
    this.showPreorderTimeSelection = false;
  }

  onPreorderDateTime(event) {
    this.hideClosePreorder = false;
    this.preOrderDatetime = event.datetime;
    this.resetListing();
    this.loader.show();
    this.getAppCatalogue();
    this.showPreorderTimeSelection = false;
  }

  private resetListing() {
    this.dataBool = false;
    this.productbool = false;
    this.productList = [];
    this.data = {
      category: [],
      product: []
    };
    this.oldProductList = [];
    this.clearSearch();
    try {
      this.cartService.cartClearCall();
    } catch (e) {}

    // -------------- data handing for element product list --------------//
    const dataObj: IProdultListPageData = {
      productList: this.productList,
      currentCategoryName: this.currentCategoryName,
      searchProducts: this.searchOn,
      cardInfo: this.cardInfo,
      paginating: this.paginating,
      hasImages: this.product_has_images,
      layout_type: this.product_layout_type,
      isRestaurantActive:
        this.restaurantInfo.available || this.restaurantInfo.scheduled_task
    };

    this.service.productList.next(JSON.parse(JSON.stringify(dataObj)));
    // -------------- data handing for element product list --------------//
  }

  instantOrder() {
    this.preOrderDatetime = null;
    this.sessionService.remove('preOrderTime');
    this.resetListing();
    this.loader.show();
    this.getAppCatalogue();
  }

  askLocation() {
    this.showAskLocationPopup = true;
  }

  hideAskLocation() {
    this.showAskLocationPopup = false;
  }

  fetchLocation() {
    this.showFetchLocationPopup = true;
  }

  hideFetchLocation() {
    this.showFetchLocationPopup = false;
    this.showNotDiliverable = true;
  }

  askToFetchLocation() {
    this.hideAskLocation();
    this.fetchLocation();
  }

  locationFetched() {
    this.messageService.onLocationChange.next(true);
    this.showFetchLocationPopup = false;
    this.appService.notDelivered(this.showNotDiliverable)
    this.loader.show();
    const obj = {
      marketplace_reference_id: this.formSettings.marketplace_reference_id,
      marketplace_user_id: this.formSettings.marketplace_user_id,
      latitude: this.sessionService.get('location').lat,
      longitude: this.sessionService.get('location').lng,
      user_id: this.user_id,
    };
    if (this.sessionService.get('appData')) {
      obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    this.restaurantService.getSingleRestaturant(obj).subscribe(
      (response: any) => {
        this.loader.hide();
        const deliveryMethod = Number(
          this.sessionService.getString('deliveryMethod')
        );
        if (
          response.status === 200 &&
          response.data &&
          response.data[0] &&
          !response.data[0].can_serve &&
          deliveryMethod == 1
        ) {
          this.showNotDiliverable = true;
          this.appService.notDelivered(this.showNotDiliverable)
        }else{
          this.showNotDiliverable = false;
          this.appService.notDelivered(this.showNotDiliverable)
        }
      },
      error => {
        console.error(error);
        this.loader.hide();
      }
    );
  }

  ngOnDestroy() {
    this.sessionService.resetTitle();
    if (!this.sessionService.isPlatformServer()) {
      clearInterval(this.interval);
    }
    this.alive = false;
  }
  // calculateDateTime(){
  //   let currDateTime = new Date().toISOString();
  //   let dateArr = currDateTime.split('.')[0].split(':');
  //   currDateTime = dateArr[0]+':'+dateArr[1]+':00';

  // }

  /**
   * select category from n level data
   */
  selectCategoryFromNLevel(data: NLevelCategoryData) {
    this.n_level_parent_category_id = data.catalogue_id;
    this.current_category_depth = data.depth - 1;
    this.productbool = false;
    this.dataBool = false;
    this.categoryShimmer = true;
    this.productList = [];
    this.pageoffset = 0;
    this.pagelimit = this.pageoffset + 25;

    // -------------- data handing for element product list --------------//
    const dataObj: IProdultListPageData = {
      productList: this.productList,
      currentCategoryName: this.currentCategoryName,
      searchProducts: this.searchOn,
      cardInfo: this.cardInfo,
      paginating: this.paginating,
      hasImages: this.product_has_images,
      layout_type: this.product_layout_type,
      isRestaurantActive:
        this.restaurantInfo.available || this.restaurantInfo.scheduled_task
    };

    this.service.productList.next(JSON.parse(JSON.stringify(dataObj)));
    // -------------- data handing for element product list --------------//

    this.data.product = [];
    if (data.has_products) {
      this.current_category_depth = 1;
      this.productShimmer = true;
      this.categoryShimmer = false;
      this.data.category = [];
      this.updateProductStatus(data, 0);
    } else {
      if (this.current_category_depth <= this.category_depth_limit) {
        this.productShimmer = true;
      }
      if (data.catalogue_id) {
        this.manageBreadCrumb(data);
      }
      this.getAppCatalogue();
    }
  }

  /**
   * manage breadcrumb data
   */
  manageBreadCrumb(data) {
    this.categoryPathData = data;
    this.service.categoryData.next(data);
  }

  /**
   * category cahnge event
   * for side layout when depth <limit
   */

  changeCategory(event) {
    if (event.parent_data) {
      this.manageBreadCrumb(event.parent_data);
    }
    setTimeout(() => {
      this.updateProductStatus(event.data, 0);
    }, 100);
  }

  /**
   * change location
   */
  changeLocation(event) {
    this.showNotDiliverable = false;
    this.showFetchLocationPopup = true;
  }

  private scrollHandler() {
    this.scrollEvent
      .pipe(
        debounceTime(100),
        distinctUntilChanged()
      )
      .subscribe(height => {
        this.onScroll(0);
      });
  }
  getMerchantBanner() {
    if (
      this.restaurantInfo.is_banners_enabled_merchant &&
      this.restaurantInfo.banner_images &&
      this.restaurantInfo.banner_images.length > 0
    ) {
      this.showMultipleBanners = true;
      this.newList = this.restaurantInfo.banner_images;
      if (!this.sessionService.isPlatformServer() && this.newList && this.newList.length) {
        this.interval = setInterval(function () {
          const profileDropOpen = document.getElementsByClassName('open');
          let openDrop = (profileDropOpen && profileDropOpen[0]) ? true :false;
          const profileDrop = document.querySelector('.profileDrop') as HTMLElement ;
          if(document.getElementById('click-event')){
            document.getElementById('click-event').click();
          }
          if(openDrop){
            profileDrop.click();
          }
        }, 5000);
      }
    } else {
      this.originalBannerImage = this.restaurantInfo.banner_image;
      if (!this.isPlatformServer && this.restaurantInfo.thumb_list) {
        const isMobile = !window.matchMedia("screen and (min-width:480px)").matches;
        if (isMobile) {
          let imgageObj = JSON.parse(this.restaurantInfo.thumb_list);
          if (imgageObj && imgageObj['400x400']) {
            this.zone.run(() => {
              this.restaurantInfo.banner_image = this.restaurantInfo.mobile_banner_image || imgageObj['400x400'];
            });
          }
        }
      }
      if(!this.restaurantInfo.banner_image && this.formSettings.webapp_logo){
        this.restaurantInfo.banner_image = this.formSettings.webapp_logo;
        this.originalBannerImage = this.formSettings.webapp_logo;
      }
      this.bannerImage = this.restaurantInfo.banner_image;
      this.showMultipleBanners = false;
    }
  }

  redirectToCustomOrder() {
    if (
      this.sessionService.get('appData') &&
      parseInt(this.sessionService.getString('reg_status')) === 1
    ) {
      this.googleAnalyticsEventsService.emitEvent(
        GoogleAnalyticsEvent.go_to_checkout,
        'Custom order checkout',
        '',
        ''
      );
      this.messageService.noProductCustomOrder.next('no-product');
      this.setNoProductStoreValue();
      this.router.navigate(['customCheckout']);
      // tslint:disable-next-line:radix
    } else if (
      this.sessionService.get('appData') &&
      parseInt(this.sessionService.getString('reg_status')) !== 1 &&
      !this.sessionService.get('appData').signup_template_data.length
    ) {
      this.googleAnalyticsEventsService.emitEvent(
        GoogleAnalyticsEvent.go_to_checkout,
        'Custom order checkout',
        '',
        ''
      );
      this.messageService.noProductCustomOrder.next('no-product');
      this.setNoProductStoreValue();
      this.router.navigate(['customCheckout']);
    } else {
      this.messageService.getLoginSignupLocation('From Checkout Button');
      $('#loginDialog').modal('show');
    }
  }

  setNoProductStoreValue() {
    let storeData: any = this.sessionService.get('stores')[0];
    let obj = {
      address: storeData.address || '',
      name: storeData.store_name || '',
      email: storeData.email || '',
      phone: storeData.phone || '',
      lat: storeData.latitude || '',
      lng: storeData.longitude || '',
      display_merchant_phone: this.formSettings.display_merchant_phone || 0,
      display_merchant_address: this.formSettings.display_merchant_address || 0
    };
    this.sessionService.setString('noProductStoreData', obj);
    this.sessionService.setString(
      'user_id',
      this.formSettings.marketplace_user_id
    );
  }
  moveToCustomOrder(){
    // tslint:disable-next-line:radix
    if(this.sessionService.get('noProductStoreData')) {
      this.sessionService.remove('noProductStoreData');
    }
    if (this.sessionService.get('appData') && parseInt(this.sessionService.getString('reg_status')) === 1) {
      this.toggle.emit();
      this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.go_to_checkout, 'Custom order checkout', '', '');
      this.router.navigate(['customCheckout'],{queryParams: {customFlow:true}});
      // tslint:disable-next-line:radix
    } else if (this.sessionService.get('appData') && parseInt(this.sessionService.getString('reg_status')) !== 1 &&
      !this.sessionService.get('appData').signup_template_data.length) {
      this.toggle.emit();
      this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.go_to_checkout, 'Custom order checkout', '', '');
      this.router.navigate(['customCheckout'],{queryParams: {customFlow:true}});
    } else {
      this.messageService.getLoginSignupLocation('From Checkout Button');
      $('#loginDialog').modal('show');
    }
  }
  //get products of banner
  getProductsOfBanners(bannerId,hasMapped){
    if(!hasMapped){
      return;
    }
    const obj: any = {
      marketplace_user_id: this.formSettings.marketplace_user_id,
      search_text: this.searchText,
      user_id: this.sessionService.getString('user_id'),
      banner_id:bannerId
    };
    if (this.sessionService.get('appData')) {
      obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }


    this.service.getProduct(obj).subscribe(response => {
      if (response.status === 200) {
        this.searchOn = 1;
        // this.oldProductList = this.productList;
        this.hideCategory = true;
        this.productList = response.data;
        for (let i = 0; i < this.productList.length; i++) {
          this.productList[
            i
          ].long_description = this.service.convertStringToBreakHTML(
            this.productList[i].long_description
          );
          if(this.productList[i].layout_data.lines &&
            this.productList[i].layout_data.lines[1] &&
            this.productList[i].layout_data.lines[1].data ){
              this.productList[i].layout_data.lines[1].data = this.service.convertStringToBreakHTML(this.productList[i].layout_data.lines[1].data);
          }
          if (
            this.productList[i].thumb_list &&
            (!this.productList[i].thumb_list['400x400'] ||
              this.productList[i].thumb_list['400x400'] === '')
          ) {
            this.productList[i].thumb_list = null;
          } else if (!this.productList[i].thumb_list) {
            this.productList[i].thumb_list = null;
          }
        }

        // -------------- data handing for element product list --------------//
        const dataObj: IProdultListPageData = {
          productList: this.productList,
          currentCategoryName: this.currentCategoryName,
          searchProducts: this.searchOn,
          cardInfo: this.cardInfo,
          paginating: this.paginating,
          hasImages: this.product_has_images,
          layout_type: this.product_layout_type,
          isRestaurantActive:
            this.restaurantInfo.available || this.restaurantInfo.scheduled_task
        };

        this.service.productList.next(JSON.parse(JSON.stringify(dataObj)));
        this.productShimmer = false;
        // -------------- data handing for element product list-------------//

        this.checkCartData = this.cartService.getCartData();

      }
    });
  }
}
