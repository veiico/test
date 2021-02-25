
import { Injectable } from '@angular/core';

import { SessionService } from '../../../../services/session.service';
import { AppService } from '../../../../app.service';

@Injectable()
export class DeliveryService {
    private pickUpAndDeliveryBool: any;
    private pickUpOrDeliveryBool: any;
    private restaurantInfo: any;
    private formSettings;
  public langJson: any;
    private customData: any = [];
    constructor(private sessionService: SessionService, private appService: AppService) {
        this.formSettings = this.sessionService.getByKey('app', 'formsetting');
        if (!this.formSettings) {
            this.formSettings = this.sessionService.getByKey('app', 'user').formSettings;
        }
      if (this.formSettings.product_view === 1) {
        this.restaurantInfo = this.sessionService.get('config');
        this.restaurantInfo.self_pickup = this.restaurantInfo.admin_self_pickup;
        this.restaurantInfo.home_delivery = this.restaurantInfo.admin_home_delivery;
      } else {
        this.restaurantInfo = this.sessionService.get('info');
      }
        this.pickUpAndDeliveryBool = this.formSettings.force_pickup_delivery;
        this.pickUpOrDeliveryBool = this.formSettings.pickup_delivery_flag;
        if (this.pickUpOrDeliveryBool === 2 && this.formSettings.deliveryOptions &&
          Object.keys(this.formSettings.deliveryOptions).length) {
          this.customData = this.formSettings.deliveryOptions.items;
        }
        if (this.pickUpOrDeliveryBool !== 2 && this.formSettings.userOptions &&
          Object.keys(this.formSettings.userOptions).length) {
          this.customData = this.formSettings.userOptions.items;
        }
      this.appService.langPromise.then(() => {
        this.langJson = this.appService.getLangJsonData();
      });
    }

    getDeliveryTemplateList() {

        let required = 0;
        if (this.pickUpAndDeliveryBool || this.pickUpOrDeliveryBool === 1) {
          required = 1;
        }
        const list = [
            {
                app_side: '1',
                data_type: 'Text',
                display_name: this.langJson['Name'],
                label: 'deliveryName',
                required: required
            }, {
                app_side: '1',
                data_type: 'deliveryAddress',
                display_name: this.formSettings && this.formSettings.terminology ? this.formSettings.terminology['DELIVER_TO'] : this.langJson['Address'],
                label: 'deliveryAddress',
                required: required
            },
            {
                app_side: '1',
                data_type: 'Telephone',
                display_name: this.langJson['Phone Number'],
                label: 'deliveryPhoneNumber',
                required: required
            }, {
                app_side: '1',
                data_type: 'Email',
                display_name: this.langJson['Email'],
                label: 'deliveryEmail',
                required: required
            }, {
                app_side: '1',
                data_type: 'date',
                display_name: 'latest delivery by time',
                label: 'deliveryTime',
            }, {
                app_side: '1',
                data_type: 'selfpickupAddress',
                display_name: (this.formSettings && this.formSettings.terminology) ? this.formSettings.terminology['SELF_PICKUP_FROM'] : this.formSettings.terminology['PICKUP_FROM'],
                label: 'selfpickupAddress',
                required: required
             }
        ];
        return list;
    }
    getCustomDeliveryTemplateList() {
        let templateList = this.getDeliveryTemplateList();
      let index = -1;
      if (this.sessionService.getString('deliveryMethod')) {
        switch (Number(this.sessionService.getString('deliveryMethod'))) {
          case 1:
            index = templateList.findIndex((a) => {return a.data_type === 'selfpickupAddress';});
            if (index > -1) {
              templateList.splice(index, 1);
            }
            break;
          case 2:
            index = templateList.findIndex((a) => {return a.data_type === 'deliveryAddress';});
            if (index > -1) {
              templateList.splice(index, 1);
            }
            break;
        }
      } else {
        if (this.restaurantInfo.home_delivery) {
          index = templateList.findIndex((a) => {return a.data_type === 'selfpickupAddress';});
          if (index > -1) {
            templateList.splice(index, 1);
          }
        } else if(this.restaurantInfo.self_pickup) {
          index = templateList.findIndex((a) => {return a.data_type === 'pickupAddress';});
          if (index > -1) {
            templateList.splice(index, 1);
          }
        }
      }
        templateList = templateList.concat(this.customData);
        return templateList;
    }

}

