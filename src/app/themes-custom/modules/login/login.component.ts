import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AppService } from '../../../app.service';
import { AppCartService } from '../../../components/catalogue/components/app-cart/app-cart.service';
import { LoginComponent } from '../../../components/login/login.component';
import { LoginService } from '../../../components/login/login.service';
import { GoogleAnalyticsEvent } from '../../../enums/enum';
import { IDynamicCompilerData } from '../../../interfaces/interfaces';
import { PopupModalService } from '../../../modules/popup/services/popup-modal.service';
import { DynamicCompilerService } from '../../../services/dynamic-compiler.service';
import { FBPixelService } from '../../../services/fb-pixel.service';
import { GoogleAnalyticsEventsService } from '../../../services/google-analytics-events.service';
import { LoaderService } from '../../../services/loader.service';
import { MessageService } from '../../../services/message.service';
import { SessionService } from '../../../services/session.service';
import { ExternalLibService } from '../../../services/set-external-lib.service';
import { ThemeService } from '../../../services/theme.service';
import { ValidationService } from '../../../services/validation.service';
import { templates } from '../../constants/template.constant';
import { MessageType } from '../../../constants/constant';

@Component({
  template: '<ng-container #loginContainer> </ng-container>',
})
export class DynamicLoginComponent extends LoginComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('loginContainer', { read: ViewContainerRef }) loginContainer: ViewContainerRef;
  phoneEmailObject: any;
  constructor(protected formBuilder: FormBuilder, protected service: LoginService, protected sessionService: SessionService,
    protected router: Router, protected popup: PopupModalService, protected loader: LoaderService,
    protected messageService: MessageService, protected appService: AppService,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService, public fbPixelService: FBPixelService,
    protected cd: ChangeDetectorRef, public appCart: AppCartService, protected extService: ExternalLibService, protected themeService: ThemeService,
    protected dynamicCompilerService: DynamicCompilerService) {
    super(formBuilder, service, sessionService, router,
      popup, loader, messageService, appService,
      googleAnalyticsEventsService, fbPixelService,
      cd, appCart, extService, themeService);
  }

  ngOnInit() {
    setTimeout(() => {
      this.createDynamicTemplate();
    }, 100);


  }
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes)
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
    const fbPixelService = this.fbPixelService;
    const cd = this.cd;
    const appCart = this.appCart;
    const extService = this.extService;
    const themeService = this.themeService;
    const dynamicCompilerService = this.dynamicCompilerService;


    /**
     * create child class for new component
     */
    class DynamicLoginComponentTemp extends DynamicLoginComponent {
      constructor() {
        super(formBuilder, service, sessionService, router,
          popup, loader, messageService, appService,
          googleAnalyticsEventsService, fbPixelService,
          cd, appCart, extService, themeService, dynamicCompilerService);

      }

      ngOnInit() {
        this.initContructorOperations();
        this.initEvents()
      }

      ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes)
      }

      /**
      * phone value email change form hybrid component
      */
      phoneEmailValueChange(data) {
        this.loginForm.controls.phone_email.setValue(data.detail.phone_email);
        this.loginForm.controls.phone_email = ValidationService.HybridEmailPhoneEventValidator(this.loginForm.controls.phone_email, 'phone_email');
        this.phoneEmailObject = data.detail;
        this.loginForm.controls.phone_email.markAsTouched();
      }


      /**
       * overridden fxn of loginDualUser for phone email hybrid change
       */
      loginDualUser() {
        this.loader.show();
        const obj = {
          'phone_no': (this.phoneEmailObject.is_phone) ? this.phoneEmailObject.value : undefined,
          'email': (!this.phoneEmailObject.is_phone) ? this.phoneEmailObject.value : undefined,
          'password': this.loginForm.value.password,
          'marketplace_reference_id': this.sessionService.get('config').marketplace_reference_id
        };

        this.service.loginDual(obj)
          .subscribe(
            response => {
              try {
                if (response.status === 200) {
                  if(this.sessionService.is_netcore_enabled){
                    try {
                      (<any>window).smartech('contact', '4', {
                        'pk^email': (!this.phoneEmailObject.is_phone) ? this.phoneEmailObject.value : undefined,
                        'mobile': (this.phoneEmailObject.is_phone) ? this.phoneEmailObject.value : undefined,
                        // 'FIRST_NAME': 'test'
                        });
                        if(!this.phoneEmailObject.is_phone){
                          (<any>window).smartech('identify', this.phoneEmailObject.value);
                        }
                    } catch (e) {
                      console.warn(e);
                    }                  
                  }
                  this.afterSuccess(response);
                } else {
                  this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.sign_in_failure,
                    this.loginForm.controls.phone_email.value ? this.phoneEmailObject.value : '', this.loginFrom, '');
                  this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
                }
              } catch (e) {
                console.error(e);
                this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.sign_in_failure,
                  this.loginForm.controls.phone_email.value ? this.phoneEmailObject.value : '', this.loginFrom, '');
              }
              this.loader.hide();
            },
            error => {
              console.error(error);
              this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.sign_in_failure,
                this.loginForm.controls.phone_email.value ? this.phoneEmailObject.value : '', this.loginFrom, '');
            }
          );
      }
//  Login via otp verification
checkForOtpVerification(resendFlow?:boolean)
{
  if((this.appConfig.is_guest_checkout_enabled &&  (this.guestSignupData && this.guestSignupData.data  && parseInt(this.guestSignupData.data.vendor_details.is_guest_account))))
    {
  this.checkForGuestOtpVerification(); 
  return; 
   }

  const obj=
  {
  'marketplace_reference_id': this.appConfig.marketplace_reference_id,
  'marketplace_user_id': this.appConfig.marketplace_user_id.toString(),
  'phone': (this.phoneEmailObject.is_phone) ? this.phoneEmailObject.value : undefined,
  'email': (!this.phoneEmailObject.is_phone) ? this.phoneEmailObject.value : undefined,
  'otp': this.otpForm.value.otpValue,
  'login_vendor_via_otp' : 1
  }
  this.service.loginViaOtp(obj).subscribe(response =>{
      try {
        if (response.status === this.responseTypes.SUCCESS) {
          this.showOtpPopUp=false;
          this.loginViaAccessToken(response.data.access_token);
        }else {
          this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
        }
       
    }catch (e) {
        console.error(e);
      }
      this.loader.hide();
    },
  error =>
  {
    this.loader.hide();
  })
}



/*
send login otp
*/
verifyLoginOtp(resendOtp?:boolean) {
  if((this.appConfig.is_guest_checkout_enabled &&  (this.guestSignupData && this.guestSignupData.data  && parseInt(this.guestSignupData.data.vendor_details.is_guest_account))))
  {
this.verifyGuestLoginOtp(1);  
return;
 }
  this.emailMessage=this.loginForm.controls.phone_email.value.is_phone; 

   this.emailMessage=this.phoneEmailObject.is_phone;
   const obj=
  {
  'marketplace_reference_id': this.appConfig.marketplace_reference_id,
  'marketplace_user_id': this.appConfig.marketplace_user_id,
  'phone': (this.phoneEmailObject.is_phone) ? this.phoneEmailObject.value : undefined,
  'email': (!this.phoneEmailObject.is_phone) ? this.phoneEmailObject.value : undefined,
  'make_otp_invalid':resendOtp
  }
  if(this.otpId)
{
obj['otp_id']=this.otpId;
}
  this.service.verifyOtp(obj).subscribe(response => {
    try {
      if (response.status === this.responseTypes.SUCCESS) {
        this.initiateOtpForm();
        this.otpId=response.data.otp_id;
        this.showOtpPopUp=true;
        this.cd.detectChanges();
        this.popup.showPopup(MessageType.SUCCESS, 2000,response.message, false);
        
      }
      else {
        this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
      }
    } catch (e) {
      console.error(e);
    }
    this.loader.hide();
  },
    error => {
      this.loader.hide();
    }
  );
}
 //login via access token
 loginViaAccessToken(access_token) {
  this.loader.show();
  const obj = {
    'phone_no': (this.phoneEmailObject.is_phone) ? this.phoneEmailObject.value : undefined,
    'email': (!this.phoneEmailObject.is_phone) ? this.phoneEmailObject.value : undefined,
    'access_token': access_token,
    'marketplace_reference_id': this.appConfig.marketplace_reference_id,
    'device_token':this.sessionService.get("device_token") || this.sessionService.get("device_token_app") 
  };
  
  this.service.accessTokenLogin(obj)
    .subscribe(
      response => {
        try {
          if (response.status === this.responseTypes.SUCCESS) {
            this.showOtpPopUp=false;
            if(this.sessionService.is_netcore_enabled){
              (<any>window).smartech('contact', '4', {
                'pk^email': (!this.phoneEmailObject.is_phone) ? this.phoneEmailObject.value : undefined,
                'mobile': (this.phoneEmailObject.is_phone) ? this.phoneEmailObject.value : undefined,
                // 'FIRST_NAME': 'test'
                });
                if(!this.phoneEmailObject.is_phone){
                  (<any>window).smartech('identify', this.phoneEmailObject.value);
                }
            }
            // console.log('phon verified', response)
            this.afterSuccess(response);
          } else {
            this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.sign_in_failure,
              this.loginForm.controls.phone_email.value ? this.phoneEmailObject.value : '', this.loginFrom, '');
            this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
          }
        } catch (e) {
          console.error(e);
          this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.sign_in_failure,
            this.loginForm.controls.phone_email.value ? this.phoneEmailObject.value : '', this.loginFrom, '');
        }
        this.loader.hide();
      },
      error => {
        console.error(error);
        this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.sign_in_failure,
          this.loginForm.controls.phone_email.value ? this.phoneEmailObject.value : '', this.loginFrom, '');
      }
    );
}



      /**
       * overridden fxn of login for phone email hybrid change
       */ 

      login() {
        this.loader.show();
        const obj = {
          'phone_no': (this.phoneEmailObject.is_phone) ? this.phoneEmailObject.value : undefined,
          'email': (!this.phoneEmailObject.is_phone) ? this.phoneEmailObject.value : undefined,
          'password': this.loginForm.value.password,
          'marketplace_reference_id':this.sessionService.get("reference_id")?this.sessionService.get("reference_id"):this.sessionService.get('config').marketplace_reference_id,
          'device_token':this.sessionService.get("device_token") || this.sessionService.get("device_token_app")
        }; 
        this.service.login(obj)
          .subscribe(
            response => {
              try {
                if (response.status === 200) {
                  if(this.sessionService.is_netcore_enabled){
                    (<any>window).smartech('contact', '4', {
                      'pk^email': (!this.phoneEmailObject.is_phone) ? this.phoneEmailObject.value : undefined,
                      'mobile': (this.phoneEmailObject.is_phone) ? this.phoneEmailObject.value : undefined,
                      // 'FIRST_NAME': 'test'
                      });
                      if(!this.phoneEmailObject.is_phone){
                        (<any>window).smartech('identify', this.phoneEmailObject.value);
                      }
                  }
                  // console.log('phon verified', response)
                  this.afterSuccess(response);
                } else {
                  this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.sign_in_failure,
                    this.loginForm.controls.phone_email.value ? this.phoneEmailObject.value : '', this.loginFrom, '');
                  this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
                }
              } catch (e) {
                console.error(e);
                this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.sign_in_failure,
                  this.loginForm.controls.phone_email.value ? this.phoneEmailObject.value : '', this.loginFrom, '');
              }
              const id=this.sessionService.get("reference_id");
              if(response.data && response.data.vendor_details && response.data.vendor_details.marketplace_reference_id && id)
              { 
                window.location.href="https://" + response.data.formSettings[0].domain_name +'/en' + "?access_token_web=" + response.data.vendor_details.app_access_token +
                "&vendor_id_web=" + response.data.vendor_details.vendor_id + "&reference_id=" + 'rrrrdfsjhxgsfusfhindhuicddfffnsno3ye8qp2upuost';
              }
              this.loader.hide();
            },
            error => {
              console.error(error);
              this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.sign_in_failure,
                this.loginForm.controls.phone_email.value ? this.phoneEmailObject.value : '', this.loginFrom, '');
            }
          );
      }

      getGoogleLoginInfo(data) {
        if (data.detail.event === 'afterSuccess') {
          this.afterSuccess(data.detail.response);
        }
      }
    }


    /**
     * start creating dynamic component
     */

    const template =  (this.sessionService.get('templates').components && this.sessionService.get('templates').components.login)  ? this.sessionService.get('templates').components.login.html : templates.login.html;
    const tmpCss = (this.sessionService.get('templates').components && this.sessionService.get('templates').components.login)  ? this.sessionService.get('templates').components.login.css : templates.login.css;
    const importsArray = [
      CommonModule,
      RouterModule,
      FormsModule,
      ReactiveFormsModule,
    ];

    const inputOutputObject = {
      'appConfig': this.appConfig,
      'headerData': this.headerData,
      'showFbSignIn': this.showFbSignIn
    };

    const componentConfig: IDynamicCompilerData = {
      templateRef: this.loginContainer,
      template: template,
      css: tmpCss,
      imports: importsArray,
      rootClass: DynamicLoginComponentTemp,
      inputData: inputOutputObject
    };


    dynamicCompilerService.createComponentFactory(componentConfig);
  }

  /**
   * change event from fugu tel input
   */
  phoneChange(event,fc?: FormControl) {
    const data = event.detail;
    this.country_code = data.dialCode
    this.phone = data.value
    if (fc) {
      fc.setValue(data.value);
  }
  }
}
