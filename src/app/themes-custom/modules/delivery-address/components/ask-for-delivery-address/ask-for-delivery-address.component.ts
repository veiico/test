import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../../../../services/session.service';

import { AskForDeliveryAddressComponent } from '../../../../../modules/delivery-address/components/ask-for-delivery-address/ask-for-delivery-address.component';

@Component({
  selector: 'app-ask-for-delivery-address-dynamic',
  templateUrl: '../../../../../modules/delivery-address/components/ask-for-delivery-address/ask-for-delivery-address.component.html',
  styleUrls: ['../../../../../modules/delivery-address/components/ask-for-delivery-address/ask-for-delivery-address.component.scss']
})
export class DynamicAskForDeliveryAddressComponent extends AskForDeliveryAddressComponent implements OnInit {

  constructor( sessionService: SessionService ) {
    super(sessionService);
  }
}
