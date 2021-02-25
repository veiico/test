import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { AppService } from '../../../../../app.service';
import { LaundryLoyaltyComponent } from '../../../../../modules/apply-loyalty-points/components/laundry-loyalty/laundry-loyalty.component';
import { PopUpService } from '../../../../../modules/popup/services/popup.service';
import { LoaderService } from '../../../../../services/loader.service';
import { MessageService } from '../../../../../services/message.service';
import { SessionService } from '../../../../../services/session.service';
import { ValidationService } from '../../../../../services/validation.service';

@Component({
  templateUrl: '../../../../../modules/apply-loyalty-points/components/laundry-loyalty/laundry-loyalty.component.html',
  styleUrls: ['../../../../../modules/apply-loyalty-points/components/laundry-loyalty/laundry-loyalty.component.scss'],
})
export class DynamicLaundryLoyaltyComponent extends LaundryLoyaltyComponent implements OnInit {

  public _list;
  get list() { return this._list };
  @Input() set list(val: any) {
    this._list = val;
  };

  constructor(public sessionService: SessionService,
    public appService: AppService,
    public messageService: MessageService,
    protected popup: PopUpService,
    public formBuilder: FormBuilder,
    public validationService: ValidationService,
    protected loader: LoaderService) {
    super(sessionService, appService, messageService, popup, formBuilder, validationService, loader);
  }


  ngOnInit() {
    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngAfterViewInit()
  }

  ngAfterViewInit() {
    super.ngOnDestroy()
  }

}

