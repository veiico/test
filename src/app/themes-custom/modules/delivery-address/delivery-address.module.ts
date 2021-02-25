import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AutoCompleteModule } from '../../../components/autocomplete/autocomplete.module';
import { FetchLocationService } from '../../../components/fetch-location/fetch-location.service';
import { ModalModule } from '../../../components/modal/modal.module';
import { DeliveryAddressService } from '../../../modules/delivery-address/services/delivery-address.service';
import { JwCommonModule } from '../../../modules/jw-common/jw-common.module';
import { DynamicAskForDeliveryAddressComponent } from './components/ask-for-delivery-address/ask-for-delivery-address.component';
import { DynamicFetchDeliveryAddressComponent } from './components/fetch-delivery-address/fetch-delivery-address.component';
import { DynamicNotDiliverableComponent } from './components/not-diliverable/not-diliverable.component';


@NgModule({
  declarations: [
    // DynamicAskForDeliveryAddressComponent, DynamicFetchDeliveryAddressComponent, 
    // DynamicNotDiliverableComponent
  ],
  imports: [
    CommonModule,
    ModalModule,
    FormsModule,
    ReactiveFormsModule,
    JwCommonModule,
    AutoCompleteModule
  ],
  providers: [
    DeliveryAddressService,
    FetchLocationService
  ],
  exports: [
    // DynamicAskForDeliveryAddressComponent,
    // DynamicFetchDeliveryAddressComponent,
    // DynamicNotDiliverableComponent
  ]
})
export class DynamicDeliveryAddressModule { }
