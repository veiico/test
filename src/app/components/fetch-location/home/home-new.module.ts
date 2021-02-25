/**
 * Created by cl-macmini-51 on 21/05/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ReactiveFormsModule } from '@angular/forms';
import { LAZY_MAPS_API_CONFIG } from '@agm/core';
import { RouterModule } from '@angular/router';

import { HeaderModule } from '../../../components/header/header.module';
import { AutoCompleteModule } from '../../../components/autocomplete/autocomplete.module';

import { HomeNewComponent } from './home-new.component';
import { FetchLocationService } from '../../../components/fetch-location/fetch-location.service';

import { GoogleMapsConfig } from '../../../services/googleConfig';
import { GoogleAnalyticsEventsService } from '../../../services/google-analytics-events.service';
import { RestaurantsService } from '../../../components/restaurants-new/restaurants-new.service';
import { HomeNewRoutingModule } from './home-new.routing';
import { FooterModule } from '../../../../app/modules/footer/footer.module';
import { LoginService } from '../../login/login.service';
import { PopupModalService } from '../../../../app/modules/popup/services/popup-modal.service';


@NgModule({
  imports: [
    CommonModule,
    BsDatepickerModule,
    ReactiveFormsModule,
    HeaderModule,
    RouterModule,
    AutoCompleteModule,
    AgmCoreModule,
    FooterModule,
    HomeNewRoutingModule
  ],
  declarations: [
    HomeNewComponent
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
export class HomeNewModule {}
