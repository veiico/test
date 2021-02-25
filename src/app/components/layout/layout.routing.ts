/**
 * Created by cl-macmini-51 on 02/05/18.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { LoginGuardService, CheckCartGuard, VerificationGuardService } from '../../guards/loginGuard.service';
import { LoadGuard } from '../../guards/load.guard';
import { SeoGuard } from '../../guards/seo.guard';
import { RestaurantGuard } from '../../guards/restaurant.guard';
import { ListGuard } from '../../guards/list.guard';
import { PendingDebtAmountGuard } from '../../../app/guards/pendingDebt.guard';
import { CustomerSubscriptionPlanGuard } from '../../../app/guards/customer-subscription-plan.guard'

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    // pathMatch:'full',
    children: [ 
      // {
      //   path: '',
      //   pathMatch: 'full',
      //   canLoad: [LoadGuard, ecomFlowGuard],
      //   data: { type: 'fetchlocation' },
      //   canActivate: [SeoGuard],
      //   loadChildren: 'app/components/fetch-location/fetch-location.module#FetchLocationModule'
      // },
      {
        path: 'page/:type/:pageName',
        data: { preload: true },
        loadChildren: 'app/components/pages/pages.module#PagesModule'
      },
      {
        path: 'page/:pageName',
        redirectTo:'page/admin/:pageName'
      },
      {
        path: 'store/:pageName',
        data: { preload: true },
        loadChildren: 'app/components/pages/pages.module#PagesModule'
      },
      {
        path: 'content/:pageName',
        data: { preload: true },
        loadChildren: 'app/components/pages/pages.module#PagesModule'
      },
      {
        path: 'verify-email',
        pathMatch: 'full',
        loadChildren: 'app/components/email-verification/email-verification.module#EmailVerificationModule'
      },
      {
        path: 'store/:slug/:id',
        pathMatch: 'full',
        canLoad: [LoadGuard],
        data: { preload: true, type: 'store' }, 
        canActivate: [SeoGuard, ListGuard , PendingDebtAmountGuard, CustomerSubscriptionPlanGuard],
        loadChildren: 'app/components/catalogue/catalogue.module#CatalogueModule'
        // loadChildren: 'app/themes-custom/modules/catalogue/catalogue.module#DynamicCatalogueModule'
      },
      {
        path: 'store/:id',
        redirectTo: 'store/-/:id',
        canActivate: [ListGuard]
      },
      {
        path: 'list',
        // pathMatch: 'full',
        canLoad: [LoadGuard, RestaurantGuard],
        data: { preload: true, type: 'list' },
        canActivate: [LoadGuard,RestaurantGuard,SeoGuard,ListGuard, PendingDebtAmountGuard, CustomerSubscriptionPlanGuard],
        loadChildren: 'app/components/restaurants-new/restaurants.module#RestaurantsModule'
        // loadChildren:'app/themes-custom/modules/restaurants-new/restaurants-new.module#DynamicRestaurantsNewModule'
      },
      {
        path: 'orders',
        pathMatch: 'full',
        canLoad: [LoadGuard],
        data: { preload: false,type:'orders' },
        canActivate: [LoginGuardService , PendingDebtAmountGuard, CustomerSubscriptionPlanGuard],
        loadChildren: 'app/components/orders/orders.module#OrdersModule'
      },
      {
        path: 'subscriptions',
        pathMatch: 'full',
        canLoad: [LoadGuard],
        data: { preload: false,type:'subscriptions' },
        canActivate: [LoginGuardService],
        loadChildren: 'app/components/subscriptions/subscriptions.module#SubscriptionsModule'
      },
      {
        path: 'details/:id',
        pathMatch: 'full',
        data: { preload: false, type: 'product' },
        canActivate: [SeoGuard],
        loadChildren: 'app/components/product-details/product-details.module#ProductDetailsModule'
      },
      // {
      //   path: 'ecomDetails/:id',
      //   pathMatch: 'full',
      //   data: { preload: false },
      //   loadChildren: 'app/components/product-description/product-description.module#ProductDescriptionModule'
      // },
      {
        path: 'store-review/:id',
        pathMatch: 'full',
        data: { preload: false,type:'store-review' },
        canLoad: [LoadGuard],
        loadChildren: 'app/components/restaurant-review/restaurant-review.module#RestaurantReviewModule'
      },
      {
        path: 'checkout',
        pathMatch: 'full',
        canLoad: [LoadGuard],
        data: { preload: false,type:'checkout' },
        canActivate: [LoginGuardService, CheckCartGuard , VerificationGuardService , PendingDebtAmountGuard, CustomerSubscriptionPlanGuard],
       loadChildren: 'app/components/checkout/checkout.module#CheckoutModule'
      },
      {
        path: 'customCheckout',
        pathMatch: 'full',
        data: { preload: false},
        canActivate: [LoginGuardService],
        loadChildren: 'app/components/custom-checkout/custom-checkout.module#CustomCheckoutModule'
      },
      {
        path: 'testCheckout',
        pathMatch: 'full',
        data: { preload: false},
        canActivate: [LoginGuardService],
        loadChildren: 'app/components/laundry-checkout/laundry-checkout.module#CheckoutLaundryModule'
      },
      {
        path: 'fav',
        pathMatch: 'full',
        canLoad: [LoadGuard],
        canActivate: [LoginGuardService , PendingDebtAmountGuard, CustomerSubscriptionPlanGuard],
        data: { preload: false,type:'fav' },
        loadChildren: 'app/components/fav-location/fav-location.module#FavLocationModule'
      },
      {
        path: 'payment',
        pathMatch: 'full',
        canLoad: [LoadGuard],
        data: { preload: false, type: 'payment' },
        canActivate: [LoginGuardService, CheckCartGuard, VerificationGuardService],
        loadChildren: 'app/components/payment-new/payment-new.module#PaymentNewModule'
      },
      {
        path: 'often-bought-product-page',
        pathMatch: 'full',
        canLoad: [LoadGuard],
        data: { preload: false},
        canActivate: [LoginGuardService],
        loadChildren: 'app/components/often-bought-products/often-bought.module#OftenBoughtModule'
         },
      {
        path: 'profile',
        pathMatch: 'full',
        data: { preload: false, type:'profile' },
        canLoad: [LoadGuard],
        canActivate: [LoginGuardService , PendingDebtAmountGuard, CustomerSubscriptionPlanGuard],
        loadChildren: 'app/components/profile/profile.module#ProfileModule'
      },
      {
        path: 'debtAmount',
        pathMatch: 'full',
        data: { preload: false, type:'debtAmount' },
        canLoad: [LoadGuard],
        canActivate: [LoginGuardService],
        loadChildren: 'app/components/show-debt/show-debt.module#DebtModule'
      },
      {
        path: 'customerSubscription',
        pathMatch: 'prefix',
        data: { preload: false, type:'customerSubscription' },
        canLoad: [LoadGuard],
        canActivate: [LoginGuardService],
        loadChildren: 'app/components/customer-subscription/customer-subscription.module#CustomerSubscriptionModule'
      },
      {
        path: 'refer',
        pathMatch: 'full',
        data: { preload: false },
        canActivate: [LoginGuardService , PendingDebtAmountGuard, CustomerSubscriptionPlanGuard],
        loadChildren: 'app/components/ReferAndEarn/refer.module#ReferModule'
      },
      {
        path: 'share/:vendorId/:marketplaceUserId',
        pathMatch: 'full',
        data: { preload: false },
        loadChildren: 'app/components/referAndEarnShare/referAndEarnShare.module#ReferAndEarnShareModule'
      },
      {
        path: 'settings',
        pathMatch: 'full',
        data: { preload: false, type:'settings' },
        canLoad: [LoadGuard],
        canActivate: [LoginGuardService],
        loadChildren: 'app/components/user-rights/user-rights.module#UserRightsModule'
      },
      {
        path: 'privacy-policy',
        pathMatch: 'full',
        data: { preload: false },
        loadChildren: 'app/components/privacy-policy/privacy-policy.module#PrivacyPolicyModule'
      },
      {
        path: 'terms-condition',
        pathMatch: 'full',
        data: { preload: false },
        loadChildren: 'app/components/terms-condition/terms-condition.module#TermsConditionModule'
      },
      {
        path: 'search',
        pathMatch: 'full',
        data: { preload: false,type:'search' },
        canLoad: [LoadGuard],
        loadChildren: 'app/components/search-all/search-all.module#SearchAllModule'
      },
      {
        path: 'loyalty-points',
        pathMatch: 'full',
        canLoad: [LoadGuard],
        data: { preload: false, type: 'loyalty' },
        canActivate: [LoginGuardService, PendingDebtAmountGuard, CustomerSubscriptionPlanGuard],
        loadChildren: 'app/components/loyalty-points-info/loyalty-points-info.module#LoyaltyPointsInfoModule'
      },
      {
        path: 'wallet',
        pathMatch: 'full',
        data: { preload: false },
        canActivate: [LoginGuardService],
        loadChildren: 'app/components/wallet/wallet.module#WalletModule'
      },
      {
        path: 'giftCard',
        pathMatch: 'full',
        data: { preload: false },
        canActivate: [LoginGuardService],
        loadChildren: 'app/components/gift-card/gift-card.module#GiftCardModule'
      },
      {
        path: 'reward',
        pathMatch: 'full',
        data: { preload: false },
        canActivate: [LoginGuardService],
        loadChildren: 'app/components/rewards/rewards.module#RewardsModule'
      },
      {
        path: '404',
        pathMatch: 'full',
        loadChildren: 'app/error-page/error-page.module#ErrorPageModule'
      },
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
      },
      {
        path: '**',
        redirectTo: '404',
        // pathMatch: 'full'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
