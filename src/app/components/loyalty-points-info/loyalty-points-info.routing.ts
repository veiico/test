import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoyaltyPointsInfoComponent } from './loyalty-points-info.component';


export const routes: Routes = [
    {
        path: '',
        component: LoyaltyPointsInfoComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LoyaltyPointsInfoRoutingModule { }
