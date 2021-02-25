import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../../services/api.service';
import { SessionService } from '../../../services/session.service';
import { DynamicTemplateDataType } from '../../../constants/constant';
import { CheckoutTemplateType } from '../../../enums/enum';

@Injectable()
export class CheckoutTemplateService {

  priceTemplateChange: EventEmitter<any[]> = new EventEmitter<any[]>();

  constructor(private http: HttpClient, private apiService: ApiService,
    private sessionService: SessionService) {
  }

   getCheckoutTemplate(type?: number) {
    const config = this.sessionService.get('config');
    const user_id = this.sessionService.get('user_id');
    return  this.apiService.get({
      url: 'template/getCheckoutTemplate',
      body: {
        marketplace_user_id: config.marketplace_user_id,
        user_id: type === CheckoutTemplateType.CUSTOM_ORDER ? config.marketplace_user_id : user_id,
        type: type || CheckoutTemplateType.NORMAL_ORDER,
      }
    });

  }


  createCheckoutTemplateJson(arr: Array<any>): Array<any> {
    const template_data: any[] = [];
    arr.forEach(template => {
      const json = {
        display_name: template.display_name,
        data_type: template.data_type,
        label: template.key,
        allowed_values: template.allowed_values && template.allowed_values.length>0? template.allowed_values : undefined,
        value: template.value
      };
      if ([DynamicTemplateDataType.SINGLE_SELECT, DynamicTemplateDataType.MULTI_SELECT,DynamicTemplateDataType.SINGLE_SELECT_DELIVERY_TEMPLATE].includes(template.data_type)) {
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
