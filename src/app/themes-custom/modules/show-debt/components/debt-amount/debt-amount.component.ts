import { Component, OnInit, Output, EventEmitter, ViewChild, ViewContainerRef } from '@angular/core';
import { Location, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DebtAmountComponent } from '../../../../../../app/components/show-debt/components/debt-amount/debt-amount.component';
import { CommonService } from '../../../../../../app/services/common.service';
import { LoaderService } from '../../../../../../app/services/loader.service';
import { DebtService } from '../../../../../../app/components/show-debt/services/show-debt.service';
import { SessionService } from '../../../../../../app/services/session.service';
import { templates } from '../../../../../../app/themes-custom/constants/template.constant';
import { IDynamicCompilerData } from '../../../../../../app/interfaces/interfaces';
import { DynamicCompilerService } from '../../../../../../app/services/dynamic-compiler.service';

@Component({
  selector: 'app-debt-amount-dynamic', 
  template: '<ng-container #userDebtTemplateRef></ng-container>'
})
export class DynamicDebtAmountComponent extends DebtAmountComponent implements OnInit { 
  @Output() onDebtAction: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('userDebtTemplateRef', { read: ViewContainerRef }) userDebtTemplateRef: ViewContainerRef;

//THEME CUSTOM
  constructor(public commonService: CommonService , 
    protected sessionService: SessionService, 
    protected debtService: DebtService,
    protected loader: LoaderService ,
    protected location: Location, 
    protected router: Router,
    protected dynamicCompilerService: DynamicCompilerService) {
        super(commonService, sessionService, debtService, loader, location, router);
     }
     
     ngOnInit() {
        setTimeout(() => {
          this.createDynamicTemplate()
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
    
        const commonService = this.commonService;
        const sessionService = this.sessionService;
        const debtService = this.debtService;
        const loader = this.loader;
        const location = this.location;
        const router = this.router;
        const dynamicCompilerService= this.dynamicCompilerService;
        /**
         * create child class for new component
         */
        class DynamicDebtAmountComponentTemp extends DynamicDebtAmountComponent {
          constructor() {
            super(commonService, sessionService, debtService, loader, location, router, dynamicCompilerService);
          }
    
          ngOnInit() {
            super.parentInit();
          }
    
        }
    
    
        /**
         * start creating dynamic component
         */
    
        const template = (this.sessionService.get('templates').pages['debtAmount'] && this.sessionService.get('templates').pages['debtAmount'].html) ? this.sessionService.get('templates').pages['debtAmount'].html : templates.debtAmount.html;
        const tmpCss = (this.sessionService.get('templates').pages['debtAmount'] && this.sessionService.get('templates').pages['debtAmount'].css) ? this.sessionService.get('templates').pages['debtAmount'].css : templates.debtAmount.css;
        const importsArray = [
          CommonModule
        ]; 
    
     
        const componentConfig: IDynamicCompilerData = {
          templateRef: this.userDebtTemplateRef,
          template: template,
          css: tmpCss,
          imports: importsArray,
          rootClass: DynamicDebtAmountComponentTemp,
        };
    
        dynamicCompilerService.createComponentFactory(componentConfig);
      } 


}
