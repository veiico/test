import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../../services/api.service';
import { SessionService } from '../../../services/session.service';
import { DynamicTemplateDataType } from '../../../constants/constant';
import { CheckoutTemplateType, BusinessType, AmountService } from '../../../enums/enum';
import { FormBuilder, FormGroup } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable()
export class ProductTemplateService {
  priceTemplateChange: EventEmitter<any[]> = new EventEmitter<any[]>();
  priceUpdation: EventEmitter<any> = new EventEmitter<any>();
  submitQuestionnaire = new Subject<any>();
  restraurantInfo : any;
  business_type=BusinessType;

  // submitQuestionnaire: EventEmitter<any> = new EventEmitter<any>();
  
  constructor(private http: HttpClient, private apiService: ApiService,
    private sessionService: SessionService, private fb: FormBuilder) {
  }



  // getProductTemplate(productId : number) {
  //   const config = this.sessionService.get('config');
  //   console.warn('---------------' + config.marketplace_user_id);
  //   return this.apiService.post({
  //     url: 'product/template/get',
  //     body: {
  //       access_token: this.sessionService.get('appData').vendor_details.app_access_token,
  //       marketplace_user_id: config.marketplace_user_id,
  //       user_id: this.sessionService.getString("user_id") || this.sessionService.get("config").marketplace_user_id,
  //       product_id: productId
  //     }
  //   });

  // }

  getProductTemplate(productId : number) {
    const config = this.sessionService.get('config');
    const data = {
      access_token: this.sessionService.get('appData') ? this.sessionService.get('appData').vendor_details.app_access_token : undefined,
      marketplace_user_id: config.marketplace_user_id,
      user_id: this.sessionService.getString("user_id") || this.sessionService.get("config").marketplace_user_id,
      product_id: productId,
      vendor_id : this.sessionService.get('appData') ? this.sessionService.get('appData').vendor_details.vendor_id : undefined
    }

    return this.http
.post(`${environment.API_ENDPOINT}product/template/get`, data).pipe(map(res => res));

  }

  getServiceTimeAmmount(prodctDetail){
    this.restraurantInfo=this.sessionService.get('info');
    if(this.restraurantInfo.business_type === this.business_type.SERVICE_MARKETPLACE){
      if(prodctDetail['unit_type'] == 1){
        let fixedServicePrice =prodctDetail.price * prodctDetail.min_quantity ;
        return fixedServicePrice;
      }
      else{
        let converterToSec;
        let check = this.convertToSec(prodctDetail);
        if (check.type == AmountService.Price) {
         return check.value
         }     
        else {
        converterToSec = check.value;
        }
        let pricePerUnitTime = prodctDetail.price/prodctDetail['unit'];
        let timeDiff;
        if(prodctDetail.start_time && prodctDetail.end_time){
          let start_dateTime = new Date(prodctDetail.start_time); 
          let end_dateTime = new Date(prodctDetail.end_time);
          timeDiff = (end_dateTime.getTime() - start_dateTime.getTime())/1000; 
          timeDiff /= converterToSec;
        }
        let service_time = prodctDetail.service_time ? prodctDetail.service_time/(converterToSec / 60): timeDiff;
        if(!service_time){
          service_time = 1;
        }
        let totalPrice = ((prodctDetail.min_quantity * pricePerUnitTime * service_time));
        return totalPrice;
      }
    }  
    return prodctDetail.price*prodctDetail.min_quantity
  }

  convertToSec(obj)
  {
   let converterToSec;
   switch (obj['unit_type']) {
     case 1:
         return {type:1,value: obj.price} ;
     case 2:
       converterToSec =  60;
       break;
     case 3:
       converterToSec =  60 * 60;
       break;
     case 4:
       converterToSec =  60 * 60 * 24;
       break;
     case 5:
       converterToSec =  60 * 60 * 24 * 7;
       break;
     case 6:
       converterToSec =   60 * 60 * 24  * 30;
       break;
     case 7:
       converterToSec =  60 * 60 * 24 * 365;
       break;
       default:
         break

   }
   return {type:0,value: converterToSec}
}

  submitProducttemplate(templateForm : FormGroup, productDetail){

    const product_template = this.createProductTemplate(templateForm.controls.templates.value);
    const questionnaireData = {
      productInfo : productDetail,
      template : JSON.stringify(product_template)
    }
    this.submitQuestionnaire.next(questionnaireData);
  console.warn(questionnaireData);

  

  }
// manupulation to send data to backend form

  createProductTemplate(arr: Array<any>): Array<any> {
    const template_data: any[] = [];
    arr.forEach(template => {
      const json = {
        display_name: template.display_name,
        data_type: template.data_type,
        label: template.key,
        allowed_values: template.allowed_values,
        value: template.value
      };
      if ([DynamicTemplateDataType.SINGLE_SELECT, DynamicTemplateDataType.MULTI_SELECT].includes(template.data_type)) {
        // arr.push(template);
        json['option'] = template.option;
        if (Array.isArray(template.value)) {
          let cost = 0;
          const keys = [];
          template.value.forEach(obj => {
            cost += obj.cost;
            keys.push(obj.text);
          });
          json['cost'] = cost;
          json['value'] = keys;
        } else {
          json['cost'] = template.value.cost || 0;
          json['value'] = template.value.text || '';
        }
      } else if (template.data_type == DynamicTemplateDataType.TELEPHONE) {
        json['value'] = `+${(template.dial_code || 1)} ${template.value}`;
      }
      template_data.push(json);
    });
    return template_data;
  }
}
