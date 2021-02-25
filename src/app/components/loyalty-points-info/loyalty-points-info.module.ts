import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DecimalConfigPipeModule } from '../../modules/decimal-config-pipe.module';
import { FooterModule } from '../../modules/footer/footer.module';
import { LoyaltyPointsInfoComponent } from './loyalty-points-info.component';
import { LoyaltyPointsInfoRoutingModule } from './loyalty-points-info.routing';
import { LoyaltyPointsInfoService } from './loyalty-points-info.service';
import { HeaderModule } from '../header/header.module';
import { DateTimeFormatPipeModule } from '../../modules/pipe.module';



@NgModule({
  imports: [
    CommonModule,
    DecimalConfigPipeModule,
    FooterModule,
    LoyaltyPointsInfoRoutingModule,
    HeaderModule,
    DateTimeFormatPipeModule
  ],
  declarations: [
    LoyaltyPointsInfoComponent
  ],
  providers: [
    LoyaltyPointsInfoService
  ]
})
export class LoyaltyPointsInfoModule {
}
