/**
 * Created by mba-214 on 24/10/18.
 */
import { Component, Input, OnInit, OnDestroy, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

import { RouteHistoryService } from '../../services/setGetRouteHistory.service';
import { SessionService } from '../../services/session.service';
import { AppService } from '../../app.service';
import { MessageService } from '../../services/message.service';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-payment-new',
  templateUrl: './payment-new.component.html',
  styleUrls: ['./payment-new.component.scss']
})

export class PaymentNewComponent implements OnInit, OnDestroy, AfterViewInit {

  public formSettings: any;
  public terminology: any;
  public langJson: any;
  public languageSelected: string;
  public direction: string;
  public currency: string;
  public lastUrl: string;
  public isSourceCustom: number;
  public isEditedTask: number = 0;
  public showDebtPopup: boolean;

  constructor(public sessionService: SessionService,
              public appService: AppService,
              public messageService: MessageService,
              public activatedRoute: ActivatedRoute,
              private router: Router,
              public routeHistoryService: RouteHistoryService,
              protected loader: LoaderService) {
    this.lastUrl = this.routeHistoryService.getPreviousUrl();
 
  }


  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((data) => {
      if (data.redir_source === 'CUSTOM' || data.redir_source === 'NEW_CUSTOM') {
        this.isSourceCustom = 1;
      } else {
        this.isSourceCustom = 0;
      }
      if (data.is_edited_task) {
        this.isEditedTask = 1;
      }
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
    this.langJson = this.appService.getLangJsonData();
  }

  onDebtActionPopup(event) {

    switch(event) {
      case 'hide': {
        this.showDebtPopup = false;
        break;
      }
      case 'pay': {
        break;
      }
    }
  }

}
