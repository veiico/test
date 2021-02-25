import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PeachComponent } from './peach.component';

@NgModule({
  declarations: [PeachComponent],
  imports: [
    CommonModule
  ],
  exports: [PeachComponent]
})
export class PeachModule { }
