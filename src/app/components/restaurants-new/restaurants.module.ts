/**
 * Created by cl-macmini-51 on 20/04/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderModule } from '../header/header.module';
import { RestaurantsNewComponent } from './restaurants-new.component';
import { RestaurantsNewRoutingModule } from './restaurants-new.routing';

import { RestaurantsService } from './restaurants-new.service';
import { BannerModule } from './components/banner/banner.module';
import { AutoCompleteModule } from '../autocomplete/autocomplete.module';
import { FetchLocationService } from '../fetch-location/fetch-location.service';
import { RestaurantsNewModule } from './components/restaurants/restaurants-new.module';
import { RestaurantTagsComponent } from './components/restaurant-tags/restaurant-tags.component';
import { MapViewModule } from '../../modules/map-view/map-view.module';

@NgModule({
  imports: [
    CommonModule,
    RestaurantsNewRoutingModule,
    HeaderModule,
    BannerModule,
    AutoCompleteModule,
    RestaurantsNewModule,
    MapViewModule
  ],
  declarations: [
    RestaurantsNewComponent,
   
  ],
  providers: [
    RestaurantsService,
    FetchLocationService
  ]
})
export class RestaurantsModule {
}
