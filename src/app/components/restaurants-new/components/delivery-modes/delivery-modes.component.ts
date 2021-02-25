/**
 * Created by cl-macmini-51 on 16/08/18.
 */
import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild, AfterViewInit, Input } from '@angular/core';

import { AppService } from '../../../../app.service';
import { SessionService } from '../../../../services/session.service';
import { MessageService } from '../../../../services/message.service';
import { AppCartService } from '../../../catalogue/components/app-cart/app-cart.service';

@Component({
  selector: 'app-delivery-modes',
  templateUrl: './delivery-modes.component.html',
  styleUrls: ['./delivery-modes.component.scss']
})
export class DeliveryModesComponent implements OnInit, OnDestroy, AfterViewInit {

  public config: any;
  public terminology: any;
  public languageSelected: string;
  public direction: string;
  public langJson: any;
  public selectedMethod: number = 0;
  public showMode: boolean;

  protected _method;
  get method() { return this._method };
  @Input() set method(val: any) {
    this._method = val;
  };

  constructor(public appService: AppService, public sessionService: SessionService, public messageService: MessageService,
              public appCartService: AppCartService) {
    this.setConfig();
    this.setLanguage();
    //if (this.sessionService.getString('deliveryMethod')) {
    //  this.selectedMethod = Number(this.sessionService.getString('deliveryMethod'));
    //} else {
    this.setDefaultPickupDeliveryConfig();
    //}
    // this.messageService.sendDeliveryMode({type: this.selectedMethod, checkout: 0});
  }

  // ===================life cycles=====================
  ngOnInit() {

  }

  ngOnDestroy() {

  }

  ngAfterViewInit() {

  }

  // ===============set config for all====================
  setConfig() {
    this.config = this.sessionService.get('config');
    if (this.config) {
      this.terminology = this.config.terminology;
      if ((this.config.admin_home_delivery && this.config.admin_self_pickup) || (this.config.admin_home_delivery && this.config.admin_pick_and_drop) || (this.config.admin_pick_and_drop && this.config.admin_self_pickup)){
        this.showMode = true;
      }
    }
  }

  // ===============set language and direction====================
  setLanguage() {
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
    this.langJson = this.appService.getLangJsonData();
  }

  //================select delivery method=================
  selectDeliveryMode(type) {
    switch (type) {
      case 1:
            this.selectedMethod = 1;
            break;
      case 2:
        this.selectedMethod = 2;
        break;
      case 8:
        this.selectedMethod = 8;
        break;
    }
    this.sessionService.setString('deliveryMethod', type);
    this.messageService.sendDeliveryMode({type: type, checkout: 0});
  }

  /**
   * function to set default config for pickup/delivery
   */

  setDefaultPickupDeliveryConfig() {

      if (this.config.admin_self_pickup && this.config.selected_delivery_method_for_apps ==4) {
        this.selectedMethod = 2;
        this.sessionService.setString('deliveryMethod', 2);
      }
      else if (this.config.admin_home_delivery && this.config.selected_delivery_method_for_apps == 2) {
        this.selectedMethod = 1;
        this.sessionService.setString('deliveryMethod', 1);
      }
      else if (this.config.admin_pick_and_drop && this.config.selected_delivery_method_for_apps == 8) {
        this.selectedMethod = 8;
        this.sessionService.setString('deliveryMethod', 8);
      }
      else if (!this.config.admin_home_delivery && this.config.admin_self_pickup) {
        this.selectedMethod = 2;
        this.sessionService.setString('deliveryMethod', 2);
      } else {
        this.selectedMethod = 1;
        this.sessionService.setString('deliveryMethod', 1);
      }
  }
}
