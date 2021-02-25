/**
 * Created by cl-macmini-51 on 20/04/18.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RestaurantsNewComponent } from './restaurants-new.component';

export const routes: Routes = [
  {
    path: '',
    component: RestaurantsNewComponent,
    children: [
      {
        path: '',
        data: { preload: true },
        loadChildren:  './components/restaurants/restaurants-new.module#RestaurantsNewModule',
        // pathMatch: 'full'
      },
      // {
      //   path: '',
      //   redirectTo: ''
      // }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes)],
  exports: [ RouterModule ]
})
export class RestaurantsNewRoutingModule {}
