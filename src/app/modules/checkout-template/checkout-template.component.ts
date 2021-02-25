import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { CheckoutTemplateService } from './services/checkout-template.service';
import { PopUpService } from '../popup/services/popup.service';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { ITemplates } from './interfaces/template.interface';
import { DynamicTemplateDataType } from '../../constants/constant';
import { debounceTime, distinctUntilChanged, takeWhile, every, skip } from 'rxjs/operators';
import { ValidationService } from '../../services/validation.service';
import { SessionService } from '../../services/session.service';
import { CheckoutTemplateType } from '../../enums/enum';
import { MessageService } from '../../services/message.service';



@Component({
  selector: 'app-checkout-template',
  templateUrl: './checkout-template.component.html',
  styleUrls: ['./checkout-template.component.scss'],
})
export class CheckoutTemplateComponent implements OnInit, OnDestroy {
  languageStrings: any={};
  public templates: any = { data: [] };
  templateForm: FormGroup;
  alive = true;
  currencySymbol : string;
  dynamicTemplateDataType = DynamicTemplateDataType;
  @Input() checkoutType: CheckoutTemplateType;
  @Input() custumOrderAdmin;
  checkoutTemplateType = CheckoutTemplateType;
  @Output() updatePrice: EventEmitter<any[]> = new EventEmitter<any[]>();
  appConfig: any;
  restaurantInfo: any;

  constructor(private checkouTemplateService: CheckoutTemplateService, private popupService: PopUpService,
    private fb: FormBuilder, private sessionService: SessionService, private validationService: ValidationService, protected messageService: MessageService,) {
     
     }

  async ngOnInit() {
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
    });
    await this.getCheckoutTemplate();
    this.initForm();
    this.setListener();
    window['x'] = this;
      this.messageService.templateFormData.subscribe((response)=>{
        if(response){
          this.checkouTemplateService.priceTemplateChange.emit(this.templateForm.value.templates);
        }
      })
  }

  private getCheckoutTemplate(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.checkouTemplateService.getCheckoutTemplate(this.checkoutType)
        .subscribe(response => {
          if (response.status === 200) {
            this.templates = response.data.template || [];
            resolve(true);
          } else {
            resolve(false);
            this.popupService.showPopup('error', 2000, response.message, false);
          }
        }, error => {
          resolve(false);
          this.popupService.showPopup('error', 2000, error.message, false);
        });
    });
  }

  private initForm() {
    this.templateForm = this.fb.group({
      templates: this.fb.array(this.createFormArray())
    });

  }

  private createFormArray(): FormGroup[] {
    const arr = [];
    try {
      this.templates.forEach((template) => {
        let templateOptions;
        if(template.data_type === DynamicTemplateDataType.SINGLE_SELECT || template.data_type === DynamicTemplateDataType.MULTI_SELECT ){
          templateOptions = this.getOptionsAccordingToCurrency(template.option);
        } else {
          templateOptions = template.option;
        }
        const fg: FormGroup = this.fb.group({
          data_type: [template.data_type],
          key: [template.label],
          value: [template.value, this.setValidators(template)],
          display_name: [template.display_name],
          allowed_values: [template.allowed_values],
          option: [templateOptions || []],
          required: [template.required || false]
        });
        if (template.data_type === DynamicTemplateDataType.TELEPHONE) {
          fg.addControl('dial_code', new FormControl(''));
        }

        arr.push(fg);
      });
    } catch (e) {
      console.error(e);
    }
    finally {
      const tempArr = arr.filter(el => (![DynamicTemplateDataType.SINGLE_SELECT,DynamicTemplateDataType.MULTI_SELECT,DynamicTemplateDataType.SINGLE_SELECT_DELIVERY_TEMPLATE].includes(el.controls.data_type.value)) || (el.controls.option.value && el.controls.option.value.length > 0))
      return tempArr;
    }
  }

  getOptionsAccordingToCurrency(opts){
    if(this.sessionService.get('config').is_multi_currency_enabled && opts && opts.length > 0){

      if(this.checkoutType == this.checkoutTemplateType.NORMAL_ORDER){
        opts = opts.filter(el => ((!el.currency_id && this.sessionService.get('info').storefront_user_id == this.sessionService.get('config').marketplace_user_id)|| (el.currency_id == this.sessionService.get('info').payment_settings.currency_id)));
        this.currencySymbol = this.sessionService.get('info').payment_settings.symbol;
      } else {
        if(this.custumOrderAdmin){
          opts = opts.filter(el => ( (!el.currency_id) || (el.currency_id == this.sessionService.get('config').payment_settings[0].currency_id)));
          this.currencySymbol = this.sessionService.get('config').payment_settings[0].symbol;
        } else {
          opts = opts.filter(el => (el.currency_id == this.sessionService.get('info').payment_settings.currency_id));
          this.currencySymbol = this.sessionService.get('info').payment_settings.symbol;
        }
      }
      return opts;
    } else {
      this.currencySymbol = this.sessionService.get('config').payment_settings[0].symbol;
      return opts;
    }
  }

  private setValidators(template: ITemplates) {
    const arr = [];
    switch (template.data_type) {
      case DynamicTemplateDataType.EMAIL:
        arr.push(ValidationService.emailValidator);
      default:
        if (template.required) {
          arr.push(Validators.required);
        }
    }
    return arr;
  }

  private setListener() {
    this.templateForm.valueChanges
      .pipe(
        takeWhile(() => this.alive),
        debounceTime(400),
        distinctUntilChanged(),
        // skip(1)
      )
      .subscribe((data: any) => {
        // tslint:disable-next-line:max-line-length
        // const items = data.templates.filter(e => [DynamicTemplateDataType.SINGLE_SELECT,DynamicTemplateDataType.MULTI_SELECT].includes(e.data_type)) || [];
        // const hasAmountField = !!(data.templates as any[]).find(_ => [DynamicTemplateDataType.SINGLE_SELECT, DynamicTemplateDataType.MULTI_SELECT].includes(_.data_type))
        // if (!hasAmountField) return;

        const items = data.templates;
        this.checkouTemplateService.priceTemplateChange.emit(items);
      });
  }


  private storeData() {

    const template_data = this.checkouTemplateService.createCheckoutTemplateJson((this.templateForm.controls.templates as FormArray).value);
    this.sessionService.setByKey('app', 'checkout_template', template_data);
  }

  validateFields(): boolean {
    if (!this.templateForm.valid) {
      this.validationService.validateAllFormFields(this.templateForm);
      return false;
    }
    this.storeData();
    return true;
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
