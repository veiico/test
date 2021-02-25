/**
 * Created by cl-macmini-51 on 08/05/18.
 */
import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DateTimeAdapter } from 'ng-pick-datetime';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';

import { AppProductTimingComponent } from '../../../components/product-timing/product-timing.component';
import { SessionService } from '../../../services/session.service';
import { PopupModalService } from '../../../modules/popup/services/popup-modal.service';
import { AppCartService } from '../../../components/catalogue/components/app-cart/app-cart.service';
import { GoogleAnalyticsEventsService } from '../../../services/google-analytics-events.service';
import { ProductTimingService } from '../../../components/product-timing/product-timing.service';
import { AppService } from '../../../app.service';
import { LoaderService } from '../../../services/loader.service';
import { ConfirmationService } from '../../../modules/jw-notifications/services/confirmation.service';

declare var $: any;


@Component({
  templateUrl: '../../../components/product-timing/product-timing.html',
  styleUrls: ['../../../components/product-timing/product-timing.scss']
})
export class DynamicAppProductTimingComponent extends AppProductTimingComponent implements OnInit, OnDestroy {

  // @Input() product: any;
  @Input() productIndex: any;
  @Input() storeIndex: any;
  @Output() sendDataForProduct: EventEmitter<number> = new EventEmitter<number>();


  public _product;
  get product() { return this._product };
  @Input() set product(val: any) {
    this._product = val;
  };

  constructor(protected route: ActivatedRoute, protected router: Router, protected sessionService: SessionService,
    protected popup: PopupModalService, protected cartService: AppCartService, protected formBuilder: FormBuilder,
    public googleAnalyticsEventsService: GoogleAnalyticsEventsService, protected ref: ChangeDetectorRef,
    protected productTimingService: ProductTimingService, public appService: AppService,
    protected localeService: BsLocaleService, protected dateTimeAdapter: DateTimeAdapter<any>, protected loader: LoaderService,public confirmationService : ConfirmationService) {
    super(route, router, sessionService, popup, cartService, formBuilder, googleAnalyticsEventsService, ref, productTimingService, appService, localeService, dateTimeAdapter, loader,confirmationService)
  }

  ngOnInit() {
    super.ngOnInit();

  }
}
