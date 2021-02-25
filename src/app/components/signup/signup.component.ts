import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { DateTimeAdapter } from 'ng-pick-datetime';
import { Subscription } from 'rxjs';
import { Meta } from '@angular/platform-browser';
import { takeWhile } from 'rxjs/operators';

import { SessionService } from '../../services/session.service';
import { PopUpService } from '../../modules/popup/services/popup.service';
import { LoaderService } from '../../services/loader.service';
import { countrySortedList } from '../../services/countryCodeList.service';
import { MessageService } from '../../services/message.service';
import { PopupModalService } from '../../modules/popup/services/popup-modal.service';
import { AppService } from '../../app.service';
import { GoogleAnalyticsEventsService } from '../../services/google-analytics-events.service';
import { AppCartService } from '../catalogue/components/app-cart/app-cart.service';
import { ValidationService } from '../../services/validation.service';
import { SignupService } from './signup.service';
import { ExternalLibService } from '../../services/set-external-lib.service';
import { GoogleAnalyticsEvent } from '../../enums/enum';
import { PhoneMinMaxValidation, DynamicTemplateDataType, MessageType } from '../../constants/constant';
import { FBPixelService } from '../../services/fb-pixel.service';
import {TimeFormat} from "../../enums/enum";

declare var $: any;
declare var FB: any;

// import * as $ from 'jquery';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit,OnDestroy {
  previousUrl: any;
  minDateForFuture: Date;
  showSignupBtn: boolean;
  signupForm: any;
  changeEmailForm: any;
  otpForm: any;
  changeNumberForm: any;
  fbData: any = {};
  form: any;
  path;
  showSignUp;
  is_otp_enabled = 0;
  fields: any = [];
  hidePassword = false;
  imageList = {};
  emailDisabled: boolean;
  bg_color = '#fffff';
  loginFrom = '';
  profile_color = '#fffff';
  phone;
  newMobileNumber;
  appConfig: any = {};
  progress: number = 1;
  progressBar: any[] = [];
  signupViaOtp:boolean;
  count: number = 0;
  verifyFields = {};
  verifiedFields = {};
  contact_email: string;
  emailChanged: boolean;
  public termsPolicy = false;
  public showTerms = true;
  public tnc_url = '';
  public countries: any = countrySortedList;
  minDate = new Date();
  public langJson: any = {};
  signUpResponse: any = [];
  public languageSelected: any;
  public direction = 'ltr';
  public messageServiceSubscription: Subscription;
  public instaData;
  public socialLogin: string = '';
  public googleData;
  public timeFormat = TimeFormat;
  // Max moment: April 21 2018, 20:30
  maxDate = new Date();
  @ViewChild('fileInput') fileInput: ElementRef;
  subscription: Subscription;
  signup_field: number;
  country_code = '91';
  alive: boolean = true;
  languageStrings: any={};

  constructor(protected formBuilder: FormBuilder, protected sessionService: SessionService,
    protected router: Router, protected service: SignupService, protected popup: PopupModalService,
    protected loader: LoaderService, protected messageService: MessageService, protected appService: AppService,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService, protected ref: ChangeDetectorRef,
    public appCart: AppCartService, protected dateTimeAdapter: DateTimeAdapter<any>,
    protected extService: ExternalLibService, protected meta: Meta, public fbPixelService: FBPixelService) {
    }

  ngOnInit() {
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
    });
    this.initConstructorFunction();
    this.initEvents();
  }


  /**
   * init events after ngOnInit
   */

  public initEvents() {
    this.progressBar = [];
    this.minDateForFuture = new Date();
    this.minDateForFuture.setDate(new Date().getDate() + 1);
    this.dateTimeAdapter.setLocale(this.sessionService.getString('language'));
    this.signupViaOtp=this.sessionService.get('config').vendor_otp_login_sign_up;
    this.is_otp_enabled = this.sessionService.get('config').is_otp_enabled;
    this.showSignUp = 0;
    this.bg_color = this.sessionService.get('config') ? this.sessionService.get('config').header_color : '';
    this.profile_color = this.sessionService.get('config') ? this.sessionService.get('config').color : '';
    this.appConfig = this.sessionService.get('config');
    this.messageServiceSubscription = this.messageService.openSignUp.subscribe((data) => {
      this.loader.hide();
      if (data.response && !data.fbData && !data.instaData && !data.googleData) {
        this.emailChanged = data.emailChanged ? true : false;
        this.contact_email = data.response.vendor_details['email'];
        this.verificationCheck(data.response);
      }
      else if (data.fbData) {
          this.termsPolicy = false;
          this.hidePassword = true;
          this.showSignUp = 0;
          this.signUpResponse = data.response;
          this.fbData = data.fbData;
          this.socialLogin = 'fb';
          this.phone = null;
          this.signupForm.reset();
          this.signupForm = this.formBuilder.group({
            'email': [data.fbData.email, [Validators.required, ValidationService.emailValidator]],
            'name': [data.fbData.first_name, [Validators.required]],
            'password': [''],
            'phone': ['', [Validators.required, Validators.minLength(PhoneMinMaxValidation.MIN_LENGTH), Validators.maxLength(PhoneMinMaxValidation.MAX_LENGTH)]]
          });
          this.setSignUpFormValidations();     
        this.ref.detectChanges();
      }
      else if (data.instaData) {
        this.termsPolicy = false;
        this.hidePassword = true;
        this.showSignUp = 0;
        this.signUpResponse = [];
        this.instaData = data.instaData;
        this.socialLogin = 'insta';
        this.phone = null;
        this.signupForm.reset();
        this.signupForm = this.formBuilder.group({
          'email': ['', [Validators.required, ValidationService.emailValidator]],
          'name': [data.instaData.first_name, [Validators.required]],
          'password': [''],
          'phone': ['', [Validators.required, Validators.minLength(PhoneMinMaxValidation.MIN_LENGTH), Validators.maxLength(PhoneMinMaxValidation.MAX_LENGTH)]]
        });
        this.setSignUpFormValidations();
        this.ref.detectChanges();
      }
      else if (data.googleData) {
          this.termsPolicy = false;
          this.hidePassword = true;
          this.signUpResponse = [];
          this.googleData = data.googleData;
          this.socialLogin = 'google';
          this.showSignUp = 0;
          this.phone = null;
          this.signupForm.reset();
          this.signupForm = this.formBuilder.group({
            'email': [data.googleData.email, [Validators.required, ValidationService.emailValidator]],
            'name': [data.googleData.first_name, [Validators.required]],
            'password': [''],
            'phone': ['', [Validators.required, Validators.minLength(PhoneMinMaxValidation.MIN_LENGTH), Validators.maxLength(PhoneMinMaxValidation.MAX_LENGTH)]]
          });
          this.setSignUpFormValidations();    
        this.ref.detectChanges();
      }
      else if (data == null || !data.response || !data.fbData || !data.instaData || !data.googleData) {
        this.termsPolicy = false;
        this.hidePassword = false;
        this.socialLogin='';
        this.fbData = {};
        this.showSignUp = 0;
        this.emptyFormValue();
        this.ref.detectChanges();
      }
    });
    if(!this.sessionService.isPlatformServer()){
      this.getPoliciesData();
    }
    this.messageService.sendLocationOfLoginSignup
      .pipe(takeWhile(_ => this.alive)).subscribe(message => {
        let runOtpFlow=document.getElementById("signViaOtp")
        if(this.signupViaOtp && this.is_otp_enabled && runOtpFlow)
        { this.hidePassword=true;
          this.showSignupBtn=true;
          this.signupForm.get('password').clearValidators();
          this.signupForm.get('password').updateValueAndValidity();
          this.ref.detectChanges();
        }    
        this.loginFrom = message;
      });
    // ================language json manupilation======================
    this.appService.langPromise.then(() => {
      this.langJson = this.appService.getLangJsonData();
    });
  }

  setSignUpFormValidations(){
    this.signup_field = this.sessionService.get('config').signup_field;
    switch (this.signup_field) {
      case 0:
        {
          this.signupForm.controls.email.setValidators([Validators.required, ValidationService.emailValidator]);
          this.signupForm.controls.phone.setValidators([Validators.minLength(PhoneMinMaxValidation.MIN_LENGTH), Validators.maxLength(PhoneMinMaxValidation.MAX_LENGTH)])
          break;
        }
      case 1:
        {
          this.signupForm.controls.email.setValidators([ValidationService.emailValidator])
          this.signupForm.controls.phone.setValidators([Validators.required, Validators.minLength(PhoneMinMaxValidation.MIN_LENGTH), Validators.maxLength(PhoneMinMaxValidation.MAX_LENGTH)])
          break;
        }
      case 2:
        {
          this.signupForm.controls.email.setValidators([Validators.required, ValidationService.emailValidator]);
          this.signupForm.controls.phone.setValidators([Validators.required, Validators.minLength(PhoneMinMaxValidation.MIN_LENGTH), Validators.maxLength(PhoneMinMaxValidation.MAX_LENGTH)])
          break;
        }
      default:
        break;
    }
  }

  initConstructorFunction(){

    this.signup_field = this.sessionService.get('config').signup_field
    this.signupForm = this.formBuilder.group({
      'email': [''],
      'password': ['',[Validators.required, ValidationService.passwordValidator]],
      'name': ['', [Validators.required]],
      'phone': ['']
    });
    let runOtpFlow=document.getElementById("signViaOtp")
    if(this.signupViaOtp && this.is_otp_enabled && runOtpFlow)
    { this.hidePassword=true;
      this.showSignupBtn=true;
      this.signupForm.get('password').clearValidators();
      this.signupForm.get('password').updateValueAndValidity();
      this.ref.detectChanges();
    }
    switch (this.signup_field) {
      case 0:
        {
          this.signupForm.controls.email.setValidators([Validators.required, ValidationService.emailValidator]);
          this.signupForm.controls.phone.setValidators([Validators.minLength(PhoneMinMaxValidation.MIN_LENGTH), Validators.maxLength(PhoneMinMaxValidation.MAX_LENGTH)])
          break;
        }
      case 1:
        {
          this.signupForm.controls.email.setValidators([ValidationService.emailValidator])
          this.signupForm.controls.phone.setValidators([Validators.required, Validators.minLength(PhoneMinMaxValidation.MIN_LENGTH), Validators.maxLength(PhoneMinMaxValidation.MAX_LENGTH)])
          break;
        }
      case 2:
        {
          this.signupForm.controls.email.setValidators([Validators.required, ValidationService.emailValidator]);
          this.signupForm.controls.phone.setValidators([Validators.required, Validators.minLength(PhoneMinMaxValidation.MIN_LENGTH), Validators.maxLength(PhoneMinMaxValidation.MAX_LENGTH)])
          break;
        }
      default:
        break;
    }

    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.path = val.url.toString();
      }
    });
    // checks for ar translations
    if (this.sessionService.getString('language')) {
      this.languageSelected = this.sessionService.getString('language');
      if (this.languageSelected === 'ar') {
        this.direction = 'rtl';
      } else {
        this.direction = 'ltr';
      }
    } else {
      this.languageSelected = 'en';
      if (this.languageSelected === 'ar') {
        this.direction = 'rtl';
      } else {
        this.direction = 'ltr';
      }
    }
  }







  /**
   * get policies data
   */
  getPoliciesData() {
    const payload = {};
    payload['marketplace_reference_id'] = this.sessionService.get('config').marketplace_reference_id;
    this.service.getPoliciesData(payload).subscribe(response => {
      if (response.status === 200) {
        this.showTerms = true;
        if (response.data.tnc_type === 1) {
          this.tnc_url = response.data.tnc_user_link;
        } else {
          this.tnc_url = '';
        }
      } else {
        this.showTerms = false;
        //this.popup.showPopup(MessageType.ERROR, 3000, response.message, false);
      }
    });
  }


  verificationCheck(data) {
    this.progressBar = [];
    this.count = 0;
    this.progress = 1;
    this.signUpResponse = data;
    // progress bar data
    this.verifyFields['mail'] = 0;
    this.verifiedFields['mailVerified'] = 0;
    if (data.formSettings[0]['is_email_verification_required'] && !data.vendor_details.is_email_verified) {
      this.verifyFields['mail'] = 1;
      this.verifiedFields['mailVerified'] = 0;
      this.count++;
      this.progressBar.push(this.count);
    }
    this.verifyFields['otp'] = 0;
    this.verifiedFields['otpVerified'] = 0;
    if (data.formSettings[0]['is_otp_enabled'] && !data.vendor_details.is_phone_verified) {
      this.verifyFields['otp'] = 1;
      this.verifiedFields['otpVerified'] = 0;
      this.count++;
      this.progressBar.push(this.count);
    }
    this.verifyFields['form'] = 0;
    this.verifiedFields['formVerified'] = 0;
    let regStatus = this.sessionService.getString('reg_status');
    if (data !== null && data.signup_template_data && data.signup_template_data.length && regStatus !== '1') {
      this.verifyFields['form'] = 1;
      this.verifiedFields['formVerified'] = 0;
      this.count++;
      this.progressBar.push(this.count);
    }

    this.verifyFields['fee'] = 0;
    this.verifiedFields['feeVerified'] = 0;
    if (this.appConfig['is_subscription_enabled'] && data.vendor_details.paid === 0) {
      this.verifyFields['fee'] = 1;
      this.verifiedFields['feeVerified'] = 0;
      this.count++;
      this.progressBar.push(this.count);
      this.sessionService.set('appData', data);
    }


    //verificationdata
    if (this.verifyFields['mail'] === 0 && this.verifyFields['otp'] === 0 && this.verifyFields['form'] === 0 && this.verifyFields['fee'] === 0) {
      this.verifiedFields['mailVerified'] = 1;
      this.verifiedFields['otpVerified'] = 1;
      this.verifiedFields['formVerified'] = 1;
      this.verifiedFields['feeVerified'] = 1;
      this.verifyFields['mail'] = 1;
      this.verifyFields['otp'] = 1;
      this.verifyFields['form'] = 1;
      this.verifyFields['fee'] = 1;
      this.checkWhichAreVerified(data, '');
      this.termsPolicy = false;
      this.hidePassword = false;
      this.fbData = {};
      this.showSignUp = 0;
      this.emptyFormValue();  
      this.ref.detectChanges();
    } else if (this.verifyFields['otp']) {
      this.hidePassword = false;
      this.showSignUp = 1;
      this.fbData = {};
      this.otpForm = this.formBuilder.group({
        'otpValue': ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
      });
      this.subscription = this.messageService.getClearForm().subscribe(message => {
        this.otpForm.value.otpValue = null;
        this.otpForm.reset();
      });
      this.emptyFormValue();
      this.ref.detectChanges();
    } else if (this.verifyFields['mail']) {
      this.checkEmailVerification();
      this.ref.detectChanges();
    } else if (this.verifyFields['form']) {
      this.hidePassword = false;
      this.showSignUp = 3;
      this.fbData = {};
      this.fields = data.signup_template_data;
      if (this.fields.length) {
        const group: any = {};

        this.fields.forEach(question => {
          if (question.data_type === 'Image') {
            this.imageList[question.label] = [];
          }
          if (question.data_type == 'Multi-Select'){
              group[question.label] = question.required ? new FormControl( null, [Validators.required])
              : new FormControl(null);
            }

         else if (question.data_type == 'Single-Select'){
            group[question.label] = question.required ? new FormControl(null, [Validators.required])
              : new FormControl(null);
          }
         else if (question.data_type !== 'Checkbox' && question.data_type !== 'Email') {
            group[question.label] = question.required ? new FormControl(question.data || null, [Validators.required])
              : new FormControl(question.data || null);
          } else if (question.data_type === 'Email') {
            group[question.label] = question.required ? new FormControl(question.data || null, [ValidationService.emailValidator])
              : new FormControl(question.data || null, [ValidationService.emailValidator]);
          } else {
            group[question.label] = question.required ? new FormControl(question.data, [Validators.required])
              : new FormControl(question.data);
          }
          if (question.data_type === 'Single-Select') {
            question.allowed_values_modified = [];
            for (let i = 0; i < question.allowed_values.length; i++) {
              question.allowed_values_modified.push({
                label: question.allowed_values[i],
                value: question.allowed_values[i]
              });
            }
          }
        });
        this.form = this.formBuilder.group(group);
      }
      this.emptyFormValue();
      this.ref.detectChanges();
    } else if (this.verifyFields['fee']) {
      this.showSignUp = 6;
    }
  }

  emptyFormValue() {
    this.signupForm.value.email = null;
    this.signupForm.value.password = null;
    this.signupForm.value.name = null;
    this.signupForm.value.phone = null;
    this.phone = null;
    $('.fugu-tel-input').val(null);
    this.signupForm.reset();
  }

  registerCheck() {

    if (this.appConfig && this.appConfig.is_dual_user_enable === 1) {
      this.registerDualUser();
    } else {
      this.register();
    }
  }

  registerDualUser() {
    if (!this.termsPolicy && this.showTerms) {
      this.popup.showPopup(MessageType.SUCCESS, 2000, this.languageStrings.please_agree_terms_service_and_privacy_policy || 'Please agree the Terms of Service and Privacy Policy.', false);
      return;
    }
    this.loader.show();
    const obj = {
      'email': this.signupForm.value.email,
      'password': this.signupForm.value.password,
      'first_name': this.signupForm.value.name,
      'phone_no': this.phone ? '+' + this.country_code + ' ' + this.phone : '',
      'marketplace_reference_id': this.appConfig.marketplace_reference_id,
      'device_token':this.sessionService.get("device_token") ||  this.sessionService.get("device_token_app")
      // 'marketplace_reference_id': this.sessionService.getString('marketplace_reference_id')
    };
    this.service.registerDual(obj)
      .subscribe(
        response => {
          try {
            if (response.status === 200) {
              try {
                if(this.sessionService.is_netcore_enabled){
                  (<any>window).smartech('contact', '4', {
                    'pk^email': this.signupForm.value.email,
                    'mobile': this.phone,
                    'FIRST_NAME': this.signupForm.value.name
                    });
                }
                if(this.signupForm.value.email){
                  (<any>window).smartech('identify', this.signupForm.value.email);    
                }
              } catch (e) {
                console.warn(e);
              }     
              //set user id
              this.sessionService.set('user_id', response.data.vendor_details.user_id);
              if (response.data.formSettings[0].is_vendor_verification_required) {
                this.popup.showPopup(MessageType.SUCCESS, 2000,  this.languageStrings.you_will_receive_a_confirmation_when_your_profile_is_verified  || 'You will receive a confirmation when your profile is verified', false);
              }

              // this.showSignUp = 3;
              this.verificationCheck(response.data);

              //this.afterAllVerificationUser(response);


            } else {
              this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.signup_failure, this.signupForm.value.email ? this.signupForm.value.email : '', this.loginFrom, '');
              this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
            }
          } catch (e) {
            this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.signup_failure, this.signupForm.value.email ? this.signupForm.value.email : '', this.loginFrom, '');
          }
          this.loader.hide();
        },
        error => {
          console.error(error);
          this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.signup_failure, this.signupForm.value.email ? this.signupForm.value.email : '', this.loginFrom, '');
        }
      );
  }



   register() {
    if (!this.termsPolicy && this.showTerms) {
      this.popup.showPopup(MessageType.SUCCESS, 2000, this.languageStrings.please_agree_terms_service_and_privacy_policy  || 'Please agree the Terms of Service and Privacy Policy.', false);
      return;
    }
    this.loader.show();
    const obj = {
      'email': this.signupForm.value.email || null,
      'password': this.signupForm.value.password,
      'first_name': this.signupForm.value.name,
      'phone_no': this.phone ? '+' + this.country_code + ' ' + this.phone : null,
      'marketplace_reference_id': this.appConfig.marketplace_reference_id,
      'device_token':this.sessionService.get("device_token") || this.sessionService.get("device_token_app") 
    };
    this.contact_email = this.signupForm.value.email;
    this.service.register(obj) 
      .subscribe(
        response => {
          try {
            if (response.status === 200) {
              try {
                if(response.data && response.data.vendor_details && this.sessionService.get('config').bumbl_domain_name && !this.sessionService.isPlatformServer()){
                  let date = new Date().toISOString();
                  if(response.data.bumble_keys && response.data.bumble_keys.City)
                  {
                      (<any>window).mt('send', 'pageview', {email: response.data.vendor_details.email, firstname: response.data.vendor_details.first_name, phone: response.data.vendor_details.phone_no, nooforders: response.data.bumble_keys && (response.data.bumble_keys.number_of_orders || response.data.bumble_keys.number_of_orders == 0) ? +response.data.bumble_keys.number_of_orders : undefined,company:this.sessionService.get('config').user_id,signup_date:date,itemincart:this.sessionService.getByKey('app', 'cart') &&  this.sessionService.getByKey('app', 'cart').length > 0 ? true : false, city_yelo: response.data.bumble_keys.City});
                  }
                    else{   
                      (<any>window).mt('send', 'pageview', {email: response.data.vendor_details.email, firstname: response.data.vendor_details.first_name, phone: response.data.vendor_details.phone_no, nooforders: response.data.bumble_keys && (response.data.bumble_keys.number_of_orders || response.data.bumble_keys.number_of_orders == 0) ? +response.data.bumble_keys.number_of_orders : undefined,company:this.sessionService.get('config').user_id,signup_date:date,itemincart:this.sessionService.getByKey('app', 'cart') &&  this.sessionService.getByKey('app', 'cart').length > 0 ? true : false});
                    }
                }
                if(this.sessionService.is_netcore_enabled){
                  (<any>window).smartech('contact', '4', {
                    'pk^email': this.signupForm.value.email,
                    'mobile': this.phone,
                    'FIRST_NAME': this.signupForm.value.name
                    });
                }
                if(this.signupForm.value.email){
                  (<any>window).smartech('identify', this.signupForm.value.email);    
                }
              } catch (e) {
                console.warn(e);
              }     
              if (response.data.formSettings[0].is_vendor_verification_required) {
                this.popup.showPopup(MessageType.SUCCESS, 2000, this.languageStrings.you_will_receive_a_confirmation_when_your_profile_is_verified || 'You will receive a confirmation when your profile is verified', false);
          
              }
              // this.showSignUp = 3;
              this.verificationCheck(response.data);
              //this.afterAllVerificationUser(response);
            } else {
              this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.signup_failure, this.signupForm.value.email ? this.signupForm.value.email : '', this.loginFrom, '');
              this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
            }
          } catch (e) {
            this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.signup_failure, this.signupForm.value.email ? this.signupForm.value.email : '', this.loginFrom, '');
          }
          this.loader.hide();
        },
        error => {
          console.error(error);
          this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.signup_failure, this.signupForm.value.email ? this.signupForm.value.email : '', this.loginFrom, '');
        }
      );
  }

  registerWithFbCheck() {
    if (this.appConfig && this.appConfig.is_dual_user_enable === 1) {
      this.registerWithFbDual();
    } else {
      this.registerWithFb();
    }
  }

  registerWithInstaCheck() {
    if (this.appConfig && this.appConfig.is_dual_user_enable === 1) {
      this.registerWithInstaDual();
    } else {
      this.registerWithInsta();
    }
  }

  registerWithGoogleCheck() {
    if (this.appConfig && this.appConfig.is_dual_user_enable === 1) {
      this.registerWithGoogleDual();
    } else {
      this.registerWithGoogle();
    }
  }

  registerWithFbDual() {
    if (!this.termsPolicy && this.showTerms) {
      this.popup.showPopup(MessageType.SUCCESS, 2000,
        this.languageStrings.please_confirm_if_you_agree_to_our_terms_of_service_and_privacy_policy || 'Please confirm if you agree to our Terms of Service and Privacy Policy.', false);
      return;
    }
    this.loader.show();
    const obj = {
      'email': this.signupForm.value.email,
      'first_name': this.signupForm.value.name,
      'fb_token': this.fbData.fb_token,
      'phone_no': '+' + this.country_code + ' ' + this.phone,
      'marketplace_reference_id': this.appConfig.marketplace_reference_id,
      'vendor_image':this.fbData.vendor_image,
      'device_token':this.sessionService.get("device_token") || this.sessionService.get("device_token_app") 
    };

    this.service.registerUsingFacebookDual(obj)
      .subscribe(
        response => {
          try {
            if (response.status === 200) {
              this.contact_email = response.data.vendor_details.email;
              this.verificationCheck(response.data);
              //this.afterAllVerificationUser(response);
            } else {
              this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.signup_failure, this.signupForm.value.email ? this.signupForm.value.email : '', this.loginFrom, '');
              this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
            }
          } catch (e) {
            this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.signup_failure, this.signupForm.value.email ? this.signupForm.value.email : '', this.loginFrom, '');
          }
          this.loader.hide();
        },
        error => {
          console.error(error);
          this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.signup_failure, this.signupForm.value.email ? this.signupForm.value.email : '', this.loginFrom, '');
        }
      );
  }

  registerWithFb() {
    this.loader.show();
    if (!this.termsPolicy && this.showTerms) {
      this.popup.showPopup(MessageType.SUCCESS, 2000,
        this.languageStrings.please_confirm_if_you_agree_to_our_terms_of_service_and_privacy_policy || 'Please confirm if you agree to our Terms of Service and Privacy Policy.', false);
      return;
    }
   const obj = {
      'email': this.signupForm.value.email || undefined,
      'first_name': this.signupForm.value.name,
      'fb_token': this.fbData.fb_token,
      'phone_no': this.phone ? '+' + this.country_code + ' ' + this.phone : undefined, 
      'marketplace_reference_id': this.appConfig.marketplace_reference_id,
      'vendor_image':this.fbData.vendor_image,
      'device_token':this.sessionService.get("device_token") || this.sessionService.get("device_token_app") 
      };
     
   
   // when phone number is not mandatory make a direct hit of the register facebook
    this.service.registerUsingFacebook(obj)
      .subscribe(
        response => {
          try {
            if (response.status === 200) {
              this.contact_email = response.data.vendor_details.email;
              this.verificationCheck(response.data);

            } else {
              this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.signup_failure, this.signupForm.value.email ? this.signupForm.value.email : '', this.loginFrom, '');
              this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
            }
          } catch (e) {
            this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.signup_failure, this.signupForm.value.email ? this.signupForm.value.email : '', this.loginFrom, '');
          }
          this.loader.hide();
        },
        error => {
          console.error(error);
          this.loader.show();
          this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.signup_failure, this.signupForm.value.email ? this.signupForm.value.email : '', this.loginFrom, '');
        }
      );
  }

  registerWithInsta() {
    if (!this.termsPolicy && this.showTerms) {
      this.popup.showPopup(MessageType.SUCCESS, 2000,
        this.languageStrings.please_confirm_if_you_agree_to_our_terms_of_service_and_privacy_policy ||'Please confirm if you agree to our Terms of Service and Privacy Policy.', false);
      return;
    }
    this.loader.show();
    const obj = {
      'email': this.signupForm.value.email || undefined,
      'first_name': this.signupForm.value.name,
      'instagram_token': this.instaData.instagram_token,
      'phone_no': this.phone ? '+' + this.country_code + ' ' + this.phone : undefined,
      'marketplace_reference_id': this.appConfig.marketplace_reference_id,
      'device_token':this.sessionService.get("device_token") || this.sessionService.get("device_token_app") 
    };

    this.service.registerUsingInstagram(obj)
      .subscribe(
        response => {
          try {
            if (response.status === 200) {
              this.contact_email = response.data.vendor_details.email;
              this.verificationCheck(response.data);
              //this.afterAllVerificationUser(response);

            } else {
              this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.signup_failure, this.signupForm.value.email ? this.signupForm.value.email : '', this.loginFrom, '');
              this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
            }
          } catch (e) {
            console.error(e);
            this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.signup_failure, this.signupForm.value.email ? this.signupForm.value.email : '', this.loginFrom, '');
          }
          this.loader.hide();
        },
        error => {
          console.error(error);
          this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.signup_failure, this.signupForm.value.email ? this.signupForm.value.email : '', this.loginFrom, '');
        }
      );
  }


  registerWithInstaDual() {
    if (!this.termsPolicy && this.showTerms) {
      this.popup.showPopup(MessageType.SUCCESS, 2000,
        this.languageStrings.please_confirm_if_you_agree_to_our_terms_of_service_and_privacy_policy ||'Please confirm if you agree to our Terms of Service and Privacy Policy.', false);
      return;
    }
    this.loader.show();
    const obj = {
      'email': this.signupForm.value.email,
      'first_name': this.signupForm.value.name,
      'instagram_token': this.instaData.instagram_token,
      'phone_no': '+' + this.country_code + ' ' + this.phone,
      'marketplace_reference_id': this.appConfig.marketplace_reference_id,
      'device_token':this.sessionService.get("device_token") || this.sessionService.get("device_token_app") 
      // 'marketplace_reference_id': this.sessionService.getString('marketplace_reference_id')
    };

    this.service.registerUsingInstagramDual(obj)
      .subscribe(
        response => {
          try {
            if (response.status === 200) {
              this.contact_email = response.data.vendor_details.email;
              this.verificationCheck(response.data);
              //this.afterAllVerificationUser(response);

            } else {
              this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.signup_failure, this.signupForm.value.email ? this.signupForm.value.email : '', this.loginFrom, '');
              this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
            }
          } catch (e) {
            console.error(e);
            this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.signup_failure, this.signupForm.value.email ? this.signupForm.value.email : '', this.loginFrom, '');
          }
          this.loader.hide();
        },
        error => {
          console.error(error);
          this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.signup_failure, this.signupForm.value.email ? this.signupForm.value.email : '', this.loginFrom, '');
        }
      );
  }


  registerWithGoogle() {
    this.loader.show();
    if (!this.termsPolicy && this.showTerms) {
      this.popup.showPopup(MessageType.SUCCESS, 2000,
        this.languageStrings.please_confirm_if_you_agree_to_our_terms_of_service_and_privacy_policy ||'Please confirm if you agree to our Terms of Service and Privacy Policy.', false);
      return;
    }
     const obj = {
        'email': this.signupForm.value.email || undefined,
        'first_name': this.signupForm.value.name,
        'google_token': this.googleData.google_token,
        'phone_no': this.phone ? '+' + this.country_code + ' ' + this.phone : undefined,
        'marketplace_reference_id': this.appConfig.marketplace_reference_id,
        'vendor_image': this.googleData.vendor_image,
        'device_token':this.sessionService.get("device_token") || this.sessionService.get("device_token_app") 
      }; 
      
    this.service.registerUsingGoogle(obj)
      .subscribe(
        response => {
          try {
            if (response.status === 200) {
              this.contact_email = response.data.vendor_details.email;
              this.verificationCheck(response.data);
              //this.afterAllVerificationUser(response);

            } else {
              this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.signup_failure, this.signupForm.value.email ? this.signupForm.value.email : '', this.loginFrom, '');
              this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
            }
          } catch (e) {
            console.error(e);
            this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.signup_failure, this.signupForm.value.email ? this.signupForm.value.email : '', this.loginFrom, '');
          }
          this.loader.hide();
        },
        error => {
          console.error(error);
          this.loader.show();
          this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.signup_failure, this.signupForm.value.email ? this.signupForm.value.email : '', this.loginFrom, '');
        }
      );
  }


  registerWithGoogleDual() {
    if (!this.termsPolicy && this.showTerms) {
      this.popup.showPopup(MessageType.SUCCESS, 2000,
        this.languageStrings.please_confirm_if_you_agree_to_our_terms_of_service_and_privacy_policy || 'Please confirm if you agree to our Terms of Service and Privacy Policy.', false);
      return;
    }
    this.loader.show();
    const obj = {
      'email': this.signupForm.value.email,
      'first_name': this.signupForm.value.name,
      'google_token': this.googleData.google_token,
      'phone_no': '+' + this.country_code + ' ' +  this.phone,
      'marketplace_reference_id': this.appConfig.marketplace_reference_id,
      'vendor_image': this.googleData.vendor_image,
    };

    this.service.registerUsingGoogleDual(obj)
      .subscribe(
        response => {
          try {
            if (response.status === 200) {
              this.contact_email = response.data.vendor_details.email;
              this.verificationCheck(response.data);
              //this.afterAllVerificationUser(response);

            } else {
              this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.signup_failure, this.signupForm.value.email ? this.signupForm.value.email : '', this.loginFrom, '');
              this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
            }
          } catch (e) {
            console.error(e);
            this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.signup_failure, this.signupForm.value.email ? this.signupForm.value.email : '', this.loginFrom, '');
          }
          this.loader.hide();
        },
        error => {
          console.error(error);
          this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.signup_failure, this.signupForm.value.email ? this.signupForm.value.email : '', this.loginFrom, '');
        }
      );
  }



  
  // ================check otp verification need================
  checkOTPVerificationNeed(response) {

    this.is_otp_enabled = this.sessionService.get('config').is_otp_enabled;
    this.signUpResponse = response;
    if (this.is_otp_enabled === 1) {
      this.showSignUp = 1;
      this.otpForm = this.formBuilder.group({
        'otpValue': ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
      });
      this.subscription = this.messageService.getClearForm().subscribe(message => {
        this.otpForm.value.otpValue = null;
        this.otpForm.reset();
      });
    } else {
      this.checkExtraTemplate(response);
    }
  }

  checkOtpVerification() {
    if (this.appConfig && this.appConfig.is_dual_user_enable === 1) {
      this.otpDualVerification();
    } else {
      this.otpVerification();
    }
  }

  otpDualVerification() {
    this.loader.show();
    const obj = {
      'otp': this.otpForm.value.otpValue,
      'vendor_id': this.signUpResponse.vendor_details.vendor_id,
      'access_token': this.signUpResponse.vendor_details.app_access_token,
      'marketplace_user_id': this.signUpResponse.vendor_details.marketplace_user_id,
      'user_id': this.sessionService.get('user_id')
    };


    this.service.otpDualVerify(obj)
      .subscribe(
        response => {
          try {
            if (response.status === 200) {
              // this.popup.showPopup(MessageType.SUCCESS, 2000, 'OTP verified successfully', false);
              // this.checkExtraTemplate(this.signUpResponse);
              //this.checkEmailVerification();
              this.progress++;
              this.verifiedFields['otpVerified'] = 1;
              this.checkStepToOpen('');
              this.messageService.profilePhone({
                reload: true
              });
              this.checkWhichAreVerified(this.signUpResponse, '');
            } else {
              this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
            }
          } catch (e) {
            console.error(e);
          }
          this.loader.hide();
        },
        error => {
          console.error(error);
        }
      );
  }

  otpVerification() {
    this.loader.show();
    const obj = {
      'otp': this.otpForm.value.otpValue,
      'vendor_id': this.signUpResponse.vendor_details.vendor_id,
      'access_token': this.signUpResponse.vendor_details.app_access_token,
      'marketplace_user_id': this.signUpResponse.vendor_details.marketplace_user_id
    };


    this.service.otpVerify(obj)
      .subscribe(
        response => {
          try {
            if (response.status === 200) {
              // this.popup.showPopup(MessageType.SUCCESS, 2000, 'OTP verified successfully', false);
              //this.checkEmailVerification();
              this.progress++;
              this.verifiedFields['otpVerified'] = 1;
              this.checkStepToOpen('');
              //     this.checkExtraTemplate(this.signUpResponse);
              this.messageService.profilePhone({
                reload: true
              });
              this.checkWhichAreVerified(this.signUpResponse, '');
            } else {
              this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
            }
          } catch (e) {
            console.error(e);
          }
          this.loader.hide();
        },
        error => {
          console.error(error);
        }
      );
  }
  // =======================resend otp=========================

  checkResendOTP() {
    if (this.appConfig && this.appConfig.is_dual_user_enable === 1) {
      this.resendDualOTP();
    } else {
      this.resendOTP();
    }
  }

  resendDualOTP() {
    this.loader.show();
    const obj = {
      'vendor_id': this.signUpResponse.vendor_details.vendor_id,
      'access_token': this.signUpResponse.vendor_details.app_access_token,
      'marketplace_user_id': this.signUpResponse.vendor_details.marketplace_user_id
    };

    this.service.otpDualResend(obj)
      .subscribe(
        response => {
          try {
            if (response.status === 200) {
              this.popup.showPopup(MessageType.SUCCESS, 2000, this.languageStrings.otp_has_been_resent_successfully || 'OTP has been resent successfully', false);
            } else {
              this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
            }
          } catch (e) {
            console.error(e);
          }
          this.loader.hide();
        },
        error => {
          console.error(error);
        }
      );
  }


  resendOTP() {
    this.loader.show();
    const obj = {
      'vendor_id': this.signUpResponse.vendor_details.vendor_id,
      'access_token': this.signUpResponse.vendor_details.app_access_token,
      'marketplace_user_id': this.signUpResponse.vendor_details.marketplace_user_id,
      'language': this.sessionService.getString("language")
    };

    this.service.otpResend(obj)
      .subscribe(
        response => {
          try {
            if (response.status === 200) {
              this.popup.showPopup(MessageType.SUCCESS, 2000, this.languageStrings.otp_has_been_resent_successfully || 'OTP has been resent successfully', false);
            } else {
              this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
            }
          } catch (e) {
            console.error(e);
          }
          this.loader.hide();
        },
        error => {
          console.error(error);
        }
      );
  }


  // =========================resend Email=================

  checkResendMail() {
    if (this.appConfig && this.appConfig.is_dual_user_enable === 1) {
      this.resendDualMail();
    } else {
      this.resendMail();
    }
  }

  resendDualMail() {
    this.loader.show();
    const obj = {
      'email': this.contact_email,
      'marketplace_user_id': this.signUpResponse.vendor_details.marketplace_user_id
    };

    if (this.emailChanged) {
      obj['change_vendor_profile'] = 1
    }

    this.service.mailDualResend(obj)
      .subscribe(
        response => {
          try {
            // console.log('response',response);
            if (response.status == 200) {
              this.popup.showPopup(MessageType.SUCCESS, 2000, this.languageStrings.email_has_been_resent_successfully || 'Email has been resent successfully', false);
            } else {
              this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
            }
          } catch (e) {
            console.error(e);
          }
          this.loader.hide();
        },
        error => {
          console.error(error);
        }
      );
  }

  resendMail() {
    this.loader.show();
    const obj = {
      'email': this.contact_email,
      'marketplace_user_id': this.signUpResponse.vendor_details.marketplace_user_id
    };

    if (this.emailChanged) {
      obj['change_vendor_profile'] = 1
    }

    this.service.mailResend(obj)
      .subscribe(
        response => {
          try {
            if (response.status == 200) {
              this.popup.showPopup(MessageType.SUCCESS, 2000, this.languageStrings.email_has_been_resent_successfully || 'Email has been resent successfully' , false);
            } else {
              this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
            }
          } catch (e) {
            console.error(e);
          }
          this.loader.hide();
        },
        error => {
          console.error(error);
        }
      );
  }

  /**
   * check email verified
   */
  checkEmailVerified() {

    const obj = {
      'marketplace_reference_id': this.appConfig.marketplace_reference_id,
      'marketplace_user_id': this.signUpResponse.vendor_details.marketplace_user_id,
      'vendor_id': this.signUpResponse.vendor_details.vendor_id,
      'access_token': this.signUpResponse.vendor_details.app_access_token,
      'device_token':this.sessionService.get("device_token") || this.sessionService.get("device_token_app") 
    };
    this.loader.show();
    this.service.accessTokenLogin(obj)
      .subscribe(
        response => {
          this.loader.hide();
          try {
            if (response.status === 200) {
              if (response.data.vendor_details.is_email_verified === 1) {
                this.messageService.profilePhone({
                  reload: true
                });
                this.verifiedFields['mailVerified'] = 1;
                this.progress++;
                this.checkStepToOpen('');
                //this.checkExtraTemplate(this.signUpResponse);
                //this.checkWhichAreVerified(this.signUpResponse, '');
              } else {
                this.popup.showPopup(MessageType.ERROR, 2000, this.languageStrings.your_email_is_not_verified_please_verify_your_email_first  || 'Your email is not verified. Please verify your email first.', false);
              }
            } else {
              this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
            }
          } catch (e) {
            console.error(e);
          }
          this.loader.hide();
        },
        error => {
          console.error(error);
        }
      );
  }

  /**
   * change email
   */
  changeEmail() {
    this.showSignUp = 5;
    this.changeEmailForm = this.formBuilder.group({
      'newEmailAddress': ['', [Validators.required, ValidationService.emailValidator]]
    });
  }

  /**
   * change email api
   */
  changeEmailVerification() {
    if (this.appConfig && this.appConfig.is_dual_user_enable === 1) {
      this.changeDualMail();
    } else {
      this.changeMail();
    }
  }

  changeDualMail() {
    this.loader.show();
    const obj = {
      'email': this.signUpResponse.vendor_details.email,
      'new_email': this.changeEmailForm.controls.newEmailAddress.value,
      'marketplace_user_id': this.signUpResponse.vendor_details.marketplace_user_id
    };

    this.service.changeEmailDualApi(obj)
      .subscribe(
        response => {
          try {
            if (response.status == 200) {
              this.contact_email = this.changeEmailForm.controls.newEmailAddress.value;
              this.popup.showPopup(MessageType.SUCCESS, 2000, this.languageStrings.email_changed_successfully || 'Email changed successfully', false);
              this.goBackToEmailVerification();

            } else {
              this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
            }
          } catch (e) {
            console.error(e);
          }
          this.loader.hide();
        },
        error => {
          console.error(error);
        }
      );
  }

  changeMail() {
    this.loader.show();
    const obj = {
      'email': this.signUpResponse.vendor_details.email,
      'new_email': this.changeEmailForm.controls.newEmailAddress.value,
      'marketplace_user_id': this.signUpResponse.vendor_details.marketplace_user_id
    };

    this.service.changeEmailApi(obj)
      .subscribe(
        response => {
          try {
            if (response.status == 200) {
              this.contact_email = this.changeEmailForm.controls.newEmailAddress.value;
              this.popup.showPopup(MessageType.SUCCESS, 2000, this.languageStrings.email_changed_successfully  || 'Email changed successfully', false);
              this.goBackToEmailVerification();

            } else {
              this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
            }
          } catch (e) {
            console.error(e);
          }
          this.loader.hide();
        },
        error => {
          console.error(error);
        }
      );
  }

  goBackToEmailVerification() {
    this.showSignUp = 4;
  }

  // ====================change mobile number========================
  changeMobileNumberUI() {
    this.showSignUp = 2;
    this.changeNumberForm = this.formBuilder.group({
      'newMobileNumber': ['', [Validators.required, Validators.minLength(PhoneMinMaxValidation.MIN_LENGTH), Validators.maxLength(PhoneMinMaxValidation.MAX_LENGTH)]]
    });
    this.newMobileNumber = null;
    this.subscription = this.messageService.getClearForm().subscribe(message => {
      this.changeNumberForm.value.newMobileNumber = null;
      //$('#fugu-phone').val(null);
      $('.fugu-tel-input').val(null);
      this.changeNumberForm.reset();
    });

  }

  goBackToOTP() {
    this.showSignUp = 1;
    this.otpForm = this.formBuilder.group({
      'otpValue': ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
    this.subscription = this.messageService.getClearForm().subscribe(message => {
      this.otpForm.value.otpValue = null;
      this.otpForm.reset();
    });
  }

  changeNumberVerification() {

    this.loader.show();
    const obj = {
      'phone_no': '+' + this.country_code + ' ' + this.newMobileNumber,
      'vendor_id': this.signUpResponse.vendor_details.vendor_id,
      'access_token': this.signUpResponse.vendor_details.app_access_token,
      'marketplace_user_id': this.signUpResponse.vendor_details.marketplace_user_id
    };

    this.service.changeNumberHit(obj)
      .subscribe(
        response => {
          try {
            if (response.status === 200) {
              this.showSignUp = 1;
              this.popup.showPopup(MessageType.SUCCESS, 2000, this.languageStrings.phone_number_changed_successfully  ||'Phone number changed successfully', false);
            } else {
              this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
            }
          } catch (e) {
            console.error(e);
          }
          this.loader.hide();
        },
        error => {
          console.error(error);
        }
      );
  }

  /**
   * check which step to open
   */
  checkStepToOpen(response) {
    if (this.verifyFields['otp'] && !this.verifiedFields['otpVerified']) {
      this.showSignUp = 1;
    } else if (this.verifyFields['mail'] && !this.verifiedFields['mailVerified']) {
      this.showSignUp = 4;
    } else if (this.verifyFields['form'] && !this.verifiedFields['formVerified']) {
      this.showSignUp = 3;
      this.checkExtraTemplate(this.signUpResponse);
    } else if (this.verifyFields['fee'] && !this.verifiedFields['feeVerified']) {
      if (response) {
        this.sessionService.setToString('reg_status', response.data.registration_status);
      }
      this.showSignUp = 6;
    } else {
      this.showSignUp = 0;
      this.checkWhichAreVerified(this.signUpResponse, response ? response.data : '');
    }
  }

  checkEmailVerification() {
    if (this.verifyFields['mail']) {
      this.showSignUp = 4;
    }
    else
      this.checkExtraTemplate(this.signUpResponse);
  }
  checkExtraTemplate(response) {
    this.fields = response && response.signup_template_data ? response.signup_template_data : [];
    if (this.fields.length) {
      this.showSignUp = 3;
      const group: any = {};
      this.fields.forEach(question => {
       if (question.data_type === 'Image') {
          this.imageList[question.label] = [];
          group[question.label] = new FormControl(question.data);
        } else if (question.data_type === 'Checkbox' && question.data_type !== 'Email') {

          group[question.label] = question.required ? new FormControl(question.data, [Validators.required])
            : new FormControl(question.data);

        } else if (question.data_type === 'Email') {
          group[question.label] = question.required ? new FormControl(question.data || null, [ValidationService.emailValidator])
            : new FormControl(question.data || null, [ValidationService.emailValidator]);
        } else {
          group[question.label] = question.required ? new FormControl(question.data || null, [Validators.required])
            : new FormControl(question.data || null);
        }

      if (question.data_type === 'Single-Select') {
        question.allowed_values_modified = [];
        for (let i = 0; i < question.allowed_values.length; i++) {
          question.allowed_values_modified.push({
            label: question.allowed_values[i],
            value: question.allowed_values[i]
          });
        }
      }
      });
 this.form = this.formBuilder.group(group);
    } 
  }

  fieldsRegister() {

    this.loader.show();
    const obj = {
      'marketplace_reference_id': this.appConfig.marketplace_reference_id,
      'marketplace_user_id': this.signUpResponse.vendor_details.marketplace_user_id,
      'vendor_id': this.signUpResponse.vendor_details.vendor_id,
      'access_token': this.signUpResponse.vendor_details.app_access_token,
      'template_name': this.signUpResponse.signup_template_name,
    };
    obj['fields'] = [];

    for (let i = 0; i < this.fields.length; i++) {
      const field = this.fields[i];
      let data;
      if (field.data_type === DynamicTemplateDataType.IMAGE) {
        if (field.required && !this.imageList[field.label].length) {
          this.popup.showPopup(MessageType.ERROR, 2000, field.label + ' cannot be empty', false);
          this.loader.hide();
          return;
        }
        data = this.imageList[field.label];
      } else {
        if (field.required && !this.form.controls[field.label].value) {
          this.popup.showPopup(MessageType.ERROR, 2000, field.label + ' is required ', false);
          this.loader.hide();
          return;
        }
        if(field.data_type == 'Multi-Select' || field.data_type == 'Single-Select') {
          if (field.data_type == 'Multi-Select'){
            data = [];
            for (let i = 0 ; i < this.form.controls[field.label].value.length ; i++) {
              data.push(this.form.controls[field.label].value[i].name);
            }
          }
          else if (field.data_type == 'Single-Select'){
            data = this.form.controls[field.label].value;

          }
        }
        else {
          data = this.form.controls[field.label].value;
          
        }
        if (field.data_type === DynamicTemplateDataType.DATE
          || field.data_type === DynamicTemplateDataType.DATE_PAST
          || field.data_type === DynamicTemplateDataType.DATE_FUTURE
          || field.data_type === DynamicTemplateDataType.DATE_TIME
          || field.data_type === DynamicTemplateDataType.DATE_TIME_FUTURE
          || field.data_type === DynamicTemplateDataType.DATE_TIME_PAST) {
          if (data) {
            const tempDate = new Date(data);
            tempDate.setTime(tempDate.getTime() + + (-1 * new Date().getTimezoneOffset() * 60 * 1000));
            data = tempDate;
          }
        }
      }
      obj['fields'].push({
        'label': field.label,
        'data': data,
      });
    }

    this.service.fieldsRegister(obj)
      .subscribe(
        response => {
          try {
            if (response.status === 200) {
              this.showSignUp = 3;
              this.progress++;
              this.verifiedFields['formVerified'] = 1;
              this.checkStepToOpen(response);
              //this.checkWhichAreVerified(this.signUpResponse, response.data);
              //this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.signup_success, this.sessionService.get('appData').vendor_details.email);
              //this.sessionService.setToString('reg_status', response.data.registration_status);
              //this.messageService.sendLoggedIn(true);
              //$('#signupDialog').modal('hide');
              //this.sessionService.remove('cookieEnabled');
              //this.messageService.storageRemoved({ data: true });
              //this.popup.showPopup(MessageType.SUCCESS, 2000, this.langJson['Registered successfully'], false);
              //const cartData = this.appCart.getCartData();
              //if (cartData && cartData.length && (this.appConfig.business_model_type === 'RENTAL' || this.appConfig.business_model_type === 'ECOM')) {
              //  this.router.navigate(['checkout']);
              //} else {
              //  if (this.path.indexOf('store-review') > -1) {
              //    this.router.navigate(['list']);
              //  }
              //}
              // if (this.path.indexOf('store-review') > -1) {
              //  this.router.navigate(['list']);
              // }

            } else {
              this.loader.hide();
              this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
              this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.signup_failure, this.sessionService.get('appData').vendor_details.email, this.loginFrom, '');
             
            }
          } catch (e) {
            this.loader.hide();
            console.error(e);
            this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.signup_failure, this.sessionService.get('appData').vendor_details.email, this.loginFrom, '');
          }
          this.loader.hide();
        },
        error => {
          this.loader.hide();
          console.error(error);
          this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.signup_failure, this.sessionService.get('appData').vendor_details.email, this.loginFrom, '');
        }
      );
  }

  uploadImage(image, id) {
    this.loader.show() ;
    // const obj = {
    //   'ref_image':image
    // };
    const formData = new FormData();
    formData.append('ref_image', image);
    formData.append('language', this.sessionService.getString('language'));
    this.service.uploadImage(formData)
      .subscribe(
        response => {
          try {
            if (response.status === 200) {
              this.imageList[id].push(response.data.ref_image);
              // this.form.get(id).setValue(response.data.ref_image);
              this.form.get(id).clearValidators();
              this.form.get(id).updateValueAndValidity();
            } else {
              this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
            }
          } catch (e) {
            console.error(e);
          }
          this.loader.hide();
        },
        error => {
          console.error(error);
          this.loader.hide();
        }
      );
  }

  openLoginModal() {
    $('#signupDialog').modal('hide');
    //this.messageService.getLoginSignupLocation('From Login Button');
    $('#loginDialog').modal('show');
  }
  onFileChange(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const id = event.target.id;
      reader.readAsDataURL(file);
      reader.onload = () => {
        // this.form.get(id).setValue({
        //   filename: file.name,
        //   filetype: file.type,
        //   value: (reader.result as string).split(',')[1]
        // });
        this.form.get(id).clearValidators();
        this.form.get(id).updateValueAndValidity();

      };
      this.uploadImage(event.target.files[0], id);
    }
  }
  clearFile(name, index) {
  if(this.fileInput.nativeElement && this.fileInput.nativeElement.value)
  {
    this.fileInput.nativeElement.value = '';
  }
    this.imageList[name].splice(index, 1);
  }


  ngOnDestroy() {
    if (this.messageServiceSubscription)
      this.messageServiceSubscription.unsubscribe();
  }


  afterAllVerificationUser(response: any, registerStatus) {
    if (registerStatus) {
      this.sessionService.setToString('reg_status', registerStatus.registration_status);
    } else if (this.sessionService.getString('reg_status')) {
      this.sessionService.setToString('reg_status', this.sessionService.getString('reg_status'))
    } else {
      this.sessionService.setToString('reg_status', response.vendor_details.registration_status);
    }
    this.emailChanged = false;
    this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.signup_success, this.signupForm.value.email ? this.signupForm.value.email : '', this.loginFrom, '');
    this.fbPixelService.emitEvent('CompleteRegistration', '');
    this.sessionService.remove('email');
    this.sessionService.set('appData', response);
    this.sessionService.setToString('marketplace_reference_id', response.marketplace_reference_id);
    // this.progressBar = [];
    if(this.sessionService.get('config').bumbl_domain_name && !this.sessionService.isPlatformServer())
    {
      (<any>window).mt("send", "pageview", {email: this.contact_email, is_registration_completed: true})
    }
    this.popup.showPopup(MessageType.SUCCESS, 2000, this.languageStrings.registered_successfully  || 'Registered successfully', false);
    this.sessionService.remove('cookieEnabled');
    this.messageService.sendLoggedIn(true);
    $('#signupDialog').modal('hide');
    const cartData = this.appCart.getCartData();
    this.previousUrl=this.sessionService.get('previousUrl');
    if (cartData && cartData.length && (this.appConfig.business_model_type === 'RENTAL' || this.appConfig.business_model_type === 'ECOM')) {
      this.router.navigate(['checkout']);
    } else {
      let appData = this.sessionService.get('appData');
      if(this.previousUrl)
       {
        this.sessionService.remove('previousUrl');
      this.router.navigate([this.previousUrl])
       }
       else{
        if(this.appConfig.is_customer_subscription_enabled && appData) {
          this.router.navigate(['/customerSubscription/subscriptionPlan']);
        }
        else if(this.path && this.path.indexOf('store-review') > -1) {
          this.router.navigate(['list']);
        }
       }    
    }
    this.extService.socketRegister(this.sessionService.get('appData').vendor_details.vendor_id);
    this.extService.updateFuguWidget();
    this.showSignUp = 0;
  }

  checkWhichAreVerified(data, registerStatus) {
    let countField = 0;
    let countVerifiedField = 0;

    for (let key in this.verifyFields) {
      if (this.verifyFields.hasOwnProperty(key)) {
        if (this.verifyFields[key] === 1) {
          countField += 1;
        }
      }
    }

    for (let key in this.verifiedFields) {
      if (this.verifiedFields.hasOwnProperty(key)) {
        if (this.verifiedFields[key] === 1) {
          countVerifiedField += 1;
        }
      }
    }


    if (countField === countVerifiedField) {
      this.afterAllVerificationUser(data, registerStatus);
    }
  }

  /**
   * successfull event for fee paid
   */
  successfullLogin(res) {
    if (res.data) {
      this.verifiedFields['feeVerified'] = 1;
      this.checkWhichAreVerified(res.loginData, '');
    }
  }
  showImage(img)
  {
if(img)
{
  window.open(img, '_blank');
}
  }
  removeFocus(event)
  {
    $('input:text').each(function(){
      $(this).trigger('blur');
  })
  }
}
