import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapPopupComponent } from './map-popup.component';
import { JwCommonModule } from '../jw-common/jw-common.module';
import { AgmCoreModule } from '@agm/core';
import { ModalModule } from '../../components/modal/modal.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FetchLocationService } from '../../components/fetch-location/fetch-location.service';
import { JwGoogleAutocompleteModule } from '../jw-google-autocomplete/jw-google-autocomplete.module';
import { MapViewModule } from '../map-view/map-view.module';

@NgModule({
  declarations: [MapPopupComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    JwGoogleAutocompleteModule,
    ModalModule,
    AgmCoreModule,
    MapViewModule
  ],
  providers:[
    FetchLocationService
  ],
  exports:[ MapPopupComponent]
})
export class MapPopupModule { }
