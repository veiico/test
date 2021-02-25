import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SessionService } from '../../../../services/session.service';

@Component({
  selector: 'app-ask-for-delivery-address',
  templateUrl: './ask-for-delivery-address.component.html',
  styleUrls: ['./ask-for-delivery-address.component.scss']
})
export class AskForDeliveryAddressComponent implements OnInit {

  languageStrings: any={};
  @Output() hide: EventEmitter<null> = new EventEmitter<null>();
  @Output() askToFetchLocation: EventEmitter<null> = new EventEmitter<null>();

  constructor(protected sessionService: SessionService) {
   
   }

  ngOnInit() {
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
    });
  }

  cancel() {
    this.hide.emit();
  }

  fetchLocation() {
    this.askToFetchLocation.emit();
  }
}
