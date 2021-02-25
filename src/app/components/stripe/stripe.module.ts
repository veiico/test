/**
 * Created by cl-macmini-51 on 20/04/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../modules/shared.module';
import { StripeRoutingModule } from './stripe.routing';

import { StripeComponent } from './stripe.component';

import { StripeApiService } from './stripe.service';


@NgModule({
  imports: [
    CommonModule,
    StripeRoutingModule,
    SharedModule
  ],
  declarations: [StripeComponent],
  providers: [
    StripeApiService
  ]
})
export class StripeModule {
}
