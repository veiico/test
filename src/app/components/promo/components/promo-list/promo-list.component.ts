/**
 * Created by mba-214 on 24/10/18.
 */
import { Component, Input, OnInit, OnDestroy, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { SessionService } from '../../../../services/session.service';
import { AppService } from '../../../../app.service';
import { MessageService } from '../../../../services/message.service';
import { PopUpService } from '../../../../modules/popup/services/popup.service';
import { LoaderService } from '../../../../services/loader.service';

@Component({
  selector: 'app-promo-list',
  templateUrl: './promo-list.component.html',
  styleUrls: ['./promo-list.component.scss']
})

export class PromoListComponent implements OnInit, OnDestroy, AfterViewInit {

  public _list;
  languageStrings: any={};
  get list() { return this._list };
  @Input() set list(val: any) {
    this._list = val;
    this.makeSelectedKey();
  };

  public _selectedPromoReferral;
  get selectedPromoReferral() { return this._selectedPromoReferral };
  @Input() set selectedPromoReferral(val: any) {
    this._selectedPromoReferral = val;
    this.makeSelectedKey();
  };

  @Output() selectedItem: any = new EventEmitter();
  public formSettings: any;
  public terminology: any;
  public langJson: any;
  public languageSelected: string;
  public direction: string;
  public currency: string;

  constructor(public sessionService: SessionService,
              public appService: AppService,
              public messageService: MessageService,
              protected router: Router,
              protected popup: PopUpService,
              protected loader: LoaderService) {
  }


  ngOnInit() {
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
    });
    this.setConfig();
    this.setLang();
  }

  ngOnDestroy() {

  }

  ngAfterViewInit() {

  }

  /**
   * setConfig
   */
  setConfig() {
    this.formSettings = this.sessionService.get('config');
    this.terminology = this.formSettings.terminology;
    this.currency = this.formSettings.payment_settings[0].symbol;
  }

  /**
   * set lang
   */
  setLang() {
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

  /**
   * make promo and referral selected
   */
  makeSelectedKey() {
    if (this._list && this._list.PROMOS && this._list.PROMOS.length) {
      this._list.PROMOS.forEach((o) => {
        o.selected = false;
      })
    }

    if (this._list && this._list.REFERRAL && this._list.REFERRAL.length) {
      this._list.REFERRAL.forEach((o) => {
        o.selected = false;
      })
    }
    this.autoSelectReferralPromo();
  }

  /**
   * set promo id
   */
  setPromoId(id) {
    this._list.PROMOS.forEach((o, i) => {
      if (i == id) {
        o.selected = true;
      } else {
        o.selected = false;
      }
    });

    this.selectedItem.emit({promo: this._list.PROMOS[id].id});
  }

  /**
   * remove promo id
   */
  removePromoId(id) {
    this._list.PROMOS.forEach((o) => {
      o.selected = false;
    });
    this.selectedItem.emit('');
  }

  /**
   * set referral id
   */
  setReferral(id) {
    this._list.REFERRAL.forEach((o, i) => {
      if (i == id) {
        o.selected = true;
      } else {
        o.selected = false;
      }
    });

    this.selectedItem.emit({promo_code: this._list.REFERRAL[id].code});
  }

  /**
   * remove referral id
   */
  removeReferralId(id) {
    this._list.REFERRAL.forEach((o) => {
      o.selected = false;
    });
    this.selectedItem.emit('');
  }

  /**
   * auto select selected promo and referral
   */
  autoSelectReferralPromo() {
    if (this._selectedPromoReferral) {
      if (this._list && this._list.PROMOS && this._list.PROMOS.length) {
        this._list.PROMOS.forEach((o) => {
          if (o.id == this._selectedPromoReferral.promo) {
            o.selected = true;
          } else if (this._selectedPromoReferral.promo_code && o.code.toLowerCase() === this._selectedPromoReferral.promo_code.toLowerCase()) {
            o.selected = true;
          }
        })
      }
      if (this._list && this._list.REFERRAL && this._list.REFERRAL.length) {
        this._list.REFERRAL.forEach((o) => {
          if (o.code == this._selectedPromoReferral.promo_code) {
            o.selected = true;
          }
        })
      }
    }

  }
}
