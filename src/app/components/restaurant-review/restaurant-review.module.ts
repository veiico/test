/**
 * Created by cl-macmini-51 on 20/04/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarRatingModule } from 'angular-star-rating';

import { SharedModule } from '../../modules/shared.module';
import { RestaurantReviewRoutingModule } from './restaurant-review.routing';

import { RestaurantReviewComponent } from './restaurant-review.component';

import { RestaurantReviewService } from './restaurant-review.service';
import { FooterModule } from '../../modules/footer/footer.module';



@NgModule({
  imports: [
    CommonModule,
    RestaurantReviewRoutingModule,
    StarRatingModule,
    SharedModule,
    FooterModule
  ],
  declarations: [
    RestaurantReviewComponent
  ],
  providers: [
    RestaurantReviewService
  ]
})
export class RestaurantReviewModule {
}
