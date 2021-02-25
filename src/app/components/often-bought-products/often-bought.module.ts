/**
 * Created by cl-macmini-51 on 20/04/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';

import { OftenBoughtRoutingModule } from './often-bought.routing';
import { AppProductComponent } from './components/app-product/app-product.component';
import { AppCartComponent } from './components/app-cart/app-cart.component';
import { CatalogueService } from '../catalogue/catalogue.service';
import { RestaurantsService } from '../restaurants-new/restaurants-new.service';
import { AppCategoryService } from '../catalogue/components/app-category/app-category.service';
import { GoogleAnalyticsEventsService } from '../../services/google-analytics-events.service';
import { FooterModule } from '../../modules/footer/footer.module';
import { OftenBoughtComponent } from './often-bought.component'
import { ItemButtonModule } from '../../modules/item-button/item-button.module';
import { GeoLocationService } from '../../services/geolocation.service';
import { ProductTimingModule } from '../product-timing/product-timing.module';
import { ServiceTimePipeModule } from '../../modules/serviceTimePipe.module';
import { NLevelCatalogueModule } from '../../modules/n-level-catalogue/n-level-catalogue.module';
import { ModalModule } from '../modal/modal.module';
import { DateTimeFormatPipeModule } from '../../modules/pipe.module';
import { OrderPlacedPopupModule } from '../order-placed-page/order-placed-popup.module';
import { CheckVideoPipeModule } from '../../modules/check-video.module';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProductTemplateModule } from '../product-template/product-template.module';
import { MatSlideToggleModule, MatRadioModule } from '@angular/material';
import { HeaderModule } from '../header/header.module';
import { TruncatePipeModule } from '../../modules/truncate-pipe.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DecimalConfigPipeModule } from '../../modules/decimal-config-pipe.module';
import { AppCartService } from '../catalogue/components/app-cart/app-cart.service';

@NgModule({
  imports: [
    CommonModule,
    OftenBoughtRoutingModule,
    ProductTemplateModule,
    HeaderModule,
    AgmCoreModule,
    ItemButtonModule,
    ProductTimingModule,
    ServiceTimePipeModule,
    ModalModule,
    DateTimeFormatPipeModule,
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
    OftenBoughtComponent,
    AppProductComponent,
    AppCartComponent
  ],
  providers: [
    CatalogueService,
    RestaurantsService,
    GoogleAnalyticsEventsService,
    GeoLocationService,
    AppCategoryService,
    AppCartService
  ],
  exports:[
    
  ]
})
export class OftenBoughtModule {}
