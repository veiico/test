/**
 * Created by cl-macmini-51 on 21/05/18.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';


import { FetchLocationRoutingModule } from './fetch-location.routing';
import { FetchLocationComponent } from './fetch-location.component';
import { FetchLocationService } from './fetch-location.service';
import { LoginService } from '../login/login.service';
import { PopupModalService } from '../../modules/popup/services/popup-modal.service';
import { GoogleAnalyticsEventsService } from '../../services/google-analytics-events.service';
import { RestaurantsService } from '../restaurants-new/restaurants-new.service';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ReactiveFormsModule } from '@angular/forms';
import { LAZY_MAPS_API_CONFIG } from '@agm/core';
import { GoogleMapsConfig } from '../../services/googleConfig';
import { RouterModule } from '@angular/router';
import { HeaderModule } from '../../components/header/header.module';
import { AutoCompleteModule } from '../autocomplete/autocomplete.module';
import { FooterModule } from '../../../app/modules/footer/footer.module';
// import { SharedLoadModule } from '../../modules/shared-load.module';
import { DateTimeFormatPipeModule } from '../../modules/pipe.module';
import { OrderPlacedPopupModule } from '../order-placed-page/order-placed-popup.module';
import { FeaturesComponent } from '../../themes/swiggy/modules/app/components/features/features.component';
import { FlowComponent } from '../../themes/swiggy/modules/app/components/flow/flow.component';
import { AppModule } from '../../themes/swiggy/modules/app/app.module';


@NgModule({
  imports: [
    CommonModule,
    FetchLocationRoutingModule,
    BsDatepickerModule,
    ReactiveFormsModule,
    HeaderModule,
    RouterModule,
    AutoCompleteModule,
    AgmCoreModule,
    FooterModule,
    DateTimeFormatPipeModule,
    OrderPlacedPopupModule,
    AppModule
  ],
  declarations: [
    FetchLocationComponent
  ],
  providers: [
    FetchLocationService,
    LoginService,
    PopupModalService,
    {
      provide: LAZY_MAPS_API_CONFIG,
      useClass: GoogleMapsConfig
    },
    GoogleAnalyticsEventsService,
    RestaurantsService
  ]
})
export class FetchLocationModule {}
