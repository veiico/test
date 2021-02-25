///<reference path="../pipes/daysAgo.pipe.ts"/>
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CalendarModule } from 'primeng/calendar';

import { SharedLoadModule } from './shared-load.module';
//import { DeliveryModesModule } from '../components/restaurants-new/components/delivery-modes/delivery-modes.module';

import { TookanStatus } from '../pipes/tookanstatus.pipe';
import { Capitalize } from '../pipes/capitalize.pipe';
import { DaysAgoPipe } from '../pipes/daysAgo.pipe';

import { DropDownListComponent } from '../components/dropdownlist/dropdownlist.component';
import { DropDownListService } from '../components/dropdownlist/dropdownlist.service';
import { PopupModule } from './popup/popup.module';
import { CheckOutService } from '../components/checkout/checkout.service';
import { PaymentService } from '../components/payment/payment.service';
import { BannerModule } from "../components/restaurants-new/components/banner/banner.module";
import { DecimalConfigPipeModule } from './decimal-config-pipe.module';
import { FacModule } from './fac/fac.module';
import { PaypalModule } from '../modules/paypal/paypal.module';
import { TelrModule } from '../modules/telr/telr.module';
import { TruncatePipeModule } from './truncate-pipe.module';
import { PayuModule } from './payu/payu.module';
import { PaystackModule } from './paystack/paystack.module';
@NgModule({
  imports: [
    CommonModule,
    TooltipModule,
    CalendarModule,
    MatRadioModule,
    SharedLoadModule,
    PopupModule,
    BannerModule,
    DecimalConfigPipeModule,
    TruncatePipeModule,
    PaypalModule,
    PaypalModule,
    TelrModule,
    PayuModule,
    PaystackModule
  ],
  declarations: [
    DropDownListComponent,
    TookanStatus,
    Capitalize,
    DaysAgoPipe,
  ],
  exports: [
    DropDownListComponent,
    TookanStatus,
    Capitalize,
    DaysAgoPipe,
    TooltipModule,
    MatRadioModule,
    CalendarModule,
    SharedLoadModule,
    BannerModule,
    DecimalConfigPipeModule,
    TruncatePipeModule,
    FacModule,
    PaypalModule,
    TelrModule,
    PayuModule,
    PaystackModule
  ],
  providers: [
    DropDownListService,
    CheckOutService,
    PaymentService
  ]
})
export class SharedModule {}
