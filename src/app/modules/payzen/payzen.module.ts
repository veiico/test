import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayzenComponent } from './payzen.component';

@NgModule({
  declarations: [PayzenComponent],
  imports: [
    CommonModule
  ],
  exports: [PayzenComponent]
})
export class PayzenModule { }
