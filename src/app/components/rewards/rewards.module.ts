import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { FooterModule } from '../../modules/footer/footer.module';
import { HeaderModule } from '../header/header.module';
import { ModalModule } from '../modal/modal.module';
import { JwCommonModule } from '../../modules/jw-common/jw-common.module';
import { RewardsService } from './rewards.service';
import { RewardsListComponent } from './components/list/list.component';
import { DecimalConfigPipeModule } from '../../modules/decimal-config-pipe.module';
import { TruncatePipeModule } from '../../modules/truncate-pipe.module';
import { PaymentMethodsModule } from '../payment-methods/payment-methods.module';

export const routes: Routes = [
  {
    path: '',
    component: RewardsListComponent,
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FooterModule,
    HeaderModule,
    RouterModule.forChild(routes),
    ModalModule,
    JwCommonModule,
    DecimalConfigPipeModule,
    TooltipModule,
    TruncatePipeModule,
    PaymentMethodsModule
  ],
  declarations: [
    RewardsListComponent
  ],
  providers: [
    RewardsService
  ]
})
export class RewardsModule {
}
