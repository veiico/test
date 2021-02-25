/**
 * Created by cl-macmini-51 on 24/07/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../../modules/shared.module';
import { FreeLancerSecondLevelCatRoutingModule } from './second-level-cat.routing';

import { FreelancerSecondLevelCatComponent } from './second-level-cat.component';

import { RestaurantsService } from '../../restaurants-new/restaurants-new.service';
import { FooterModule } from '../../../modules/footer/footer.module';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FreeLancerSecondLevelCatRoutingModule,
    FooterModule
  ],
  declarations: [
    FreelancerSecondLevelCatComponent
  ],
  providers: [
    RestaurantsService
  ]
})
export class FreeLancerSecondLevelCatModule {
}
