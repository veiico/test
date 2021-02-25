/**
 * Created by cl-macmini-51 on 01/05/18.
 */
import { Component, OnInit } from '@angular/core';

import { SessionService } from '../../services/session.service';
import { LoaderService } from '../../services/loader.service';

declare var $: any;

// import * as $ from 'jquery';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.html',
  styleUrls: ['./privacy-policy.scss']
})
export class PrivacyPolicyComponent implements OnInit {

  public appConfig: any;
  public languageSelected: any;
  public direction = 'ltr';
  languageStrings: any={};

  constructor(private sessionService: SessionService, private loader: LoaderService) {
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
    this.appConfig = this.sessionService.get('config');
    this.loader.hide();
  }
}
