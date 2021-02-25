/**
 * Created by cl-macmini-51 on 02/05/18.
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AgmCoreModule } from "@agm/core";

import { SharedModule } from "../../modules/shared.module";
import { CheckoutRoutingModule } from "./checkout.routing";

import { CheckOutComponent } from "./checkout.component";
import { AppointmentComponent } from "./components/appointment/appointment.component";
import { DeliveryComponent } from "./components/delivery/delivery.component";
import { PickUpComponent } from "./components/pickup/pickup.component";

import { PickUpService } from "./components/pickup/pickup.service";
import { CheckOutService } from "./checkout.service";
import { ValidationService } from "../../services/validation.service";
import { DropDownListService } from "../dropdownlist/dropdownlist.service";
import { DeliveryService } from "./components/delivery/delivery.service";
import { GoogleAnalyticsEventsService } from "../../services/google-analytics-events.service";
import { PaymentService } from "../payment/payment.service";
import { AppointmentService } from "./components/appointment/appointment.service";
import { AppDeliveryAddressComponent } from "./components/delivery-address/delivery-address.component";
import { FavLocationModule } from "../fav-location/fav-location.module";
import { StaticAddressModule } from "./components/static-address/static-address.module";
import { FooterModule } from "../../modules/footer/footer.module";
import { TableModule } from "primeng/table";
import { InputSwitchModule } from "primeng/inputswitch";
import { CheckboxModule } from "primeng/checkbox";
import { CheckoutTemplateModule } from "../../modules/checkout-template/checkout-template.module";
import { CheckoutCartModule } from "../../modules/checkout-cart/checkout-cart.module";
import { JwGoogleAutocompleteModule } from "../../modules/jw-google-autocomplete/jw-google-autocomplete.module";
import { DateTimeFormatPipeModule } from '../../modules/pipe.module';
import { CustomerVerificationPopupModule } from '../customer-verification-popup/customer-verification-popup.module';
import { DynamicHeaderModule } from '../../themes-custom/modules/header/header.module';
import { RecurringTasksComponent } from './components/recurring-tasks/recurring-tasks.component';
import { ProductDescriptionService } from '../../services/product-description.service';
import { MapPopupModule } from '../../modules/map-popup/map-popup.module';
import { ModalModule } from '../modal/modal.module';
import { AppProductComponent } from './components/app-product/app-product.component';
import { ServiceTimePipeModule } from '../../modules/serviceTimePipe.module';
import { CheckVideoPipeModule } from '../../modules/check-video.module';
@NgModule({
  imports: [
    CommonModule,
    CheckoutRoutingModule,
    CustomerVerificationPopupModule,
    SharedModule,
    AgmCoreModule,
    FavLocationModule,
    StaticAddressModule,
    FooterModule,
    InputSwitchModule,
    TableModule,
    CheckoutTemplateModule,
    CheckoutCartModule,
    JwGoogleAutocompleteModule,
    CheckboxModule,
    DateTimeFormatPipeModule,
    DynamicHeaderModule,
    MapPopupModule,
    ModalModule,
    ServiceTimePipeModule,
    CheckVideoPipeModule
  ],
  declarations: [
    CheckOutComponent,
    AppointmentComponent,
    DeliveryComponent,
    PickUpComponent,
    AppProductComponent,
    AppDeliveryAddressComponent,
    RecurringTasksComponent
  ],
  exports: [
    AppointmentComponent,
    DeliveryComponent,
    PickUpComponent,
    AppDeliveryAddressComponent,
    RecurringTasksComponent
  ],
  providers: [
    PickUpService,
    CheckOutService,
    ValidationService,
    DropDownListService,
    DeliveryService,
    GoogleAnalyticsEventsService,
    PaymentService,
    AppointmentService,
    ProductDescriptionService
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class CheckoutModule { }
