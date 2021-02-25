import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedLoadModule } from '../../modules/shared-load.module';

import { MerchantProfileRoutingModule } from './merchantProfile.routing';

import { MerchantProfileComponent } from './merchantProfile.component';
import { MerchantProfileService } from './merchantProfile.service';
import { ItemsComponent } from './components/items/items.component';
import { DateTimeFormatPipeModule } from '../../modules/pipe.module';
import { StarRatingModule } from 'angular-star-rating';

@NgModule({
  imports: [
    CommonModule,
    SharedLoadModule,
    MerchantProfileRoutingModule,
    DateTimeFormatPipeModule,StarRatingModule
  ],
  declarations: [
    MerchantProfileComponent,
    ItemsComponent
  ],
  providers: [
    MerchantProfileService
  ]
})
export class MerchantProfileModule {
}
