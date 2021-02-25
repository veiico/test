import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { SessionService } from '../../../../services/session.service';
import { GoogleAnalyticsEventsService } from '../../../../services/google-analytics-events.service';
import { Router } from '../../../../../../node_modules/@angular/router';
import { GoogleAnalyticsEvent } from '../../../../enums/enum';
import { MessageService } from '../../../../services/message.service';
declare var $: any;

@Component({
  selector: 'app-custom-order',
  templateUrl: './custom-order.component.html',
  styleUrls: ['./custom-order.component.scss']
})
export class CustomOrderComponent implements OnInit {
  @Output() toggle: EventEmitter<string> = new EventEmitter<string>();
  public terminology;
  public showMultipleBanners: boolean;
  public mapInitCheck: boolean;
  constructor(public sessionService: SessionService,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
    public messageService: MessageService,
    public router: Router) {}

  ngOnInit() {
    this.initEvents();
    if (this.sessionService.get('mapView') == true) {
      this.mapInitCheck = true;
    } else {
      this.mapInitCheck = false;
    }
  }
  initEvents() {
    this.terminology = this.sessionService.get('config').terminology;
    this.showMultipleBanners = this.sessionService.get('config').is_banners_enabled ? true : false;
  }

  /**
   * go to checkout page incase of custom category
   */
  goToCheckout() {
    // tslint:disable-next-line:radix
    if(this.sessionService.get('noProductStoreData')) {
      this.sessionService.remove('noProductStoreData');
    }
    if (this.sessionService.get('appData') && parseInt(this.sessionService.getString('reg_status')) === 1) {
      this.toggle.emit();
      this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.go_to_checkout, 'Custom order checkout', '', '');
      this.router.navigate(['customCheckout']);
      // tslint:disable-next-line:radix
    } else if (this.sessionService.get('appData') && parseInt(this.sessionService.getString('reg_status')) !== 1 &&
      !this.sessionService.get('appData').signup_template_data.length) {
      this.toggle.emit();
      this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.go_to_checkout, 'Custom order checkout', '', '');
      this.router.navigate(['customCheckout']);
    } else {
      this.messageService.getLoginSignupLocation('From Checkout Button');
      $('#loginDialog').modal('show');
    }
  }


}
