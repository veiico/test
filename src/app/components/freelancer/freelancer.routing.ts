/**
 * Created by cl-macmini-51 on 19/07/18.
 */
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { FreeLancerComponent } from "./freelancer.component";
import { LoginGuardService } from "../../guards/loginGuard.service";
import { SeoGuard } from '../../guards/seo.guard';
import { FreelancerHomePageGuard } from './freelancer-home-page.guard';

export const routes: Routes = [
  {
    path: "",
    component: FreeLancerComponent,
    children: [
      {
        path: 'home',
        pathMatch: 'full',
        data: { type: 'fetchlocation'},
        canActivate: [SeoGuard],
        loadChildren: 'app/components/freelancer/home/home.module#FreeLancerHomeModule'
      },
      {
        path: "homepage",
        pathMatch: "full",
        canLoad: [FreelancerHomePageGuard],
        loadChildren:
          "app/components/freelancer/freelancer-homepage/freelancer-homapge.module#FreeLancerHomePageModule"
      },
      {
        path: "create-project/:id",
        pathMatch: "full",
        loadChildren:
          "app/components/freelancer/create-project/create-project.module#FreeLancerProjectModule"
      },
      {
        path: "categories/:id",
        pathMatch: "full",
        loadChildren:
          "app/components/freelancer/second-level-cat/second-level-cat.module#FreeLancerSecondLevelCatModule"
      },
      {
        path: "payment",
        // pathMatch: "full",
        // canLoad: [LoadGuard],
        data: { preload: false, type: "payment" },
        canActivate: [LoginGuardService],
        loadChildren: "app/components/payment-new/payment-new.module#PaymentNewModule"
      },
      {
        path: "projects",
        pathMatch: "full",
        loadChildren:
          "app/components/freelancer/posted-projects/posted-projects.module#PostedProjectModule"
      },
      {
        path: "profile",
        pathMatch: "full",
        loadChildren: "app/components/profile/profile.module#ProfileModule"
      },
      {
        path: "settings",
        pathMatch: "full",
        loadChildren:
          "app/components/user-rights/user-rights.module#UserRightsModule"
      },
      { path: 'merchantProfile/:userId/:isMobileAppView',
        pathMatch: 'full',
        loadChildren: 'app/components/merchantProfile/merchantProfile.module#MerchantProfileModule'
      },
      {
        path: "refer",
        pathMatch: "full",
        loadChildren: "app/components/ReferAndEarn/refer.module#ReferModule"
      },
      {
        path: "bids/:id",
        pathMatch: "full",
        loadChildren:
          "app/components/freelancer/view-bids/view-bids.module#ViewBidsModule"
      },
      {
        path: '',
        redirectTo: 'homepage',
        pathMatch: 'full'
      },
      // {
      // path: 'orders',
      //   pathMatch: 'full',
      //   loadChildren: 'app/components/orders/orders.module#OrdersModule'
      // },
      {
        path: "wallet",
        pathMatch: "full",
        loadChildren: "app/components/wallet/wallet.module#WalletModule"
      },
      {
        path: "",
        redirectTo: "",
        pathMatch: "full"
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FreeLancerRoutingModule { }
