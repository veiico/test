import { Component, OnInit, ViewChild, ViewContainerRef, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerVerificationPopupComponent } from '../../../components/customer-verification-popup/customer-verification-popup.component';
import { DynamicCompilerService } from '../../../services/dynamic-compiler.service';
import { SessionService } from '../../../services/session.service';
import { templates } from '../../constants/template.constant';
import { CommonModule } from '@angular/common';
import { IDynamicCompilerData } from '../../../interfaces/interfaces';
import { AppService } from '../../../app.service'

@Component({
  template: '<ng-container #customerVerificationRef></ng-container>'
})
export class DynamicCustomerVerificationPopupComponent extends CustomerVerificationPopupComponent implements OnInit {
  @ViewChild('customerVerificationRef', { read: ViewContainerRef }) customerVerificationRef: ViewContainerRef;
  @Output() popUpClose = new EventEmitter<null>();
  constructor(protected router: Router,public appService: AppService, protected dynamicCompilerService: DynamicCompilerService, 
    public sessionService: SessionService) {
    super(router,appService, sessionService);
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

    const sessionService = this.sessionService;
    const dynamicCompilerService = this.dynamicCompilerService;
    const router = this.router;
    const appService = this.appService;

    /**
     * create child class for new component
     */
    class DynamicCustomerVerificationPopupComponentTemp extends DynamicCustomerVerificationPopupComponent {
      constructor() {
        super(router, appService, dynamicCompilerService, sessionService);
      }

      ngOnInit() {
        super.parentInit();
      }

    }


    /**
     * start creating dynamic component
     */


    const template = (this.sessionService.get('templates').components && this.sessionService.get('templates').components.customerVerificationPopup) ? this.sessionService.get('templates').components.customerVerificationPopup.html : templates.customerVerificationPopup.html;
    const tmpCss = (this.sessionService.get('templates').components && this.sessionService.get('templates').components.customerVerificationPopup) ? this.sessionService.get('templates').components.customerVerificationPopup.css : templates.customerVerificationPopup.css;

    const importsArray = [
      CommonModule
    ];

    const inputDataObject = {
      popUpClose: this.popUpClose
    };

    const componentConfig: IDynamicCompilerData = {
      templateRef: this.customerVerificationRef,
      template: template,
      css: tmpCss,
      imports: importsArray,
      rootClass: DynamicCustomerVerificationPopupComponentTemp,
      inputData: inputDataObject
    };

    dynamicCompilerService.createComponentFactory(componentConfig);
  }

}
