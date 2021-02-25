import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlutterwaveComponent } from './flutterwave.component';

@NgModule({
  declarations: [FlutterwaveComponent],
  imports: [
    CommonModule
  ],
  exports: [FlutterwaveComponent]
})
export class FlutterwaveModule { }
