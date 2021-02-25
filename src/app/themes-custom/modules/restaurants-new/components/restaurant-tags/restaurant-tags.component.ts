import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { TooltipModule } from 'ngx-bootstrap';
import { CarouselModule } from 'primeng/carousel';

import { RestaurantTagsComponent } from '../../../../../components/restaurants-new/components/restaurant-tags/restaurant-tags.component';
import { IDynamicCompilerData } from '../../../../../interfaces/interfaces';
import { DynamicCompilerService } from '../../../../../services/dynamic-compiler.service';
import { SessionService } from '../../../../../services/session.service';
import { ThemeService } from '../../../../../services/theme.service';
import { templates } from '../../../../../themes-custom/constants/template.constant';


@Component({
  template: '<ng-container #businessCategoryContainer></ng-container>'
})
export class DynamicRestaurantTagsComponent extends RestaurantTagsComponent implements OnInit, OnDestroy {

  @ViewChild('businessCategoryContainer', { read: ViewContainerRef }) businessCategoryContainer: ViewContainerRef;
  @Input('previewOn') previewOn;
  @Input('item') item;
  public _data: any;
  get data() {
    return this._data;
  }
  @Input() set data(val: any) {
    if (val) {
      this._data = val;
      this.onPreview();
    }
  }


  constructor(protected themeService: ThemeService, protected el: ElementRef, protected dynamicCompilerService: DynamicCompilerService, protected sessionService: SessionService) {
    super(themeService, el,sessionService);
  }


  ngOnInit() {
    setTimeout(() => {
      this.createDynamicTemplate()
    }, 100);


  }

  createDynamicTemplate() {

    /**
     * reference services in const variable to access
     * without passing in constructor of child component
     */

    const themeService = this.themeService;
    const el = this.el;
    const dynamicCompilerService = this.dynamicCompilerService;
    const sessionService = this.sessionService


    /**
     * create child class for new component
     */
    class DynamicRestaurantTagsComponentTemp extends DynamicRestaurantTagsComponent {
      constructor() {
        super(themeService, el, dynamicCompilerService, sessionService);
      }

      ngOnInit() {
      }
    }


    /**
     * start creating dynamic component
     */

    const template = (this.sessionService.get('templates').components && this.sessionService.get('templates').components.restaurantTags) ? this.sessionService.get('templates').components.restaurantTags.html : templates.restaurantTags.html;
    const tmpCss = (this.sessionService.get('templates').components && this.sessionService.get('templates').components.restaurantTags) ? this.sessionService.get('templates').components.restaurantTags.css : templates.restaurantTags.css;
    const importsArray = [
      CommonModule,
      TooltipModule,
      CarouselModule
    ];

    const inputDataObject = {
      'data': this._data,
      'item': this.item,
      'previewOn': this.previewOn

    }
    const componentConfig: IDynamicCompilerData = {
      templateRef: this.businessCategoryContainer,
      template: template,
      css: tmpCss,
      imports: importsArray,
      rootClass: DynamicRestaurantTagsComponentTemp,
      inputData: inputDataObject
    };


    dynamicCompilerService.createComponentFactory(componentConfig);
  }
}
