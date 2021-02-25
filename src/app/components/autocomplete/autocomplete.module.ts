/**
 * Created by cl-macmini-51 on 11/09/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutocompleteComponent } from "./autocomplete.component";
import { JwCommonModule } from "../../modules/jw-common/jw-common.module";
import { ModalModule } from "../modal/modal.module";
import { AgmCoreModule, LAZY_MAPS_API_CONFIG } from '@agm/core';
import { GoogleMapsConfig } from '../../services/googleConfig';
import { JwGoogleAutocompleteModule } from '../../modules/jw-google-autocomplete/jw-google-autocomplete.module';
import { MapPopupModule } from '../../modules/map-popup/map-popup.module';
declare var require: any;
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    JwCommonModule,
    ModalModule,
    AgmCoreModule.forRoot(),
    JwGoogleAutocompleteModule,
    MapPopupModule
  ],
  declarations: [
    AutocompleteComponent
  ],
  providers: [
    {
      provide: LAZY_MAPS_API_CONFIG,
      useClass: GoogleMapsConfig,
      useExisting: true
    }
  ],
  exports: [AutocompleteComponent]
})
export class AutoCompleteModule {
}
