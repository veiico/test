/**
 * Created by cl-macmini-51 on 21/05/18.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SwiggyFavLocationComponent } from './fav-location.component';
import { LoadChildrenGuard } from '../../../../guards/loadchildren.guard';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path:'',
        pathMatch:'full',
        component: SwiggyFavLocationComponent,
      }
    ],
    canActivate:[LoadChildrenGuard]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes)],
  exports: [ RouterModule ],
  providers:[LoadChildrenGuard]
})
export class FavLocationRoutingModule {}
