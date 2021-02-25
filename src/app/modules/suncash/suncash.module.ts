import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuncashComponent } from './suncash.component';

@NgModule({
  declarations: [SuncashComponent],
  imports: [
    CommonModule
  ],
  exports: [SuncashComponent]
})
export class SuncashModule { }
