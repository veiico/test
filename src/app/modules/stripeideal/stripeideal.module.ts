import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StripeidealComponent } from './stripeideal.component';
import { StripeidealService } from './stripeideal.service';


@NgModule({
  declarations: [StripeidealComponent],
  imports: [
    CommonModule
  ],
  exports: [
    StripeidealComponent
  ],
  providers: [
    StripeidealService
  ]
})
export class StripeidealModule { }
