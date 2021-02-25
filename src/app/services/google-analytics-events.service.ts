import { Injectable } from '@angular/core';
import { SessionService } from './session.service';
import { LoadScriptsPostAppComponentLoad } from '../classes/load-scripts.class';

declare var ga: Function;

@Injectable()
export class GoogleAnalyticsEventsService {

  public config: any;
  public google_analytics_data: any;
  constructor(public sessionService: SessionService) {
    this.config = this.sessionService.get('config');
  }

  public async emitEvent(id, label, action, eventVal?: any) {
    if (this.sessionService.isPlatformServer()) return;

    this.google_analytics_data = this.config.GOOGLE_ANALYTIC_OPTION_LIST;
    let index = -1;
    if (this.google_analytics_data && this.google_analytics_data.length) {
      index = this.google_analytics_data.findIndex((o) => { return o.ga_master_option_id === id; })
    }
    await LoadScriptsPostAppComponentLoad.googleAnalytics();

    if (this.config.google_analytics_is_active) {
      this.setUserId();
    }


    if (index > -1) {
      ga('send', 'event', {
        eventCategory: this.google_analytics_data[index].ga_master_category_name,
        eventLabel: label,
        eventAction: action ? action : this.google_analytics_data[index].ga_master_action_name
      });
    }

    if (index > -1 && this.google_analytics_data[index].google_event_id && this.google_analytics_data[index].is_active && this.config.google_analytics_is_active) {
      if (label === 'Order Created Success') {
        ga('yeloClientTracker.send', 'event', {
          eventCategory: this.google_analytics_data[index].category_name,
          eventLabel: label,
          eventAction: action ? action : (this.google_analytics_data[index].action_name !== '.' ? this.google_analytics_data[index].action_name : this.getEmailId()),
          eventValue: eventVal ? eventVal : 0,
          sessionControl: 'end'
        });
      } else {
        ga('yeloClientTracker.send', 'event', {
          eventCategory: this.google_analytics_data[index].category_name,
          eventLabel: label,
          eventAction: action ? action : (this.google_analytics_data[index].action_name !== '.' ? this.google_analytics_data[index].action_name : this.getEmailId()),
          eventValue: eventVal ? eventVal : 0
        });
      }
    }

  }

  public setUserId() {
    if (this.config && this.config.user_id_in_ga) {
      const appData = this.sessionService.get('appData');
      if (appData) {
        const vendor_id = appData.vendor_details.vendor_id;
        if (vendor_id) {
          ga('set', 'userId', vendor_id);
          ga('yeloClientTracker.set', 'userId', vendor_id);
          ga('set', 'dimension1', vendor_id.toString());
          ga('yeloClientTracker.set', 'dimension1', vendor_id.toString());
        }
      }
    }
  }

  public async checkClientGAEnable() {
    if (this.config && this.config.google_analytics_is_active) {
      const tracking_id = this.config.google_analytics_tracking_id;
      await LoadScriptsPostAppComponentLoad.googleAnalytics();
      ga('create', tracking_id, 'auto', 'yeloClientTracker');
    }
  }

  public getEmailId() {
    if (this.sessionService.get('appData')) {
      return this.sessionService.get('appData').vendor_details.email ? this.sessionService.get('appData').vendor_details.email : this.sessionService.get('appData').vendor_details.phone_no;
    } else {

      return 'Click';
    }
  }
}
