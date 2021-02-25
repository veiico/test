import {
  BrowserModule,
  BrowserTransferStateModule
} from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { AppComponent } from './app.component';
import { AppRoutingModule, SelectivePreloadingStrategy } from './app.routing';

import { AppService } from './app.service';
import { ApiService } from './services/api.service';
import { RouteHistoryService } from './services/setGetRouteHistory.service';
import { MessageService } from './services/message.service';
import { SessionService } from './services/session.service';
import { LoaderService } from './services/loader.service';
import { AppStartService } from './services/app-start.service';
import { ExternalLibService } from './services/set-external-lib.service';
import {
  OtherWorkflowGuard,
  EcommerceGuard
} from './guards/logisticGuard.service';
import { LoadGuard } from './guards/load.guard';
import { ThemeService } from './services/theme.service';
import { MarketplaceGuardService } from './guards/marketplace-guard.service';
import { PopupModule } from './modules/popup/popup.module';
import { ModalModule } from './components/modal/modal.module';

import { GoogleAnalyticsEventsService } from './services/google-analytics-events.service';
import { SeoService } from './services/seo.service';
import { SeoGuard } from './guards/seo.guard';
import { ProfileService } from './components/profile/profile.service';
import { CookieFooterModule } from './components/cookie-setting-footer/cookie-setting-footer.module';
import { FBPixelService } from './services/fb-pixel.service';
import { OrdersService } from './components/orders/orders.service';
import { PopUpService } from './modules/popup/services/popup.service';
import { PaymentService } from './components/payment/payment.service';
import { PostedProjectService } from './components/freelancer/posted-projects/posted-projects.service';
import { GoogleAdWordsService } from './services/google-adwords.service';
import { TransferHttpCacheModule } from '@nguniversal/common';
// import { TransferHttpCacheModule } from '@hapiness/ng-universal-transfer-http';
import { environment } from '../environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';
import { GoogleMapsConfig } from './services/googleConfig';
import { RestaurantGuard } from './guards/restaurant.guard';
import { CommonService } from './services/common.service';
import { BusinessCategoriesService } from './components/restaurants-new/components/business-categories/business-categories.service';
import { JwNotificationsModule } from './modules/jw-notifications/jw-notifications.module';
import { registerLocaleData } from '@angular/common';
import localeAr from '@angular/common/locales/ar'; 
registerLocaleData(localeAr,'ar-kl');
export function appStartFactory(appStartService: AppStartService): Function {
  return () => appStartService.initialLoad();
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    HttpClientModule,
    TransferHttpCacheModule,
    BrowserTransferStateModule,
    BsDatepickerModule.forRoot(),
    TooltipModule.forRoot(),
    AppRoutingModule,
    CookieFooterModule,
    PopupModule,
    JwNotificationsModule,
    ModalModule,
    // RouterModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.beta || environment.production
    })
  ],
  providers: [
    ExternalLibService,
    AppService,
    AppStartService,
    {
      // Provider for APP_INITIALIZER
      provide: APP_INITIALIZER,
      useFactory: appStartFactory,
      deps: [AppStartService],
      multi: true
    },
    RouteHistoryService,
    ApiService,
    OrdersService,
    CommonService,
    PopUpService,
    MessageService,
    SessionService,
    LoaderService,
    SelectivePreloadingStrategy,
    MarketplaceGuardService,
    OtherWorkflowGuard,
    LoadGuard,
    RestaurantGuard,
    ThemeService,
    GoogleAnalyticsEventsService,
    SeoService,
    SeoGuard,
    ProfileService,
    FBPixelService,
    PostedProjectService,
    GoogleAdWordsService,
    GoogleMapsConfig,
    BusinessCategoriesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}