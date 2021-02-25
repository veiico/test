import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollToTopComponent } from './scroll-to-top.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ScrollToTopComponent],
  exports: [ScrollToTopComponent]
})
export class ScrollToTopModule { }
