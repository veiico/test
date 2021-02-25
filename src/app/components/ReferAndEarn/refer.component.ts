import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators} from '@angular/forms';

import { SessionService } from '../../services/session.service';
import { LoaderService } from '../../services/loader.service';
import { PopUpService } from '../../modules/popup/services/popup.service';
import { ReferService } from './refer.service';
import { MessageService } from '../../services/message.service';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-refer',
  templateUrl: './refer.component.html',
  styleUrls: ['./refer.component.scss']
})
export class ReferComponent implements OnInit {
  data;
  appConfig;
  edit = false;
  bg_color = '#fffff';
  profile_color = '#fffff';
  domain;
  locationPath;
  locationHref;
  finalPath;
  dataCopy;
  referralData;
  phoneForm;
  country_code;
  phoneCopy;
  html:any;
  public languageSelected: any;
  public direction = 'ltr';
  public headerData;
  public terminology:any = {};
  languageStrings: any={};
  
  constructor(private sessionService: SessionService, private loader: LoaderService, private popup: PopUpService,
              private service: ReferService, private message: MessageService, private formBuilder: FormBuilder,
              public appService: AppService) {
    this.phoneForm = this.formBuilder.group({
      'phone': ['', [Validators.required]]
    });
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
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
    });
    this.headerData = this.sessionService.get('config');
    if (this.headerData.terminology) {
      this.terminology = this.headerData.terminology;
    }
    this.domain = this.sessionService.getString('domain');
    this.locationHref = location.href;
    this.locationPath = location.pathname;
    this.appConfig = this.sessionService.get('config');
    this.finalPath = 'https://' + this.domain + '/' + this.locationPath.split('/')[1] + '/share/' + this.sessionService.get('appData').vendor_details.vendor_id + '/' + this.appConfig.marketplace_user_id;
    this.data = this.sessionService.get('appData').vendor_details;
    this.referralData = this.sessionService.get('appData').referral;
    if (this.referralData.sender_description.indexOf('<referral>') !== -1) {
      this.referralData.sender_description = this.referralData.sender_description.replace(/<referral>/g, this.data.referral_code);
    }
    if (this.referralData.receiver_description.indexOf('<referral>') !== -1) {
      this.referralData.receiver_description = this.referralData.receiver_description.replace(/<referral>/g, this.data.referral_code);
    }
    this.bg_color = this.sessionService.get('config') ? this.sessionService.get('config').header_color : '';
    this.profile_color = this.sessionService.get('config') ? this.sessionService.get('config').color : '';
    this.dataCopy = JSON.parse(JSON.stringify(this.data));
    this.phoneCopy = this.dataCopy.phone_no.trim();
    this.loader.hide();
    // ================language json manupilation======================
    this.html = this.checkDescriptionType(this.referralData.sender_description);
  }


  /**
   * check if referal string contain link or not
   */
  checkDescriptionType(value){
    var expression = /(?:(?:https?|ftp):\/\/)?[-a-zA-Z0-9@:%._\+~#=]*\.[a-z]*\b([-a-zA-Z0-9@:%_\+.~#()?&//=]*)/igm;
    return value.replace(expression, function(url) {
      if(url.includes('https') || url.includes('http'))
      return '<a href="' + url + '" target="_blank">' + url + '</a>';
      else
      return '<a href="//' + url + '" target="_blank">' + url + '</a>';
  })
  }
  shareOnWhatsapp() {
    const descript = encodeURIComponent(this.referralData.receiver_description);
    const url = this.finalPath;
   window.open("https://api.whatsapp.com/send?url=" + url + "&text=" + descript + " " + url);
  }
  shareOnFb() {
    const descript = encodeURIComponent(this.referralData.receiver_description);
    const title = "Referral code";


    const fbShareLink = escape(this.finalPath) + '&title =' + escape(title)+ '&description =' + escape(descript);
    window.open("https://www.facebook.com/sharer/sharer.php?u=" + fbShareLink, "pop", "width=600, height=400, scrollbars=no");

  }
  shareOnTwitter() {
    const descript = encodeURIComponent(this.referralData.receiver_description);
    const twShareLink = 'text=' + descript + '&url=' + escape(this.finalPath);
    window.open("http://twitter.com/intent/tweet?" + twShareLink , "pop", "width=600, height=400, scrollbars=no");
  }

}
