import { Component, NgZone, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { Router } from '@angular/router';

import { FavLocationService } from '../fav-location.service';
import { MessageService } from '../../../services/message.service';
import { LoaderService } from '../../../services/loader.service';
import { SessionService } from '../../../services/session.service';
import { ThemeService } from '../../../services/theme.service';
import { AppService } from '../../../app.service';


@Component({
    selector: 'fav-location-model',
    templateUrl: './fav-location-model.component.html',
    styleUrls: ['./fav-location-model.component.scss']
})
export class FavLocationModelComponent implements OnInit {
    public formSettings: any;
    public locationTypes:any;
    @Input() styles;
    @Input() address;
    @Input() readOnly = false;
    @Output() edit = new EventEmitter<any>();
    @Output() delete = new EventEmitter<any>();
    @Input() laundry_pickup:boolean = false;
    @Input() laundry_delivery:boolean = false;
    public langJson:any ={};
    public terminology: any = {};
    languageStrings: any={};
    
    constructor(protected service: FavLocationService, protected messageService: MessageService, public appService: AppService,
        protected router: Router, protected loader: LoaderService, protected sessionService: SessionService,
        protected themeService: ThemeService, protected el: ElementRef) {
    }

    ngOnInit() {
      
        this.setConfig();
            this.terminology = this.sessionService.get('config').terminology;
            this.sessionService.langStringsPromise.then(() =>
            {
             this.languageStrings = this.sessionService.languageStrings;
             this.locationTypes = [
              {
                  label: this.languageStrings.home || 'Home',
                  icon: 'assets/img/home_gray.svg',
                  value: 0
              },
              {
                  label: this.languageStrings.work ||'Work',
                  icon: 'assets/img/work_gray.svg',
                  value: 1
              },
              {
                  label: this.languageStrings.others || 'Others',
                  icon: 'assets/img/other_gray.svg',
                  value: 2
              },
              {
                label: (this.languageStrings.current_address ||'Current Address')
                .replace("ADDRESS_ADDRESS",this.terminology.ADDRESS),
                icon: 'assets/img/other_gray.svg'
            }
          ];
            });
           this.themeService.setNativeStyles(this.styles, this.el);
            this.appService.langPromise.then(() => {
            this.langJson = this.appService.getLangJsonData();
          });
    }

    /** 
* set config 
*/ 
setConfig() { 
    this.formSettings = this.sessionService.get('config'); 
    this.terminology = this.formSettings.terminology; 
    }
    editAddress(event) {
      event.stopPropagation();
        this.service.selectedFavAddressId = this.address.fav_id;
        this.edit.emit(this.address);
    }

    deleteAddress(event) {
      event.stopPropagation();
        const obj = {
            // 'marketplace_reference_id': this.sessionService.getString('marketplace_reference_id'),
            'marketplace_reference_id': this.formSettings.marketplace_reference_id,
            'marketplace_user_id': this.formSettings.marketplace_user_id,
            'fav_id': this.address.fav_id
        };
        if (this.sessionService.get('appData')) {
            obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
            obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
          }
        this.loader.show();
        this.service.deleteAddress(obj).subscribe(res => {
            this.loader.hide();
            if (res.status === 200) {
                this.messageService.sendAlert({
                    type: 'success',
                    msg: res.message,
                    timeout: 2000
                });
                this.delete.emit(this.address);
            }
        });
    }

    // cancelForm() {
    //     this.checkoutForm.reset();
    //     this.workflowObj.phone = null;
    //     this.editMode = false;
    // }
}
