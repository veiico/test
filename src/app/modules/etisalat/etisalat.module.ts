import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EtisalatComponent } from './etisalat.component';

@NgModule({
  declarations: [EtisalatComponent],
  imports: [
    CommonModule
  ],
  exports:[EtisalatComponent]
})
export class EtisalatModule { }
