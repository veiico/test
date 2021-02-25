
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavLocationRoutingModule } from './fav-location.routing';

import { SwiggyFavLocationComponent } from './fav-location.component';
import { SharedModule } from '../../../../modules/shared.module';
import { FavLocationService } from '../../../../components/fav-location/fav-location.service';
//import { FooterNewModule } from '../footer-new/footer-new.module';
//import { SwiggyHeaderModule } from '../header/header.module';
import { SwiggyFavLocationModelComponent } from './fav-location-model/fav-location-model.component';
import { SwiggyAddFavLocationComponent } from './add-fav-location/add-fav-location.component';
import { FuguTelInputModule } from '../../../../components/fugu-tel-input/fugu-tel-input.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { JwCommonModule } from '../../../../modules/jw-common/jw-common.module';
import { MatRadioModule } from '@angular/material';
import { JwGoogleAutocompleteModule } from '../../../../modules/jw-google-autocomplete/jw-google-autocomplete.module';
import { HeaderModule } from '../../../../components/header/header.module';
import { AgmCoreModule } from '@agm/core';
import { LoadChildrenGuard } from '../../../../guards/loadchildren.guard';


@NgModule({
  imports: [
    CommonModule,
    FavLocationRoutingModule,
    FuguTelInputModule,
    ReactiveFormsModule,
    JwCommonModule,
    HeaderModule,
    MatRadioModule,
    FormsModule,
    JwGoogleAutocompleteModule,
    AgmCoreModule.forRoot(),
  ],
  declarations: [
    SwiggyFavLocationComponent,
    SwiggyFavLocationModelComponent,
    SwiggyAddFavLocationComponent
  ],
  providers: [
    FavLocationService,
    LoadChildrenGuard
  ],
  exports: [
    SwiggyFavLocationComponent,
    SwiggyFavLocationModelComponent,
    SwiggyAddFavLocationComponent
  ]
})
export class SwiggyFavLocationModule {
}
