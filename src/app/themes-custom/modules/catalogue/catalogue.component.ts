
import { MapsAPILoader } from '@agm/core';
import { AfterViewInit, Component, NgZone, OnDestroy, OnInit, Renderer2, ViewEncapsulation, ViewChild, ViewContainerRef, ChangeDetectorRef, Injector, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { slideUpDownDOM } from '../../../animations/slideUpDown.animation';
import { AppService } from '../../../app.service';
import { CatalogueService } from '../../../components/catalogue/catalogue.service';
import { AppCartService } from '../../../components/catalogue/components/app-cart/app-cart.service';
import { AppCategoryService } from '../../../components/catalogue/components/app-category/app-category.service';
import { RestaurantsService } from '../../../components/restaurants-new/restaurants-new.service';
import { PopUpService } from '../../../modules/popup/services/popup.service';
import { FBPixelService } from '../../../services/fb-pixel.service';
import { GeoLocationService } from '../../../services/geolocation.service';
import { GoogleAnalyticsEventsService } from '../../../services/google-analytics-events.service';
import { LoaderService } from '../../../services/loader.service';
import { MessageService } from '../../../services/message.service';
import { SessionService } from '../../../services/session.service';
import { CatalogueComponent } from '../../../components/catalogue/catalogue.component';
import { DynamicCompilerService } from '../../../services/dynamic-compiler.service';
import { IDynamicCompilerData } from '../../../interfaces/interfaces';
import { templates } from '../../constants/template.constant';
import { CommonModule, isPlatformBrowser } from '@angular/common'; 
import { StarRatingModule } from 'angular-star-rating';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { DynamicAppCartComponent } from './components/app-cart/app-cart.component';
import { DynamicAppCategoryComponent } from './components/app-category/app-category.component';
import { DynamicAppProductComponent } from './components/app-product/app-product.component';
import { DynamicStaticPagesComponent } from './components/static-pages/static-pages.component';
import { DynamicSubHeaderComponent } from './components/sub-header/sub-header.component';
import { DynamicMandatoryItemsComponent } from './components/mandatory-items/mandatory-items.component';
import { DynamicNotDiliverableComponent } from '../delivery-address/components/not-diliverable/not-diliverable.component';
import { ProductTemplateComponent } from '../../../components/product-template/components/product-template/product-template.component';
import { DynamicAskForDeliveryAddressComponent } from '../delivery-address/components/ask-for-delivery-address/ask-for-delivery-address.component';
import { DynamicFetchDeliveryAddressComponent } from '../delivery-address/components/fetch-delivery-address/fetch-delivery-address.component';


declare var $: any;
declare var require: any;

@Component({
  selector: 'app-catalogue',
  template: '<ng-container #catalogueTemplateRef></ng-container>'
})
export class DynamicCatalogueComponent extends CatalogueComponent implements OnInit, AfterViewInit, OnDestroy {
  platformId: Object;
  @ViewChild('catalogueTemplateRef', { read: ViewContainerRef }) catalogueTemplateRef: ViewContainerRef;

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
    protected cd: ChangeDetectorRef,
    protected dynamicCompilerService: DynamicCompilerService, private injector: Injector, @Inject(PLATFORM_ID) _platformId: Object
  ) {
    super(messageService, zone, sessionService, appCategoryService, router, service,
      route, mapsAPILoader, googleAnalyticsEventsService, loader, restaurantService,
      cartService, appService, renderer, popUpService, fbPixelService, geolocation, cd)
    this.platformId = _platformId;

  }

  async ngOnInit() {
    // super.ngOnInit();
    this.createAngularElements();
    this.createDynamicTemplate();
  }
  createAngularElements() {
    const customElementTupleArray: [any, string][] = [
      [DynamicAppCartComponent, 'app-cart-dynamic'],
      [DynamicAppCategoryComponent, 'app-category-dynamic'],
      [DynamicAppProductComponent, 'app-product-dynamic'],
      [DynamicStaticPagesComponent, 'app-static-pages-dynamic'],
      [DynamicSubHeaderComponent, 'app-sub-header-dynamic'],
      [DynamicMandatoryItemsComponent, 'app-mandatory-items-dynamic'],
      [DynamicNotDiliverableComponent, 'app-not-diliverable-dynamic'],
      [ProductTemplateComponent, 'app-product-template'],
      [DynamicAskForDeliveryAddressComponent, 'app-ask-for-delivery-address-dynamic'],
      [DynamicFetchDeliveryAddressComponent, 'app-fetch-delivery-address-dynamic']
    ];
    if (isPlatformBrowser(this.platformId)) {
      const { createCustomElement } = require('@angular/elements');
      for (const [component, selector] of customElementTupleArray) {
        const elemExist = customElements.get(selector)
        if (!elemExist) {
          const el = createCustomElement(component, { injector: this.injector });
          customElements.define(selector, el);
        }
      }
    }
  }

  ngAfterViewInit() {
    super.ngAfterViewInit()
  }

  async parentInit() {
    super.ngOnInit();
  }

  createDynamicTemplate() {

    /**
     * reference services in const variable to access
     * without passing in constructor of child component
     */

    const appService = this.appService;
    const sessionService = this.sessionService;
    const messageService = this.messageService;
    const router = this.router;
    const dynamicCompilerService = this.dynamicCompilerService;
    const route = this.route;
    const cartService = this.cartService;
    const zone = this.zone;
    const appCategoryService = this.appCategoryService;
    const service = this.service;
    const loader = this.loader;
    const mapsAPILoader = this.mapsAPILoader;
    const googleAnalyticsEventsService = this.googleAnalyticsEventsService;
    const restaurantService = this.restaurantService;
    const renderer = this.renderer;
    const popUpService = this.popUpService;
    const fbPixelService = this.fbPixelService;
    const geolocation = this.geolocation;
    const cd =this.cd;
    const injector = this.injector;
    const platformId = this.platformId;



    /**
     * create child class for new component
     */
    class DynamicCatalogueComponentTemp extends DynamicCatalogueComponent {
      constructor() {
        super(messageService, zone, sessionService, appCategoryService, router, service,
          route, mapsAPILoader, googleAnalyticsEventsService, loader, restaurantService,
          cartService, appService, renderer, popUpService, fbPixelService, geolocation, cd, dynamicCompilerService, injector, platformId)
      }

      async ngOnInit() {
        super.parentInit();
      }

      ngAfterViewInit() {
        super.ngAfterViewInit();
      }

      ngOnDestroy() {
        super.ngOnDestroy();
      }

    }


    /**
     * start creating dynamic component
     */

    const template = (this.sessionService.get('templates').pages['store'] && this.sessionService.get('templates').pages['store'].html) ? this.sessionService.get('templates').pages['store'].html : templates.store.html;
    const tmpCss = (this.sessionService.get('templates').pages['store'] && this.sessionService.get('templates').pages['store'].css) ? this.sessionService.get('templates').pages['store'].css : templates.store.css;
    const importsArray = [
      CommonModule,
      StarRatingModule,
      ReactiveFormsModule,
      FormsModule,
      MatCheckboxModule,
      DropdownModule,
      MultiSelectModule
    ];


    const componentConfig: IDynamicCompilerData = {
      templateRef: this.catalogueTemplateRef,
      template: template,
      css: tmpCss,
      imports: importsArray,
      rootClass: DynamicCatalogueComponentTemp,
      encapsulation: ViewEncapsulation.None,
      animations: [slideUpDownDOM]
    };

    dynamicCompilerService.createComponentFactory(componentConfig);
  }


}
