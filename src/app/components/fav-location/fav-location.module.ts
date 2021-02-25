
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavLocationRoutingModule } from './fav-location.routing';

import { FavLocationComponent } from './fav-location.component';

import { FavLocationService } from './fav-location.service';


import { SharedModule } from '../../modules/shared.module';
import { AddFavLocationComponent } from './add-fav-location/add-fav-location.component';
import { FavLocationModelComponent } from './fav-location-model/fav-location-model.component';
import { FuguTelInputModule } from '../fugu-tel-input/fugu-tel-input.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { JwCommonModule } from '../../modules/jw-common/jw-common.module';
import { MatRadioModule } from '@angular/material';
import { HeaderModule } from '../header/header.module';
import { JwGoogleAutocompleteModule } from '../../modules/jw-google-autocomplete/jw-google-autocomplete.module';
import { AutoCompleteModule } from '../autocomplete/autocomplete.module';
import { MapPopupModule } from '../../modules/map-popup/map-popup.module';

@NgModule({
  imports: [
    CommonModule,
    FavLocationRoutingModule,
    FuguTelInputModule,
    ReactiveFormsModule,
    JwCommonModule,
    MatRadioModule,
    FormsModule,
    HeaderModule,
    JwGoogleAutocompleteModule,
    AutoCompleteModule,
    MapPopupModule
  ],
  declarations: [
    FavLocationComponent,
    AddFavLocationComponent,
    FavLocationModelComponent
  ],
  exports:[
    FavLocationComponent,
    AddFavLocationComponent,
    FavLocationModelComponent
  ],
  providers: [
    FavLocationService
  ]
})
export class FavLocationModule {
}
