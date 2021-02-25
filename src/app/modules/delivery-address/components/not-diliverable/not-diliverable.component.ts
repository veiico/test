import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '../../../../../../node_modules/@angular/router';
import { SessionService } from '../../../../services/session.service';
import { AppService } from '../../../../app.service';

@Component({
  selector: 'app-not-diliverable',
  templateUrl: './not-diliverable.component.html',
  styleUrls: ['./not-diliverable.component.scss']
})
export class NotDiliverableComponent implements OnInit {

  languageStrings: any={};
  @Output() changeLocationEvent: any = new EventEmitter();
  isMerchantDomain: boolean;
  langJson: any;
  config: any;
  terminology: any;

  constructor(protected router: Router, protected sessionService: SessionService, protected appService: AppService) { 
   
  }

  ngOnInit() {
 
    this.config = this.sessionService.get('config');
    if (this.config) {
      this.terminology = this.config.terminology;
    }


    this.isMerchantDomain = this.sessionService.isMerchantDomain();
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
     this.languageStrings.sorry_this_merchant_does_not_deliver_to_your_selected_location =
     (this.languageStrings.sorry_this_merchant_does_not_deliver_to_your_selected_location || 'Sorry this MERCHANT_MERCHANT does not deliver to your selected location').replace('MERCHANT_MERCHANT', this.terminology.MERCHANT.toLowerCase());
    });
  }

  showMore() {
    this.router.navigate(['list']);
  }

  /**
   * change location
   */
  changeLocation() {
    this.changeLocationEvent.emit({data: true});
  }

}
