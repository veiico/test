import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapViewComponent } from './map-view.component';
import { JwCommonModule } from '../jw-common/jw-common.module';
import { AgmCoreModule } from '@agm/core';
import { ModalModule } from '../../components/modal/modal.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FetchLocationService } from '../../components/fetch-location/fetch-location.service';
import { JwGoogleAutocompleteModule } from '../jw-google-autocomplete/jw-google-autocomplete.module';
// import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { AgmOverlays } from 'agm-overlays';
import { MapviewService } from './map-view.service';


@NgModule({
  declarations: [MapViewComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    JwGoogleAutocompleteModule,
    ModalModule,
    AgmCoreModule,
    // AgmJsMarkerClustererModule,
    AgmOverlays
  ],
  providers: [FetchLocationService,
    MapviewService
  ],
  exports: [ MapViewComponent]
})
export class MapViewModule { }
