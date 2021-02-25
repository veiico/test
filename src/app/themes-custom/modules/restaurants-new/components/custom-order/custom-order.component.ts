import { Component, EventEmitter, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';

import { CustomOrderComponent } from '../../../../../components/restaurants-new/components/custom-order/custom-order.component';
import { GoogleAnalyticsEventsService } from '../../../../../services/google-analytics-events.service';
import { MessageService } from '../../../../../services/message.service';
import { SessionService } from '../../../../../services/session.service';
import { CommonModule } from '@angular/common';
import { DynamicCompilerService } from '../../../../../services/dynamic-compiler.service';
import { IDynamicCompilerData } from '../../../../../interfaces/interfaces';
import { templates } from '../../../../../themes-custom/constants/template.constant';

declare var $: any;

@Component({
  template: '<ng-container #businessCategoryContainer></ng-container>'
})
export class DynamicCustomOrderComponent extends CustomOrderComponent implements OnInit {
  @Output() toggle: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('businessCategoryContainer', { read: ViewContainerRef }) businessCategoryContainer: ViewContainerRef;

  constructor(public sessionService: SessionService,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
    public messageService: MessageService,
    public router: Router,
    public dynamicCompilerService: DynamicCompilerService) {
    super(sessionService, googleAnalyticsEventsService, messageService, router)
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

    const sessionService = this.sessionService;
    const googleAnalyticsEventsService = this.googleAnalyticsEventsService;
    const messageService = this.messageService;
    const router = this.router;
    const dynamicCompilerService = this.dynamicCompilerService;



    /**
     * create child class for new component
     */
    class DynamicCustomOrderComponentTemp extends DynamicCustomOrderComponent {
      constructor() {
        super(sessionService, googleAnalyticsEventsService, messageService, router, dynamicCompilerService);
        this.initEvents();
      }
      ngOnInit() {
      }
    }


    /**
     * start creating dynamic component
     */

    const template = (this.sessionService.get('templates').components && this.sessionService.get('templates').components.customOrder) ? this.sessionService.get('templates').components.customOrder.html : templates.customOrder.html;
    const tmpCss = (this.sessionService.get('templates').components && this.sessionService.get('templates').components.customOrder) ? this.sessionService.get('templates').components.customOrder.css : templates.customOrder.css;
    const importsArray = [
      CommonModule
    ];

    const inputDataObject = {
      'toggle': this.toggle
    }
    const componentConfig: IDynamicCompilerData = {
      templateRef: this.businessCategoryContainer,
      template: template,
      css: tmpCss,
      imports: importsArray,
      rootClass: DynamicCustomOrderComponentTemp,
      inputData: inputDataObject
    };


    dynamicCompilerService.createComponentFactory(componentConfig);
  }

}
