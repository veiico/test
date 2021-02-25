/**
 * Created by cl-macmini-51 on 26/07/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarRatingModule } from 'angular-star-rating';

import { SharedModule } from '../../../modules/shared.module';
import { ViewBidsRoutingModule } from './view-bids.routing';

import { ViewBidsComponents } from './view-bids.component';

import { PostedProjectService } from '../posted-projects/posted-projects.service';
import { FooterModule } from '../../../modules/footer/footer.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    StarRatingModule,
    ViewBidsRoutingModule,
    FooterModule
  ],
  declarations: [
    ViewBidsComponents
  ],
  providers: [
    PostedProjectService
  ]
})
export class ViewBidsModule {
}
