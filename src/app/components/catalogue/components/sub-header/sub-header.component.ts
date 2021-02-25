/**
 * Created by mba-214 on 25/10/18.
 */
import { Component, Input, OnInit, OnDestroy, AfterViewInit, Output } from '@angular/core';
import { SessionService } from '../../../../services/session.service';
import { PopUpService } from '../../../../modules/popup/services/popup.service';
import { AppService } from '../../../../app.service';

@Component({
  selector: 'app-sub-header',
  templateUrl: './sub-header.component.html',
  styleUrls: ['./sub-header.component.scss']
})

export class SubHeaderComponent implements OnInit, OnDestroy, AfterViewInit {

  public formSettings: any;
  public terminology: any;
  public langJson: any;
  public direction: string;
  public languageSelected: string;

  constructor(public sessionService: SessionService,
              public appService: AppService) {

  }


  ngOnInit() {
    this.setConfig();
    this.setLang();
  }

  ngOnDestroy() {

  }

  ngAfterViewInit() {

  }

  /**
   * set config
   */
  setConfig() {
    this.formSettings = this.sessionService.get('config');
    this.terminology = this.formSettings.terminology;
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
    this.appService.langPromise.then(()=>{
    this.langJson = this.appService.getLangJsonData();
    });
  }
}
