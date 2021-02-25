import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HypurComponent } from './hypur.component';

@NgModule({
  declarations: [HypurComponent],
  imports: [
    CommonModule
  ],
  exports: [HypurComponent]
})
export class HypurModule { }
