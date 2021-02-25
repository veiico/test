import { Component, OnInit, ChangeDetectorRef, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { SessionService } from '../../../services/session.service';
import { LoaderService } from '../../../services/loader.service';
import { MessageService } from '../../../services/message.service';

import { OtpVerificationService } from '../otp-verification.service';
import { Subscription, Observable } from 'rxjs';
import { ModalType, MessageType, PhoneMinMaxValidation } from '../../../constants/constant';
import { PopupModalService } from '../../../modules/popup/services/popup-modal.service';
import { ValidationService } from '../../../../app/services/validation.service';
declare var $: any;


@Component({
  selector: 'app-otp-plus-change-password',
  templateUrl: './otp-plus-change-password.component.html',
  styleUrls: ['./otp-plus-change-password.component.scss']
})
export class OtpPlusChangePasswordComponent implements OnInit {
  changePswdForm: FormGroup;
  otpForm: any;
  form: any;
  showOtp = 0;
  is_otp_enabled = 0;
  hidePassword = false;
  phone;
  appConfig: any = {};
  verifyFields = {};
  verifiedFields = {};
  secretToken;
  public langJson: any = {};
  signUpResponse: any = [];
  public direction = 'ltr';
  public messageServiceSubscription: Subscription;
  subscription: Subscription;

  public showPassword: boolean;
  public showPasswordField = true;

  @Input('otpData') otpData: any;
  languageStrings: any={};

  constructor(protected formBuilder: FormBuilder, protected sessionService: SessionService, protected service: OtpVerificationService,
    protected loader: LoaderService, protected messageService: MessageService, protected popup: PopupModalService) { }

  ngOnInit() {
    this.sessionService.langStringsPromise.then(() =>
      {
       this.languageStrings = this.sessionService.languageStrings;
      });
    this.initEvents();
  }

  verificationDialog() {
    this.showOtp = 1;
    this.initOtpVerificationForm();
}

  public initEvents(){
    this.showOtp = 1;
   this.initOtpVerificationForm();
    this.appConfig = this.sessionService.get('config');
    this.messageServiceSubscription = this.messageService.openOtp.subscribe((data) => {
      if (data.response) {
        this.signUpResponse = data.response;
        this.verificationCheck(data.response);
      }
      else{
        this.showOtp = 0;
        this.otpForm.reset();
      }
    });
    this.initChangePasswordForm();
    this.messageService.onOtpModalClose.subscribe(
      (res) => {
        if(res) {
          this.verificationDialog();
        }
      });

      $('#otpDialog').on('hidden.bs.modal',  (e) => {
        this.initOtpVerificationForm();
  })

  }

  initOtpVerificationForm(){
    this.otpForm = this.formBuilder.group({
      'otpValue': ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });

  }

  initChangePasswordForm(){
    this.changePswdForm = this.formBuilder.group({
      newPswd: ['', [Validators.required, ValidationService.passwordValidator]],
      confirmPswd: ['', [Validators.required, ValidationService.passwordValidator]]
    });
  }

verificationCheck(data) {

  this.verifyFields['otp'] = 0;
  this.verifiedFields['otpVerified'] = 0;
  if (data.formSettings[0]['is_otp_enabled']) {
    this.verifyFields['otp'] = 1;
    this.verifiedFields['otpVerified'] = 0;
  }
  this.verifyFields['form'] = 0;
  this.verifiedFields['formVerified'] = 0;

   if (this.verifyFields['otp']) {
    this.hidePassword = false;
    this.showOtp = 1;
    this.initOtpVerificationForm();
    this.subscription = this.messageService.getClearForm().subscribe(message => {
      this.otpForm.value.otpValue = null;
      this.otpForm.reset();
    });
  }
}

otpVerification() {
  this.loader.show();
  const obj = {
    'otp': this.otpForm.value.otpValue,
    'marketplace_reference_id': this.otpData.marketplace_reference_id,
    'language': this.sessionService.getString('language'),
    'phone': this.otpData.phone,
    'email': this.otpData.email
  };


  this.service.otpVerify(obj)
    .subscribe(
      response => {
        try {
          if (response.status === 200) {
            this.secretToken = response.data.secret_token;
            this.showOtp = 3;
            this.initChangePasswordForm();
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
// =======================resend otp=========================


resendOTP() {
  this.loader.show();
  this.initOtpVerificationForm();
  const obj = {
    'marketplace_reference_id': this.otpData.marketplace_reference_id,
    'phone': this.sessionService.resendOTP ? this.sessionService.resendOTP.phone : this.otpData.marketplace_reference_id,
    'email': this.sessionService.resendOTP ? this.sessionService.resendOTP.email : this.otpData.marketplace_reference_id,
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
        this.loader.hide();
      }
    );
}

checkStepToOpen(response) {
  if (this.verifyFields['otp'] && !this.verifiedFields['otpVerified']) {
    this.showOtp = 1;
  }
}

// ====================change mobile number========================
changeMobileNumberUI() {
  $("#otpDialog").modal("hide");
  $("#forgotModal").modal("show");

}
goBackToOTP() {
  $("#otpDialog").modal("show");
  this.showOtp = 1;
  $("#forgotModal").modal("hide");
  this.otpForm = this.formBuilder.group({
    'otpValue': ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
  });
  this.subscription = this.messageService.getClearForm().subscribe(message => {
    this.otpForm.value.otpValue = null;
    this.otpForm.reset();
  });
}



changePassword() {
  const new_pwd = this.changePswdForm.controls.newPswd.value.trim();
  const confirm_Pwd = this.changePswdForm.controls.confirmPswd.value.trim();

  if( new_pwd == confirm_Pwd ){
    this.loader.show();
    const obj = {
      'password': this.changePswdForm.controls.newPswd.value,
      'marketplace_reference_id': this.otpData.marketplace_reference_id,
      'language': this.sessionService.getString('language'),
      'secret_token': this.secretToken
    }

    this.service.resetPassword(obj)
    .subscribe(
      response => {
        try {
          if (response.status === 200) {
            $("#otpDialog").modal("hide");
            $("#loginDialog").modal("show");
            this.popup.showPopup(MessageType.SUCCESS, 2000, (this.languageStrings.password_has_been_changed_successfully || 'Password has been changed successfully'), false);
            this.verificationDialog();
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
        console.error(error);
        this.loader.hide();
      }
    );

  }

  else{
    this.popup.showPopup(MessageType.SUCCESS, 2000, this.languageStrings.new_password_and_confirm_password_do_not_match  || 'New password and confirm password do not match.', false);
  }
  this.initChangePasswordForm();


}


togglePassword(item: string) {
  const el = document.getElementById(item);
  if (!this.showPassword) {
  el.setAttribute('type', 'text');
  this.showPassword = true;
  } else {
  el.setAttribute('type', 'password');
  this.showPassword = false;
  }
  }

  ngOnDestroy(){
    if(this.messageServiceSubscription) {
      this.messageServiceSubscription.unsubscribe();
    }
    if(this.subscription) {
      this.subscription.unsubscribe();
    }

  }
  keyDownFunction(event) {
    if(event.keyCode == 13) {
      this.otpVerification();
    }
  }


}
