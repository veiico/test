/**
 * Created by mba-214 on 23/10/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProgressBarComponent } from './progressbar.component';



@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ProgressBarComponent
  ],
  exports: [
    ProgressBarComponent
  ],
  providers: [
  ]
})
export class ProgressBarModule {
}
