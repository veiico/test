import { MessageType } from './../../../../constants/constant';
import { Component, OnInit } from '@angular/core';

import { SessionService } from '../../../../services/session.service';
import { LoaderService } from '../../../../services/loader.service';
import { PopUpService } from '../../../../modules/popup/services/popup.service';
import { AppService } from '../../../../app.service';
import { GiftCardService } from '../../gift-card.service';
import { GiftCardType } from '../../../../enums/enum';


@Component({
  selector: 'app-gift-card-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class GiftCardHistoryComponent implements OnInit {

  public headerData: any;
  public config: any;
  public loginData: any;
  public terminology: any = {};
  public langJson: any = {};
  public languageSelected: string;
  public direction: string;
  public history: any;
  public historyHave: boolean = true;
  languageStrings: any={};
  public giftCardType = GiftCardType;

  constructor(private sessionService: SessionService,
              private loader: LoaderService,
              private giftCardService: GiftCardService,
              public popup: PopUpService,
              public appService: AppService) {

  }

  ngOnInit() {
    this.headerData = this.sessionService.get('config');
    this.setConfig();
    this.setLanguage();
    if (!this.sessionService.isPlatformServer()) {
      this.getHistory();
    }
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
    });
  }

  /**
   * set config
   */
  setConfig() {
    this.config = this.sessionService.get('config');
    this.loginData = this.sessionService.get('appData');
    if (this.config) {
      this.terminology = this.config.terminology;
    }
  }

  /**
   * set language
   */
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

    this.appService.langPromise.then(() => {
      this.langJson = this.appService.getLangJsonData();
    });
  }

  /**
   * get gift card history
   */
  getHistory() {
    const data = {
      marketplace_user_id: this.loginData.vendor_details.marketplace_user_id,
    };
    if (this.loginData) {
      data['vendor_id'] = this.loginData.vendor_details.vendor_id;
      data['access_token'] = this.loginData.vendor_details.app_access_token;
    }
    this.loader.show();
    this.giftCardService.giftCardHistory(data).subscribe((response) => {
      this.loader.hide();
      if (response.status === 200) {
        this.history = response.data.txn_history;
        this.history.forEach((o) => {
          if ((o.receiver_vendor_id === this.loginData.vendor_details.vendor_id) && (o.sender_vendor_id === this.loginData.vendor_details.vendor_id) && o.is_redeemed) {
            o.type = 1;
          } else if ((o.receiver_vendor_id !== this.loginData.vendor_details.vendor_id) && (o.sender_vendor_id === this.loginData.vendor_details.vendor_id) && o.is_redeemed) {
            o.type = 4;
          } else if (o.receiver_vendor_id === this.loginData.vendor_details.vendor_id) {
            o.type = 2;
          } else if (o.sender_vendor_id === this.loginData.vendor_details.vendor_id && !o.is_redeemed) {
            o.type = 3;
          }
        })
        if (this.history && this.history.length) {
          this.historyHave = true;
        } else {
          this.historyHave = false;
        }
      } else {
        this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
      }
    }, error => {
      console.error(error);
    });
  }
}
