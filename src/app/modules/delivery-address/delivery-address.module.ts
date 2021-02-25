import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AskForDeliveryAddressComponent } from './components/ask-for-delivery-address/ask-for-delivery-address.component';
import { FetchDeliveryAddressComponent } from './components/fetch-delivery-address/fetch-delivery-address.component';
import { DeliveryAddressService } from './services/delivery-address.service';
import { JwCommonModule } from '../jw-common/jw-common.module';
import { PopupModule } from '../popup/popup.module';
import { ModalModule } from '../../components/modal/modal.module';
import { FormsModule, ReactiveFormsModule } from '../../../../node_modules/@angular/forms';
import { AutoCompleteModule } from '../../components/autocomplete/autocomplete.module';
import { FetchLocationService } from '../../components/fetch-location/fetch-location.service';
import { NotDiliverableComponent } from './components/not-diliverable/not-diliverable.component';

@NgModule({
  declarations: [AskForDeliveryAddressComponent, FetchDeliveryAddressComponent, NotDiliverableComponent],
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
    AskForDeliveryAddressComponent,
    FetchDeliveryAddressComponent,
    NotDiliverableComponent
  ]
})
export class DeliveryAddressModule { }
