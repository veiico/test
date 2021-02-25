/**
 * Created by mba-214 on 23/10/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DecimalConfigPipeModule } from '../../modules/decimal-config-pipe.module';
import { PaymentHoldOverlayComponent } from './components/hold-overlay/hold-overlay.component';

@NgModule({
  imports: [
    CommonModule,
    DecimalConfigPipeModule
  ],
  declarations: [
    PaymentHoldOverlayComponent
  ],
  exports: [
    PaymentHoldOverlayComponent
  ],
  providers: [

  ]
})
export class PaymentHoldModule {
}
