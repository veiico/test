import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NmiComponent } from './nmi.component';

@NgModule({
  declarations: [NmiComponent],
  imports: [
    CommonModule
  ],
  exports: [NmiComponent]
})
export class NmiModule { }
