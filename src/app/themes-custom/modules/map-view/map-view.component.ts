import { MapsAPILoader } from '@agm/core';
import { Component, ElementRef, NgZone, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { AppService } from '../../../app.service';
import { FetchLocationService } from '../../../components/fetch-location/fetch-location.service';
import { MapViewComponent } from '../../../modules/map-view/map-view.component';
import { MapviewService } from '../../../modules/map-view/map-view.service';
import { PopUpService } from '../../../modules/popup/services/popup.service';
import { GoogleAnalyticsEventsService } from '../../../services/google-analytics-events.service';
import { MessageService } from '../../../services/message.service';
import { SessionService } from '../../../services/session.service';
import { ThemeService } from '../../../services/theme.service';

@Component({
  templateUrl: '../../../modules/map-view/map-view.component.html',
  styleUrls: ['../../../modules/map-view/map-view.component.scss']
})
export class DynamicMapViewComponent extends MapViewComponent implements OnInit, OnDestroy {

  constructor(protected themeService: ThemeService, protected fb: FormBuilder, protected mapsAPILoader: MapsAPILoader,
    protected ngZone: NgZone, protected sessionService: SessionService, protected messageService: MessageService,
    protected fetchLocationService: FetchLocationService, protected mapviewService: MapviewService, protected appService: AppService, protected popupService: PopUpService,
    protected googleAnalyticsEventsService: GoogleAnalyticsEventsService, protected router: Router, protected el: ElementRef, protected cdref: ChangeDetectorRef) {
    super(themeService, fb, mapsAPILoader, ngZone, sessionService, messageService, fetchLocationService, mapviewService, appService, popupService, googleAnalyticsEventsService, router, el, cdref);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

}
