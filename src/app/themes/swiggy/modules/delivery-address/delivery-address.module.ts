/**
 * Created by cl-macmini-51 on 02/05/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';

import { SharedModule } from '../../../../modules/shared.module';
import { SwiggyFavLocationModule } from '../fav-location/fav-location.module';

import { SwiggyDeliveryAddressComponent } from './delivery-address.component';
import { CheckOutService } from '../../../../components/checkout/checkout.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AgmCoreModule,
    SwiggyFavLocationModule
  ],
  declarations: [
    SwiggyDeliveryAddressComponent
  ],
  exports: [
    SwiggyDeliveryAddressComponent
  ],
  providers: [
    CheckOutService
  ]
})
export class SwiggyDeliveryAddressModule {
}
