/**
 * Created by mba-214 on 04/11/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TruncatePipe } from '../pipes/truncate.pipe';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    TruncatePipe
  ],
  exports: [
    TruncatePipe
  ]
})
export class TruncatePipeModule {}
