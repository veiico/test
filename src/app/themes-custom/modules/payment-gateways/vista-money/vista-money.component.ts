import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { AppService } from '../../../../app.service';
import { VistaComponent } from '../../../../modules/vista/vista.component';
import { VistaService } from '../../../../modules/vista/vista.service';
import { LoaderService } from '../../../../services/loader.service';
import { SessionService } from '../../../../services/session.service';
import { PopUpService } from '../../../../modules/popup/services/popup.service';

@Component({
  templateUrl: '../../../../modules/vista/vista.component.html',
  styleUrls: ['../../../../modules/vista/vista.component.scss']
})
export class DynamicVistaMoneyComponent extends VistaComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() loginResponse: any;
  @Input() NET_PAYABLE_AMOUNT: number;
  @Output() paymentMadeResponse: any = new EventEmitter();
  @Input() paymentFor: any;
  protected _triggerPayment;
  get triggerPayment() { return this._triggerPayment };
  @Input() set triggerPayment(val: any) {
    if (val) {
      this._triggerPayment = val;
      // this.initVistaMoney();
    }
  };


  constructor(protected sessionService: SessionService,
    protected popup: PopUpService,
    public vistaMoneyService: VistaService,
    public domSanitizer: DomSanitizer,
    public loader: LoaderService,
    public router: Router,
    protected appService: AppService) {
    super(sessionService,popup, vistaMoneyService, domSanitizer, loader, router, appService)
  }

  ngOnInit() {
    super.ngOnInit()
  }

  ngAfterViewInit() {
    super.ngAfterViewInit()
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

}
