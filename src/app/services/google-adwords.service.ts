/**
 * Created by mba-214 on 23/11/18.
 */
import { Injectable } from '@angular/core';
import { SessionService } from './session.service';

declare var gtag: any;
@Injectable()
export class GoogleAdWordsService {

  public config: any;
  constructor(public sessionService: SessionService) {
    this.config = this.sessionService.get('config');
  }

  loadParticularScript(data) {
    switch (data.type) {
      case 'CONVERSION':
        if (this.config.marketplace_user_id == '60863')
          this.gtag_report_conversion(data);
        break;
      default:
        break;
    }
  }

  gtag_report_conversion(data) {
    //var callback = function () {
    //  if (typeof(data.url) != 'undefined') {
    //    (<any>window).location = data.url;
    //  }
    //};
    try {
      gtag('event', 'conversion', {
        'send_to': 'AW-791827547/HyffCO-WkYgBENuoyfkC',
        'transaction_id': data.id ? data.id : '',
        'currency': data.currency,
        'value': data.value,
        //'event_callback': callback
      });
      return false;
    } catch (error) {
      console.error(error);
    }

  }

}
