
import { Injectable } from '@angular/core';

import { ApiService } from '../../../../services/api.service';
import { SessionService } from '../../../../services/session.service';
import { AppService } from '../../../../app.service';

@Injectable()
export class PickUpService {
  mandatorySignFields: any;
  private formSettings;
  public langJson: any = {};
  public restaurantInfo: any;
  constructor(private apiService: ApiService, private sessionService: SessionService,
    private appService: AppService) {
    this.formSettings = this.sessionService.get('config');
    if (this.formSettings.product_view === 1) {
      this.restaurantInfo = this.sessionService.get('config');
      this.restaurantInfo.self_pickup = this.restaurantInfo.admin_self_pickup;
      this.restaurantInfo.home_delivery = this.restaurantInfo.admin_home_delivery;
    } else {
      this.restaurantInfo = this.sessionService.get('info');
    }
    this.appService.langPromise.then(() => {
      this.langJson = this.appService.getLangJsonData();
    });
  }

  async getTemplateList(isCustomPickup : boolean) {
    await this.appService.langPromise;
    const pickUpAndDeliveryBool = this.formSettings.force_pickup_delivery;
    const pickUpOrDeliveryBool = this.formSettings.pickup_delivery_flag;
   this.mandatorySignFields =this.formSettings.signup_field;
   if(this.formSettings.is_guest_checkout_enabled && this.sessionService.get('appData') && parseInt(this.sessionService.get('appData').vendor_details.is_guest_account))
   {
     if(this.formSettings.email_config_for_guest_checkout && this.formSettings.phone_config_for_guest_checkout)
     {
      this.mandatorySignFields=2;//for email or phone both mandatory
     }
     else if(this.formSettings.email_config_for_guest_checkout)
     {
       this.mandatorySignFields=0;//for email  mandatory
     }
     else if( this.formSettings.phone_config_for_guest_checkout)
     {
       this.mandatorySignFields=1;//for  phone mandatory
     }
   }
    let required = 0;
    if (pickUpAndDeliveryBool || !pickUpOrDeliveryBool) {
      required = 1;
    }
    const list = [
       {
        app_side: '1',
        data_type: 'pickupAddress',
        display_name: this.formSettings && this.formSettings.terminology ? this.formSettings.terminology['DELIVER_TO'] : this.langJson['Address'],
        label: 'pickupAddress',
        required: required,
        visibility: 1
      },
     {
        app_side: '1',
        data_type: 'date',
        display_name: 'ready for pick-up',
        label: 'pickupTime',
        visibility: 1
      }, {
        app_side: '1',
        data_type: 'selfpickupAddress',
        display_name:  (this.formSettings && this.formSettings.terminology) ? this.formSettings.terminology['SELF_PICKUP_FROM'] : this.formSettings.terminology['PICKUP_FROM'],
        label: 'selfpickupAddress',
        required: required,
        visibility: 1
      }
    ];

    if(!isCustomPickup || (isCustomPickup && this.formSettings.custom_order_name)){
      list.push(
        {
          app_side: '1',
          data_type: 'Text',
          display_name: this.langJson['Name'],
          label: 'pickupName',
          // required: required,
          required: this.formSettings.custom_order_name==1 ? 1:0,
          visibility: this.formSettings.custom_order_name
        },
      )
    }
    if(!isCustomPickup || (isCustomPickup && this.formSettings.custom_order_phone)){
      list.push({
        app_side: '1',
        data_type: 'Telephone',
        display_name: this.langJson['Phone Number'],
        label: 'pickupPhoneNumber',
        // required: required,
        required: ((isCustomPickup && this.formSettings.custom_order_phone ==1) || (!isCustomPickup && this.mandatorySignFields!=0)) ? 1:0,
        visibility: this.formSettings.custom_order_phone
      })
    }
    if(!isCustomPickup || (isCustomPickup && this.formSettings.custom_order_email)){
      list.push({
        app_side: '1',
        data_type: 'Email',
        display_name: this.langJson['Email'],
        label: 'pickupEmail',
        // required: required,
        required: ((isCustomPickup && this.formSettings.custom_order_email==1)|| (!isCustomPickup && this.mandatorySignFields!=1)) ? 1:0,
        visibility: this.formSettings.custom_order_email
      }, )
    }
    return list;
  }
  async getCustomTemplateList(isCustomPickup: boolean) {
    const templateList = await this.getTemplateList(isCustomPickup);
    let index = -1;
    if (isCustomPickup) {
      index = templateList.findIndex((a) => { return a.data_type === 'pickupAddress'; });
      if (index > -1) {
        templateList[index].display_name =  this.formSettings && this.formSettings.terminology ? this.formSettings.terminology['PICKUP_FROM'] : this.formSettings.terminology['PICKUP_FROM'];
      }
      index = templateList.findIndex((a) => { return a.data_type === 'selfpickupAddress'; });
      if (index > -1) {
        templateList.splice(index, 1);
      }
      return templateList;
    }
    if (this.sessionService.getString('deliveryMethod')) {
      switch (Number(this.sessionService.getString('deliveryMethod'))) {
        case 1:
          index = templateList.findIndex((a) => { return a.data_type === 'selfpickupAddress'; });
          if (index > -1) {
            templateList.splice(index, 1);
          }
          break;
        case 2:
          index = templateList.findIndex((a) => { return a.data_type === 'pickupAddress'; });
          if (index > -1) {
            templateList.splice(index, 1);
          }
          break;
      }
    } else {
      if (this.restaurantInfo.home_delivery) {
        index = templateList.findIndex((a) => { return a.data_type === 'selfpickupAddress'; });
        if (index > -1) {
          templateList.splice(index, 1);
        }
      } else if (this.restaurantInfo.self_pickup) {
        index = templateList.findIndex((a) => { return a.data_type === 'pickupAddress'; });
        if (index > -1) {
          templateList.splice(index, 1);
        }
      }
    }
    let customTemplateList = [];
    if (this.formSettings.userOptions && Object.keys(this.formSettings.userOptions).length) {
      customTemplateList = this.formSettings.userOptions.items;
    }
    customTemplateList = templateList.concat(customTemplateList);
    return customTemplateList;
  }


}

