/**
 * Created by mba-214 on 04/11/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchFilterPipe } from '../pipes/search-filter.pipe';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    SearchFilterPipe
  ],
  exports: [
    SearchFilterPipe
  ]
})
export class SearchFilterPipeModule {}
