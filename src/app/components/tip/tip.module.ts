/**
 * Created by mba-214 on 23/10/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DecimalConfigPipeModule } from '../../modules/decimal-config-pipe.module';

import { JwCommonModule } from '../../modules/jw-common/jw-common.module';
import { ApplyTipComponent } from './components/apply-tip/apply-tip.component';

@NgModule({
  imports: [
    CommonModule,
    DecimalConfigPipeModule,
    FormsModule,
    ReactiveFormsModule,
    JwCommonModule
  ],
  declarations: [
    ApplyTipComponent
  ],
  exports: [
    ApplyTipComponent
  ],
  providers: [
  ]
})
export class TipModule {
}
