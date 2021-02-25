/**
 * Created by cl-macmini-51 on 20/04/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarRatingModule } from 'angular-star-rating';
import { AgmCoreModule } from '@agm/core';

import { CatalogueRoutingModule } from './catalogue.routing';
import { SharedModule } from '../../modules/shared.module';

import { AppCartComponent } from './components/app-cart/app-cart.component';
import { CatalogueComponent } from './catalogue.component';
import { AppCategoryComponent } from './components/app-category/app-category.component';
import { AppProductComponent } from './components/app-product/app-product.component';

import { CatalogueService } from './catalogue.service';
import { RestaurantsService } from '../restaurants-new/restaurants-new.service';
import { AppCategoryService } from './components/app-category/app-category.service';
import { GoogleAnalyticsEventsService } from '../../services/google-analytics-events.service';
import { FooterModule } from '../../modules/footer/footer.module';
import { AppLaundryProductComponent } from './components/laundry-product-view/laundry-product-view.component';
import { SubHeaderComponent } from './components/sub-header/sub-header.component';
import { StaticPagesComponent } from './components/static-pages/static-pages.component';
import { ItemButtonModule } from '../../modules/item-button/item-button.module';
import { PreorderTimeModule } from '../../modules/preorder-time/preorder-time.module';
import { GeoLocationService } from '../../services/geolocation.service';
import { ProductTimingModule } from '../product-timing/product-timing.module';
import { ServiceTimePipeModule } from '../../modules/serviceTimePipe.module';
import { DeliveryAddressModule } from '../../modules/delivery-address/delivery-address.module';
import { CatalogueShimmerComponent } from './components/catalogue-shimmer/catalogue-shimmer.component';
import { NLevelCatalogueModule } from '../../modules/n-level-catalogue/n-level-catalogue.module';
import { QuickLookModule } from '../../modules/quickLook/quickLook.module';
import { ModalModule } from '../modal/modal.module';
import { DateTimeFormatPipeModule } from '../../modules/pipe.module';
import { MinutesPipeModule } from '../../modules/minutes-pipe.module';
import { CustomerVerificationPopupModule } from '../customer-verification-popup/customer-verification-popup.module';
import { MandatoryItemsComponent } from './components/mandatory-items/mandatory-items.component';
import { AppProductService } from './components/app-product/app-product.service';
import { OrderPlacedPopupModule } from '../order-placed-page/order-placed-popup.module';
import { CheckVideoPipeModule } from '../../modules/check-video.module';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckoutTemplateModule } from '../../modules/checkout-template/checkout-template.module';
import { ProductTemplateModule } from '../product-template/product-template.module';
import { MatSlideToggleModule, MatRadioModule } from '@angular/material';
import { HeaderModule } from '../header/header.module';
import { TruncatePipeModule } from '../../modules/truncate-pipe.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DecimalConfigPipeModule } from '../../modules/decimal-config-pipe.module';

@NgModule({
  imports: [
    CommonModule,
    ProductTemplateModule,
    CatalogueRoutingModule,
    StarRatingModule,
    HeaderModule,
    CheckoutTemplateModule,
    AgmCoreModule,
    FooterModule,
    ItemButtonModule,
    PreorderTimeModule,
    ProductTimingModule,
    ServiceTimePipeModule,
    DeliveryAddressModule,
    NLevelCatalogueModule,
    QuickLookModule,
    ModalModule,
    DateTimeFormatPipeModule,
    MinutesPipeModule,
    CustomerVerificationPopupModule,
    OrderPlacedPopupModule,
    CheckVideoPipeModule,
    DropdownModule,
    MultiSelectModule,
    MatSlideToggleModule,
    TruncatePipeModule,
    TooltipModule,
    ReactiveFormsModule,
    FormsModule,
    DecimalConfigPipeModule
  ],
  declarations: [
    CatalogueComponent,
    AppCartComponent,
    AppCategoryComponent,
    AppProductComponent,
    AppLaundryProductComponent,
    SubHeaderComponent,
    StaticPagesComponent,
    CatalogueShimmerComponent,
    MandatoryItemsComponent
  ],
  providers: [
    CatalogueService,
    RestaurantsService,
    AppCategoryService,
    GoogleAnalyticsEventsService,
    GeoLocationService,
    AppProductService
  ],
  exports:[
    MandatoryItemsComponent
  ]
})
export class CatalogueModule {}
