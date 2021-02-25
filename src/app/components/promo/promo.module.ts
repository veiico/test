/**
 * Created by mba-214 on 23/10/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { JwCommonModule } from '../../modules/jw-common/jw-common.module';
import { PromoListComponent } from './components/promo-list/promo-list.component';
import { PromoEnterComponent } from './components/enter-promo/enter-promo.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    JwCommonModule
  ],
  declarations: [
    PromoListComponent,
    PromoEnterComponent
  ],
  exports: [
    PromoListComponent,
    PromoEnterComponent
  ],
  providers: [
  ]
})
export class PromoModule {
}
