/**
 * Created by cl-macmini-51 on 01/05/18.
 */
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { SessionService } from '../../services/session.service';
import { LoaderService } from '../../services/loader.service';
import { UserRightsService } from './user-rights.service';
import { AppService } from '../../app.service';
import { PopupModalService } from '../../modules/popup/services/popup-modal.service';
import { MessageType } from '../../constants/constant';

declare var $: any;

// import * as $ from 'jquery';

@Component({
  selector: 'app-user-rights',
  templateUrl: './user-rights.html',
  styleUrls: ['./user-rights.scss']
})
export class UserRightsComponent implements OnInit, AfterViewInit {
  public appConfig;
  public userRights;
  public terminology;
  public userRightsForm: any;
  public errorMessage: any;
  public langJson: any = {};
  public ecomView: boolean;
  public languageSelected: any;
  public direction = 'ltr';
  public headerData;
  appData: any;
  languageStrings: any={};
  constructor(protected sessionService: SessionService, protected loader: LoaderService,
    protected formBuilder: FormBuilder, protected userRightService: UserRightsService, protected popup: PopupModalService,
    public appService: AppService) {
    this.ecomView = (this.sessionService.get('config').business_model_type === 'ECOM') &&
      (this.sessionService.get('config').nlevel_enabled === 2);
    this.buildForm();
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

  ngOnInit() {
    this.headerData = this.sessionService.get('config');
    this.appConfig = this.sessionService.get('config');
    this.appData = this.sessionService.get('appData');
    if (this.appConfig.terminology) {
      this.terminology = this.appConfig.terminology;
    }
    if (this.appData && this.appData.user_rights && this.appData.user_rights.length) {
      this.userRights = this.appData.user_rights || [];
    }
    this.loader.hide();
    // ================language json manupilation======================
    this.appService.langPromise.then(() => {
      this.langJson = this.appService.getLangJsonData();
    })
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
     this.languageStrings.gdpr_customer_rights  = (this.languageStrings.gdpr_customer_rights || "GDPR Customer Rights")
     .replace('CUSTOMER_RIGHTS', this.terminology.CUSTOMER_RIGHTS);
    });
  }

  ngAfterViewInit() {
  }

  buildForm() {
    this.userRightsForm = this.formBuilder.group({
      'userRightOption': ['0', [Validators.required]],
      'description': ['']
    });
  }

  getChangedRight() {
    if (this.userRightsForm.value.userRightOption !== '0') {
      this.errorMessage = null;
    }
  }

  registerUserRights() {

    if (this.userRightsForm.value.userRightOption === '0') {
      this.errorMessage = this.languageStrings.please_choose_valid_option || 'Please choose valid option.'
      return;
    }
    this.loader.show();
    const obj = {
      'description': this.userRightsForm.value.description,
      'right_type': this.userRightsForm.value.userRightOption,
    };
    if (this.sessionService.get('appData')) {
      obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    this.userRightService.setUserRights(obj)
      .subscribe(
        response => {
          try {
            if (response.status === 200) {
              this.buildForm();
              this.popup.showPopup(MessageType.SUCCESS, 2000, this.languageStrings.submitted_successfully || 'Submitted Successfully.', false);
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
