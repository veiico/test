/**
 * Created by cl-macmini-51 on 26/07/18.
 */
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { LoaderService } from '../../services/loader.service';
import { SessionService } from '../../services/session.service';
import { AppService } from '../../app.service';
import { EmailVerificationService } from './email-verification.service'

@Component({
  selector: 'app-email-verify',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss']
})

export class EmailVerificationComponent implements OnInit, OnDestroy, AfterViewInit {

  public config: any;
  public token: string;
  public email: string;
  public type: string;
  public user_type: string;
  public terminology: any={};
  public bsConfig: any;
  public colorTheme = 'theme-dynamic';
  public minDate = new Date();
  public langJson: any = {};
  public languageSelected: any;
  public direction = 'ltr';
  public message = '';
  public data;//header data
  languageStrings: any={};
  constructor(private loader: LoaderService, private sessionService: SessionService, private activatedRoute: ActivatedRoute,
    public router: Router, private appService: AppService, public emailVerificationService: EmailVerificationService) {
    this.setConfig();
    this.setLanguage();

    this.sessionService.remove('appData');
    this.sessionService.remove('reg_status');
  }

  ngOnInit() {
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
    });
    this.data = this.sessionService.get('config');
    this.loader.hide();
    this.checkForDemoLogin();
  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {

  }

  // =================check for demo login===================
  checkForDemoLogin() {

    this.activatedRoute.queryParams.subscribe(
      (data) => {
        if (data != null) {
          this.token = data.token;
          this.email = data.email;
          this.type = data.type;
          this.user_type = data.userType;
          if (this.token && this.email && this.type) {
            this.verifyEmail(this.token, this.email, this.type, this.user_type);
          }
        }
      });

    //if (this.router.url !== '/' && !this.sessionService.get('appData')) {
    //  this.token = this.router.url.split('?')[1].split('=')[1].split('&')[0];
    //  this.email = this.router.url.split('&')[1].split('=')[1];
    //  this.type = this.router.url.split('&')[2].split('=')[1];
    //
    //  if (this.token && this.email && this.type) {
    //    this.verifyEmail(this.token, this.email, this.type);
    //  }
    //}
  }

  // ============set config for all======================
  setConfig() {
    this.config = this.sessionService.get('config');
    if (this.config) {
      this.config.borderColor = this.config['color'] || '#e13d36';
      this.terminology = this.config.terminology || {};
      // this.config.nlevel_enabled = 1;
    }

    this.bsConfig = Object.assign({}, {
      containerClass: this.colorTheme,
      showWeekNumbers: false,
      dateInputFormat: 'LL'
    }
    );
  }

  // ============set language for all======================
  async setLanguage() {
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
    await this.appService.langPromise;
    this.langJson = this.appService.getLangJsonData();
    this.languageStrings.find_businesses = (this.languageStrings.find_businesses || 'Find Businesses')
    .replace('BUSINESSES_BUSINESSES', this.terminology.BUSINESSES ? this.terminology.BUSINESSES : 'Businesses');

  }

  // ==================verify======================
  verifyEmail(token, email, type, userType) {
    this.loader.show();
    if (this.user_type === 'vendor') {
      const obj = {
        token: token,
        email: email,
        type: type,
        userType: userType,
        language:this.config ? this.config.language : 'en'
     
        
 };
      this.emailVerificationService.emailVerifyVendorHit(obj)
        .subscribe(
          response => {
            this.loader.hide();
            try {
              if (response.status === 200) {
                this.message = response.message;
              } else {
                this.message = response.message;
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
    else {
      const obj = {
        token: token,
        email: email,
        type: type,
        userType: undefined
      };
      this.emailVerificationService.emailVerifyMerchantHit(obj)
        .subscribe(
          response => {
            this.loader.hide();
            try {
              if (response.status === 200) {
                this.message = response.message;
              } else {
                this.message = response.message;
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

  }
}
