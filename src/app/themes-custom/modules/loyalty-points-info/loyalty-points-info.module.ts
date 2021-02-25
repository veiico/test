import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LoyaltyPointsInfoService } from '../../../components/loyalty-points-info/loyalty-points-info.service';
import { DynamicFooterModule } from '../footer/footer.module';
import { DynamicHeaderModule } from '../header/header.module';
import { DynamicLoyaltyPointsInfoComponent } from './loyalty-points-info.component';
import { DynamicLoyaltyPointsInfoRoutingModule } from './loyalty-points-info.routing';




@NgModule({
  imports: [
    CommonModule,
    DynamicFooterModule,
    DynamicLoyaltyPointsInfoRoutingModule,
    DynamicHeaderModule,
  ],
  declarations: [
    DynamicLoyaltyPointsInfoComponent
  ],
  providers: [
    LoyaltyPointsInfoService
  ]
})
export class DynmaicLoyaltyPointsInfoModule {
}
