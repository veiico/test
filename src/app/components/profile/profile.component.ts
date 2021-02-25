import { MessageType } from './../../constants/constant';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { SessionService } from '../../services/session.service';
import { LoaderService } from '../../services/loader.service';
import { PopUpService } from '../../modules/popup/services/popup.service';
import { ProfileService } from './profile.service';
import { MessageService } from '../../services/message.service';
import { ValidationService } from '../../services/validation.service';
import { countrySortedList } from '../../services/countryCodeList.service';
import { AppService } from '../../app.service';
import { PhoneMinMaxValidation, DynamicTemplateDataType } from '../../constants/constant';
import { GoogleAnalyticsEvent } from '../../enums/enum';
import { GoogleAnalyticsEventsService } from '../../services/google-analytics-events.service';
import {TimeFormat} from "../../enums/enum";
declare var $: any;

// import * as $ from 'jquery';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  hideChangePassword: any;
  public config: any;
  data;
  appConfig;
  edit = false;
  bg_color = '#fffff';
  profile_color = '#fffff';
  dataCopy = {
    phone_no: '',
    first_name: '',
    email: ''
  };
  phoneForm;
  changePasswordForm;
  changePasswordFlag;
  country_code;
  phoneCopy;
  emailCopy;
  ecomView: boolean;
  templateFields;
  public langJson: any;
  formSettings: any;
  public languageArray: any;
  public languageSelected: any;
  public countries: any = countrySortedList;
  public direction = 'ltr';
  public headerData;
  public signup_field;
  public editTemplate: boolean;
  templateForm: FormGroup;
  dummyFormGroup: FormGroup;
  imageList = {};
  @ViewChild('fileInput') fileInput: ElementRef;
  maxDate = new Date();
  minDate = new Date();
  public profileData;
  image: any;
  imageData: any;
  @ViewChild('profileImage') profileImage: ElementRef;
  isPlatformServer:boolean;
  timeFormat = TimeFormat;
  languageStrings: any={};

  constructor(protected sessionService: SessionService, protected loader: LoaderService, protected popup: PopUpService,
    protected service: ProfileService, protected message: MessageService, protected formBuilder: FormBuilder, public messageService: MessageService,
    public appService: AppService, public googleAnalyticsEventsService: GoogleAnalyticsEventsService) {
    this.phoneForm = this.formBuilder.group({
      'phone': [''],
      'email': ['']
    });
    this.signup_field = this.sessionService.get('config').signup_field;
    if(this.sessionService.get('config').is_guest_checkout_enabled && this.sessionService.get('appData') && parseInt(this.sessionService.get('appData').vendor_details.is_guest_account))
    {
      if(this.sessionService.get('config').email_config_for_guest_checkout && this.sessionService.get('config').phone_config_for_guest_checkout)
      {
       this.signup_field=2;//for email or phone both mandatory
      }
      else if(this.sessionService.get('config').email_config_for_guest_checkout)
      {
        this.signup_field=0;//for email  mandatory
      }
      else if(this.sessionService.get('config').phone_config_for_guest_checkout)
      {
        this.signup_field=1;//for  phone mandatory
      }
    }
    switch (this.signup_field) {
      case 0: {
        this.phoneForm.controls.email.setValidators([Validators.required, ValidationService.emailValidator]);
        this.phoneForm.controls.phone.setValidators([Validators.minLength(PhoneMinMaxValidation.MIN_LENGTH),
        Validators.maxLength(PhoneMinMaxValidation.MAX_LENGTH)]);
        break;
      }
      case 1: {
        this.phoneForm.controls.email.setValidators([ValidationService.emailValidator]);
        this.phoneForm.controls.phone.setValidators([Validators.required,
        Validators.minLength(PhoneMinMaxValidation.MIN_LENGTH), Validators.maxLength(PhoneMinMaxValidation.MAX_LENGTH)]);
        break;
      }
      case 2: {
        this.phoneForm.controls.email.setValidators([Validators.required, ValidationService.emailValidator]);
        this.phoneForm.controls.phone.setValidators([Validators.required,
        Validators.minLength(PhoneMinMaxValidation.MIN_LENGTH), Validators.maxLength(PhoneMinMaxValidation.MAX_LENGTH)]);
        break;
      }
      default:
        break;
    }
    this.ecomView = (this.sessionService.get('config').business_model_type === 'ECOM') &&
      (this.sessionService.get('config').nlevel_enabled === 2);
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
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
    });
    this.isPlatformServer = this.sessionService.isPlatformServer();
    this.hideChangePassword=this.sessionService.get('appData')?this.sessionService.get('appData').vendor_details.is_dummy_password:0;
    this.headerData = this.sessionService.get('config');
    this.loader.hide();
    this.appConfig = this.sessionService.get('config');
    if (this.appConfig.languages && this.appConfig.languages.length) {
      this.languageArray = this.appConfig.languages;
      if (this.sessionService.getString('language')) {
        this.languageSelected = this.sessionService.getString('language');
      } else {
        this.languageSelected = 'en';
      }
    }
    if (!this.isPlatformServer) {
      this.accessTokenLogin();
    }

    this.bg_color = this.sessionService.get('config') ? this.sessionService.get('config').header_color : '';
    this.profile_color = this.sessionService.get('config') ? this.sessionService.get('config').color : '';
    this.message.profilePhoneUpdate.subscribe((data) => {
      if (data.reload && this.sessionService.get('appData')) {
        this.accessTokenLogin();
      }
    });
    // ================language json manupilation======================
    this.appService.langPromise.then(() => {
      this.langJson = this.appService.getLangJsonData();
    });
  }

  // ================language changed===================
  languageChanged(type) {
    this.appService.hitLangJson(type)
      .subscribe(
        response => {

        }, error => {
          console.error(error);
        }
      );
      this.appService.hitLanguageStrings();
    // location.pathname = this.languageSelected + '/';
  }

  accessTokenLogin() {
    const obj = {
      'marketplace_reference_id': this.appConfig.marketplace_reference_id,
      'marketplace_user_id': this.appConfig.marketplace_user_id,
    };
    if (this.sessionService.get('appData')) {
      obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
      obj['device_token']=this.sessionService.get("device_token") ||  this.sessionService.get("device_token_app") 
    }
    this.loader.show();
    this.service.accessTokenLogin(obj)
      .subscribe(
        response => {
          this.loader.hide();
          try {
            if (response.status === 200) {
              this.sessionService.set('appData', response.data);
              this.profileData = response.data;
              this.data = this.sessionService.get('appData').vendor_details;
              this.dataCopy = JSON.parse(JSON.stringify(this.data));
              this.phoneNumberCheck(this.dataCopy);
              // response.data.signup_template_data.forEach(element => {
              //   if (element.data_type === DynamicTemplateDataType.DATE || element.data_type === DynamicTemplateDataType.DATE_PAST
              //   || element.data_type === DynamicTemplateDataType.DATE_FUTURE || element.data_type === DynamicTemplateDataType.DATE_TIME ||
              //   element.data_type === DynamicTemplateDataType.DATE_TIME_PAST ||
              //   element.data_type === DynamicTemplateDataType.DATE_TIME_FUTURE) {
              //     if (element.data) {
              //       const tempDate = new Date(element.data);
              //       tempDate.setTime(tempDate.getTime() + + (-1 * new Date().getTimezoneOffset() * 60 * 1000));
              //       element.data = tempDate;
              //     }
              //   }
              // });
              this.templateFields = response.data.signup_template_data;
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

  saveEdits() {
    if (!this.dataCopy.first_name) {
      this.popup.showPopup(MessageType.ERROR, 2000, this.languageStrings.name_cannot_be_empty || 'Name cannot be empty.', false);
      return;
    }
    let phone = false, email = false;
    if (this.phoneCopy !== this.data.phone_no) {
      phone = true;
    }
    if (this.emailCopy !== this.data.email) {
      email = true;
    }
    // const obj = {
    //   'marketplace_reference_id': this.sessionService.getString('marketplace_reference_id'),
    //   'marketplace_user_id': this.sessionService.get('appData').vendor_details.marketplace_user_id,
    //   'vendor_id': this.sessionService.get('appData').vendor_details.vendor_id,
    //   'access_token': this.sessionService.get('appData').vendor_details.app_access_token,
    //   'first_name': this.dataCopy.first_name,
    //   'phone_no': this.phoneForm.controls.phone.value ? '+' + this.country_code + ' ' + this.phoneForm.controls.phone.value : '',
    //   'email': email ? this.emailCopy : this.data.email,
    //   'language': this.languageSelected
    // };

    let fd = new FormData();
    fd.append('domain_name', this.sessionService.getString('domain'));
    fd.append('marketplace_reference_id', this.appConfig.marketplace_reference_id);
    // fd.append('marketplace_reference_id', this.sessionService.getString('marketplace_reference_id'));
    fd.append('marketplace_user_id', this.sessionService.get('appData').vendor_details.marketplace_user_id);
    fd.append('access_token', this.sessionService.get('appData').vendor_details.app_access_token);
    fd.append('vendor_id', this.sessionService.get('appData').vendor_details.vendor_id);
    fd.append('language', this.languageSelected);
    fd.append('first_name', this.dataCopy.first_name);
    fd.append('phone_no', this.phoneForm.controls.phone.value ? '+' + this.country_code + ' ' + this.phoneForm.controls.phone.value : '');
    fd.append('email', email ? this.emailCopy : this.data.email);
    if (this.image) {
      fd.append('vendor_image', this.image);
    }
    else {
      fd.append('vendor_image', this.data.vendor_image);
    }

    if (this.sessionService.get('config') && this.sessionService.get('config').is_dual_user_enable === 1) {
     fd.append('dual_user_key','1');
    } else {
     fd.append('dual_user_key','0');
    }

    this.loader.show();
    this.service.saveEdits(fd)
      .subscribe(
        response => {
          this.loader.hide();
          try {
            if (response.status === 200) {
              this.edit = false;
              this.data = response.data;
              this.popup.showPopup(MessageType.SUCCESS, 2000, response.message, false);
              if(this.sessionService.is_netcore_enabled){
                try {
                  (<any>window).smartech('contact', '4', {
                    'pk^email': email ? this.emailCopy : this.data.email,
                    'mobile': this.phoneForm.controls.phone.value,
                    'FIRST_NAME': this.dataCopy.first_name
                    });
                } catch (e) {
                  console.warn(e);
                }     
              }
              const name = response.data.first_name;
              const phone = response.data.phone_no;
              const data = this.sessionService.get('appData');
              data.vendor_details.first_name = name;
              data.vendor_details.email = response.data.changed_email ? response.data.changed_email : response.data.email;
              data.vendor_details.phone_no = phone;
              data.vendor_details.is_phone_verified = response.data.is_phone_verified;
              data.vendor_details.is_email_verified = response.data.is_email_verified;
              data.vendor_details.vendor_image = response.data.vendor_image;
              this.sessionService.set('appData', data);
              this.data.first_name = response.data.first_name;
              this.phoneNumberCheck(this.data);
              this.message.sendProfileName(response.data.first_name);
              this.image = null;
              this.imageData = null;

              if (this.sessionService.get('config').is_otp_enabled && !response.data.is_phone_verified) {
                this.messageService.getLoginSignupLocation('From Login Button');
                $('#signupDialog').modal('show');
                this.message.openSignUpPage({
                  'checkAllFields': 1,
                  'response': this.sessionService.get('appData')
                });
              } else if (this.sessionService.get('config').is_email_verification_required && !response.data.is_email_verified) {
                this.messageService.getLoginSignupLocation('From Login Button');
                $('#signupDialog').modal('show');
                this.message.openSignUpPage({
                  'emailChanged': 1,
                  'checkAllFields': 1,
                  'response': this.sessionService.get('appData')
                });
              }


              if (this.sessionService.getString('language') === this.languageSelected) {
                this.sessionService.setToString('language', this.languageSelected);
              } else {
                this.sessionService.setToString('language', this.languageSelected);
                // location.pathname = this.languageSelected + '/';
                try {
                  let restorePath = location.pathname.split('/').splice(2);
                  let newPath= restorePath.join('/');
                  // location.pathname = this.languageSelected + '/' + newPath ;
                  window.location.href = window.location.origin +'/'+this.languageSelected + '/' + newPath ;

                } catch (e) {
                  console.error(e);
                }
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

  phoneNumberCheck(data) {
    const phone = data.phone_no.trim();
    if (phone.indexOf(' ') > -1) {
      this.phoneCopy = phone.split(' ')[1];
      this.phoneForm.controls.phone.setValue(this.phoneCopy);
      this.country_code = phone.split(' ')[0].split('+')[1];
    } else {
      for (let i = 0; i < this.countries.length; i++) {
        if (phone.indexOf(this.countries[i]) > -1) {
          const m = phone.slice(this.countries[i].length, phone.length);
          if (this.countries[i] === '+1' && m.length === 10) {
            this.phoneCopy = m;
            this.phoneForm.controls.phone.setValue(this.phoneCopy);
            this.country_code = this.countries[i].split('+')[1];
            return;
          } else if (this.countries[i] !== '+1') {
            this.phoneCopy = m;
            this.phoneForm.controls.phone.setValue(this.phoneCopy);
            this.country_code = this.countries[i].split('+')[1];
            return;
          }
        } else {
          this.phoneCopy = phone.split(' ')[1];
          this.phoneForm.controls.phone.setValue(this.phoneCopy);
          this.country_code = phone.split(' ')[0].split('+')[1];
        }
      }
    }
  }

  /**
   * on file change
   * @param event js event
   */
  onFileChange(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const id = event.target.id;
      reader.readAsDataURL(file);
      reader.onload = () => {
        try{
          this.templateForm.get(id).setValue({
            filename: file.name,
            filetype: file.type,
            value: (reader.result as string).split(',')[1]
          });
        }catch(error){
          console.error(error)
        }
      };
      this.uploadImage(event.target.files[0], id);
    }
  }

  /**
   * to remove file from list
   * @param name key in image list
   * @param index index
   */
  clearFile(name, index) {
    this.fileInput.nativeElement.value = '';
    this.imageList[name].splice(index, 1);
  }

  /**
   * upload image
   * @param image image
   * @param id key in image list
   */
  uploadImage(image, id) {
    const formData = new FormData();
    formData.append('ref_image', image);
    formData.append('language', this.sessionService.getString('language'));
    this.service.uploadImage(formData)
      .subscribe(
        response => {
          try {
            if (response.status === 200) {
              this.imageList[id].push(response.data.ref_image);
              this.templateForm.get(id).setValue(response.data.ref_image);
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

  /**
   * function to edit signup template
   */
  editSignupTemplate() {
    if (this.templateForm.invalid) {
      const templateFormControls = Object.keys(this.templateForm.controls);
      for (let i = 0; i < templateFormControls.length; i++) {
        const key = templateFormControls[i];
        if (this.templateForm.controls[key].invalid) {
          this.popup.showPopup(MessageType.ERROR, 2000, 'Invalid ' + key, false);
          return;
        }
      }
      return;
    }

    this.loader.show();
    const obj = {
      'marketplace_reference_id': this.appConfig.marketplace_reference_id,
      'marketplace_user_id': this.appConfig.marketplace_user_id,
    };
    if (this.sessionService.get('appData')) {
      obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    obj['fields'] = [];

    for (let i = 0; i < this.templateFields.length; i++) {
      const field = this.templateFields[i];
      let data;
      if (field.data_type === DynamicTemplateDataType.IMAGE) {
        if (field.required && !this.imageList[field.label].length) {
          this.popup.showPopup(MessageType.ERROR, 2000, field.label + ' cannot be empty', false);
          this.loader.hide();
          return;
        }
        data = this.imageList[field.label];
      } else {
        if (field.required && !this.templateForm.controls[field.label].value) {
          this.popup.showPopup(MessageType.ERROR, 2000, field.label + ' is required ', false);
          this.loader.hide();
          return;
        }

        if(field.data_type == 'Multi-Select' || field.data_type == 'Single-Select') {
          if (field.data_type == 'Multi-Select'){
            data = [];
            for (let i = 0 ; i < this.templateForm.controls[field.label].value.length ; i++) {
              data.push(this.templateForm.controls[field.label].value[i].name);
            }
          }
          else if (field.data_type == 'Single-Select'){
            data = this.templateForm.controls[field.label].value.name;
          }
        }
        else {
          data = this.templateForm.controls[field.label].value;
          
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

    this.service.editSignupTemplate(obj)
      .subscribe(
        response => {
          try {
            if (response.status === 200) {
              this.editTemplate = false;
              this.accessTokenLogin();
            } else {
              this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
              this.loader.hide();
            }
          } catch (e) {
            console.error(e);
            this.loader.hide();
          }
        },
        error => {
          console.error(error);
          this.loader.hide();
        }
      );
  }

  /**
   * to edit signuup template data
   */
  editTemplateData() {
    this.initEditTemplateFrom();
    this.editTemplate = true;
  }

  /**
   * initialize edit signup template form
   */
  initEditTemplateFrom() {
    if (this.templateFields.length) {
      const group: any = {};

      this.templateFields.forEach((field) => {
        switch (field.data_type) {
          case DynamicTemplateDataType.IMAGE:
            this.imageList[field.label] = [...field.data] || [];
            break;
          case DynamicTemplateDataType.EMAIL:
            group[field.label] = field.required ?
              new FormControl(field.data || null, [Validators.required, ValidationService.emailValidator])
              : new FormControl(field.data || null, [ValidationService.emailValidator]);
            break;
          case DynamicTemplateDataType.CHECKBOX:
            group[field.label] = field.required ? new FormControl(field.data, [Validators.required])
              : new FormControl(field.data);
            break;
          case DynamicTemplateDataType.NUMBER:
            group[field.label] = field.required ? new FormControl(field.data, [Validators.required])
              : new FormControl(field.data);
            break;
            case DynamicTemplateDataType.MULTI_SELECT:
              group[field.label] = field.required ? new FormControl(this.manipulateMultiSelectData(field.data), [Validators.required])
                : new FormControl(this.manipulateMultiSelectData(field.data) || null)
              break;
          case DynamicTemplateDataType.SINGLE_SELECT:
          
            group[field.label] = field.required ? new FormControl(this.manipulateSingleSelectData(field.data) || null, [Validators.required])
            : new FormControl(this.manipulateSingleSelectData(field.data) || null);
          break;
          case DynamicTemplateDataType.DATE:
          case DynamicTemplateDataType.DATE_FUTURE:
          case DynamicTemplateDataType.DATE_PAST:
          case DynamicTemplateDataType.DATE_TIME:
          case DynamicTemplateDataType.DATE_TIME_PAST:
          case DynamicTemplateDataType.DATE_TIME_FUTURE:
            const data =  field.data ? new Date(field.data) : undefined ;
            group[field.label] = field.required ? new FormControl(new Date(data), [Validators.required])
              : new FormControl(data);
            break;
          default:
            group[field.label] = field.required ? new FormControl(field.data || null, [Validators.required])
              : new FormControl(field.data || null);
            break;
        }
      });
      this.templateForm = this.formBuilder.group(group);
    }
  }


manipulateSingleSelectData(fieldData){
let  dummySingleSelectData= {
    name : fieldData
  };
  return dummySingleSelectData
}

manipulateMultiSelectData(fieldData) {
  let dummyData = [];
  for (let item = 0 ; item < fieldData.length ; item++){
    dummyData.push({
      name : fieldData[item]
    })
  }
  return dummyData;
}
  /**
   * change password
   */
  changePassword() {
    this.changePasswordFlag = true;
  }

  /**
   * get back from password change
   */
  goBackChange($event) {
    this.changePasswordFlag = false;
  }

  /**
   * save change password
   */
  saveChangePassword($event) {
    this.changePasswordFlag = false;
    this.accessTokenLogin();
  }

  onImageSelect(event) {
    let file = event.target.files;
    if (file.length) {
      this.image = file[0];
      if(this.profileImage){
        this.profileImage.nativeElement.value = '';
      }
      let reader = new FileReader();
      reader.readAsDataURL(this.image);
      reader.onload = () => {
          this.imageData = reader.result;
      }
    }
  }

}
