import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { IDynamicCompilerData } from '../../../interfaces/interfaces';

import { AppService } from '../../../app.service';
import { UserRightsComponent } from '../../../components/user-rights/user-rights.component';
import { UserRightsService } from '../../../components/user-rights/user-rights.service';
import { PopupModalService } from '../../../modules/popup/services/popup-modal.service';
import { DynamicCompilerService } from '../../../services/dynamic-compiler.service';
import { LoaderService } from '../../../services/loader.service';
import { SessionService } from '../../../services/session.service';
import { templates } from '../../constants/template.constant';


declare var $: any;


@Component({
  selector: 'app-user-rights-dynamic',
  template: '<ng-container #userRightsTemplateRef></ng-container>'
})
export class DynamicUserRightsComponent extends UserRightsComponent implements OnInit, AfterViewInit {
  @ViewChild('userRightsTemplateRef', { read: ViewContainerRef }) userRightsTemplateRef: ViewContainerRef;

  constructor(protected sessionService: SessionService, protected loader: LoaderService,
    protected formBuilder: FormBuilder, protected userRightService: UserRightsService, protected popup: PopupModalService,
    public appService: AppService, protected dynamicCompilerService: DynamicCompilerService) {
    super(sessionService, loader, formBuilder, userRightService, popup, appService)
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

    const appService = this.appService;
    const sessionService = this.sessionService;
    const dynamicCompilerService = this.dynamicCompilerService;
    const popup = this.popup;
    const loader = this.loader;
    const userRightService = this.userRightService;
    const formBuilder = this.formBuilder;
    /**
     * create child class for new component
     */
    class DynamicUserRightsComponentTemp extends DynamicUserRightsComponent {
      constructor() {
        super(sessionService, loader, formBuilder, userRightService, popup, appService, dynamicCompilerService)
      }

      ngOnInit() {
        super.parentInit();
      }

      ngAfterViewInit() {
        super.ngAfterViewInit();
      }

    }


    /**
     * start creating dynamic component
     */

    const template = (this.sessionService.get('templates').pages['settings'] && this.sessionService.get('templates').pages['settings'].html) ? this.sessionService.get('templates').pages['settings'].html : templates.settings.html;
    const tmpCss = (this.sessionService.get('templates').pages['settings'] && this.sessionService.get('templates').pages['settings'].css) ? this.sessionService.get('templates').pages['settings'].css : templates.settings.css;
    const importsArray = [
      CommonModule,
      ReactiveFormsModule
    ];


    const componentConfig: IDynamicCompilerData = {
      templateRef: this.userRightsTemplateRef,
      template: template,
      css: tmpCss,
      imports: importsArray,
      rootClass: DynamicUserRightsComponentTemp,
    };

    dynamicCompilerService.createComponentFactory(componentConfig);
  }


}
