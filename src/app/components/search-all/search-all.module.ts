/**
 * Created by cl-macmini-51 on 22/06/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarRatingModule } from 'angular-star-rating';

import {SharedModule} from '../../modules/shared.module';
import { SearchAllRoutingModule } from './search-all.routing';

import { SearchAllComponent } from './search-all.component';
import { SearchAllService } from './search-all.service';
import { GoogleAnalyticsEventsService } from '../../services/google-analytics-events.service';
import { FooterModule } from '../../modules/footer/footer.module';
import { ProductTimingModule } from '../product-timing/product-timing.module';
import { ServiceTimePipeModule } from '../../modules/serviceTimePipe.module';
import { CheckVideoPipeModule } from '../../modules/check-video.module';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { ModalModule } from '../modal/modal.module';
import { ProductTemplateModule } from '../product-template/product-template.module';

@NgModule({
  imports: [
    CommonModule,
    ProductTemplateModule,
    SearchAllRoutingModule,
    SharedModule,
    StarRatingModule,
    FooterModule,
    ProductTimingModule,
    ServiceTimePipeModule,
    CheckVideoPipeModule,
    DropdownModule,
    MultiSelectModule,
    ModalModule
  ],
  declarations: [
    SearchAllComponent
  ],
  providers: [
    SearchAllService,
    GoogleAnalyticsEventsService
  ]
})
export class SearchAllModule {}
