import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayComponent } from './components/pay/pay.component';
import { Routes, RouterModule } from '@angular/router';
import { StripeService } from './services/stripe.service';


const routes: Routes = [
  { path: 'pay', component: PayComponent },
  { path: '', redirectTo: 'pay' }
];


@NgModule({
  declarations: [PayComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    StripeService
  ]
})
export class StripeModule { }
