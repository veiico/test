import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { AppService } from '../../../../../app.service';
import { NotDiliverableComponent } from '../../../../../modules/delivery-address/components/not-diliverable/not-diliverable.component';
import { SessionService } from '../../../../../services/session.service';

@Component({
  selector: 'app-not-diliverable-dynamic',
  templateUrl: '../../../../../modules/delivery-address/components/not-diliverable/not-diliverable.component.html',
  styleUrls: ['../../../../../modules/delivery-address/components/not-diliverable/not-diliverable.component.scss']
})
export class DynamicNotDiliverableComponent extends NotDiliverableComponent implements OnInit {

  @Output() changeLocationEvent: any = new EventEmitter();
  isMerchantDomain: boolean;
  langJson: any;
  config: any;
  terminology: any;

  constructor(protected router: Router, protected sessionService: SessionService, protected appService: AppService) {
    super(router, sessionService, appService)
  }


  ngOnInit() {
    super.ngOnInit();
  }
  /**
   * change location
   */
  changeLocation() {
    this.changeLocationEvent.emit({data: true});
  }


}
