import { MessageType } from './../../../../../constants/constant';
/**
 * Created by cl-macmini-51 on 20/07/18.
 */
import { Component, OnDestroy, OnInit, AfterViewInit, Input, OnChanges, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { Validators, FormControl, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { SessionService } from '../../../../../services/session.service';
import { AppService } from '../../../../../app.service';
import { LoaderService } from '../../../../../services/loader.service';
import { ValidationService } from '../../../../../services/validation.service';
import { SignupService } from '../../../../signup/signup.service';
import { CreateProjectService } from '../../create-project.service';
import { DynamicTemplateDataType } from '../../../../../constants/constant';
import { PopupModalService } from '../../../../../modules/popup/services/popup-modal.service';
import { GoogleAnalyticsEvent, FreelancerAddress } from '../../../../../enums/enum';
import { GoogleAnalyticsEventsService } from '../../../../../services/google-analytics-events.service';
import { MessageService } from '../../../../../services/message.service';
import { JwGoogleAutocompleteComponent } from '../../../../../modules/jw-google-autocomplete/components/autocomplete/jw-google-autocomplete.component';
import {TimeFormat} from "../../../../../enums/enum";

declare var $: any;
import * as moment from "moment";

@Component({
  selector: 'app-free-lancer-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss'],

})
export class FreelancerTemplateComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {

  public form: any;
  public config: any = {};
  public langJson: any = {};
  public languageSelected: any;
  public direction = 'ltr';
  public terminology: any = {};
  public multiSelectSettings: any;
  public minDateForFutrue: Date = new Date();
  public maxDateForPast: Date = new Date();
  // ==============for satrt, end, request start, request end=============
  public minDateForStart: Date = new Date();
  public minDateForEnd: Date = new Date();
  public minDateForRequestStart: Date = new Date();
  public minDateForRequestEnd: Date = new Date();
  public minDateLabelForEnd: string;
  public minDateLabelForRequestEnd: string;
  public concatArray;
  public imageList = {};
  public showSubmit = false;
  public submittedData = [];
  public typesWithoutDate = [];
  public typesDate = [];
  public typesCheckbox = [];
  public typesImages = [];
  public typesTextArea = [];
  public templateDataType = DynamicTemplateDataType;
  public projectAddress: string;
  public pickupAddress: string;
  public timeFormat = TimeFormat;
  public mapType = 1;
  public freelancerAddress = FreelancerAddress;

  //map
  showTemplatePopup: boolean;
  lat;
  lng;
  city;
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('search') searchElement: JwGoogleAutocompleteComponent;
  @Input() templateFields: any;
  @Input() categoryId: any;
  @Input() path: Array<number>;
  @Input() index: any;
  @Input() totalIndex: any;
  @Output() statusNext = new EventEmitter<any>();
  @Output() statusBack = new EventEmitter<any>();
  languageStrings: any={};
  constructor(protected sessionService: SessionService, protected appService: AppService,
    protected loader: LoaderService, protected popup: PopupModalService, public messageService: MessageService,
    protected formBuilder: FormBuilder, protected signupService: SignupService,
    protected createProjectService: CreateProjectService, public router: Router,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService) {
    this.setConfig();
    this.setLanguage();
  }

  // ======================life cycle====================
  ngOnInit() {
    // this.minDateForFutrue.setDate(this.minDateForFutrue.getDate() + 1);

    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
    });
    if (this.templateFields) {
      this.templateManuplation();
    }
    let locationObj = this.sessionService.get('location');
    if(locationObj && locationObj.city)
    {
    if ((this.config.is_tookan_active || this.config.show_serving_restriction) && locationObj && !this.config.freelancer_create_pd_jobs) {
      this.projectAddress = locationObj.city;
      this.createProjectService.projectAddressObj.latitude = this.createProjectService.projectAddressObjCpy.latitude || +locationObj.lat;
      this.createProjectService.projectAddressObj.longitude = this.createProjectService.projectAddressObjCpy.longitude || +locationObj.lng;
      this.createProjectService.projectAddressObj.address = this.createProjectService.projectAddressObjCpy.address || locationObj.city;
    }
  }
  if(locationObj && locationObj.city)
  {
    if ((this.config.is_tookan_active || this.config.show_serving_restriction) && locationObj && this.config.freelancer_create_pd_jobs) {
      this.pickupAddress = locationObj.city;
      this.createProjectService.projectAddressObj.latitude = this.createProjectService.projectAddressObjCpy.latitude || +locationObj.lat;
      this.createProjectService.projectAddressObj.longitude = this.createProjectService.projectAddressObjCpy.longitude || +locationObj.lng;
      this.createProjectService.projectAddressObj.address = this.createProjectService.projectAddressObjCpy.address || locationObj.city;

    }
  }

    this.multiSelectSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'skill',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };


  }
  ngAfterViewInit() {

  }
  ngOnDestroy() {

  }

  ngOnChanges() {
    if (this.index === this.totalIndex) {
      this.showSubmit = true;
    } else {
      this.showSubmit = false;
    }

    // =================check if index already exist or not========================
    let checkExist = false;
    if (this.sessionService.get('fLData')) {
      this.submittedData = this.sessionService.get('fLData');
      const localData = this.sessionService.get('fLData');
      for (let i = 0; i < localData.length; i++) {
        if (localData[i].index === this.index) {
          checkExist = true;
          break;
        } else {
          checkExist = false;
        }
      }
      if (checkExist) {
        this.submittedData.splice(this.index - 1, 1);
      }
    }
  }

  // ======================set config====================
  setConfig() {
    this.config = this.sessionService.get('config');
    this.terminology = this.config.terminology;
  }

  // ======================set language====================
  setLanguage() {
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

  // ======================template manuplation===================
  templateManuplation() {


    // without Date Image Checkbox TexatArea
    this.typesWithoutDate = this.templateFields.template.filter(text => {
      if (text.data_type === this.templateDataType.TEXT ||
        text.data_type === this.templateDataType.EMAIL ||
        text.data_type === this.templateDataType.TELEPHONE ||
        text.data_type === this.templateDataType.NUMBER ||
        text.data_type === this.templateDataType.SINGLE_SELECT ||
        text.data_type === this.templateDataType.MULTI_SELECT ||
        text.data_type === this.templateDataType.DROPDOWN) {
        return true;
      }
    });
    // Date only
    this.typesDate = this.templateFields.template.filter(text => {
      if (text.data_type === this.templateDataType.DATE ||
        text.data_type === this.templateDataType.DATE_FUTURE ||
        text.data_type === this.templateDataType.DATE_PAST ||
        text.data_type === this.templateDataType.DATE_TIME ||
        text.data_type === this.templateDataType.TIME ||
        text.data_type === this.templateDataType.DATE_TIME_FUTURE ||
        text.data_type === this.templateDataType.DATE_TIME_PAST) {
        return true;
      }
    });
    // checkbox only
    this.typesCheckbox = this.templateFields.template.filter(text => {
      if (text.data_type === this.templateDataType.CHECKBOX) {
        return true;
      }
    });
    // images only
    this.typesImages = this.templateFields.template.filter(text => {
      if (text.data_type === this.templateDataType.IMAGE) {
        return true;
      }
    });
    // textarea only
    this.typesTextArea = this.templateFields.template.filter(text => {
      if (text.data_type === this.templateDataType.TEXTAREA) {
        return true;
      }
    });

    this.concatArray = this.typesWithoutDate.concat(this.typesDate, this.typesCheckbox, this.typesImages, this.typesTextArea);



    const group: any = {};

    this.concatArray.forEach(field => {

      if (field.data_type === this.templateDataType.EMAIL) {
        // tslint:disable-next-line:max-line-length
        group[field.label] = field.required ? new FormControl(field.value || null, [Validators.required, ValidationService.emailValidator]) : new FormControl(field.value || null, [ValidationService.emailValidator]);
      } else if (field.data_type === this.templateDataType.IMAGE) {
    
        if (field.value) {
          this.imageList[field.label] = field.value;
        } else {
          this.imageList[field.label] = [];
        }
        // tslint:disable-next-line:max-line-length
        group[field.label] = field.required ? new FormControl(field.value || null, [Validators.required]) : new FormControl(field.value || null);
      } else if (field.data_type === this.templateDataType.CHECKBOX) {
        // tslint:disable-next-line:max-line-length
        group[field.label] = field.required ? new FormControl(field.value || false, [Validators.required]) : new FormControl(field.value || false);
      } else if (field.data_type === this.templateDataType.NUMBER) {
        // tslint:disable-next-line:max-line-length
        group[field.label] = field.required ? new FormControl(field.value || (field.is_hidden ? 1 : null), [Validators.required, Validators.max(9999999999),
        ValidationService.setDecimalConfigRegexPattren(this.config.decimal_calculation_precision_point)]) : new FormControl(field.value || null);
      } else if (field.data_type === this.templateDataType.MULTI_SELECT || field.data_type === this.templateDataType.SINGLE_SELECT ||
        field.data_type === this.templateDataType.DROPDOWN) {
        group[field.label] = field.required ? new FormControl(undefined, [Validators.required]) : new FormControl(undefined);
      } else {
        // tslint:disable-next-line:max-line-length
        group[field.label] = field.required ? new FormControl(field.value || null, [Validators.required]) : new FormControl(field.value || null);
      }

      if (field.data_type === this.templateDataType.SINGLE_SELECT || field.data_type === this.templateDataType.DROPDOWN) {
        field.allowed_values_modified = [];
        for (let i = 0; i < field.allowed_values.length; i++) {
          field.allowed_values_modified.push({
            label: field.allowed_values[i],
            value: field.allowed_values[i]
          });
        }
      }
      if (field.data_type === this.templateDataType.MULTI_SELECT) {
        field.allowed_values_modified = [];
        for (let i = 0; i < field.allowed_values.length; i++) {
          field.allowed_values_modified.push({
            label: field.allowed_values[i],
            value: field.allowed_values[i]
          });
        }
      }

      // if (question.data_type === 'Image') {
      //  this.imageList[question.label] = [];
      // }
      // if (question.data_type !== 'Checkbox' && question.data_type !== 'Email') {
      //  group[question.label] = question.required ? new FormControl(question.data || null, [Validators.required])
      //    : new FormControl(question.data || null);
      // } else if (question.data_type === 'Email') {
      //  group[question.label] = question.required ? new FormControl(question.data || null, [ValidationService.emailValidator])
      //    : new FormControl(question.data || null, [ValidationService.emailValidator]);
      // } else {
      //  group[question.label] = question.required ? new FormControl(question.data, [Validators.required])
      //    : new FormControl(question.data);
      // }
    });
    this.form = this.formBuilder.group(group);
  }

  // ===============image file on change=====================
  onFileChange(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const id = event.target.id;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.form.get(id).setValue({
          filename: file.name,
          filetype: file.type,
          value: reader.result.toString().split(',')[1]
        });
      };
      this.uploadImage(event.target.files[0], id);
    }
  }

  // ===============upload image file hit=====================
  uploadImage(image, id) {
    const formData = new FormData();
    formData.append('ref_image', image);
    this.loader.show();
    this.signupService.uploadImage(formData)
      .subscribe(
        response => {
          try {
            if (response.status === 200) {
              this.imageList[id].push(response.data.ref_image);
              this.form.get(id).setValue(response.data.ref_image);
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

  clearFile(name, index) {
    this.fileInput.nativeElement.value = '';
    this.imageList[name].splice(index, 1);
  }

  // =============start end date validation==============
  startEndChanged(event, type, val?,checkType?) {
    if (type === 'start') {
      this.minDateForEnd = event;
      this.minDateLabelForEnd = val.display_name;
      this.checkForValidTime(checkType, val);
    } else {
      this.checkForValidTime(checkType, val, this.minDateForEnd, this.minDateLabelForEnd);
    }
  }
  checkForValidTime(type: string, val, compareTo?, compareToLabel?) {
    const selected = moment(val.value);
    let now = moment();
    if (compareTo) {
      now = moment(compareTo);
    }

    switch (type) {
      case 'future':
        if (selected.diff(now) < 0) {
          if (compareTo) {
            val.value = new Date(compareTo);
            this.popup.showPopup(MessageType.ERROR, 2500, val.display_name + ' must be greater than ' + compareToLabel, false);
          } else
          {
            val.value = new Date();
            this.popup.showPopup(MessageType.ERROR, 2500,  val.display_name + ' must be greater than current time', false);
          }
        }
        break;
      case 'past':
        if (selected.diff(now) > 0) {
          if (compareTo) {
            val.value = new Date(compareTo);
            this.popup.showPopup(MessageType.ERROR, 2500, val.display_name + ' must be less than ' + compareToLabel, false);
          } else {
            val.value = new Date();
            this.popup.showPopup(MessageType.ERROR, 2500, val.display_name + ' must be less than current time', false);
          }
        }
        break;
    }

  }
  requestStartEndChanged(event, type, val?,checkType? ) {
    if (type === 'start') {
      this.minDateForRequestEnd = event;
      this.minDateLabelForRequestEnd = val.display_name;
      this.checkForValidTime(checkType, val);
    } else {
      this.checkForValidTime(checkType, val, this.minDateForRequestEnd, this.minDateLabelForRequestEnd);
    }
  }

  // ==============form submit=====================
  onSubmit(form) {
    if (this.index === 1 && (this.config.is_tookan_active || this.config.show_serving_restriction) &&
      (!this.createProjectService.projectAddressObj || !this.createProjectService.projectAddressObj.latitude
        || !this.createProjectService.projectAddressObj.longitude || !this.createProjectService.projectAddressObj.address)) {
      this.popup.showPopup(MessageType.ERROR, 2000, 'Please select a valid address', false);
      return false;
    }

    if (this.config.freelancer_create_pd_jobs && this.index === 1 && (this.config.is_tookan_active || this.config.show_serving_restriction) &&
      (!this.createProjectService.pickupAddress || !this.createProjectService.pickupAddress.pickup_latitude
        || !this.createProjectService.pickupAddress.pickup_longitude || !this.createProjectService.pickupAddress.pickup_address)) {
      this.popup.showPopup(MessageType.ERROR, 2000, 'Please select a valid Pickup address', false);
      return false;
    }

    let image_error = false;
    const checkboxError = false;
    const obj = {};
    obj['fields'] = [];

    // ==============start end request start request end===============
    const startIndex = this.concatArray.findIndex(function (o: any) { return o.label === 'start_date'; });
    const endIndex = this.concatArray.findIndex(function (o: any) { return o.label === 'end_date'; });
    const requestStartIndex = this.concatArray.findIndex(function (o: any) { return o.label === 'request_start'; });
    const requestEndIndex = this.concatArray.findIndex(function (o: any) { return o.label === 'request_end'; });

    if (this.form.controls['start_date'] && this.form.controls['end_date']) {
      if (this.form.controls['start_date'].value.getTime() >= this.form.controls['end_date'].value.getTime()) {
        const msg = this.concatArray[endIndex].display_name + ' should be greater than ' + this.concatArray[startIndex].display_name;
        this.popup.showPopup(MessageType.ERROR, 2000, msg, false);
        return false;
      }
    }
    if (this.form.controls['request_start'] && this.form.controls['request_end']) {
      if (this.form.controls['request_start'].value.getTime() >= this.form.controls['request_end'].value.getTime()) {
        const msg = this.concatArray[requestEndIndex].display_name +
          ' should be greater than ' + this.concatArray[requestStartIndex].display_name;
        this.popup.showPopup(MessageType.ERROR, 2000, msg, false);
        return false;
      }
    }
    if (this.form.controls['request_start'] &&
      this.form.controls['request_end'] && this.form.controls['start_date']
      && this.form.controls['end_date']) {
      if (this.form.controls['request_start'].value.getTime() >= this.form.controls['start_date'].value.getTime()) {
        const msg = this.concatArray[requestStartIndex].display_name + ' should be less than ' + this.concatArray[startIndex].display_name;
        this.popup.showPopup(MessageType.ERROR, 2000, msg, false);
        return false;
      } else if (this.form.controls['request_end'].value.getTime() >= this.form.controls['start_date'].value.getTime()) {
        const msg = this.concatArray[requestEndIndex].display_name + ' should be less than ' + this.concatArray[startIndex].display_name;
        this.popup.showPopup(MessageType.ERROR, 2000, msg, false);
        return false;
      }
    }

    Object.keys(this.form.controls).forEach(key => {
 
      // this.concatArray.forEach(question => {
      //  //if (question.data_type === 'Checkbox' && question.required && !this.form.controls[key].value ) {
      //  //  this.popup.showPopup(MessageType.ERROR, 2000, key + ' is required ', false);
      //  //  checkboxError = true;
      //  //  return false;
      //  //}
      //  //else if (question.required && (!this.form.controls[key].value || this.form.controls[key].value === '')) {
      //  //  this.popup.showPopup(MessageType.ERROR, 2000, key + ' is required ', false);
      //  //  return;
      //  //}
      // });

      if (key in this.imageList) {
        const temp_obj = {
          'label': key,
          'value': this.imageList[key]
        };
        this.concatArray.forEach(question => {
          if (question.label === key) {
            if (question.required && !this.imageList[key].length) {
              this.popup.showPopup(MessageType.ERROR, 2000, key + ' cannot be empty', false);
              image_error = true;
            }
          }
        });
        obj['fields'].push(temp_obj);
      } else {
        if (this.form.controls[key]) {
          const temp_obj = {
            'label': key,
            'value': this.form.controls[key].value
          };
          obj['fields'].push(temp_obj);
        }
      }
    });
    obj['index'] = this.index;


    for (let k = 0; k < this.concatArray.length; k++) {
      for (let m = 0; m < obj['fields'].length; m++) {
        if (obj['fields'][m].label === this.concatArray[k].label) {
          obj['fields'][m]['filter'] = this.concatArray[k].filter;
          obj['fields'][m]['required'] = this.concatArray[k].required;
          obj['fields'][m]['data_type'] = this.concatArray[k].data_type;
          obj['fields'][m]['display_name'] = this.concatArray[k].display_name;
        }
      }
    }

    if (image_error) {
      this.loader.hide();
      return false;
    }
    if (checkboxError) {
      this.loader.hide();
      return false;
    }

    let checkExist = false;

    if (this.sessionService.get('fLData')) {
      this.submittedData = this.sessionService.get('fLData');
      const localData = this.sessionService.get('fLData');
      for (let i = 0; i < localData.length; i++) {
        if (localData[i].index === this.index) {
          checkExist = true;
          break;
        } else {
          checkExist = false;
        }
      }

      if (checkExist) {
        this.submittedData.splice(this.index - 1, 1);
      }

    }
    this.submittedData.push(obj);
    this.submittedData.sort(this.sessionService.sortBy('index'));
    this.sessionService.setString('fLData', this.submittedData);

    if (this.index !== this.totalIndex) {
      this.statusNext.emit({ index: this.index, total: this.totalIndex });
    } else {

      if (this.sessionService.get('appData') && parseInt(this.sessionService.getString('reg_status')) === 1){
        this.createProject();
      } else {
        this.messageService.getLoginSignupLocation('From Checkout Button');
        $('#loginDialog').modal('show');
      }
    }
  }

  // ====================go back event====================

  goBack() {
    this.createProjectService.pickupAddressCpy = {};
    this.createProjectService.projectAddressObjCpy = {}
    this.statusBack.emit({ index: this.index - 1, total: this.totalIndex });
  }

  // ===================create project service=====================
  createProject() {
    const data = this.sessionService.get('fLData');
    let dataArray = [];

    if (data.length === 1) {
      dataArray = data[0].fields;
    } else {
      for (let i = 0; i < data.length; i++) {
        // if (i != data.length - 1) {
        dataArray = [...dataArray, ...data[i].fields];
        // }
      }
    }


    this.loader.show();
    // let project_type;
    // if (this.config.project_type && this.config.project_type === ProjectTypeEnum.FREELANCER_WITHOUT_BIDDING) {
    //     project_type = ProjectTypeEnum.FREELANCER_WITHOUT_BIDDING;
    // } else {
    //   if (this.config.business_model_type === 'FREELANCER') {
    //     project_type = ProjectTypeEnum.FREELANCER;
    //   } else {
    //     project_type = ProjectTypeEnum.LOGISTICS;
    //   }
    // }

    const timezone = new Date().getTimezoneOffset();

    if ((this.config.is_tookan_active || this.config.show_serving_restriction) && !this.config.freelancer_create_pd_jobs) {
      this.createProjectService.pickupAddress.pickup_latitude = +this.createProjectService.projectAddressObj.latitude;
      this.createProjectService.pickupAddress.pickup_longitude = +this.createProjectService.projectAddressObj.longitude;
      this.createProjectService.pickupAddress.pickup_address = this.createProjectService.projectAddressObj.address;
    }

  let obj = {
    'marketplace_reference_id': this.config.marketplace_reference_id,
    'marketplace_user_id': this.config.marketplace_user_id,
    'category_id': this.categoryId,
    'path': this.path,
    'project_type': this.createProjectService.project_type,
    'template_json': dataArray,
    timezone,
    ...this.createProjectService.projectAddressObj,
    // ...this.createProjectService.pickupAddressCpy, // uncomment when freelancer geofence goes live from apps
    'root_category_id': this.path[0] || this.categoryId  // uncomment when freelancer geofence goes live from apps
  };

    if((this.config.is_tookan_active || this.config.show_serving_restriction) && this.config.freelancer_create_pd_jobs){
      if(this.createProjectService.pickupAddressCpy.pickup_latitude)  {
        obj = Object.assign(obj , this.createProjectService.pickupAddressCpy);
      }
      else {
        obj = Object.assign(obj , this.createProjectService.pickupAddress);
      }
    }
    if((this.config.is_tookan_active || this.config.show_serving_restriction) && !this.config.freelancer_create_pd_jobs){
      this.createProjectService.pickupAddress.pickup_address = this.createProjectService.projectAddressObj.address;
      this.createProjectService.pickupAddress.pickup_latitude = this.createProjectService.projectAddressObj.latitude;
      this.createProjectService.pickupAddress.pickup_longitude = this.createProjectService.projectAddressObj.longitude;
      obj = Object.assign(obj , this.createProjectService.pickupAddress);
      delete obj.address;
      delete obj.latitude;
      delete obj.longitude;
    }

    if (this.sessionService.get('appData')) {
      obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    
    this.createProjectService.createProject(obj)
      .subscribe(
        response => {
          try {
            if (response.status === 200) {
              this.sessionService.remove('fLData');
              this.popup.showPopup('success', 2000, response.message, false);
              this.router.navigate(['/']); //freelancer
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

  clearLatLng(type: number) {
    if (type === FreelancerAddress.PROJECT_ADDRESS) {
      this.createProjectService.projectAddressObj = {};
    }

    if (type === FreelancerAddress.PICKUP_ADDRESS) {
      this.createProjectService.pickupAddress = {};
      this.createProjectService.pickupAddressCpy = {};
    }
  }

  onLatLngEvent(latlng: google.maps.LatLng, address: string, type: number) {
    if (latlng) {
      if (type === FreelancerAddress.PROJECT_ADDRESS) {
        this.createProjectService.projectAddressObj.latitude = +latlng.lat();
        this.createProjectService.projectAddressObj.longitude = +latlng.lng();
        this.createProjectService.projectAddressObj.address = address;

        this.createProjectService.projectAddressObjCpy.latitude = +latlng.lat();
        this.createProjectService.projectAddressObjCpy.longitude = +latlng.lng();
        this.createProjectService.projectAddressObjCpy.address = address;
      } else if (type === FreelancerAddress.PICKUP_ADDRESS) {
        this.createProjectService.pickupAddress.pickup_latitude = +latlng.lat();
        this.createProjectService.pickupAddress.pickup_longitude = +latlng.lng();
        this.createProjectService.pickupAddress.pickup_address = address;

        this.createProjectService.pickupAddressCpy.pickup_latitude = +latlng.lat();
        this.createProjectService.pickupAddressCpy.pickup_longitude = +latlng.lng();
        this.createProjectService.pickupAddressCpy.pickup_address = address;
      }
    } else {
      this.clearLatLng(type);
    }
  }

  openMap(type) {

    this.mapType = type;

    if (type === FreelancerAddress.PROJECT_ADDRESS && Object.keys(this.createProjectService.projectAddressObj).length) {
      this.lat = this.createProjectService.projectAddressObj.latitude;
      this.lng = this.createProjectService.projectAddressObj.longitude;
      this.city = this.createProjectService.projectAddressObj.address;
    } else if (type === FreelancerAddress.PICKUP_ADDRESS && Object.keys(this.createProjectService.pickupAddress).length) {
      this.lat = this.createProjectService.pickupAddress.pickup_latitude;
      this.lng = this.createProjectService.pickupAddress.pickup_longitude;
      this.city = this.createProjectService.pickupAddress.pickup_address;
    }
    else if (this.sessionService.get('location')) {
      this.lat = this.sessionService.get('location').lat;
      this.lng = this.sessionService.get('location').lng;
      this.city = this.sessionService.get('location').address;
    }
    // else {
    //   const config = this.sessionService.get('config');
    //   this.lat = +config.latitude;
    //   this.lng = +config.longitude;
    //   this.city = config.address;
    // }
    this.showTemplatePopup = true;
  }

  onMapPopupSave(data) {
    this.lat = data.lat;
    this.lng = data.lng;
    this.city = data.city;

    if (this.mapType === FreelancerAddress.PROJECT_ADDRESS) {
      this.createProjectService.projectAddressObj.latitude = +data.lat;
      this.createProjectService.projectAddressObj.longitude = +data.lng;
      this.createProjectService.projectAddressObj.address = data.city;
    }
    if (this.mapType === FreelancerAddress.PICKUP_ADDRESS) {
      this.createProjectService.pickupAddress.pickup_latitude = +data.lat;
      this.createProjectService.pickupAddress.pickup_longitude = +data.lng;
      this.createProjectService.pickupAddress.pickup_address = data.city;
    }

    this.searchElement.ctrl.control.markAsPristine();
    this.projectAddress = data.city;
    this.hideTempltePopup();
  }

  hideTempltePopup() {
    this.showTemplatePopup = false;

  }
}
