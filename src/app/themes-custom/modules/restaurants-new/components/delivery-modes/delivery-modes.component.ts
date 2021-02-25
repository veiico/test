import { Component, Input, OnInit, ViewContainerRef, ViewChild } from '@angular/core';

import { AppService } from '../../../../../app.service';
import { AppCartService } from '../../../../../components/catalogue/components/app-cart/app-cart.service';
import { DeliveryModesComponent } from '../../../../../components/restaurants-new/components/delivery-modes/delivery-modes.component';
import { MessageService } from '../../../../../services/message.service';
import { SessionService } from '../../../../../services/session.service';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import { IDynamicCompilerData } from '../../../../../interfaces/interfaces';
import { DynamicCompilerService } from '../../../../../services/dynamic-compiler.service';
import { templates } from '../../../../../themes-custom/constants/template.constant';



@Component({
  template: '<ng-container #deliveryModeContainer></ng-container>'
})
export class DynamicDeliveryModesComponent extends DeliveryModesComponent implements OnInit {
  @ViewChild('deliveryModeContainer', { read: ViewContainerRef }) deliveryModeContainer: ViewContainerRef;
  protected _method;
  get method() { return this._method };
  @Input() set method(val: any) {
    this._method = val;
  };

  constructor(public appService: AppService, public sessionService: SessionService, public messageService: MessageService,
    public appCartService: AppCartService, protected dynamicCompilerService: DynamicCompilerService) {
    super(appService, sessionService, messageService, appCartService)
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

    const appService = this.appService;
    const sessionService = this.sessionService;
    const messageService = this.messageService;
    const appCartService = this.appCartService;
    const dynamicCompilerService = this.dynamicCompilerService;

    /**
     * create child class for new component
     */
    class DynamicDeliveryModesComponentTemp extends DynamicDeliveryModesComponent {
      constructor() {
        super(appService, sessionService, messageService, appCartService, dynamicCompilerService)
      }
      ngOnInit() {
      }
    }


    /**
     * start creating dynamic component
     */

    const template = (this.sessionService.get('templates').components && this.sessionService.get('templates').components.deliveryModes) ? this.sessionService.get('templates').components.deliveryModes.html : templates.deliveryModes.html;
    const tmpCss = (this.sessionService.get('templates').components && this.sessionService.get('templates').components.deliveryModes) ? this.sessionService.get('templates').components.deliveryModes.css : templates.deliveryModes.css;
    const importsArray = [
      CommonModule,
      TooltipModule
    ];

    const inputDataObject = {
      'method': this._method
    };


    const componentConfig: IDynamicCompilerData = {
      templateRef: this.deliveryModeContainer,
      template: template,
      css: tmpCss,
      imports: importsArray,
      rootClass: DynamicDeliveryModesComponentTemp,
      inputData: inputDataObject
    };


    dynamicCompilerService.createComponentFactory(componentConfig);
  }



}
