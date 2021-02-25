import { ProductTemplateModule } from './../../../components/product-template/product-template.module';
import { ProductTemplateComponent } from './../../../components/product-template/components/product-template/product-template.component';
import { AgmCoreModule } from '@agm/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Compiler,
  COMPILER_OPTIONS,
  CompilerFactory,
  CUSTOM_ELEMENTS_SCHEMA,
  Inject,
  Injector,
  NgModule,
  PLATFORM_ID,
} from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { JitCompilerFactory } from '@angular/platform-browser-dynamic';
import { StarRatingModule } from 'angular-star-rating';

import { CatalogueService } from '../../../components/catalogue/catalogue.service';
import { AppCategoryService } from '../../../components/catalogue/components/app-category/app-category.service';
import { RestaurantsService } from '../../../components/restaurants-new/restaurants-new.service';
import { MinutesPipeModule } from '../../../modules/minutes-pipe.module';
import { DateTimeFormatPipeModule } from '../../../modules/pipe.module';
import { ServiceTimePipeModule } from '../../../modules/serviceTimePipe.module';
import { SharedModule } from '../../../modules/shared.module';
import { GeoLocationService } from '../../../services/geolocation.service';
import { GoogleAnalyticsEventsService } from '../../../services/google-analytics-events.service';
import { DynamicDeliveryAddressModule } from '../delivery-address/delivery-address.module';
import { DynamicFooterModule } from '../footer/footer.module';
import { DynamicHeaderModule } from '../header/header.module';
import { DynamicModalModule } from '../modal/modal.module';
import { DynamicNLevelCatalogueModule } from '../n-level-catalogue/n-level-catalogue.module';
import { DynamicPreorderTimeModule } from '../preorder-time/preorder-time.module';
import { DynamicProductTimingModule } from '../product-timing/product-timing.module';
import { DynamicQuickLookModule } from '../quickLook/quickLook.module';
import { DynamicCatalogueComponent } from './catalogue.component';
import { DynamicCatalogueRoutingModule } from './catalogue.routing';
import { DynamicAppCartComponent } from './components/app-cart/app-cart.component';
import { DynamicAppCategoryComponent } from './components/app-category/app-category.component';
import { DynamicAppProductComponent } from './components/app-product/app-product.component';
import { DynamicStaticPagesComponent } from './components/static-pages/static-pages.component';
import { DynamicSubHeaderComponent } from './components/sub-header/sub-header.component';
import { DynamicCustomerVerificationPopupModule } from '../customer-verification-popup/customer-verification-popup.module';
import { DynamicMandatoryItemsComponent } from './components/mandatory-items/mandatory-items.component';
import { DynamicOrderPlacedPopupModule } from '../order-placed-page/order-placed-popup.module';
import { CheckVideoPipeModule } from '../../../modules/check-video.module';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { DynamicNotDiliverableComponent } from '../delivery-address/components/not-diliverable/not-diliverable.component';
import { DynamicAskForDeliveryAddressComponent } from '../delivery-address/components/ask-for-delivery-address/ask-for-delivery-address.component';
import { DynamicFetchDeliveryAddressComponent } from '../delivery-address/components/fetch-delivery-address/fetch-delivery-address.component';
declare var require: any;

export function createCompiler(compilerFactory: CompilerFactory) {
  return compilerFactory.createCompiler();
}

@NgModule({
  imports: [
    CommonModule,
    DynamicCatalogueRoutingModule,
    StarRatingModule,
    AgmCoreModule,
    DynamicFooterModule,
    DynamicPreorderTimeModule,
    DynamicProductTimingModule,
    ServiceTimePipeModule,
    DynamicDeliveryAddressModule,
    DynamicNLevelCatalogueModule,
    DynamicQuickLookModule,
    DateTimeFormatPipeModule,
    MinutesPipeModule,
    DynamicHeaderModule,
    ReactiveFormsModule,
    DynamicModalModule,
    DynamicCustomerVerificationPopupModule,
    DynamicOrderPlacedPopupModule,
    CheckVideoPipeModule,
    DropdownModule,
    MultiSelectModule,
    ProductTemplateModule,
    SharedModule
  ],
  declarations: [
    DynamicCatalogueComponent,
    DynamicAppCartComponent,
    DynamicAppCategoryComponent,
    DynamicAppProductComponent,
    DynamicStaticPagesComponent,
    DynamicSubHeaderComponent,
    DynamicMandatoryItemsComponent,
    DynamicNotDiliverableComponent,
    DynamicAskForDeliveryAddressComponent,
    DynamicFetchDeliveryAddressComponent
  ],
  entryComponents: [
    DynamicAppCartComponent,
    DynamicAppCategoryComponent,
    DynamicAppProductComponent,
    DynamicStaticPagesComponent,
    DynamicSubHeaderComponent,
    DynamicMandatoryItemsComponent,
    DynamicNotDiliverableComponent,
    ProductTemplateComponent,
    DynamicAskForDeliveryAddressComponent,
    DynamicFetchDeliveryAddressComponent
  ],
  providers: [
    CatalogueService,
    RestaurantsService,
    AppCategoryService,
    GoogleAnalyticsEventsService,
    GeoLocationService,
    { provide: COMPILER_OPTIONS, useValue: {}, multi: true },
    {
      provide: CompilerFactory,
      useClass: JitCompilerFactory,
      deps: [COMPILER_OPTIONS]
    },
    { provide: Compiler, useFactory: createCompiler, deps: [CompilerFactory] },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DynamicCatalogueModule {
}
