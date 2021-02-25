import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DynamicLoyaltyPointsInfoComponent } from './loyalty-points-info.component';


export const routes: Routes = [
    {
        path: '',
        component: DynamicLoyaltyPointsInfoComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DynamicLoyaltyPointsInfoRoutingModule { }
