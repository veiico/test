import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router, Route, ActivatedRoute } from "@angular/router";

import { SessionService } from '../../../../services/session.service';
import { LoaderService } from '../../../../services/loader.service';
import { AppService } from '../../../../app.service';

@Component({
  selector: 'app-gift-button',
  templateUrl: './gift-button.component.html',
  styleUrls: ['./gift-button.component.scss']
})
export class GiftButtonComponent implements OnInit {

  public headerData: any;
  public config: any;
  public loginData: any;
  public terminology: any = {};
  public langJson: any = {};
  public languageSelected: string;
  public direction: string;
  public modeSelected: string = 'BUY';

  @Output() sendMode: any = new EventEmitter();
  languageStrings: any={};

  constructor(private sessionService: SessionService,
              private loader: LoaderService,
              public appService: AppService) {

  }

  ngOnInit() {
    this.headerData = this.sessionService.get('config');
    this.setConfig();
    this.setLanguage();
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
   * show mode selected
   */
  showMode(type) {
    this.modeSelected = type;
    this.sendMode.emit({data: this.modeSelected});
  }
}
