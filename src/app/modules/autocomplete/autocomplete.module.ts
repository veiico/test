import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutocompleteComponent } from './autocomplete.component';
import { ReactiveFormsModule } from '../../../../node_modules/@angular/forms';
import { JwCommonModule } from '../jw-common/jw-common.module';
import { GoogleMapsConfig } from '../../services/googleConfig';
import { LAZY_MAPS_API_CONFIG, AgmCoreModule } from '@agm/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { JwGoogleAutocompleteModule } from '../jw-google-autocomplete/jw-google-autocomplete.module';
import { RestaurantsService } from '../../components/restaurants-new/restaurants-new.service';
import { DateTimeFormatPipeModule } from '../pipe.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    JwCommonModule,
    BsDatepickerModule,
    AgmCoreModule.forRoot(),
    JwGoogleAutocompleteModule,
    DateTimeFormatPipeModule
  ],
  declarations: [AutocompleteComponent],
  exports: [AutocompleteComponent],
  providers: [
    {
      provide: LAZY_MAPS_API_CONFIG,
      useClass: GoogleMapsConfig
    },
    RestaurantsService
  ]
})
export class AutocompleteModule { }
