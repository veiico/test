import { MapsAPILoader } from '@agm/core';
import { AfterViewInit, Component, NgZone, OnDestroy, OnInit, ViewChild, ViewContainerRef, Renderer2, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../../../../../app.service';
import { AppCartService } from '../../../../../components/catalogue/components/app-cart/app-cart.service';
import { AppCategoryService } from '../../../../../components/catalogue/components/app-category/app-category.service';
import { FetchLocationService } from '../../../../../components/fetch-location/fetch-location.service';
import { RestaurantsService } from '../../../../../components/restaurants-new/restaurants-new.service';
import { PopUpService } from '../../../../../modules/popup/services/popup.service';
import { FBPixelService } from '../../../../../services/fb-pixel.service';
import { GoogleAnalyticsEventsService } from '../../../../../services/google-analytics-events.service';
import { LoaderService } from '../../../../../services/loader.service';
import { MessageService } from '../../../../../services/message.service';
import { SessionService } from '../../../../../services/session.service';
import { RestaurantsComponent } from '../../../../../components/restaurants-new/components/restaurants/restaurants.component';
import { templates } from '../../../../../themes-custom/constants/template.constant';
import { CommonModule } from '@angular/common';
import { IDynamicCompilerData } from '../../../../../interfaces/interfaces';
import { DynamicCompilerService } from '../../../../../services/dynamic-compiler.service';


@Component({
  selector: 'app-restaurants-dynamic',
  template: '<ng-container #restaurantContainer></ng-container>',
})
export class DynamicRestaurantsComponent extends RestaurantsComponent implements OnInit, OnDestroy, AfterViewInit {

  public config: any = {};
  public businessData:any;
  @ViewChild('restaurantContainer', { read: ViewContainerRef }) restaurantContainer: ViewContainerRef;

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
    public dynamicCompilerService: DynamicCompilerService,
    protected renderer: Renderer2,
    protected cd: ChangeDetectorRef) {
    super(service, messageService, loader, router, sessionService, cartService,
      mapsAPILoader, ngZone, googleAnalyticsEventsService, fetchLocationService,
      appService, categoryService, route, popup, fbPixelService,renderer,cd)
  }

  ngOnInit() {
   this.businessData="";
    this.createDynamicTemplate();
  }

  parentInit() {
    super.ngOnInit();
  }

  ngAfterViewInit() {
    super.ngAfterViewInit()
  }

  parentDestroy() {
    super.ngOnDestroy()
  }

  createDynamicTemplate() {

    /**
     * reference services in const variable to access 
     * without passing in constructor of child component
     */

    const service = this.service;
    const messageService = this.messageService;
    const loader = this.loader;
    const router = this.router;
    const sessionService = this.sessionService;
    const cartService = this.cartService;
    const mapsAPILoader = this.mapsAPILoader;
    const ngZone = this.ngZone;
    const googleAnalyticsEventsService = this.googleAnalyticsEventsService;
    const fetchLocationService = this.fetchLocationService;
    const appService = this.appService;
    const categoryService = this.categoryService;
    const route = this.route;
    const fbPixelService = this.fbPixelService;
    const popup = this.popup;
    const dynamicCompilerService = this.dynamicCompilerService;
    const renderer = this.renderer;
    const cd = this.cd;

    /**
     * create child class for new component
     */
    class DynamicRestaurantsComponentTemp extends DynamicRestaurantsComponent {
      constructor() {
        super(service, messageService, loader, router, sessionService, cartService,
          mapsAPILoader, ngZone, googleAnalyticsEventsService, fetchLocationService,
          appService, categoryService, route, popup, fbPixelService, dynamicCompilerService,renderer,cd);
        this.setConfig();
      }
      ngOnInit() {
        super.parentInit()
      }

      ngAfterViewInit() {
        super.ngAfterViewInit()
      }

      ngOnDestroy() {
        super.parentDestroy();
      }

    }


    /**
     * start creating dynamic component
     */

    const template = (this.sessionService.get('templates').components && this.sessionService.get('templates').components.merchantListSection) ? this.sessionService.get('templates').components.merchantListSection.html : templates.merchantListSection.html;
    const tmpCss = (this.sessionService.get('templates').components && this.sessionService.get('templates').components.merchantListSection) ? this.sessionService.get('templates').components.merchantListSection.css : templates.merchantListSection.css;
    const importsArray = [
      CommonModule
    ];
    const componentConfig: IDynamicCompilerData = {
      templateRef: this.restaurantContainer,
      template: template,
      css: tmpCss,
      imports: importsArray,
      rootClass: DynamicRestaurantsComponentTemp,
    };


    dynamicCompilerService.createComponentFactory(componentConfig);
  }

}
