import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ModalType, DynamicTemplateDataType } from '../../../../constants/constant';
import { AppProductComponent } from '../../../catalogue/components/app-product/app-product.component';
import { ProductTemplateService } from '../../services/product-template.service';
import { PopUpService } from '../../../../modules/popup/services/popup.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ITemplates, templateCharges } from '../../../../modules/checkout-template/interfaces/template.interface';
import { ValidationService } from '../../../../services/validation.service';
import { SessionService } from '../../../../services/session.service';
import { takeWhile, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { LoaderService } from '../../../../services/loader.service';
@Component({
  selector: 'app-product-template',
  templateUrl: './product-template.component.html',
  styleUrls: ['./product-template.component.scss']
})
export class ProductTemplateComponent implements OnInit {
  templates: Array<ITemplates> = [];
  templateForm: FormGroup;
  // currentProductPrice: number = 0;
  alive = true;
  public formSetting: any;
  public isDataAvailable : boolean = false;
  public languageSelected: any;
  public direction = 'ltr';
  public productPrice : number = 0;
  singleSelectItems = {};
  multiSelectItems = {};
  extraCharges: { singleSelectPrice: number, multiSelectPrice: number };
  productDetail;
  @Output() closePopup1: EventEmitter<null> = new EventEmitter<null>();
  @Input() currency;
  languageStrings: any={};
  @Input() set productData(data) {
    if (data) {
      this.productDetail = data;
      this.afterDataReceived();
    }
  };

  constructor(private loader: LoaderService ,private productTemplateService: ProductTemplateService, private popupService: PopUpService, private fb: FormBuilder, public sessionService: SessionService) {


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
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
    });
    this.formSetting = this.sessionService.get('config');
    this.currency = this.formSetting.is_multi_currency_enabled ? this.currency : this.formSetting.payment_settings[0].symbol;
    this.extraCharges = { singleSelectPrice: 0, multiSelectPrice: 0 };

  }

  private async afterDataReceived() {
    this.getProductPrice();
    // this.currentProductPrice = this.productDetail.price;
    // await this.getProductTemplate();
    await this.getProductTemplate();
    this.initForm();
    this.setListener();
    // window['x'] = this;
    this.productTemplateService.priceUpdation.subscribe((res) => {
      this.updateExtraCharges(res);
    });
  }

  private getProductTemplate(): Promise<boolean> {
    if(this.productDetail.isSearchOn == true && this.productDetail.template){
      this.isDataAvailable = true;
      this.templates = this.productDetail.template;
      return;
    }
    this.loader.show();
    return new Promise((resolve, reject) => {
      this.productTemplateService.getProductTemplate(this.productDetail.product_id)
        .subscribe((response: any) => {
          this.loader.hide();
          if (response.status === 200) {
            this.isDataAvailable = true;
            this.templates = response.data[0].template || [];
            resolve(true);
          } else {
            resolve(false);
            this.popupService.showPopup('error', 2000, response.message, false);
                this.closeThePopup();
                this.loader.hide();
          }
        }, error => {
          resolve(false);
          this.loader.hide();
          this.popupService.showPopup('error', 2000, error.message, false);
        });
    });
  }

  getProductPrice() {
    this.productPrice = this.productTemplateService.getServiceTimeAmmount(this.productDetail);
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
        const fg: FormGroup = this.fb.group({
          data_type: [template.data_type],
          key: [template.label],
          value: [template.value, this.setValidators(template)],
          display_name: [template.display_name],
          allowed_values: [template.allowed_values],
          option: [template.option || []],
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
      return arr;
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
        this.productTemplateService.priceTemplateChange.emit(items);

      });
  }

  updateExtraCharges(item: any) {
    if (item.value != 'null') {
      if (item.data_type == 'Multi-Select') {
        const key = item.index_id;
            if (this.multiSelectItems.hasOwnProperty(key)){
                delete this.multiSelectItems[key];
                this.multiSelectItems[key] = item.value
            } else {
              this.multiSelectItems[key] = item.value
            }
            this.updateMultiSelectPrice();
      }
      else if (item.data_type == 'Single-Select') {
        const key = item.index_id;
        if (this.singleSelectItems.hasOwnProperty(key)){
            delete this.singleSelectItems[key];
            this.singleSelectItems[key] = item.value
        } else {
          this.singleSelectItems[key] = item.value
        }
        this.updateSingleSelectPrice();
      }
    }
  }
  updateMultiSelectPrice() {
        this.extraCharges.multiSelectPrice = 0;
        const obj = this.multiSelectItems;
        const totalsum = Object.values(obj).reduce((acc, value) => {
          const totalValue = (value as any[]).reduce((a, v) => a + v.cost,0);
          return acc + totalValue;
        }, 0)
        this.extraCharges.multiSelectPrice = (totalsum as number);
  }
  updateSingleSelectPrice() {
    this.extraCharges.singleSelectPrice = 0;
    const obj = this.singleSelectItems;
    const totalsum = Object.values(obj).reduce((acc, value) => {
      acc = acc + (value as any).cost
      return acc ;
    }, 0)
    this.extraCharges.singleSelectPrice = (totalsum as number);
}

  closeThePopup() {
    this.closePopup1.emit();
  }
  submitQuestionnaire() {
    const extraCharges = this.extraCharges.singleSelectPrice + this.extraCharges.multiSelectPrice;
    this.productDetail.total_amount = ((this.productDetail.price*this.productDetail.min_quantity + extraCharges))
    this.productDetail.productTemplatePrice = extraCharges;
    // this.productDetail.showPrice = ((this.productDetail.price*this.productDetail.min_quantity + this.extraCharges.singleSelectItems + this.extraCharges.multiSelectItems))

    console.warn('SUBMIT ------->', this.templateForm),this.productDetail.total_amount;
      this.productTemplateService.submitProducttemplate(this.templateForm ,this.productDetail);
      this.closePopup1.emit();
  }
  ngOnDestroy() {
    this.alive = false;
    this.isDataAvailable = false;
    //  this.productTemplateService.submitQuestionnaire.unsubscribe();
  }
}
