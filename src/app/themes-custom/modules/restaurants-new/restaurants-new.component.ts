import { IDynamicCompilerData } from './../../../interfaces/interfaces';
import { DynamicCompilerService } from './../../../services/dynamic-compiler.service';
import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild, ViewContainerRef, Injector, Inject, PLATFORM_ID } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart, NavigationEnd } from '@angular/router';
import { takeWhile } from 'rxjs/operators';

import { RestaurantsNewComponent } from '../../../components/restaurants-new/restaurants-new.component';
import { SessionService } from '../../../services/session.service';
import { PopUpService } from '../../../modules/popup/services/popup.service';
import { AppService } from '../../../app.service';
import { MessageService } from '../../../services/message.service';
import { AppCartService } from '../../../components/catalogue/components/app-cart/app-cart.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { templates } from '../../constants/template.constant';
import { DynamicRestaurantsComponent } from './components/restaurants/restaurants.component';
import { DynamicListViewComponent } from './components/list-view/list-view.component';
import { DynamicRestaurantTagsComponent } from './components/restaurant-tags/restaurant-tags.component';
import { DynamicCustomOrderComponent } from './components/custom-order/custom-order.component';
import { DynamicProductOnlyComponent } from '../app-product-only/app-product.component';
declare var require: any;

@Component({
  selector: 'app-restaurants-new-dynamic',
  template: '<ng-container #templateRef></ng-container>'
})
export class DynamicRestaurantsNewComponent extends RestaurantsNewComponent implements OnInit, AfterViewInit, OnDestroy {


  @ViewChild('templateRef', { read: ViewContainerRef }) templateRef: ViewContainerRef;
  platformId: Object;
  constructor(public sessionService: SessionService,
    public route: ActivatedRoute,
    public popup: PopUpService,
    public appService: AppService,
    public messageService: MessageService,
    public cartService: AppCartService,
    public router: Router,
    public dynamicCompilerService: DynamicCompilerService, private injector: Injector, @Inject(PLATFORM_ID) _platformId: Object) {
    super(sessionService, route, popup, appService, messageService, cartService, router)
    this.platformId = _platformId;
  }


  ngOnInit() {
      this.createAngularElements();
      this.createDynamicTemplate();
  }
  createAngularElements() {
    const customElementTupleArray: [any, string][] = [
      [DynamicRestaurantsComponent, 'app-restaurants-dynamic'],
      [DynamicListViewComponent, 'app-list-view-dynamic'],
      [DynamicRestaurantTagsComponent, 'restaurant-tags-dynamic'],
      [DynamicCustomOrderComponent, 'app-custom-order-dynamic'],
      [DynamicProductOnlyComponent, 'app-product-only-dynamic']
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

  ngOnInit2() {
    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
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
    const popup = this.popup;
    const cartService = this.cartService;
    const injector = this.injector;
    const platformId = this.platformId;

    /**
     * create child class for new component
     */
    class DynamicRestaurantsNewComponentTemp extends DynamicRestaurantsNewComponent {
      constructor() {
        super(sessionService, route, popup, appService, messageService, cartService, router, dynamicCompilerService,injector,platformId)
      }
      ngOnInit() {
        super.ngOnInit2()
      }

      ngOnDestroy() {
        super.ngOnDestroy();
      }

    }


    /**
     * start creating dynamic component
     */
    
    const template = (this.sessionService.get('templates').pages['list'] && this.sessionService.get('templates').pages['list'].html) ? this.sessionService.get('templates').pages['list'].html : templates.merchantListingPage.html;
    const tmpCss = (this.sessionService.get('templates').pages['list'] && this.sessionService.get('templates').pages['list'].css) ? this.sessionService.get('templates').pages['list'].css : templates.merchantListingPage.css;
    const importsArray = [
      CommonModule
    ];


    const componentConfig: IDynamicCompilerData = {
      templateRef: this.templateRef,
      template: template,
      css: tmpCss,
      imports: importsArray,
      rootClass: DynamicRestaurantsNewComponentTemp
    };

    dynamicCompilerService.createComponentFactory(componentConfig);
  }

}
