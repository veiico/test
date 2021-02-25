/**
 * Created by mba-214 on 04/11/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DecimalConfigPipe } from '../pipes/decimalConfig.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [DecimalConfigPipe],
  exports: [DecimalConfigPipe]
})
export class DecimalConfigPipeModule {}
