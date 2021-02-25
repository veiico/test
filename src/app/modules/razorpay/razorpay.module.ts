/**
 * Created by mba-214 on 02/11/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RazorpayService } from './razorpay.service';
import { RazorpayComponent } from './razorpay.component';


@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [
    RazorpayComponent
  ],
  exports: [
    RazorpayComponent
  ],
  providers: [
    RazorpayService
  ]
})
export class RazorpayModule {
}
