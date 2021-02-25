import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import { AppService } from '../../../app.service';
import { ProductOnlyComponent } from '../../../components/app-product-only/app-product.component';
import { AppCartService } from '../../../components/catalogue/components/app-cart/app-cart.service';
import { RestaurantsService } from '../../../components/restaurants-new/restaurants-new.service';
import { PopUpService } from '../../../modules/popup/services/popup.service';
import { GoogleAnalyticsEventsService } from '../../../services/google-analytics-events.service';
import { LoaderService } from '../../../services/loader.service';
import { MessageService } from '../../../services/message.service';
import { SessionService } from '../../../services/session.service';

@Component({
  selector: 'app-product-only-dynamic',
  templateUrl: '../../../components/app-product-only/app-product.component.html',
  styleUrls: ['../../../components/app-product-only/app-product.component.scss'],
})
export class DynamicProductOnlyComponent extends ProductOnlyComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() productList: any;
  @Input() selectedProductFilterInput: any;
  @Input() queryParam: any;
  @Output() toggle: EventEmitter<string> = new EventEmitter<string>();

  constructor(public service: RestaurantsService, public messageService: MessageService, public loader: LoaderService,
    public router: Router, public sessionService: SessionService,
    public cartService: AppCartService,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService, public popup: PopUpService,
    public appService: AppService) {
    super(service, messageService, loader, router, sessionService, cartService, googleAnalyticsEventsService, popup, appService)
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

}
