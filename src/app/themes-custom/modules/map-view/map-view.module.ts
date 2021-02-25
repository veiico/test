import { AgmCoreModule } from '@agm/core';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NgModule, Injector, Inject, PLATFORM_ID } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AgmOverlays } from 'agm-overlays';
import { TooltipModule } from 'ngx-bootstrap';

import { FetchLocationService } from '../../../components/fetch-location/fetch-location.service';
import { ModalModule } from '../../../components/modal/modal.module';
import { JwGoogleAutocompleteModule } from '../../../modules/jw-google-autocomplete/jw-google-autocomplete.module';
import { MapviewService } from '../../../modules/map-view/map-view.service';
import { DynamicMapViewComponent } from './map-view.component';


const customElementTupleArray: [any, string][] = [
  [DynamicMapViewComponent, 'app-map-view-dynamic'],
]
declare var require: any;

@NgModule({
  declarations: [DynamicMapViewComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    JwGoogleAutocompleteModule,
    ModalModule,
    AgmCoreModule,
    TooltipModule,
    AgmJsMarkerClustererModule,
    AgmOverlays
  ],
  providers: [FetchLocationService,
    MapviewService
  ],
  exports: [DynamicMapViewComponent],
  entryComponents: [DynamicMapViewComponent]
})
export class DynamicMapViewModule {
  constructor(private injector: Injector, @Inject(PLATFORM_ID) platformId: Object) {
    if (isPlatformBrowser(platformId)) {
      const { createCustomElement } = require('@angular/elements');

      for (const [component, selector] of customElementTupleArray) {
        const elemExist = customElements.get(selector)
        if (!elemExist) {
          const el = createCustomElement(component, { injector: this.injector });
          customElements.define(selector, el);
        }
      }
    }
  }
}
