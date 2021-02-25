import { MessageType } from './../../../../constants/constant';
/**
 * Created by mba-214 on 18/10/18.
 */
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, Validators } from '@angular/forms';
import { SessionService } from '../../../../services/session.service';
import { LoaderService } from '../../../../services/loader.service';
import { PopUpService } from '../../../../modules/popup/services/popup.service';
import { ProfileService } from '../../profile.service';
import { MessageService } from '../../../../services/message.service';
import { AppService } from '../../../../app.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss', '../../profile.component.scss']
})
export class ChangePasswordComponent implements OnInit {
 public  config: any;
  changePasswordForm;
  public appConfig: any;
  public langJson: any;
  public languageSelected: any;
  public matchPassword: boolean;
  public direction = 'ltr';
  public newPasswordType = 'password';
  public confirmPasswordType = 'password';

  @Output() back: EventEmitter<string> = new EventEmitter<string>();
  @Output() save: EventEmitter<string> = new EventEmitter<string>();
  languageStrings: any={};

  constructor(protected sessionService: SessionService, protected loader: LoaderService, protected popup: PopUpService,
              protected service: ProfileService, protected message: MessageService, protected formBuilder: FormBuilder,
              public appService: AppService) {
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

    this.changePassword();
  }

  ngOnInit() {
    this.loader.hide();
    this.appConfig = this.sessionService.get('config');
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
    });
    this.langJson = this.appService.getLangJsonData();
  }

  /**
   * change password input type
   */
  changeInputType(type) {
    switch(type) {
      case '1':
        if (this.newPasswordType === 'password') {
          this.newPasswordType = 'text';
        } else {
          this.newPasswordType = 'password';
        }
        break;
      case '2':
        if (this.confirmPasswordType === 'password') {
          this.confirmPasswordType = 'text';
        } else {
          this.confirmPasswordType = 'password';
        }
        break;
      default:
        this.newPasswordType = 'password';
        this.confirmPasswordType = 'password';
        break;
    }
  }

  /**
   * change password
   */
  changePassword() {
    this.changePasswordForm = this.formBuilder.group({
      'oldPassword': ['', [Validators.required]],
      'newPassword': ['', [Validators.required]],
      'confirmPassword': ['', [Validators.required]]
    });
  }

  /**
   * change password match
   */
  changeNewPassword() {
    if (this.changePasswordForm.controls.newPassword.value && this.changePasswordForm.controls.confirmPassword.value) {
      if (this.changePasswordForm.controls.newPassword.value !== this.changePasswordForm.controls.confirmPassword.value) {
        this.matchPassword = true;
      } else {
        this.matchPassword = false;
      }
    } else {
      this.matchPassword = false;
    }
  }

  /**
   * go back
   */
  goBack() {
    this.back.emit();
  }

  /**
   * change password hit
   */
  saveChangePassword() {
    if (this.matchPassword) {
      return;
    }
    const obj = {
      'marketplace_reference_id': this.appConfig.marketplace_reference_id,
      'new_password': this.changePasswordForm.controls.newPassword.value,
      'current_password': this.changePasswordForm.controls.oldPassword.value
    };
    if (this.sessionService.get('appData')) {
      obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    this.loader.show();
    this.service.changePassword(obj)
      .subscribe(
        response => {
          this.loader.hide();
          try {
            if (response.status === 200) {
              this.popup.showPopup(MessageType.SUCCESS, 2000, response.message, false);
              let data = this.sessionService.get('appData');
              data.vendor_details.app_access_token = response.data.access_token;
              this.sessionService.set('appData', data);
              this.save.emit();
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
}
