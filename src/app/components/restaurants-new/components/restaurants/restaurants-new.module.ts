/**
 * Created by cl-macmini-51 on 20/04/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AgmCoreModule } from '@agm/core';
import { StarRatingModule } from 'angular-star-rating';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { BusinessCategoriesModule } from '../business-categories/business-categories.module';
import { RestaurantFilterModule } from '../restaurant-filter/restaurant-filter.module';
import { ProductTimingModule } from '../../../product-timing/product-timing.module';
import { DecimalConfigPipeModule } from '../../../../modules/decimal-config-pipe.module';
import { TruncatePipeModule } from '../../../../modules/truncate-pipe.module';
import { RestaurantsComponent } from './restaurants.component';
import { ProductOnlyComponent } from '../../../app-product-only/app-product.component';
import { ListViewComponent } from '../list-view/list-view.component';
import { LastLevelCategoriesComponent } from '../last-level-categories/categories.component';
import { CustomOrderComponent } from '../custom-order/custom-order.component';
import { FetchLocationService } from '../../../fetch-location/fetch-location.service';
import { GoogleAnalyticsEventsService } from '../../../../services/google-analytics-events.service';
import { RestaurantsService } from '../../restaurants-new.service';
import { AppCategoryService } from '../../../catalogue/components/app-category/app-category.service';
import { ProductOnlyService } from '../../../app-product-only/app-product.service';
import { FooterModule } from '../../../../modules/footer/footer.module';
import { ListShimmerComponent } from '../list-shimmer/list-shimmer.component';
import { RestaurantTagsComponent } from '../restaurant-tags/restaurant-tags.component';
import { QuickLookModule } from '../../../../modules/quickLook/quickLook.module';
import {ModalModule} from "../../../modal/modal.module";
import { MinutesPipeModule } from '../../../../modules/minutes-pipe.module';
import { CustomerVerificationPopupModule } from '../../../../components/customer-verification-popup/customer-verification-popup.module';
import { MapViewModule } from '../../../../modules/map-view/map-view.module';
import { OrderPlacedPopupModule } from '../../../../components/order-placed-page/order-placed-popup.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TooltipModule,
    AgmCoreModule,
    StarRatingModule,
    BusinessCategoriesModule,
    RestaurantFilterModule,
    ProductTimingModule,
    DecimalConfigPipeModule,
    TruncatePipeModule,
    FooterModule,
    QuickLookModule,
    ModalModule,
    MinutesPipeModule,
    CustomerVerificationPopupModule,
    MapViewModule,
    OrderPlacedPopupModule
  ],
  declarations: [
    RestaurantsComponent,
    ProductOnlyComponent,
    ListViewComponent,
    ListShimmerComponent,
    LastLevelCategoriesComponent,
    CustomOrderComponent,
    RestaurantTagsComponent
  ],
  exports:[RestaurantsComponent],
  providers: [
    FetchLocationService,
    GoogleAnalyticsEventsService,
    RestaurantsService,
    AppCategoryService,
    ProductOnlyService
  ]
})
export class RestaurantsNewModule {
}
