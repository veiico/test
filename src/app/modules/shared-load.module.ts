/**
 * Created by cl-macmini-51 on 10/07/18.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { Daterangepicker } from 'ng2-daterangepicker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { AppCartService } from '../components/catalogue/components/app-cart/app-cart.service';
// import { CookieFooterComponent } from '../components/cookie-setting-footer/cookie-setting-footer.component';
import { CookieSettingService } from '../components/cookie-setting-footer/cookie-setting-footer.service';
import { FuguIntelInputService } from '../components/fugu-tel-input/fugu-tel-input.service';
import { ClickOutsideDirective } from '../directives/click-outside.directive';
import { TapEffectDirective } from '../directives/tap-effect.directive';
import { ValidationService } from '../services/validation.service';
import { LogisticsUtilityModule } from './logistics-utility.module';
import { HeaderModule } from '../components/header/header.module';
import { PopupModule } from './popup/popup.module';
import { CookieFooterModule } from '../components/cookie-setting-footer/cookie-setting-footer.module';


@NgModule({
  imports: [
    CommonModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    Daterangepicker,
    BsDatepickerModule,
    RouterModule,
    CookieFooterModule,
    LogisticsUtilityModule,
    HeaderModule,
    PopupModule
  ],
  declarations: [
    TapEffectDirective,
    ClickOutsideDirective,
  ],
  exports: [
    CookieFooterModule,
    HeaderModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    Daterangepicker,
    BsDatepickerModule,
    TapEffectDirective,
    ClickOutsideDirective,
    LogisticsUtilityModule,
    PopupModule
  ],
  providers: [
    AppCartService,
    CookieSettingService,
    FuguIntelInputService,

    ValidationService
  ]
})
export class SharedLoadModule { }
