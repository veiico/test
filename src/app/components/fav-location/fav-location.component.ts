import { Component, OnInit } from '@angular/core';
import { FavLocationService } from './fav-location.service';

import { MessageService } from '../../services/message.service';


import { LoaderService } from '../../services/loader.service';
import { SessionService } from '../../services/session.service';
import { ThemeService } from '../../services/theme.service';

@Component({
    selector: 'app-fav',
    templateUrl: './fav-location.component.html',
    styleUrls: ['./fav-location.component.scss']
})
export class FavLocationComponent implements OnInit {

    locations: Array<any> = [];
    editMode = false;
    selectEditAddress;
    config: any;
    content;
    languageStrings: any={};

    constructor(
        protected service: FavLocationService, protected messageService: MessageService,
        protected loader: LoaderService, protected sessionService: SessionService, protected themeService: ThemeService) {
    }

    ngOnInit() {
        this.sessionService.langStringsPromise.then(() =>
      {
       this.languageStrings = this.sessionService.languageStrings;
      });
        this.config = this.sessionService.get('config');
        this.content = this.themeService.config;
        this.fetchLocations();
    }

    fetchLocations() {
        const obj = {
            // 'marketplace_reference_id': this.sessionService.getString('marketplace_reference_id'),
            // 'marketplace_user_id': this.sessionService.get('appData').vendor_details.marketplace_user_id,
            'marketplace_reference_id': this.config.marketplace_reference_id,
            'marketplace_user_id': this.config.marketplace_user_id,
        };
        if (this.sessionService.get('appData')) {
            obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
            obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
          }
        this.service.fetchAddresses(obj).subscribe(res => {
            this.loader.hide();
            if (res.status === 200) {
              this.locations = res.data.favLocations;
            }
        });
    }

    onAddressEdit(address) {
 

        this.selectEditAddress = address;
    }

    onAddressSave($event) {
        if (this.selectEditAddress) {
            this.selectEditAddress = null;
        }
        this.fetchLocations();
    }
}
