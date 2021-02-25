/**
 * Created by cl-macmini-51 on 28/09/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';

import { SharedModule } from '../../../../modules/shared.module';
import { AppStaticAddress } from './static-address.component';
import { SearchFilterPipeModule } from '../../../../modules/search-filter-pipe.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SearchFilterPipeModule
  ],
  declarations: [
    AppStaticAddress
  ],
  exports: [
    AppStaticAddress
  ],
  providers: []
})
export class StaticAddressModule {
}
