import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppService } from '../../../../../app.service';
import { ChangePasswordComponent } from '../../../../../components/profile/components/change-password/change-password.component';
import { ProfileService } from '../../../../../components/profile/profile.service';
import { IDynamicCompilerData } from '../../../../../interfaces/interfaces';
import { PopUpService } from '../../../../../modules/popup/services/popup.service';
import { DynamicCompilerService } from '../../../../../services/dynamic-compiler.service';
import { LoaderService } from '../../../../../services/loader.service';
import { MessageService } from '../../../../../services/message.service';
import { SessionService } from '../../../../../services/session.service';
import { templates } from '../../../../../themes-custom/constants/template.constant';

@Component({
  selector: 'app-change-password',
  template: '<ng-container #changePasswordTemplateRef></ng-container>'
})
export class DynamicChangePasswordComponent extends ChangePasswordComponent implements OnInit {

  @ViewChild('changePasswordTemplateRef', { read: ViewContainerRef }) changePasswordTemplateRef: ViewContainerRef;
  constructor(protected sessionService: SessionService, protected loader: LoaderService, protected popup: PopUpService,
    protected service: ProfileService, protected message: MessageService, protected formBuilder: FormBuilder,
    public appService: AppService,
    protected dynamicCompilerService: DynamicCompilerService) {
    super(sessionService, loader, popup, service, message, formBuilder, appService)

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
    const loader = this.loader;
    const popup = this.popup;
    const message = this.message;
    const appService = this.appService;
    const formBuilder = this.formBuilder;
    const service = this.service;


    /**
     * create child class for new component
     */
    class DynamicChangePasswordComponentTemp extends DynamicChangePasswordComponent {
      constructor() {
        super(sessionService, loader, popup, service, message, formBuilder, appService, dynamicCompilerService)
      }

      ngOnInit() {
        super.parentInit();
      }
    }


    /**
     * start creating dynamic component
     */

    const template = (this.sessionService.get('templates').components && this.sessionService.get('templates').components.changePassword) ? this.sessionService.get('templates').components.changePassword.html : templates.changePassword.html;
    const tmpCss = (this.sessionService.get('templates').components && this.sessionService.get('templates').components.changePassword) ? this.sessionService.get('templates').components.changePassword.css : templates.changePassword.css;

    const importsArray = [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
    ];

    const inputDataObject = {
      'back': this.back,
      'save': this.save
    };

    const componentConfig: IDynamicCompilerData = {
      templateRef: this.changePasswordTemplateRef,
      template: template,
      css: tmpCss,
      imports: importsArray,
      rootClass: DynamicChangePasswordComponentTemp,
      inputData: inputDataObject
    };

    dynamicCompilerService.createComponentFactory(componentConfig);
  }
}
