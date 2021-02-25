/**
 * Created by mba-214 on 04/11/18.
 */
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { SessionService } from '../../../../services/session.service';
import { LoaderService } from '../../../../services/loader.service';
import { PopUpService } from '../../../../modules/popup/services/popup.service';
import { MessageService } from '../../../../services/message.service';
import { AppService } from '../../../../app.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {

  public appConfig: any;
  public langJson: any;
  public languageSelected: any;
  public subscription: any;
  public curreny: string;
  public direction = 'ltr';

  @Input() profileData: any;
  languageStrings: any={};

  constructor(protected sessionService: SessionService,
              protected loader: LoaderService,
              protected popup: PopUpService,
              protected message: MessageService,
              public appService: AppService) {}

  ngOnInit() {
    this.setConfig();
    this.setLang();

    if (this.profileData) {
      this.filterOutSubscriptionFromResponse();
    }
  }

  /**
   * set config
   */
  setConfig() {
    this.appConfig = this.sessionService.get('config');
    this.curreny = this.appConfig.payment_settings[0].symbol;
  }

  /**
   * set lang
   */
  setLang() {
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
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
    });
  }

  /**
   * filter out subscription plan details from login response
   */
  filterOutSubscriptionFromResponse() {
    this.subscription = this.profileData.vendor_details.subscriptionPlan[0];
  }
}
