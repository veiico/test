/**
 * Created by cl-macmini-51 on 09/10/18.
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Meta } from '@angular/platform-browser';

import { SessionService } from '../../services/session.service';
import { LoaderService } from '../../services/loader.service';
import { PopUpService } from '../../modules/popup/services/popup.service';
import { MessageService } from '../../services/message.service';
import { AppService } from '../../app.service';
import { ReferAndEarnShareService } from './referAndEarnShare.service';
import { MessageType } from '../../constants/constant';

@Component({
  selector: 'app-refer-share',
  templateUrl: './referAndEarnShare.component.html',
  styleUrls: ['./referAndEarnShare.component.scss']
})
export class ReferAndEarnShareComponent implements OnInit {
  data;
  appConfig;
  referralData;
  country_code;
  vendorId;
  marketplaceUserId;
  showRefer: boolean;
  public langJson: any;
  public languageSelected: any;
  public direction = 'ltr';
  public headerData;
  languageStrings: any={};
  constructor(private sessionService: SessionService, private loader: LoaderService, private popup: PopUpService,
              private service: ReferAndEarnShareService, private message: MessageService, private formBuilder: FormBuilder,
              public appService: AppService, private activatedRoute: ActivatedRoute, private meta: Meta) {
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

  ngOnInit() {
    this.headerData = this.sessionService.get('config');
    this.appConfig = this.sessionService.get('config');
    this.loader.hide();
    // ================language json manupilation======================


    this.activatedRoute.params.subscribe(
      (data) => {
        if (data != null) {
          this.vendorId = data.vendorId;
          this.marketplaceUserId = data.marketplaceUserId;
          if (this.vendorId && this.marketplaceUserId) {
            this.getDataForShare(this.vendorId, this.marketplaceUserId);
          }
        }
      });
      this.sessionService.langStringsPromise.then(() =>
      {
       this.languageStrings = this.sessionService.languageStrings;
      });
  }

  /**
   * get share data
   */
  getDataForShare(vendorId, marketplaceUserId) {
    const obj = {
      'marketplace_user_id': marketplaceUserId,
      'vendor_id': vendorId
    };
    this.loader.show();
    this.service.getDataForShare(obj)
      .subscribe(
        response => {
          this.loader.hide();
          try {
            if (response.status === 200) {
              if (response.data && response.data.length > 0) {
                this.showRefer = false;
                this.referralData = response.data[0];

                if (this.referralData.sender_description.indexOf('<referral>') !== -1) {
                  this.referralData.sender_description = this.referralData.sender_description.replace(/<referral>/g, this.referralData.referral_code);
                }
                if (this.referralData.receiver_description.indexOf('<referral>') !== -1) {
                  this.referralData.receiver_description = this.referralData.receiver_description.replace(/<referral>/g, this.referralData.referral_code);
                }
                this.generateTags(this.referralData);
              } else {
                this.showRefer = true;
              }

            } else {
              this.popup.showPopup(MessageType.ERROR, 2000, response.message, false);
            }
          } catch (e) {
            console.error(e);
          }
          this.loader.hide();
        },
        error => {
          console.error(error);
        }
      );
  }

  generateTags(data) {

    this.meta.updateTag({ name: 'keywords', content: 'Referral Code' });
    this.meta.updateTag({ name: 'description', content: data.receiver_description });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
    this.meta.updateTag({ name: 'twitter:site', content: 'Any' });
    this.meta.updateTag({ name: 'twitter:title', content: 'Referral Code' });
    this.meta.updateTag({ name: 'twitter:description', content: data.receiver_description });
    this.meta.updateTag({ name: 'twitter:image', content: this.appConfig.web_header_logo || this.appConfig.logo });

    this.meta.updateTag({ property: 'og:type', content: 'article' });
    this.meta.updateTag({ property: 'og:site_name', content: 'Any' });
    this.meta.updateTag({ property: 'og:title', content: 'Referral Code' });
    this.meta.updateTag({ property: 'og:description', content: data.receiver_description });
    this.meta.updateTag({ property: 'og:image', content: this.appConfig.web_header_logo || this.appConfig.logo});
    //this.meta.updateTag({ property: 'og:url', content: `https://instafire-app.firebaseapp.com/${config.slug}` });
  }

}
