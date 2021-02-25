import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicTemplateDataType, MessageType } from '../../../../constants/constant';
import { SessionService } from '../../../../services/session.service';
import { LoaderService } from '../../../../services/loader.service';
import { SignupService } from '../../../../components/signup/signup.service';
import { PopupModalService } from '../../../../modules/popup/services/popup-modal.service';
import {TimeFormat} from "../../../../enums/enum";
import { ProductTemplateService } from '../../../../components/product-template/services/product-template.service';
import { MessageService } from '../../../../services/message.service';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-data-controls',
  templateUrl: './data-controls.component.html',
  styleUrls: ['./data-controls.component.scss'],
})
export class DataControlsComponent implements OnInit {
  languageStrings: any={};
  minDateForDateTimeFuture: Date;
  @Input() template: FormGroup;
  @Input() indexId: number;
  @Input() currency: string;
  templateForm: FormGroup;

  dynamicTemplateDataType = DynamicTemplateDataType;

  direction: string;
  config: any = {};
  minDateForFuture: Date;
  maxDateForPast: Date;
  timeFormat = TimeFormat;
  isShowDeliveryTemplate: number;

  constructor(private sessionService: SessionService, private loader: LoaderService,
    private signupService: SignupService, private popup: PopupModalService, private ref: ChangeDetectorRef, private productTemplateService : ProductTemplateService,protected messageService: MessageService) { 
     
    }

  ngOnInit() {
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
    });
    this.checkForTranslation();
    this.minDateForDateTimeFuture = new Date();
    this.minDateForFuture = new Date();
    this.minDateForFuture.setDate(new Date().getDate() + 1);
    this.maxDateForPast = new Date();
    this.maxDateForPast.setDate(new Date().getDate() - 1);
    this.config = this.sessionService.get('config');
    if(!this.config.is_multi_currency_enabled)
    this.currency = this.sessionService.get('config').payment_settings[0].symbol;
    this.isShowDeliveryTemplate = JSON.parse(localStorage.getItem('deliveryMethod'));
    this.messageService.templateListData
    .subscribe(
      (res) => {
          this.isShowDeliveryTemplate = res;
          this.template.controls.value.reset('')
      })

  }

  checkForTranslation() {
    const languageSelected = this.sessionService.getString('language');
    if (languageSelected === 'ar') {
      this.direction = 'rtl';
    } else {
      this.direction = 'ltr';
    }
  }

  onImageChnage(e) {
    if (!e.target.files.length) return;

    const formData = new FormData();
    formData.append('ref_image', e.target.files[0]);
    this.loader.show();
    this.signupService.uploadImage(formData)
      .subscribe(
        response => {
          try {
            if (response.status === 200) {
              let arr: any[] = this.template.controls.value.value || [];
              arr.push(response.data.ref_image);
              this.template.controls.value.setValue(arr);
            } else {
              this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
            }
          } catch (e) {
            console.error(e);
          }
          finally {
            this.loader.hide();
            e.target.value = "";
            this.ref.detectChanges();
          }
        },
        error => {
          this.loader.hide();
          this.ref.detectChanges();
        }
      );
  }

  onDialCodeChange(dialCode) {
    this.template.controls.dial_code.setValue(dialCode);
  }

  removeImage(index: number) {
    let arr: any[] = this.template.controls.value.value || [];
    arr.splice(index, 1);
    this.template.controls.value.setValue(arr);
  }

  onMultiSelectValueChange(e,data,template) {

    let arr = new Set(this.template.controls.value.value || []);
    if (e.target.checked)
      arr.add(data);
    else
      arr.delete(data);
    this.template.controls.value.setValue(Array.from(arr));
    setTimeout(() => {
      const obj ={
        index_id : this.indexId,
        data_type : (template.controls.data_type.value || []),
        value : (template.controls.value.value || 'null')
      }
      this.productTemplateService.priceUpdation.emit(obj);
    }, 0);
  }
  onDropdownValueChange(e,template){
    const obj ={
      data_type : (template.controls.data_type.value || {}),
      value : (template.controls.value.value || 'null'),
      index_id : this.indexId
    }
    this.productTemplateService.priceUpdation.emit(obj);
    console.warn('Dropdown Changes',e);
  }
  onDropdownValueChangeForDeliverTemplate(e,template){
    const obj ={
      data_type : (template.controls.data_type.value || {}),
      option : (template.controls.value.value || 'null'),
      index_id : this.indexId
    }
    this.messageService.templateFormData.next(true);
  }
}
