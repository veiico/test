/**
 * Created by cl-macmini-51 on 02/05/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { arLocale, esUsLocale, frLocale } from 'ngx-bootstrap/locale';
import { AgmCoreModule, LAZY_MAPS_API_CONFIG } from '@agm/core';

import { GoogleMapsConfig } from '../../services/googleConfig';

import { LayoutRoutingModule } from './layout.routing';

import { LayoutComponent } from './layout.component';

import { LoginGuardService, CheckCartGuard,VerificationGuardService } from '../../guards/loginGuard.service';

import { EcomFlowGuard } from '../../guards/ecomFlowGuard.service';
// import { CookieFooterComponent } from '../cookie-setting-footer/cookie-setting-footer.component';
import { CookieSettingService } from '../cookie-setting-footer/cookie-setting-footer.service';
import { CookieFooterModule } from '../cookie-setting-footer/cookie-setting-footer.module';
import { LoadGuard } from '../../guards/load.guard';
import { PendingDebtAmountGuard } from '../../../app/guards/pendingDebt.guard';
import { CustomerSubscriptionPlanGuard } from '../../../app/guards/customer-subscription-plan.guard';

const locales = [arLocale, esUsLocale, frLocale];
locales.forEach(locale => defineLocale(locale.abbr, locale));


@NgModule({
  imports: [
    CommonModule,
    LayoutRoutingModule,
    CookieFooterModule,
    // SharedLoadModule,
  ],
  declarations: [
    LayoutComponent
  ],
  providers: [
    EcomFlowGuard,
    LoadGuard,
    LoginGuardService,
    VerificationGuardService,
    PendingDebtAmountGuard,
    CheckCartGuard,
    CustomerSubscriptionPlanGuard,
    {
      provide: LAZY_MAPS_API_CONFIG,
      useClass: GoogleMapsConfig
    }
  ]
})
export class LayoutModule {
}
