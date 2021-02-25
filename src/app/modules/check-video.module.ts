import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckVideoPipe } from '../pipes/checkVideo.pipe';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    CheckVideoPipe
  ],
  exports: [
    CheckVideoPipe
  ]
})
export class CheckVideoPipeModule {
}