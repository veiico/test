import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DokuComponent } from './doku.component';

@NgModule({
  declarations: [DokuComponent],
  imports: [
    CommonModule
  ],
  exports: [DokuComponent]
})
export class DokuModule { }
