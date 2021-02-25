/**
 * Created by mba-214 on 04/11/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionComponent } from './subscription.component';
import { DecimalConfigPipeModule } from '../../../../modules/decimal-config-pipe.module';

@NgModule({
  imports: [
    CommonModule,
    DecimalConfigPipeModule
  ],
  declarations: [
    SubscriptionComponent
  ],
  exports: [
    SubscriptionComponent
  ],
  providers: [

  ]
})
export class SubscriptionModule {
}
