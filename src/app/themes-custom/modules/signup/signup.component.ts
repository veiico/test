import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material';
import { Meta } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { DateTimeAdapter, OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { CalendarModule } from 'primeng/calendar';

import { AppService } from '../../../app.service';
import { AppCartService } from '../../../components/catalogue/components/app-cart/app-cart.service';
import { SignupComponent } from '../../../components/signup/signup.component';
import { SignupService } from '../../../components/signup/signup.service';
import { IDynamicCompilerData } from '../../../interfaces/interfaces';
import { PopupModalService } from '../../../modules/popup/services/popup-modal.service';
import { DynamicCompilerService } from '../../../services/dynamic-compiler.service';
import { FBPixelService } from '../../../services/fb-pixel.service';
import { GoogleAnalyticsEventsService } from '../../../services/google-analytics-events.service';
import { LoaderService } from '../../../services/loader.service';
import { MessageService } from '../../../services/message.service';
import { SessionService } from '../../../services/session.service';
import { ExternalLibService } from '../../../services/set-external-lib.service';
import { templates } from '../../constants/template.constant';


@Component({
  // templateUrl: '../../../components/signup/signup.component.html',
  template: '<ng-container #signupContainer> </ng-container>',
  styleUrls: ['../../../components/signup/signup.component.scss']
})
export class DynamicSignupComponent extends SignupComponent implements OnInit, OnDestroy {
  @ViewChild('signupContainer', { read: ViewContainerRef }) signupContainer: ViewContainerRef;
  constructor(protected formBuilder: FormBuilder, protected sessionService: SessionService,
    protected router: Router, protected service: SignupService, protected popup: PopupModalService,
    protected loader: LoaderService, protected messageService: MessageService, protected appService: AppService,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService, protected ref: ChangeDetectorRef,
    public appCart: AppCartService, protected dateTimeAdapter: DateTimeAdapter<any>,
    protected extService: ExternalLibService, protected meta: Meta, public fbPixelService: FBPixelService,
    protected dynamicCompilerService: DynamicCompilerService,
    protected ngZone: NgZone) {
    super(formBuilder, sessionService, router,
      service, popup, loader, messageService,
      appService, googleAnalyticsEventsService,
      ref, appCart, dateTimeAdapter,
      extService, meta, fbPixelService);

  }

  ngOnInit() {
    super.ngOnInit();
    setTimeout(() => {
      this.createDynamicTemplate();
    }, 100);
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  createDynamicTemplate() {

    /**
     * reference services in const variable to access
     * without passing in constructor of child component
     */


    const formBuilder = this.formBuilder;
    const service = this.service;
    const sessionService = this.sessionService;
    const router = this.router;
    const popup = this.popup;
    const loader = this.loader;
    const messageService = this.messageService;
    const appService = this.appService;
    const googleAnalyticsEventsService = this.googleAnalyticsEventsService;
    const ref = this.ref;
    const dateTimeAdapter = this.dateTimeAdapter;
    const appCart = this.appCart;
    const extService = this.extService;
    const meta = this.meta;
    const fbPixelService = this.fbPixelService;
    const dynamicCompilerService = this.dynamicCompilerService;
    const ngZone = this.ngZone;

    /**
     * create child class for new component
     */
    class DynamicSignupComponentTemp extends DynamicSignupComponent {
      constructor() {
        super(formBuilder, sessionService, router,
          service, popup, loader, messageService,
          appService, googleAnalyticsEventsService,
          ref, appCart, dateTimeAdapter,
          extService, meta, fbPixelService, dynamicCompilerService, ngZone);
        this.initConstructorFunction()
      }

      ngOnInit() {
        this.initEvents()
      }

      ngOnDestroy() {
        super.ngOnDestroy();
      }

    }

    /**
     * start creating dynamic component
     */

    const template =  (this.sessionService.get('templates').components && this.sessionService.get('templates').components.signup)  ? this.sessionService.get('templates').components.signup.html : templates.signup.html;
    const tmpCss = (this.sessionService.get('templates').components && this.sessionService.get('templates').components.signup)  ? this.sessionService.get('templates').components.signup.css : templates.signup.css;
    const importsArray = [
      CommonModule,
      RouterModule,
      FormsModule,
      MatCheckboxModule,
      OwlDateTimeModule,
      OwlNativeDateTimeModule,
      ReactiveFormsModule,
      CalendarModule
    ];

    const inputOutputObject = {
    };

    const componentConfig: IDynamicCompilerData = {
      templateRef: this.signupContainer,
      template: template,
      css: tmpCss,
      imports: importsArray,
      rootClass: DynamicSignupComponentTemp,
      inputData: inputOutputObject
    };

    dynamicCompilerService.createComponentFactory(componentConfig);
  }

  /**
   * change event from fugu tel input
   */
  phoneChange(event, fc?: FormControl) {
    const data = event.detail;
    this.country_code = data.dialCode
    this.phone = data.value
    this.newMobileNumber = data.value;
    if (fc) {
      fc.setValue(data.phoneValue);
    }
  }

  /**
  * successfull event for fee paid
  */
  successfullLogin(res) {
    if (res.detail.data) {
      super.successfullLogin(res.detail);
    }
  }

}
