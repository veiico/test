/**
 * Created by mba-214 on 24/10/18.
 */
import { Component, Input, OnInit, OnDestroy, AfterViewInit, Output, EventEmitter } from '@angular/core';

import { SessionService } from '../../../../services/session.service';
import { AppService } from '../../../../app.service';
import { MessageService } from '../../../../services/message.service';
import { LoaderService } from '../../../../services/loader.service';

@Component({
  selector: 'app-hold-overlay',
  templateUrl: './hold-overlay.component.html',
  styleUrls: ['./hold-overlay.component.scss']
})

export class PaymentHoldOverlayComponent implements OnInit, OnDestroy, AfterViewInit {

  public _list;
  languageStrings: any={};
  get list() { return this._list };
  @Input() set list(val: any) {
    this._list = val;
  };

  public _clickedFrom;
  get clickedFrom() { return this._clickedFrom };
  @Input() set clickedFrom(val: any) {
    this._clickedFrom = val;
  };

  @Output() gotItEvent: any = new EventEmitter();
  public formSettings: any;
  public terminology: any;
  public langJson: any;
  public languageSelected: string;
  public direction: string;
  public currency: string;
  public loginData: any;

  constructor(public sessionService: SessionService,
              public appService: AppService,
              public messageService: MessageService,
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
    this.loginData = this.sessionService.get('appData');
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

  /**
   * got it
   */
  gotIt() {
    this.gotItEvent.emit({data: this.clickedFrom});
  }
}
