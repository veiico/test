import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymarkComponent } from './paymark.component';

@NgModule({
  declarations: [PaymarkComponent],
  imports: [
    CommonModule
  ],
  exports: [PaymarkComponent]
})
export class PaymarkModule { }
