import { Component, OnInit, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SessionService } from '../../../services/session.service';
import { LoaderService } from '../../../services/loader.service';
import { MessageService } from '../../../services/message.service';
import { PopupModalService } from '../../../modules/popup/services/popup-modal.service';
import { OtpPlusChangePasswordComponent } from '../../../../app/components/otp-verification/otp-plus-change-password/otp-plus-change-password.component';
import { OtpVerificationService } from '../../../../app/components/otp-verification/otp-verification.service';
import { templates } from '../../constants/template.constant';
import { IDynamicCompilerData } from '../../../../app/interfaces/interfaces';
import { DynamicCompilerService } from '../../../../app/services/dynamic-compiler.service';
import { CommonModule } from '@angular/common';



@Component({ 
  template: '<ng-container #otpVerifyContainer> </ng-container>'
})
export class OtpVerificationDynamicComponent extends OtpPlusChangePasswordComponent implements OnInit {
@ViewChild('otpVerifyContainer', { read: ViewContainerRef })
    otpVerificationTemplateViewRef: ViewContainerRef;
  @Input('otpData') otpData: any;
  

  constructor(
    protected formBuilder: FormBuilder, 
    protected sessionService: SessionService, 
    protected service: OtpVerificationService,
    protected loader: LoaderService, 
    protected messageService: MessageService, 
    protected popup: PopupModalService,
    protected dynamicCompilerService ?: DynamicCompilerService) {
        super(formBuilder,sessionService,service,loader,messageService,popup);
     }

  ngOnInit() {
    setTimeout(()=>{
      this.createDynamicTemplate();
    },100);
    
  }


  parentInit() {
    super.ngOnInit();
  }
  
  createDynamicTemplate() {
      const formBuilder = this.formBuilder;
      const sessionService =  this.sessionService; 
      const service =  this.service;
      const loader = this.loader; 
      const messageService = this.messageService;
      const popup = this.popup;
      const dynamicCompilerService = this.dynamicCompilerService;

      class DynamicOtpVerificationTemp extends OtpVerificationDynamicComponent {

        constructor() {
            super(
              formBuilder,
              sessionService,
              service,
              loader,
              messageService,
              popup,
              dynamicCompilerService
            );
          }

          ngOnInit() {
            super.parentInit();
          }

       
        } 
         /**
         * start creating dynamic component
         */

        const template = (this.sessionService.get('templates').components && this.sessionService.get('templates').components.otpVerification) ? this.sessionService.get('templates').components.otpVerification.html : templates.otpVerification.html;
        const tmpCss = (this.sessionService.get('templates').components && this.sessionService.get('templates').components.otpVerification) ? this.sessionService.get('templates').components.otpVerification.css : templates.otpVerification.css;
 
        const importsArray = [
            CommonModule,
            FormsModule,
            ReactiveFormsModule,
        ]; 
        const inputDataObject = {
            otpData: this.otpData
          };
     
        const componentConfig: IDynamicCompilerData = {
          templateRef: this.otpVerificationTemplateViewRef,
          template: template,
          css: tmpCss,
          imports: importsArray,
          rootClass: DynamicOtpVerificationTemp,
          inputData: inputDataObject
        };
    
        dynamicCompilerService.createComponentFactory(componentConfig); 
      
  }


}
