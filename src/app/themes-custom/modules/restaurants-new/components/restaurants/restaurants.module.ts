import { AgmCoreModule } from '@agm/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, Injector, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StarRatingModule } from 'angular-star-rating';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { ProductOnlyService } from '../../../../../components/app-product-only/app-product.service';
import { AppCategoryService } from '../../../../../components/catalogue/components/app-category/app-category.service';
import { FetchLocationService } from '../../../../../components/fetch-location/fetch-location.service';
import { RestaurantsService } from '../../../../../components/restaurants-new/restaurants-new.service';
import { GoogleAnalyticsEventsService } from '../../../../../services/google-analytics-events.service';
import { DynamicRestaurantFilterModule } from '../restaurant-filter/restaurant-filter.module';
import { DynamicRestaurantsComponent } from './restaurants.component'
import { DynamicListViewComponent } from '../list-view/list-view.component';
import { DecimalConfigPipeModule } from '../../../../../modules/decimal-config-pipe.module';
import { DynamicBusinessCategoriesModule } from '../business-categories/business-categories.module';
import { DynamicRestaurantTagsComponent } from '../restaurant-tags/restaurant-tags.component';
import { DynamicCustomOrderComponent } from '../custom-order/custom-order.component';
import { DynamicFooterModule } from '../../../footer/footer.module';
import { DynamicProductOnlyComponent } from '../../../app-product-only/app-product.component';
import { TruncatePipeModule } from '../../../../../modules/truncate-pipe.module';
import { ProductTimingModule } from '../../../../../components/product-timing/product-timing.module';
import { QuickLookModule } from '../../../../../modules/quickLook/quickLook.module';
import { ModalModule } from '../../../../../components/modal/modal.module';

declare var require: any;

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TooltipModule,
    AgmCoreModule,
    StarRatingModule,
    DynamicBusinessCategoriesModule,
    DynamicRestaurantFilterModule,
    ProductTimingModule,
    DecimalConfigPipeModule,
    TruncatePipeModule,
    DynamicFooterModule,
    QuickLookModule,
    ModalModule
  ],
  declarations: [
    DynamicRestaurantsComponent,
    DynamicProductOnlyComponent,
    DynamicListViewComponent,
    DynamicCustomOrderComponent,
    DynamicRestaurantTagsComponent
  ],
  exports: [DynamicRestaurantsComponent],
  providers: [
    FetchLocationService,
    GoogleAnalyticsEventsService,
    RestaurantsService,
    AppCategoryService,
    ProductOnlyService
  ],
  entryComponents: [
    DynamicRestaurantsComponent,
    DynamicListViewComponent,
    DynamicRestaurantTagsComponent,
    DynamicCustomOrderComponent,
    DynamicProductOnlyComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DynamicRestaurantsModule {
}
