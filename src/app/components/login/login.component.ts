import { MessageType, PhoneMinMaxValidation } from './../../constants/constant';
import { Component, OnInit, OnChanges, Input, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { ValidationService } from '../../services/validation.service';
import { LoginService } from './login.service';
import { SessionService } from '../../services/session.service';
import { PopUpService } from '../../modules/popup/services/popup.service';
import { LoaderService } from '../../services/loader.service';
import { MessageService } from '../../services/message.service';
import { PopupModalService } from '../../modules/popup/services/popup-modal.service';
import { AppService } from '../../app.service';
import { AppCartService } from '../catalogue/components/app-cart/app-cart.service';
import { GoogleAnalyticsEventsService } from '../../services/google-analytics-events.service';
import { ExternalLibService } from '../../services/set-external-lib.service';
import { GoogleAnalyticsEvent } from '../../enums/enum';
import { FBPixelService } from '../../services/fb-pixel.service';
import { Preview, onPreview } from '../../themes/swiggy/modules/app/classes/preview.class';
import { ThemeService } from '../../services/theme.service';

declare var $: any;
declare var FB: any;
declare var OAuth: any;
enum SocialLoginType {
  'INSTAGRAM' = 'insta',
  'FACEBOOK' = 'fb'
}

enum ResponseTypes {
  'SUCCESS' = 200,
  'NOT_REGISTERED' = 405
}

// import * as $ from 'jquery';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent extends Preview implements OnInit, OnChanges, onPreview, OnDestroy {
  previousUrl: any;
  guestSignupData: any;
  guestCheckoutForm: any;
  showGuestCheckoutflow: boolean;
  emailMessage: any;
  public config: any;
  loginForm: any;
  // appConfig: any;
  fbloginForm: any;
  bg_color = '#fffff';
  profile_color = '#fffff';
  path;
  country_code = '91';
  phone;
  emailDisabled: boolean;
  otpId="";
  subscription: Subscription;
  signupShown = true;
  public langJson: any = {};
  formSettings: any;
  public languageArray: any;
  public languageSelected: any;
  public direction = 'ltr';
  @Input('appConfig') appConfig;
  private _h;
  @Input('headerData') headerData;
  public socialLogin: string = '';
  @Input('showFbSignIn') showFbSignIn;
  socialData: any = {};
  responseTypes = ResponseTypes;
  socialLoginType = SocialLoginType;
  loginFrom = '';

  themeData: any = {};
  loginViaOtpFlow: any;
  otpForm: any;
  showOtpPopUp: boolean=false;
  languageStrings: any={};
  constructor(protected formBuilder: FormBuilder, protected service: LoginService, protected sessionService: SessionService,
    protected router: Router, protected popup: PopupModalService, protected loader: LoaderService,
    protected messageService: MessageService, protected appService: AppService,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService, public fbPixelService: FBPixelService,
    protected cd: ChangeDetectorRef, public appCart: AppCartService, protected extService: ExternalLibService, protected themeService: ThemeService) {
    super(themeService);
  }
  protected initContructorOperations() {
    this.loginForm = this.formBuilder.group({
      'phone_email': ['', [Validators.required]],
      'password':['']
    });
    if(this.appConfig && !this.appConfig.vendor_otp_login_sign_up)
    {
      // this.loginForm.addControl('password', new FormControl('', [Validators.required,ValidationService.passwordValidator]));
      this.loginForm.get('password').setValidators([Validators.required,ValidationService.passwordValidator]); }
    this.fbloginForm = this.formBuilder.group({
      'email': ['', [Validators.required, ValidationService.emailValidator]],
      'phone': ['', [Validators.required]],
    });
    this.subscription = this.messageService.getClearForm().subscribe(message => {
      this.loginForm.value.password = null;
      this.loginForm.reset();
    });
   
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.path = val.url.toString();
      }
    });
    if (this.sessionService.get('config')) {
      this.signupShown = this.sessionService.get('config')['app_signup_allowed'];
    }
    // checks for ar translations
    if (this.sessionService.getString('language')) {
      this.languageSelected = this.sessionService.getString('language');
      if (this.languageSelected === 'ar') {
        this.direction = 'rtl';
      }
      else {
        this.direction = 'ltr';
      }
    }
    else {
      this.languageSelected = 'en';
      if (this.languageSelected === 'ar') {
        this.direction = 'rtl';
      }
      else {
        this.direction = 'ltr';
      }
    }
    this.initGuestFields();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.headerData){
      this.headerData = changes.headerData.currentValue;
      this.appConfig = this.headerData;
    }
  }
  ngOnInit() {
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
    });
    // console.log("-------------login component -- language data---------------------",this.languageStrings);
    this.appConfig = this.sessionService.get('config')
    this.loginViaOtpFlow=this.appConfig.vendor_otp_login_sign_up;
    this.showOtpPopUp=false;
    this.initContructorOperations();
    this.initEvents()
  }

  initEvents(){
   
      $('#loginDialog').on('hide.bs.modal', () => {
        this.showFbSignIn = false;
        // this.cd.detectChanges();
        this.loginForm.reset();
        this.loginForm.updateValueAndValidity();
      });
      
      $('#loginDialog').on('show.bs.modal', () => {
        this.showOtpPopUp = false;
        this.loginViaOtpFlow=this.appConfig.vendor_otp_login_sign_up;
      this.loginForm.reset();
        this.loginForm.updateValueAndValidity();
        this.cd.detectChanges();
        
       
      });
   
   
    if (this.sessionService.get('config') || this.headerData) {
      this.appConfig = this.sessionService.get('config') ? this.sessionService.get('config') : this.headerData;
    }

    this.bg_color = this.sessionService.get('config') ? this.sessionService.get('config').header_color : '';
    this.profile_color = this.sessionService.get('config') ? this.sessionService.get('config').color : '';
    // ================language json manupilation======================
    this.appService.langPromise.then(() => {
      this.langJson = this.appService.getLangJsonData();
    });

    this.themeService.getThemeModuleData('signin').subscribe(res => {
      this.onPreview(res);
      this.cd.detectChanges();
    });

    this.messageService.sendLocationOfLoginSignup
      .pipe(takeWhile(_ => this.alive)).subscribe(message => {
      this.showGuestCheckoutflow=false;
      this.initGuestFields();
      this.loginFrom = message;
    });
  }

  onPreview(data) {
    if (data.signinPopup) {
      this.themeData = data.signinPopup.data;
      this.cd.detectChanges();
    }
  }

  keyDownFunction(event) {
    if(event.keyCode == 13) {
      if(this.loginViaOtpFlow)
      {
        this.verifyLoginOtp(false)

      }
      else
      {
      this.loginCheck();
      }
    }
  }

  loginCheck() {
 
    if (this.appConfig && this.appConfig.is_dual_user_enable === 1) {
   
      this.loginDualUser();
    } else {
 

      this.login();
    }
  }

  loginDualUser() {
    this.loader.show();
    const obj = {
      'phone_no': (this.loginForm.controls.phone_email.value.is_phone) ? this.loginForm.controls.phone_email.value.value : undefined,
      'email': (!this.loginForm.controls.phone_email.value.is_phone) ? this.loginForm.controls.phone_email.value.value.trim() : undefined,
      'password': this.loginForm.value.password,
      'marketplace_reference_id': this.appConfig.marketplace_reference_id
    };

    this.service.loginDual(obj) 
      .subscribe(
        response => {
          try {
            if (response.status === 200) {
              if(this.sessionService.is_netcore_enabled){
                try {
                  (<any>window).smartech('contact', '4', {
                    'pk^email': this.loginForm.controls.phone_email.value.is_phone ? this.loginForm.controls.phone_email.value.value : undefined,
                    'mobile': (!this.loginForm.controls.phone_email.value.is_phone) ? this.loginForm.controls.phone_email.value.value : undefined,
                    // 'FIRST_NAME': 'test'
                    });
                    if(!this.loginForm.controls.phone_email.value.is_phone){
                      (<any>window).smartech('identify', this.loginForm.controls.phone_email.value.value);
                    }
                } catch (e) {
                  console.warn(e);
                } 
              }
              this.afterSuccess(response);
            } else {
              this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.sign_in_failure,
                this.loginForm.controls.phone_email.value ? this.loginForm.controls.phone_email.value.value : '', this.loginFrom, '');
              this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
            }
          } catch (e) {
    
            this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.sign_in_failure,
              this.loginForm.controls.phone_email.value ? this.loginForm.controls.phone_email.value.value : '', this.loginFrom, '');
          }
          this.loader.hide();
        },
        error => {
          console.error(error);
          this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.sign_in_failure,
            this.loginForm.controls.phone_email.value ? this.loginForm.controls.phone_email.value.value : '', this.loginFrom, '');
        }
      );
  }


  login() {
    this.loader.show();
    const obj = {
      'phone_no': (this.loginForm.controls.phone_email.value.is_phone) ? this.loginForm.controls.phone_email.value.value : undefined,
      'email': (!this.loginForm.controls.phone_email.value.is_phone) ? this.loginForm.controls.phone_email.value.value.trim() : undefined,
      'password': this.loginForm.value.password,
      'marketplace_reference_id': this.sessionService.get("reference_id")?this.sessionService.get("reference_id"):this.appConfig.marketplace_reference_id,
      'device_token':this.sessionService.get("device_token") ||  this.sessionService.get("device_token_app")
    };
     this.service.login(obj)
      .subscribe(
        response => {
          try {
            if (response.status === 200) {
              if(this.sessionService.is_netcore_enabled){
                try {
                  (<any>window).smartech('contact', '4', {
                    'pk^email': (!this.loginForm.controls.phone_email.value.is_phone) ? this.loginForm.controls.phone_email.value.value : undefined,
                    'mobile' : (this.loginForm.controls.phone_email.value.is_phone) ? this.loginForm.controls.phone_email.value.value : undefined,
                    // 'FIRST_NAME': 'test'
                    });
                if(!this.loginForm.controls.phone_email.value.is_phone){
                      (<any>window).smartech('identify', this.loginForm.controls.phone_email.value.value);
                    }
                } catch (e) {
                  console.warn(e);
                } 
              }
              this.afterSuccess(response);
            } else {
              this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.sign_in_failure,
                this.loginForm.controls.phone_email.value ? this.loginForm.controls.phone_email.value.value : '', this.loginFrom, '');
              this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
            }
          } catch (e) {
            console.error(e);
            this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.sign_in_failure,
              this.loginForm.controls.phone_email.value ? this.loginForm.controls.phone_email.value.value : '', this.loginFrom, '');
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
            this.loginForm.controls.phone_email.value ? this.loginForm.controls.phone_email.value.value : '', this.loginFrom, '');
        }
      );
  }
  //login via access token
  loginViaAccessToken(access_token) {
    this.loader.show();
    const obj = {
      'phone_no': (this.loginForm.controls.phone_email.value.is_phone) ? this.loginForm.controls.phone_email.value.value : undefined,
      'email': (!this.loginForm.controls.phone_email.value.is_phone) ? this.loginForm.controls.phone_email.value.value.trim() : undefined,
      'access_token': access_token,
      'marketplace_reference_id': this.appConfig.marketplace_reference_id,
      'device_token':this.sessionService.get("device_token") ||  this.sessionService.get("device_token_app")
    };
  
    this.service.accessTokenLogin(obj)
      .subscribe(
        response => {
          try {
            if (response.status === this.responseTypes.SUCCESS) {
              this.showOtpPopUp=false;
              if(this.sessionService.is_netcore_enabled){
                try {
                  (<any>window).smartech('contact', '4', {
                    'pk^email': (!this.loginForm.controls.phone_email.value.is_phone) ? this.loginForm.controls.phone_email.value.value : undefined,
                    'mobile' : (this.loginForm.controls.phone_email.value.is_phone) ? this.loginForm.controls.phone_email.value.value : undefined,
                    // 'FIRST_NAME': 'test'
                    });
                if(!this.loginForm.controls.phone_email.value.is_phone){
                      (<any>window).smartech('identify', this.loginForm.controls.phone_email.value.value);
                    }
                } catch (e) {
                  this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
                } 
              }
              this.afterSuccess(response);
            } else {
              this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.sign_in_failure,
                this.loginForm.controls.phone_email.value ? this.loginForm.controls.phone_email.value.value : '', this.loginFrom, '');
              this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
            }
          } catch (e) {
            console.error(e);
            this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.sign_in_failure,
              this.loginForm.controls.phone_email.value ? this.loginForm.controls.phone_email.value.value : '', this.loginFrom, '');
          }
          this.loader.hide();
        },
        error => {
          console.error(error);
          this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.sign_in_failure,
            this.loginForm.controls.phone_email.value ? this.loginForm.controls.phone_email.value.value : '', this.loginFrom, '');
        }
      );
  }

  signInWithFb() {
    if (this.socialLogin == this.socialLoginType.FACEBOOK) {
      //const that = this;
      FB.login((response) => {
   
        if (response.authResponse) {
          const authResponse = response.authResponse;
         
          FB.api('/me?fields=name,email,picture.type(large)', (response) => {
          
            const fb_name = response.name;
            // const vendor_image = response.picture.data.url
            const vendor_image = 'https://graph.facebook.com/'+authResponse.userID+'/picture?type=large&width=400&height=400';
      

            this.loader.show();
            const obj = {
              'email': this.fbloginForm.value.email,
              'first_name': fb_name,
              'fb_token': authResponse.userID,
              'domain_name': this.sessionService.getString('domain'),
              'phone_no': '+' + this.country_code + ' ' + this.phone,
              'marketplace_reference_id': this.appConfig.marketplace_reference_id,
              'vendor_image': vendor_image
            };
            this.service.registerUsingFacebook(obj)
              .subscribe(
                response => {
                  try {
                    if (response.status === 200) {
                      this.showFbSignIn = false;
                      this.cd.detectChanges();
                      this.afterSuccess(response);
                    } else {
                      this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.sign_in_failure, this.fbloginForm.value.email ? this.fbloginForm.value.email : '', this.loginFrom, '');
                      this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
                    }
                  } catch (e) {
                    console.error(e);
                    this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.sign_in_failure, this.fbloginForm.value.email ? this.fbloginForm.value.email : '', this.loginFrom, '');
                  }
                  this.loader.hide();
                },
                error => {
                  console.error(error);
                  this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.sign_in_failure, this.fbloginForm.value.email ? this.fbloginForm.value.email : '', this.loginFrom, '');
                }
              );
          });
        } else {
        }
      }, { scope: ['email'] });
    }
  }

  loginWithFacebook() {
    //const that = this;
    FB.login((response) => {
 
      if (response.authResponse) {
        const authResponse = response.authResponse;
    
        FB.api('/me?fields=name,email,picture.type(large)', (response) => {
          // console.log('Good to see you, ' + response.name + '.');
          const fb_name = response.name;
          const fb_email = response.email;
          const vendor_image = 'https://graph.facebook.com/'+authResponse.userID+'/picture?type=large&width=400&height=400';
    

          this.loader.show();
          const obj = {
            'fb_token': authResponse.userID,
            'domain_name': this.sessionService.getString('domain'),
            'marketplace_reference_id': this.appConfig.marketplace_reference_id,
            'vendor_image':vendor_image,
            'device_token':this.sessionService.get("device_token") || this.sessionService.get("device_token_app"),
            'email':fb_email
          };

          this.socialLogin = this.socialLoginType.FACEBOOK;

          if (this.appConfig && this.appConfig.is_dual_user_enable === 1) {
            this.fbLoginDual(obj, fb_name, fb_email, authResponse,vendor_image);
          } else {
            this.fbLogin(obj, fb_name, fb_email, authResponse,vendor_image);
          }
        });
      } else {
      }
    }, { scope: ['email'] });
  }

  fbLogin(obj, fb_name, fb_email, authResponse,vendor_image) {
    this.service.loginUsingFacebook(obj)
      .subscribe(
        response => {
          try {
            const signup_field = this.sessionService.get('config').signup_field;
            if (response.status === 200) {
              this.afterSuccess(response);

            } else if (response.status === 405) {
              const obj = {
                'email': fb_email,
                'first_name': fb_name,
                'fb_token': authResponse.userID,
                'domain_name': this.sessionService.getString('domain'),
                'marketplace_reference_id': this.appConfig.marketplace_reference_id,
                'vendor_image':vendor_image
              };
              if (!fb_email) {
                this.showFbSignIn = true;
                this.cd.detectChanges();
                this.loader.hide();
                return;
              }
             if(signup_field ==0)
               {
              this.registerWithFb(obj);
              }
              else{
                this.messageService.getLoginSignupLocation(this.loginFrom);
                $('#loginDialog').modal('hide');
                $('#signupDialog').modal('show');
                this.messageService.openSignUpPage({
                  'checkAllFields': 1,
                  'response': response.data,
                  'fbData': obj
                });
              }
          
            } else if(signup_field !=0)   // when phone number is not mandatory make a direct hit of the register facebook
            { 
              this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.sign_in_failure, fb_email ? fb_email : '', this.loginFrom, '');
              this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
            }
          } catch (e) {
            console.error(e);
            this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.sign_in_failure, fb_email ? fb_email : '', this.loginFrom, '');
          }
          this.loader.hide();
        },
        error => {
          console.error(error);
          this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.sign_in_failure, fb_email ? fb_email : '', this.loginFrom, '');
        }
      );
  }

  fbLoginDual(obj, fb_name, fb_email, authResponse,vendor_image) {
    this.service.loginUsingFacebookDual(obj)
      .subscribe(
        response => {
          try {
            if (response.status === 200) {
              this.afterSuccess(response);

            } else if (response.status === 405) {
              const obj = {
                'email': fb_email,
                'first_name': fb_name,
                'fb_token': authResponse.userID,
                'domain_name': this.sessionService.getString('domain'),
                'marketplace_reference_id': this.appConfig.marketplace_reference_id,
                'vendor_image': vendor_image,
                'device_token':this.sessionService.get("device_token") || this.sessionService.get("device_token_app") 
              };
              if (!fb_email) {
                this.showFbSignIn = true;
                this.cd.detectChanges();
                this.loader.hide();
                return;
              }
              this.messageService.getLoginSignupLocation(this.loginFrom);
              $('#loginDialog').modal('hide');
              $('#signupDialog').modal('show');
              this.messageService.openSignUpPage({
                // 'showTrue' : 0,
                // 'showOTP': 0,
                // 'signup_template_data': [],
                'checkAllFields': 1,
                'response': response.data,
                'fbData': obj
              });
            } else {
              this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.sign_in_failure, fb_email ? fb_email : '', this.loginFrom, '');
              this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
            }
          } catch (e) {
            console.error(e);
            this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.sign_in_failure, fb_email ? fb_email : '', this.loginFrom, '');
          }
          this.loader.hide();
        },
        error => {
          console.error(error);
          this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.sign_in_failure, fb_email ? fb_email : '', this.loginFrom, '');
        }
      );
  }


  loginWithInstagram() {

    OAuth.initialize(this.sessionService.get('config').instagram_app_id);
    // Use popup for OAuth
    OAuth.popup('instagram').then(instagram => {
 
      // Retrieves user data from OAuth provider by using #get() and
      // OAuth provider url
      this.loader.show();
      instagram.get('/v1/users/self').then(data => {
    

        const obj = {
          'instagram_token': data.data.id,
          'domain_name': this.sessionService.getString('domain'),
          'marketplace_reference_id': this.appConfig.marketplace_reference_id
        };
        this.socialLogin = this.socialLoginType.INSTAGRAM;
        this.socialData = {
          'first_name': data.data.full_name,
          'instagram_token': data.data.id,
          'domain_name': this.sessionService.getString('domain'),
          'marketplace_reference_id': this.appConfig.marketplace_reference_id
        };

        if (this.appConfig && this.appConfig.is_dual_user_enable === 1) {
          this.instagramLoginDualApi(obj, data.data.full_name);
        } else {
          this.instagramLoginApi(obj, data.data.full_name);
        }
      })
    });


  }


  instagramLoginDualApi(instaData, name) {
    this.service.loginUsingInstagramDual(instaData)
      .subscribe(
        response => {
          try {
            if (response.status === this.responseTypes.SUCCESS) {
              this.afterSuccess(response);

            } else if (response.status === this.responseTypes.NOT_REGISTERED) {

              this.openSignupDialog(response, instaData, name);

            } else {
              this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.sign_in_failure, '', this.loginFrom, '');
              this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
            }
          } catch (e) {
            console.error(e);
            this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.sign_in_failure, '', this.loginFrom, '');
          }
          this.loader.hide();
        },
        error => {
          console.error(error);
          this.loader.hide();
          this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.sign_in_failure, '', this.loginFrom, '');
        }
      );
  }

  instagramLoginApi(instaData, name) {
    this.service.loginUsingInstagram(instaData)
      .subscribe(
        response => {
          try {
            if (response.status === this.responseTypes.SUCCESS) {
              this.afterSuccess(response);

            } else if (response.status === this.responseTypes.NOT_REGISTERED) {
              this.openSignupDialog(response, instaData, name);

            } else {
              this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.sign_in_failure, '', this.loginFrom, '');
              this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
            }
          } catch (e) {
            console.error(e);
            this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.sign_in_failure, '', this.loginFrom, '');
          }
          this.loader.hide();
        },
        error => {
          console.error(error);
          this.loader.hide();
          this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.sign_in_failure, '', this.loginFrom, '');
        }
      );
  }

  openSignupDialog(response, instaData, name) {
    const obj = {

      'first_name': name,
      'instagram_token': instaData.instagram_token,
      'domain_name': this.sessionService.getString('domain'),
      'marketplace_reference_id': this.appConfig.marketplace_reference_id
    };
    // this.showFbSignIn = true;
    // this.cd.detectChanges();
    // this.loader.hide();
    this.messageService.getLoginSignupLocation(this.loginFrom);
    $('#loginDialog').modal('hide');
    $('#signupDialog').modal('show');
    this.messageService.openSignUpPage({
      'showTrue': 0,
      'showOTP': 0,
      'signup_template_data': [],
      'instaData': obj
    });
    this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
  }


  afterSuccess(response,fromRegister?:any) {
    this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.sign_in_success,
      this.loginForm.controls.phone_email.value ? this.loginForm.controls.phone_email.value.value : '', this.loginFrom, '');
      if(!fromRegister)
      {
        this.loader.hide();
      }
    this.fbPixelService.emitEvent('Lead', '');
    if (response.data.formSettings[0].is_otp_enabled && !response.data.vendor_details.is_phone_verified && !(this.appConfig.is_guest_checkout_enabled && parseInt(response.data.vendor_details.is_guest_account))) {
      this.messageService.getLoginSignupLocation(this.loginFrom);
      $('#loginDialog').modal('hide');
      $('#signupDialog').modal('show');
      this.messageService.openSignUpPage({
        // 'showTrue': 0,
        // 'showOTP': response.data.vendor_details.is_phone_verified === 0 ||
        // !response.data.vendor_details.is_phone_verified ? 1 : 0,
        // 'signup_template_data': response.data.signup_template_data
        'checkAllFields': 1,
        'response': response.data
      });
      this.cd.detectChanges();
      
      return;
    } else if (response.data.formSettings[0].is_email_verification_required && !response.data.vendor_details.is_email_verified && !(this.appConfig.is_guest_checkout_enabled && parseInt(response.data.vendor_details.is_guest_account))) {
      this.messageService.getLoginSignupLocation(this.loginFrom);
      $('#loginDialog').modal('hide');
      $('#signupDialog').modal('show');
      this.messageService.openSignUpPage({
        'checkAllFields': 1,
        'response': response.data
      });
      this.cd.detectChanges();
      
      return;
    } else if (response.data.vendor_details.registration_status !== 1 && response.data.signup_template_data.length && !(this.appConfig.is_guest_checkout_enabled && parseInt(response.data.vendor_details.is_guest_account))) {
      this.messageService.getLoginSignupLocation(this.loginFrom);
      $('#loginDialog').modal('hide');
      $('#signupDialog').modal('show');
      this.messageService.openSignUpPage({
        //
        'checkAllFields': 1,
        'response': response.data
      });
      this.cd.detectChanges();
      
      return;
    } else if (this.sessionService.get('config').is_subscription_enabled && !response.data.vendor_details.paid && !(this.appConfig.is_guest_checkout_enabled && parseInt(response.data.vendor_details.is_guest_account))) {
      this.messageService.getLoginSignupLocation(this.loginFrom);
      $('#loginDialog').modal('hide');
      $('#signupDialog').modal('show');
      this.messageService.openSignUpPage({
        //
        'checkAllFields': 1,
        'response': response.data
      });

      this.cd.detectChanges();
    }
    if ((this.appConfig && this.appConfig.phone_config_for_guest_checkout ==2 || this.appConfig.email_config_for_guest_checkout ==2) && this.appConfig.is_guest_checkout_enabled && parseInt(response.data.vendor_details.is_guest_account)) {
     this.verifyGuestLoginOtp();
      return;
    }
     else {
      this.loader.hide();
      this.sessionService.remove('email');
      this.sessionService.setToString('reg_status', response.data.vendor_details.registration_status);
      this.sessionService.set('appData', response.data);
      this.messageService.sendLoggedIn(true);
      if(response.data && response.data.vendor_details &&  this.sessionService.get('config').bumbl_domain_name && !this.sessionService.isPlatformServer()){
        if(response.data.bumble_keys && response.data.bumble_keys.City)
        {
          (<any>window).mt('send', 'pageview', {email: response.data.vendor_details.email, firstname: response.data.vendor_details.first_name, phone: response.data.vendor_details.phone_no, company:this.sessionService.get('config').user_id,nooforders: response.data.bumble_keys && (response.data.bumble_keys.number_of_orders || response.data.bumble_keys.number_of_orders == 0) ? +response.data.bumble_keys.number_of_orders : undefined,itemincart: this.sessionService.getByKey('app', 'cart') && this.sessionService.getByKey('app', 'cart').length > 0 ? true : false,city_yelo:response.data.bumble_keys.City});      
        }
          else{
              (<any>window).mt('send', 'pageview', {email: response.data.vendor_details.email, firstname: response.data.vendor_details.first_name, phone: response.data.vendor_details.phone_no, company:this.sessionService.get('config').user_id,nooforders: response.data.bumble_keys && (response.data.bumble_keys.number_of_orders || response.data.bumble_keys.number_of_orders == 0) ? +response.data.bumble_keys.number_of_orders : undefined,itemincart: this.sessionService.getByKey('app', 'cart') && this.sessionService.getByKey('app', 'cart').length > 0 ? true : false});
          }
      }
      if (response.data.vendor_details.cookie_accepted) {
        this.messageService.storageRemoved({ data: false });
      } else {
        this.sessionService.remove('cookieEnabled');
        this.messageService.storageRemoved({ data: true });
      }
      $('#loginDialog').modal('hide');
      this.extService.socketRegister(this.sessionService.get('appData').vendor_details.vendor_id);
      this.extService.updateFuguWidget();
      if(fromRegister)
      {
        this.popup.showPopup(MessageType.SUCCESS, 2000, this.languageStrings.registered_successfully  || 'Registered successfully', false);
      }
      else
      {
        this.popup.showPopup(MessageType.SUCCESS, 2000, this.languageStrings.logged_in_successfully || 'Logged in successfully' , false);
      }
      if(this.sessionService.get('config').is_debt_enabled && response.data.vendor_details && response.data.vendor_details.debt_amount > 0 && !(this.appConfig.is_guest_checkout_enabled && parseInt(response.data.vendor_details.is_guest_account))) {
      this.router.navigate(['debtAmount']);
      return;
      }else if(this.sessionService.get('config').is_customer_subscription_enabled && response.data.vendor_details && parseInt(response.data.vendor_details.is_customer_subscription_plan_expired) && !(this.appConfig.is_guest_checkout_enabled && parseInt(response.data.vendor_details.is_guest_account))){
        this.router.navigate(['customerSubscription/subscriptionPlan'])
      }
      const cartData = this.appCart.getCartData();
      this.previousUrl=this.sessionService.get('previousUrl');
      if(this.previousUrl)
      {
        this.sessionService.remove('previousUrl');
        this.router.navigate([this.previousUrl])
      }
      if (cartData && cartData.length && (this.appConfig.business_model_type === 'RENTAL' || this.appConfig.business_model_type === 'ECOM')) {
        this.router.navigate(['checkout']);
      } else {
        if (this.path && this.path.indexOf('store-review') > -1) {
          this.router.navigate(['list']);
        }
      }

    }

  }
  closeLoginPopup() {
    this.messageService.openSignUpPage({});
    $('#loginDialog').on('hidden.bs.modal', (e) => {
      // do something...
      this.messageService.getLoginSignupLocation(this.loginFrom);
      $('#signupDialog').modal('show');
      $('#loginDialog').off('hidden.bs.modal');
    });

    $('#loginDialog').modal('hide');

  }
  openForgotPopup() {
    $('#loginDialog').modal('hide');
    $('#forgotModal').modal('show');
  }

  /**
   * get google login success info
   * @param event
   */
  getGoogleLoginInfo(data) {

    if (data.event === 'afterSuccess') {
      this.afterSuccess(data.response,data.from);
    }
  }
  onSucessGuestVerification()
  {
      this.sessionService.remove('email');
      this.sessionService.setToString('reg_status', this.guestSignupData.data.vendor_details.registration_status);
      this.sessionService.set('appData', this.guestSignupData.data);
      this.extService.socketRegister(this.sessionService.get('appData').vendor_details.vendor_id);
      this.extService.updateFuguWidget();
      this.messageService.sendLoggedIn(true);
      $('#loginDialog').modal('hide');
      this.previousUrl=this.sessionService.get('previousUrl');
      if(this.previousUrl)
      {
        this.sessionService.remove('previousUrl');
        this.router.navigate([this.previousUrl])
      }
      if (this.guestSignupData.data.vendor_details.cookie_accepted) {
        this.messageService.storageRemoved({ data: false });
      } else {
        this.sessionService.remove('cookieEnabled');
        this.messageService.storageRemoved({ data: true });
      }

  }
  openLoginModal() {
 this.showGuestCheckoutflow=false;
  }
   //  Login via otp verification
   checkForGuestOtpVerification(resendFlow?:boolean)
   {
     const obj=
     {
     'marketplace_reference_id': this.appConfig.marketplace_reference_id,
     'marketplace_user_id': this.appConfig.marketplace_user_id.toString(),
     'phone': (this.guestCheckoutForm.controls.phone.value) ? this.guestCheckoutForm.controls.phone.value : undefined,
     'email': (this.guestCheckoutForm.controls.email.value) ? this.guestCheckoutForm.controls.email.value.trim() : undefined,
     'otp': this.otpForm.value.otpValue,
     'login_vendor_via_otp' : 1
     }
     this.service.loginViaOtp(obj).subscribe(response =>{
         try {
           if (response.status === this.responseTypes.SUCCESS) {
             this.showOtpPopUp=false;
               this.onSucessGuestVerification();

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
    'phone': (this.loginForm.controls.phone_email.value.is_phone) ? this.loginForm.controls.phone_email.value.value : undefined,
    'email': (!this.loginForm.controls.phone_email.value.is_phone) ? this.loginForm.controls.phone_email.value.value.trim() : undefined,
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

  //initiate otp form
  initiateOtpForm()
  {  this.otpForm = this.formBuilder.group({
      'otpValue': ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
}

/*
send login otp
*/
verifyGuestLoginOtp(resendOtp?:any) {
  if (this.appConfig.is_guest_checkout_enabled &&  (this.guestSignupData && this.guestSignupData.data  && parseInt(this.guestSignupData.data.vendor_details.is_guest_account)) && this.appConfig.email_config_for_guest_checkout==2)
  {
    this.emailMessage=false;
  }
  else{
    this.emailMessage=true;
  }
  this.showGuestCheckoutflow=false;
   const obj=
  {
  'marketplace_reference_id': this.appConfig.marketplace_reference_id,
  'marketplace_user_id': this.appConfig.marketplace_user_id,
  'phone': (this.guestCheckoutForm.controls.phone.value) ? this.guestCheckoutForm.controls.phone.value : undefined,
  'email': (this.guestCheckoutForm.controls.email.value) ? this.guestCheckoutForm.controls.email.value.trim() : undefined,
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
     const obj=
    {
    'marketplace_reference_id': this.appConfig.marketplace_reference_id,
    'marketplace_user_id': this.appConfig.marketplace_user_id,
    'phone': (this.loginForm.controls.phone_email.value.is_phone) ? this.loginForm.controls.phone_email.value.value : undefined,
    'email': (!this.loginForm.controls.phone_email.value.is_phone) ? this.loginForm.controls.phone_email.value.value.trim() : undefined,
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

  initGuestFields()
  {
    this.guestCheckoutForm = this.formBuilder.group({
      'email': [''],
      'phone':['']
    });
    if(this.appConfig && this.appConfig.email_config_for_guest_checkout)
    {
      this.guestCheckoutForm.controls.email.setValidators([Validators.required, ValidationService.emailValidator]);
    }
    if(this.appConfig && this.appConfig.phone_config_for_guest_checkout)
    {
      this.guestCheckoutForm.controls.phone.setValidators([Validators.required,Validators.minLength(PhoneMinMaxValidation.MIN_LENGTH), Validators.maxLength(PhoneMinMaxValidation.MAX_LENGTH)])
    }
    
  }
showGuestCheckout()
{
  this.showGuestCheckoutflow=true;
}
registerAsGuest()
{ this.guestSignupData={};
  this.loader.show();
  const obj = {
    'email': this.guestCheckoutForm.value.email || null,
    'phone_no': this.guestCheckoutForm.value.phone ? '+' + this.country_code + ' ' + this.guestCheckoutForm.value.phone : null,
    'marketplace_reference_id': this.appConfig.marketplace_reference_id,
    'device_token':this.sessionService.get("device_token") || this.sessionService.get("device_token_app"),
    'guest_checkout_flow':'1'
  };
  this.service.registerGuest(obj).subscribe(response=>
    { if(response.status ==this.responseTypes.SUCCESS)
      {
        this.loader.hide();
        this.guestSignupData=response;
        this.afterSuccess(response)
      }
    else{
      this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
    }
    this.loader.hide();
    },
    error=>
    {
      this.loader.hide();
    })
}
  ngOnDestroy() {
    this.alive = false;
  }
  registerWithFb(signupDirectObjForObj?:any) {
    this.loader.show();
    let obj={};
    if(signupDirectObjForObj)    
     {
     obj=Object.assign({}, signupDirectObjForObj);
      
   // when phone number is not mandatory make a direct hit of the register facebook
    this.service.registerUsingFacebook(obj)
      .subscribe(
        response => {
          try {
            if (response.status === 200) {
              this.afterSuccess(response,'regsiter');
            } else {

              this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
            }
          } catch (e) {

          }
          this.loader.hide();
        },
        error => {
          console.error(error);
          this.loader.show();
        }
      );
  }
}
}
