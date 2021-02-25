import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SquareComponent } from './square.component';

@NgModule({
  declarations: [SquareComponent],
  imports: [
    CommonModule
  ],
  exports: [SquareComponent]
})
export class SquareModule { }
