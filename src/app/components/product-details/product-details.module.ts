/**
 * Created by cl-macmini-51 on 01/06/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';
import { StarRatingModule } from 'angular-star-rating';
import { NgxPageScrollModule } from 'ngx-page-scroll';

import { SharedModule } from '../../modules/shared.module';
import { ProductDetailsRoutingModule } from './product-details.routing';

import { ProductDetailsComponent } from './product-details.component';

import { ProductDetailsService } from './product-details.service';
import { RestaurantsService } from '../restaurants-new/restaurants-new.service';
import { ProductOnlyService } from '../app-product-only/app-product.service';
import { GoogleAnalyticsEventsService } from '../../services/google-analytics-events.service';
import { FetchLocationService } from '../fetch-location/fetch-location.service';
import { FooterModule } from '../../modules/footer/footer.module';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ProductTimingModule } from '../product-timing/product-timing.module';
import { DateTimeFormatPipeModule } from '../../modules/pipe.module';
import { CustomerVerificationPopupModule } from '../customer-verification-popup/customer-verification-popup.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AgmCoreModule,
    StarRatingModule,
    ProductDetailsRoutingModule,
    CustomerVerificationPopupModule,
    NgxPageScrollModule,
    FooterModule,
    OverlayPanelModule,
    ProductTimingModule,
    DateTimeFormatPipeModule
  ],
  declarations: [
    ProductDetailsComponent
  ],
  providers: [
    RestaurantsService,
    ProductOnlyService,
    GoogleAnalyticsEventsService,
    FetchLocationService,
    ProductDetailsService
  ]
})
export class ProductDetailsModule {
}
