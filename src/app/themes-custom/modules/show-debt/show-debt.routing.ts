import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DynamicDebtAmountComponent } from './components/debt-amount/debt-amount.component';



export const routes: Routes = [
  {
    path: '',
    component: DynamicDebtAmountComponent,
    children: []
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DynamicShowDebtRoutingModule { }
