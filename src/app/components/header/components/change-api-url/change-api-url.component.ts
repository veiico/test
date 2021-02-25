import { MessageType } from './../../../../constants/constant';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { ModalType } from '../../../../constants/constant';
import { PopupModalService } from '../../../../modules/popup/services/popup-modal.service';
import { ValidationService } from '../../../../services/validation.service';
import { LoaderService } from '../../../../services/loader.service';
import { HeaderService } from '../../header.service';
import { SessionService } from '../../../../services/session.service';

@Component({
  selector: 'app-change-api-url',
  templateUrl: './change-api-url.component.html',
  styleUrls: ['./change-api-url.component.scss']
})
export class ChangeApiUrlComponent implements OnInit {

  public modalType = ModalType;
  @Output() hide: EventEmitter<any> = new EventEmitter<any>();
  public apiUrlForm: FormGroup;
  public languageSelected;
  public direction;
  languageStrings: any={};

  constructor(private formBuilder: FormBuilder, protected popupModal: PopupModalService, public sessionService: SessionService,
              public validationService: ValidationService, protected loader: LoaderService, public headerService: HeaderService) { }

  ngOnInit() {
    this.sessionService.langStringsPromise.then(() =>
      {
       this.languageStrings = this.sessionService.languageStrings;
      });
    this.initApiUrlForm();
    this.setLanguage();
  }

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

  initApiUrlForm() {
    this.apiUrlForm = this.formBuilder.group({
      apiUrl: [environment.API_ENDPOINT, Validators.required]
    });
  }

  onSubmit() {
    if (environment.production) {
      this.popupModal.showPopup(MessageType.ERROR, 2000, 'This feature is only for test environment', false);
      return;
    }
    if (this.apiUrlForm.invalid) {
      return this.validationService.validateAllFormFields(this.apiUrlForm);
    }
    const oldUrl = environment.API_ENDPOINT;
    environment.API_ENDPOINT = this.apiUrlForm.controls.apiUrl.value;
    this.loader.show();
    this.headerService.checkApiUrl()
      .subscribe(response => {
        this.loader.hide();
        localStorage.setItem('apiUrl', environment.API_ENDPOINT);
        this.hide.emit();
      }, error => {
        environment.API_ENDPOINT = oldUrl;
        this.loader.hide();
        this.popupModal.showPopup(MessageType.ERROR, 2000, 'Invaild or broken url', false);
      });
  }

  hideTempltePopup() {
    this.hide.emit();
  }
}
