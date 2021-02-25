import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AppService } from '../../../../../app.service';
import { AppCategoryComponent } from '../../../../../components/catalogue/components/app-category/app-category.component';
import { AppCategoryService } from '../../../../../components/catalogue/components/app-category/app-category.service';
import { GoogleAnalyticsEventsService } from '../../../../../services/google-analytics-events.service';
import { SessionService } from '../../../../../services/session.service';
import { CatalogueService } from '../../../../../components/catalogue/catalogue.service';
import { IDynamicCompilerData } from '../../../../../interfaces/interfaces';
import { takeWhile } from 'rxjs/operators';
import { DynamicCompilerService } from '../../../../../services/dynamic-compiler.service';
import { templates } from '../../../../../themes-custom/constants/template.constant';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-dynamic',
  template: '<ng-container #categoryTemplateRef></ng-container>'
})
export class DynamicAppCategoryComponent extends AppCategoryComponent implements OnInit {


  @Input('categoryData') categoryData;
  @Output() updateProduct: EventEmitter<any> = new EventEmitter<any>();
  @Output() showSearchProducts: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('categoryTemplateRef', { read: ViewContainerRef }) categoryTemplateRef: ViewContainerRef;
  alive = true;
  
  constructor(protected route: ActivatedRoute, protected router: Router, protected sessionService: SessionService,
    public appCategoryService: AppCategoryService, public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
    public appService: AppService, public catalogueService: CatalogueService, protected dynamicCompilerService: DynamicCompilerService) {
    super(route, router, sessionService, appCategoryService, googleAnalyticsEventsService, appService);
  }

  ngOnInit() {
    setTimeout(() => {
      this.createDynamicTemplate();
    }, 100);
  }

  parentInit() {
    super.ngOnInit();
  }

  createDynamicTemplate() {

    /**
     * reference services in const variable to access 
     * without passing in constructor of child component
     */

    const appService = this.appService;
    const sessionService = this.sessionService;
    const route = this.route;
    const router = this.router;
    const appCategoryService = this.appCategoryService;
    const googleAnalyticsEventsService = this.googleAnalyticsEventsService;
    const catalogueService = this.catalogueService;
    const dynamicCompilerService = this.dynamicCompilerService;




    /**
     * create child class for new component
     */
    class DynamicAppCategoryComponentTemp extends DynamicAppCategoryComponent {
      constructor() {
        super(route, router, sessionService, appCategoryService, googleAnalyticsEventsService, appService, catalogueService, dynamicCompilerService);
      }

      ngOnInit() {
        this.catalogueService.categoryList.pipe(takeWhile(_ => this.alive)).subscribe((response) => {
          this.categoryData = response;
        });
        super.parentInit();
      }

      ngOnDestroy() {
        this.alive = false;
        super.ngOnDestroy();
      }

    }


    /**
     * start creating dynamic component
     */


    const template = (this.sessionService.get('templates').components && this.sessionService.get('templates').components.category) ? this.sessionService.get('templates').components.category.html : templates.category.html;
    const tmpCss = (this.sessionService.get('templates').components && this.sessionService.get('templates').components.category) ? this.sessionService.get('templates').components.category.css : templates.category.css;

    const importsArray = [
      CommonModule
    ];

    const inputDataObject = {
      showSearchProducts: this.showSearchProducts,
      updateProduct: this.updateProduct,
      categoryData: this.categoryData
    };

    const componentConfig: IDynamicCompilerData = {
      templateRef: this.categoryTemplateRef,
      template: template,
      css: tmpCss,
      imports: importsArray,
      rootClass: DynamicAppCategoryComponentTemp,
      inputData: inputDataObject
    };

    dynamicCompilerService.createComponentFactory(componentConfig);
  }

}
