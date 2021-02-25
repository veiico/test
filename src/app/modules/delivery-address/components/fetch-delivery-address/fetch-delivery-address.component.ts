import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SessionService } from '../../../../services/session.service';
import { ModalType } from '../../../../constants/constant';

@Component({
  selector: 'app-fetch-delivery-address',
  templateUrl: './fetch-delivery-address.component.html',
  styleUrls: ['./fetch-delivery-address.component.scss', '../../../preorder-time/components/preorder-time/preorder-time.component.scss']
})
export class FetchDeliveryAddressComponent implements OnInit {

  languageStrings: any={};
  @Output() locationFetched: EventEmitter<null> = new EventEmitter<null>();
  @Output() hideFetchLocation: EventEmitter<null> = new EventEmitter<null>();
  modalType = ModalType;

  constructor(protected sessionService: SessionService) { 

  }

  ngOnInit() {
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
    });
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
