import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { FetchDeliveryAddressComponent } from '../../../../../modules/delivery-address/components/fetch-delivery-address/fetch-delivery-address.component';
import { SessionService } from '../../../../../services/session.service';
import { ModalType } from '../../../../../constants/constant';
@Component({
  selector: 'app-fetch-delivery-address-dynamic',
  templateUrl: '../../../../../modules/delivery-address/components/fetch-delivery-address/fetch-delivery-address.component.html',
  styleUrls: ['../../../../../modules/delivery-address/components/fetch-delivery-address/fetch-delivery-address.component.scss',
    '../../../../../modules/preorder-time/components/preorder-time/preorder-time.component.scss']
})
export class DynamicFetchDeliveryAddressComponent extends FetchDeliveryAddressComponent implements OnInit {

  @Output() locationFetched: EventEmitter<null> = new EventEmitter<null>();
  @Output() hideFetchLocation: EventEmitter<null> = new EventEmitter<null>();
  modalType = ModalType;

  constructor(protected sessionService: SessionService) {
    super(sessionService);
  }
  locationAutoFilled() {
    this.locationFetched.emit();
  }

  onClose() {
    this.sessionService.remove('location');
    this.hideFetchLocation.emit();
  }


  onSubmit() {
    if (!this.sessionService.get('location') || !this.sessionService.get('location').lat || !this.sessionService.get('location').lng) {
      return;
    }
    this.locationFetched.emit();
  }
}
