import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DebtAmountComponent } from './components/debt-amount/debt-amount.component';
import { ModalModule } from '../modal/modal.module';
import { DebtService } from './services/show-debt.service';
import { HeaderModule } from '../header/header.module';
import { FooterModule } from '../../../app/modules/footer/footer.module';
import { Routes, RouterModule } from '@angular/router';
import { DecimalConfigPipeModule } from '../../../app/modules/decimal-config-pipe.module';
export const routes: Routes = [
  {
    path: '',
    component: DebtAmountComponent,
    children: []
  }
];
  
@NgModule({
  imports: [
    CommonModule,
    ModalModule,
    FooterModule,
    RouterModule.forChild(routes),
    DecimalConfigPipeModule
  ],
  declarations: [
    DebtAmountComponent
  ],
  exports:[
    DebtAmountComponent
  ],
  providers: [DebtService]
})
export class DebtModule { 
}
