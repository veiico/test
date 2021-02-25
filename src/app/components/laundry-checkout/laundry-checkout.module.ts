/**
 * Created by mba-214 on 23/10/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';

import { SharedModule } from '../../modules/shared.module';

import { ValidationService } from '../../services/validation.service';
import { GoogleAnalyticsEventsService } from '../../services/google-analytics-events.service';
import { PaymentService } from '../payment/payment.service';
import { FooterModule } from '../../modules/footer/footer.module';
import { CheckOutLaundryComponent } from './laundry-checkout.component';
import { CheckOutService } from '../checkout/checkout.service';
import { DropDownListService } from '../dropdownlist/dropdownlist.service';
import { ProgressBarModule } from './components/progressbar/progressbar.module';
import { JwCommonModule } from '../../modules/jw-common/jw-common.module';
import { ReviewOrderComponent } from './components/review-order/review-order.component';
import { AddressLaundryComponent } from './components/address/address.component';
import { JwGoogleAutocompleteModule } from '../../modules/jw-google-autocomplete/jw-google-autocomplete.module';
import { FavLocationService } from '../fav-location/fav-location.service';
import { ScheduleLaundryModule } from './components/schedule/schedule.module';
import { PaymentComponent } from './components/payment/payment.component';
import { PromoModule } from '../promo/promo.module';
import { ApplyLoyatyPointsModule } from '../../modules/apply-loyalty-points/apply-loyalty-points.module';
import { TipModule } from '../tip/tip.module';
import { PaymentMethodsModule } from '../payment-methods/payment-methods.module';
import { CheckoutTemplateModule } from '../../modules/checkout-template/checkout-template.module';
import { AppStaticAddressLaundry } from './components/static-address/static-address.component';
import { SearchFilterPipeModule } from '../../modules/search-filter-pipe.module';
import { DateTimeFormatPipeModule } from '../../modules/pipe.module';
import { ProductDescriptionService } from '../../services/product-description.service';
import { MapPopupModule } from '../../modules/map-popup/map-popup.module';



@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AgmCoreModule,
    FooterModule,
    ProgressBarModule,
    JwCommonModule,
    JwGoogleAutocompleteModule,
    ScheduleLaundryModule,
    PromoModule,
    ApplyLoyatyPointsModule,
    TipModule,
    PaymentMethodsModule,
    CheckoutTemplateModule,
    SearchFilterPipeModule,
    DateTimeFormatPipeModule,
    MapPopupModule
  ],
  declarations: [
    CheckOutLaundryComponent,
    ReviewOrderComponent,
    AddressLaundryComponent,
    PaymentComponent,
    AppStaticAddressLaundry
  ],
  exports: [
    CheckOutLaundryComponent,
    // ScheduleLaundryComponent,
    // CalendarLaundryComponent,
    ReviewOrderComponent,
    AddressLaundryComponent,
    PaymentComponent,
    AppStaticAddressLaundry
  ],
  providers: [
    CheckOutService,
    ValidationService,
    GoogleAnalyticsEventsService,
    PaymentService,
    DropDownListService,
    FavLocationService,
    ProductDescriptionService
  ]
})
export class CheckoutLaundryModule {
}
