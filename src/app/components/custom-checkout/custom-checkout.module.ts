import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomCheckoutComponent } from './custom-checkout.component';
import { SharedModule } from '../../modules/shared.module';
import { FavLocationModule } from '../fav-location/fav-location.module';
import { AgmCoreModule } from '@agm/core';
import { CustomCheckoutRoutingModule } from './custom-checkout.routing';
import { CheckoutModule } from '../checkout/checkout.module';
import { PickupOptionComponent } from './components/pickup-option/pickup-option.component';
import { FooterModule } from '../../modules/footer/footer.module';
import { ScheduleLaundryModule } from '../laundry-checkout/components/schedule/schedule.module';
import { CheckoutTemplateModule } from '../../modules/checkout-template/checkout-template.module';
import { CustomerVerificationPopupModule } from '../customer-verification-popup/customer-verification-popup.module';
import { OrderPlacedPopupModule } from '../order-placed-page/order-placed-popup.module';
import { ProductDescriptionService } from '../../services/product-description.service';


@NgModule({
  imports: [
    CommonModule,
    CustomCheckoutRoutingModule,
    SharedModule,
    AgmCoreModule,
    FavLocationModule,
    CheckoutModule,
    FooterModule,
    ScheduleLaundryModule,
    CheckoutTemplateModule,
    CustomerVerificationPopupModule,
    OrderPlacedPopupModule
  ],
  declarations: [
    CustomCheckoutComponent,
    PickupOptionComponent
  ],
  providers: [
    ProductDescriptionService
  ]
})
export class CustomCheckoutModule { }
