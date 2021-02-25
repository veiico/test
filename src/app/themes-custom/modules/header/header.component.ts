import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  Renderer2,
  ViewChild,
  ViewContainerRef,
  Input
} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AppService } from '../../../app.service';
import { HeaderComponent } from '../../../components/header/header.component';
import { HeaderService } from '../../../components/header/header.service';
import { LoginService } from '../../../components/login/login.service';
import { IDynamicCompilerData } from '../../../interfaces/interfaces';
import { PopupModalService } from '../../../modules/popup/services/popup-modal.service';
import { PopUpService } from '../../../modules/popup/services/popup.service';
import { DynamicCompilerService } from '../../../services/dynamic-compiler.service';
import { GoogleAnalyticsEventsService } from '../../../services/google-analytics-events.service';
import { LoaderService } from '../../../services/loader.service';
import { MessageService } from '../../../services/message.service';
import { SessionService } from '../../../services/session.service';
import { ExternalLibService } from '../../../services/set-external-lib.service';
import { templates } from '../../constants/template.constant';
import { ValidationService } from '../../../services/validation.service';
import { RestaurantsService } from '../../../components/restaurants-new/restaurants-new.service';

declare var $: any;

@Component({
  template: '<ng-container #headerContainer> </ng-container>'
})
export class DynamicHeaderComponent extends HeaderComponent
  implements OnInit, AfterViewInit {
  @ViewChild('headerContainer', { read: ViewContainerRef })
  headerTemplateViewRef: ViewContainerRef;
  phoneEmailObject: any;
  templates: any;
  constructor(
    protected ngZone: NgZone,
    protected messageService: MessageService,
    public router: Router,
    protected loader: LoaderService,
    public sessionService: SessionService,
    protected formBuilder: FormBuilder,
    protected loginService: LoginService,
    protected popup: PopUpService,
    protected elementRef: ElementRef,
    protected popupModal: PopupModalService,
    public  headerService: HeaderService,
    protected appService: AppService,
    protected extService: ExternalLibService,
    protected renderer: Renderer2,
    protected googleAnalyticsEventsService: GoogleAnalyticsEventsService,
    protected dynamicCompilerService: DynamicCompilerService,
    public restaurantService: RestaurantsService
  ) {
    super(
      ngZone,
      messageService,
      router,
      loader,
      sessionService,
      formBuilder,
      loginService,
      popup,
      elementRef,
      popupModal,
      headerService,
      appService,
      extService,
      renderer,
      googleAnalyticsEventsService,
      restaurantService
    );
  }

  ngOnInit() {
    setTimeout(() => {
      this.createDynamicTemplate();
    }, 0);
  }

  createDynamicTemplate() {
    const ngZone = this.ngZone;
    const messageService = this.messageService;
    const router = this.router;
    const loader = this.loader;
    const sessionService = this.sessionService;
    const formBuilder = this.formBuilder;
    const loginService = this.loginService;
    const popup = this.popup;
    const elementRef = this.elementRef;
    const popupModal = this.popupModal;
    const headerService = this.headerService;
    const appService = this.appService;
    const extService = this.extService;
    const renderer = this.renderer;
    const googleAnalyticsEventsService = this.googleAnalyticsEventsService;
    const dynamicCompilerService = this.dynamicCompilerService;
    const restaurantService = this.restaurantService;

    class DynamicHeaderTemp extends DynamicHeaderComponent {
      public headerWrapper = {};
      constructor() {
        super(
          ngZone,
          messageService,
          router,
          loader,
          sessionService,
          formBuilder,
          loginService,
          popup,
          elementRef,
          popupModal,
          headerService,
          appService,
          extService,
          renderer,
          googleAnalyticsEventsService,
          dynamicCompilerService,
          restaurantService
        );
      }
      ngOnInit() {
        this.initContructorFunction();
        this.initChecks();
        this.image_link = this.formSettings.web_header_logo;
        this.headerWrapper = {
          clientLogo: this.image_link,
          title: this.title,
          showSearchBar: this.hideSearch,
          loggedIn: this.loggedIn,
          showLoginBtn: this.hideLogin,
          languageArray: this.languageArray,
          profileImage: this.profileImage,
          refStatus: this.refStatus,
          walletEnabled: this.walletEnabled,
          headerData: this.headerData,
          configData: this.formSettings
        };
      }
    }

    const template =
      this.sessionService.get('templates').components &&
        this.sessionService.get('templates').components.header
        ? this.sessionService.get('templates').components.header.html
        : templates.header.html;
    const tmpCss =
      this.sessionService.get('templates').components &&
        this.sessionService.get('templates').components.header
        ? this.sessionService.get('templates').components.header.css
        : templates.header.css;
    const importsArray = [CommonModule, FormsModule, ReactiveFormsModule, RouterModule];
    const inputDataObject = {
      showSearch: this.showSearch,
      headerData: this._headerData,
      showAddressBarOnlyRestaurant: this._showAddressBarOnlyRestaurant,
      hidden: this.hidden
    };

    const componentConfig: IDynamicCompilerData = {
      templateRef: this.headerTemplateViewRef,
      template: template,
      css: tmpCss,
      imports: importsArray,
      rootClass: DynamicHeaderTemp,
      inputData: inputDataObject
    };

    dynamicCompilerService.createComponentFactory(componentConfig);
  }

  /**
   * phone value email chnage form hybrid component
   */
  phoneEmailValueChange(data) {
    if (this.forgotForm) {
      this.forgotForm.controls.phone_email.setValue(data.detail.phone_email);
      this.forgotForm.controls.phone_email = ValidationService.HybridEmailPhoneEventValidator(
        this.forgotForm.controls.phone_email,
        'phone_email'
      );
    }

    this.phoneEmailObject = data.detail;
  }

  /**
   * forgot email ovevevride
   */

  forgotEmail() {
    const obj = {
      phone_no: this.phoneEmailObject.is_phone
        ? this.phoneEmailObject.value
        : undefined,
      email: !this.phoneEmailObject.is_phone
        ? this.phoneEmailObject.value
        : undefined,
      marketplace_reference_id: this.sessionService.getString(
        'marketplace_reference_id'
      )
    };
    this.loader.show();
    this.loginService.forgot(obj).subscribe(
      response => {
        try {
          if (response.status === 200) {
            $('#loginDialog').modal('hide');
            $('#forgotModal').modal('hide');
            this.popupModal.showPopup('success', 2000, response.message, false);
          } else {
            this.popupModal.showPopup('error', 2000, response.message, false);
          }
        } catch (e) {
          console.error(e);
        }
        this.loader.hide();
      },
      error => {
        $('#loginDialog').modal('hide');
        $('#forgotModal').modal('hide');
        this.loader.hide();
      }
    );
  }

  // forgot email for otp override
  forgotEmailOtp() {
    const obj = {
      phone: this.phoneEmailObject.is_phone
        ? this.phoneEmailObject.value
        : undefined,
      email: !this.phoneEmailObject.is_phone
        ? this.phoneEmailObject.value
        : undefined,
      marketplace_reference_id: this.sessionService.getString(
        'marketplace_reference_id'
      ),
      language: this.sessionService.getString("language")
    };
    this.otpObjectDetails = {
      phone: this.phoneEmailObject.is_phone
        ? this.phoneEmailObject.value
        : undefined,
      email: !this.phoneEmailObject.is_phone
        ? this.phoneEmailObject.value
        : undefined,
      marketplace_reference_id: this.sessionService.getString(
        'marketplace_reference_id'
      )
    };
    this.loader.show();
    this.sessionService.resendOTP = this.otpObjectDetails;
    this.loginService.forgotNew(obj).subscribe(
      response => {
        try {
          if (response.status === 200) {
            $("#loginDialog").modal("hide");
            $("#forgotModal").modal("hide");
            $("#otpDialog").modal("show");

            this.popupModal.showPopup('success', 2000, response.message, false);
          } else {
            this.popupModal.showPopup('error', 2000, response.message, false);
          }
        } catch (e) {
          console.error(e);
        }
        this.loader.hide();
      },
      error => {
        $("#loginDialog").modal("hide");
        $("#forgotModal").modal("hide");
        $("#otpDialog").modal("hide");
        console.error(error);
      }
    );
  }
}
