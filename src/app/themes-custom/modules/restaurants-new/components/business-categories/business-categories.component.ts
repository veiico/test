import { Component, OnInit, ViewChild, ViewContainerRef, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BusinessCategoriesComponent } from '../../../../../components/restaurants-new/components/business-categories/business-categories.component';
import { BusinessCategoriesService } from '../../../../../components/restaurants-new/components/business-categories/business-categories.service';
import { GoogleAnalyticsEventsService } from '../../../../../services/google-analytics-events.service';
import { MessageService } from '../../../../../services/message.service';
import { SessionService } from '../../../../../services/session.service';
import { DynamicCompilerService } from '../../../../../services/dynamic-compiler.service';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CarouselModule } from 'primeng/carousel';
import { templates } from '../../../../../themes-custom/constants/template.constant';
import { IDynamicCompilerData } from '../../../../../interfaces/interfaces';
import { RestaurantsService } from '../../../../../components/restaurants-new/restaurants-new.service';
declare var $: any;

@Component({
  template: '<ng-container #businessCategoryContainer></ng-container>'
})
export class DynamicBusinessCategoriesComponent extends BusinessCategoriesComponent implements OnInit {

  @ViewChild('businessCategoryContainer', { read: ViewContainerRef }) businessCategoryContainer: ViewContainerRef;
  @Output() hideCategoryPage: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    public businessCategoriesService: BusinessCategoriesService,
    public sessionService: SessionService,
    public messageService: MessageService,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
    public router: Router,
    public dynamicCompilerService: DynamicCompilerService,
    public restaurantService: RestaurantsService,
    public route: ActivatedRoute
  ) {
    super(businessCategoriesService, sessionService, messageService, googleAnalyticsEventsService, router, restaurantService, route);
  }

  ngOnInit() {
    setTimeout(() => {
      this.createDynamicTemplate();
    }, 100);
  }

  parentInit(){
    super.ngOnInit();
  }


  createDynamicTemplate() {

    /**
     * reference services in const variable to access
     * without passing in constructor of child component
     */

    const businessCategoriesService = this.businessCategoriesService;
    const sessionService = this.sessionService;
    const googleAnalyticsEventsService = this.googleAnalyticsEventsService;
    const messageService = this.messageService;
    const router = this.router;
    const dynamicCompilerService = this.dynamicCompilerService;
    const restaurantService = this.restaurantService;
    const route = this.route;

    /**
     * create child class for new component
     */
    class DynamicBusinessCategoriesComponentTemp extends DynamicBusinessCategoriesComponent {
      constructor() {
        super(businessCategoriesService, sessionService, messageService, googleAnalyticsEventsService, router,dynamicCompilerService, restaurantService, route);
      }
      ngOnInit() {
       this.parentInit();
      }
    }


    /**
     * start creating dynamic component
     */

    const template = (this.sessionService.get('templates').components && this.sessionService.get('templates').components.businessCategory) ? this.sessionService.get('templates').components.businessCategory.html : templates.businessCategory.html;
    const tmpCss = (this.sessionService.get('templates').components && this.sessionService.get('templates').components.businessCategory) ? this.sessionService.get('templates').components.businessCategory.css : templates.businessCategory.css;
    const importsArray = [
      CommonModule,
      TooltipModule,
      CarouselModule
    ];

    const inputData = {
      'hideCategoryPage': this.hideCategoryPage
    }

    const componentConfig: IDynamicCompilerData = {
      templateRef: this.businessCategoryContainer,
      template: template,
      css: tmpCss,
      imports: importsArray,
      rootClass: DynamicBusinessCategoriesComponentTemp,
      inputData : inputData
    };


    dynamicCompilerService.createComponentFactory(componentConfig);
  }
}
