import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PixelpayComponent } from './pixelpay.component';

@NgModule({
  declarations: [PixelpayComponent],
  imports: [
    CommonModule
  ],
  exports: [PixelpayComponent]
})
export class PixelpayModule { }
