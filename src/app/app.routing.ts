import { NgModule } from '@angular/core';
import {
  Routes,
  RouterModule,
  PreloadingStrategy,
  Route
} from '@angular/router';

import { LoadGuard } from './guards/load.guard';

import {
  OtherWorkflowGuard,
  EcommerceGuard
} from './guards/logisticGuard.service';
import { MarketplaceGuardService } from './guards/marketplace-guard.service';
import { SeoGuard } from './guards/seo.guard';
import { Observable, of } from '../../node_modules/rxjs';
import { environment } from '../environments/environment';

export class SelectivePreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: Function): Observable<any> {
    return route.data && route.data.preload ? load() : of(null);
  }
}

export const routes: Routes = [
  {
    path: '',
    // pathMatch: 'full',
    canLoad: [LoadGuard, MarketplaceGuardService],
    data: { type: 'fetchlocation', preload: true },
    canActivate: [LoadGuard, SeoGuard],
    loadChildren:
      'app/components/fetch-location/fetch-location.module#FetchLocationModule'
  },
  {
    path: 'freelancer',
    loadChildren:
      'app/components/freelancer/freelancer.module#FreeLancerModule',
    canLoad: [OtherWorkflowGuard]
  },
  {
    path: 'newHome',
    loadChildren:
      'app/components/fetch-location/home/home-new.module#HomeNewModule'
  },
  {
    path: 'test',
    loadChildren: './themes/swiggy/modules/app/app.module#AppModule'
  },
  {
    path: 'test',
    loadChildren:
      './themes/swiggy/modules/fav-location/fav-location.module#SwiggyFavLocationModule'
  },
  {
    path: 'stripe',
    loadChildren: 'app/components/stripe/stripe.module#StripeModule'
  }, 
  {
    path: '',
    data: { type: 'layout' },
    canLoad: [LoadGuard],
    loadChildren: 'app/components/layout/layout.module#LayoutModule'
  },
  {
    path: 'test',
    loadChildren:
      'app/themes-custom/modules/fetch-location/fetch-location.module#DynamicFetchLocationModule'
  },
  {
    path: 'test',
    loadChildren:
      'app/themes-custom/modules/restaurants-new/restaurants-new.module#DynamicRestaurantsNewModule'
  },
  {
    path:'test',
    loadChildren:'app/themes-custom/modules/catalogue/catalogue.module#DynamicCatalogueModule'
  },
  {
    path: 'test',
    loadChildren: 'app/themes-custom/modules/orders/orders.module#DynamicOrdersModule'
  },
  {
    path: 'test',
    loadChildren: 'app/themes-custom/modules/user-rights/user-rights.module#DynmaicUserRightsModule'
  },
  {
    path:'test',
    loadChildren:'app/themes-custom/modules/profile/profile.module#DynamicProfileModule'
  },
  {
    path:'test',
    loadChildren:'app/themes-custom/modules/loyalty-points-info/loyalty-points-info.module#DynmaicLoyaltyPointsInfoModule'
  },
  {
    path: 'test',
    loadChildren: 'app/themes-custom/modules/payment/payment.module#DynamicPaymentModule'
  },
  {
    path: 'test',
    loadChildren: 'app/themes-custom/modules/show-debt/show-debt.module#DynamicDebtModule'
  }
  //{
  //  path: 'test',
  //  loadChildren: './themes/swiggy/modules/checkout/checkout.module#SwiggyCheckoutModule',
  //},
  //{
  //  path: 'test',
  //  loadChildren: './themes/swiggy/modules/orders/orders.module#SwiggyOrdersModule',
  //},
  //{
  //  path: 'test',
  //  loadChildren: './themes/swiggy/modules/payment/payment.module#SwiggyPaymentModule',
  //},
  //{
  //  path: 'test',
  //  loadChildren: './themes/swiggy/modules/profile/profile.module#SwiggyProfileModule',
  //},
  //{
  //  path: 'test',
  //  loadChildren: './themes/swiggy/modules/restaurant-review/restaurant-review.module#SwiggyRestaurantReviewModule',
  //},
  //{
  //  path: 'test',
  //  loadChildren: './themes/swiggy/modules/restaurants-new/restaurants.module#SwiggyRestaurantsModule',
  //},
  //{
  //  path: 'test',
  //  loadChildren: './themes/swiggy/modules/user-rights/user-rights.module#SwiggyUserRightsModule',
  //},
  //{
  //  path: 'test',
  //  loadChildren: './themes/swiggy/modules/search-all/search-all.module#SwiggySearchAllModule',
  //},
  //{
  //  path: 'logistics',
  //  loadChildren: 'app/components/logistics/logistics.module#LogisticsModule',
  //  canLoad: [OtherWorkflowGuard],
  //  // canActivate:[LogisticsGuard]
  //},
  // {
  //   path: '',
  //   pathMatch: 'full',
  //   canLoad: [MarketplaceGuardService],
  //   loadChildren: 'app/components/layout/layout.module#LayoutModule',
  //   data: {
  //     preload: true
  //   }
  // },
  // { path: '', redirectTo: '', pathMatch: 'full' },
  // { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: false,
      preloadingStrategy: SelectivePreloadingStrategy,
      initialNavigation: environment.enable_ssr ? 'enabled' : false //true | false | 'enabled' | 'disabled' | 'legacy_enabled' | 'legacy_disabled'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
