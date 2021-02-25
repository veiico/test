import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

import { AppService } from '../../../../../app.service';
import { SubscriptionComponent } from '../../../../../components/profile/components/subscription/subscription.component';
import { IDynamicCompilerData } from '../../../../../interfaces/interfaces';
import { PopUpService } from '../../../../../modules/popup/services/popup.service';
import { DecimalConfigPipe } from '../../../../../pipes/decimalConfig.pipe';
import { DynamicCompilerService } from '../../../../../services/dynamic-compiler.service';
import { LoaderService } from '../../../../../services/loader.service';
import { MessageService } from '../../../../../services/message.service';
import { SessionService } from '../../../../../services/session.service';
import { templates } from '../../../../../themes-custom/constants/template.constant';


@Component({
  template: '<ng-container #subscriptionTemplateRef></ng-container>',
})
export class DynamicSubscriptionComponent extends SubscriptionComponent implements OnInit {

  decimalPipe = new DecimalConfigPipe(this.sessionService);

  _profileData: any
  get profileData() {
    return this._profileData
  }

  @Input() set profileData(val: any) {
    this._profileData = val;
  }

  @ViewChild('subscriptionTemplateRef', { read: ViewContainerRef }) subscriptionTemplateRef: ViewContainerRef;
  constructor(protected sessionService: SessionService,
    protected loader: LoaderService,
    protected popup: PopUpService,
    protected message: MessageService,
    public appService: AppService,
    protected dynamicCompilerService: DynamicCompilerService) {
    super(sessionService, loader, popup, message, appService);
  }

  ngOnInit() {
    setTimeout(() => {
      this.createDynamicTemplate();
    }, 100);
  }

  parentInit() {
    super.ngOnInit();
  }


  filterOutSubscriptionFromResponse() {
    super.filterOutSubscriptionFromResponse();
    if(this.subscription && this.subscription.plan_amount){
      this.subscription.plan_amount = this.decimalPipe.transform(this.subscription.plan_amount);
    }
   
  }

  createDynamicTemplate() {

    /**
     * reference services in const variable to access 
     * without passing in constructor of child component
     */

    const sessionService = this.sessionService;
    const dynamicCompilerService = this.dynamicCompilerService;
    const loader = this.loader;
    const popup = this.popup;
    const message = this.message;
    const appService = this.appService;


    /**
     * create child class for new component
     */
    class DynamicSubscriptionComponentTemp extends DynamicSubscriptionComponent {
      constructor() {
        super(sessionService, loader, popup, message, appService, dynamicCompilerService);
      }

      ngOnInit() {
        super.parentInit();
      }
    }


    /**
     * start creating dynamic component
     */

    const template = (this.sessionService.get('templates').components && this.sessionService.get('templates').components.subscriptionInfo) ? this.sessionService.get('templates').components.subscriptionInfo.html : templates.subscriptionInfo.html;
    const tmpCss = (this.sessionService.get('templates').components && this.sessionService.get('templates').components.subscriptionInfo) ? this.sessionService.get('templates').components.subscriptionInfo.css : templates.subscriptionInfo.css;

    const importsArray = [
      CommonModule
    ];

    const inputDataObject = {
      'profileData': this._profileData
    };

    const componentConfig: IDynamicCompilerData = {
      templateRef: this.subscriptionTemplateRef,
      template: template,
      css: tmpCss,
      imports: importsArray,
      rootClass: DynamicSubscriptionComponentTemp,
      inputData: inputDataObject
    };

    dynamicCompilerService.createComponentFactory(componentConfig);
  }
}
