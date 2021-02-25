import { AfterViewInit, Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { EventEmitter } from 'events';

import { AppService } from '../../../../../app.service';
import { PaymentHoldOverlayComponent } from '../../../../../components/payment-hold/components/hold-overlay/hold-overlay.component';
import { LoaderService } from '../../../../../services/loader.service';
import { MessageService } from '../../../../../services/message.service';
import { SessionService } from '../../../../../services/session.service';

@Component({
  templateUrl: '../../../../../components/payment-hold/components/hold-overlay/hold-overlay.component.html',
  styleUrls: ['../../../../../components/payment-hold/components/hold-overlay/hold-overlay.component.scss']
})

export class DynamicPaymentHoldOverlayComponent extends PaymentHoldOverlayComponent implements OnInit, OnDestroy, AfterViewInit {

  public _list;
  get list() { return this._list };
  @Input() set list(val: any) {
    this._list = val;
  };

  public _clickedFrom;
  get clickedFrom() { return this._clickedFrom };
  @Input() set clickedFrom(val: any) {
    this._clickedFrom = val;
  };

  constructor(public sessionService: SessionService,
    public appService: AppService,
    public messageService: MessageService,
    protected loader: LoaderService) {
    super(sessionService, appService, messageService, loader)
  }


  ngOnInit() {
    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
  }

}
