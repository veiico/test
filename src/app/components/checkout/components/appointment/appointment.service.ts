import { Injectable } from '@angular/core';

import { ApiService } from '../../../../services/api.service';
import { SessionService } from '../../../../services/session.service';


@Injectable()
export class AppointmentService {
    private formSettings;
    constructor(private apiService: ApiService, private sessionService: SessionService) {
        this.formSettings = this.sessionService.getByKey('app', 'formsetting');
        if (!this.formSettings) {
            this.formSettings = this.sessionService.getByKey('app', 'user').formSettings;
        }
     }

    getTemplateList() {
        const required = 1;
        const list = [
            {
                app_side: '1',
                data_type: 'Text',
                display_name: 'name',
                label: 'pickupName',
                required: required
            }, {
                app_side: '1',
                data_type: 'pickupAddress',
                display_name: 'address',
                label: 'pickupAddress',
                required: required
            },
            {
                app_side: '1',
                data_type: 'Telephone',
                display_name: 'phone',
                label: 'pickupPhoneNumber',
                required: required
            }, {
                app_side: '1',
                data_type: 'Email',
                display_name: 'email',
                label: 'pickupEmail',
                required: required
            }, {
                app_side: '1',
                data_type: 'pickupTime',
                display_name: 'start time',
                label: 'pickupTime',
            },
            {
                app_side: '1',
                data_type: 'deliveryTime',
                display_name: 'end time',
                label: 'deliveryTime',
            }
        ];
        return list;
    }
    getCustomTemplateList() {
        const templateList = this.getTemplateList();
        let customTemplateList = [];
        if (this.formSettings.userOptions && Object.keys(this.formSettings.userOptions).length) {
          customTemplateList = this.formSettings.userOptions.items;
        }
        customTemplateList = templateList.concat(customTemplateList);
        return customTemplateList;
    }


}

