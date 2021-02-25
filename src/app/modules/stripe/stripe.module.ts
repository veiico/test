/**
 * Created by mba-214 on 02/11/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StripeComponent } from './stripe.component';
import { StripeCardListComponent } from './components/get-card/get-card.component';
import { StripeAddCardComponent } from './components/add-card/add-card.component';
import { StripeService } from './stripe.service';


@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [
    StripeComponent,
    StripeCardListComponent,
    StripeAddCardComponent
  ],
  exports: [
    StripeComponent,
    StripeCardListComponent,
    StripeAddCardComponent
  ],
  providers: [
    StripeService
  ]
})
export class StripeModule {
}
