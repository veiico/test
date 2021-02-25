import { FacComponent } from '../../../../modules/fac/fac.component';
import { Component, OnInit, AfterViewInit, OnDestroy, Input } from '@angular/core';
import { SessionService } from '../../../../services/session.service';
import { FacService } from '../../../../modules/fac/fac.service';
import { DomSanitizer } from '@angular/platform-browser';
import { LoaderService } from '../../../../services/loader.service';
import { Router } from '@angular/router';
import { AppService } from '../../../../app.service';
import { PopUpService } from '../../../../modules/popup/services/popup.service';
@Component({
  templateUrl: '../../../../modules/fac/fac.component.html',
  styleUrls: ['../../../../modules/fac/fac.component.scss']
})

export class DynamicFacComponent extends FacComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() NET_PAYABLE_AMOUNT: number;

  protected _triggerPayment;
  get triggerPayment() { return this._triggerPayment };
  @Input() set triggerPayment(val: any) {
    if (val) {
      this._triggerPayment = val;
    //   this.initFac();
    }
  };

  constructor(protected sessionService: SessionService,
    protected popup: PopUpService,
    public facService: FacService,
    public domSanitizer: DomSanitizer,
    public loader: LoaderService,
    public router: Router,
    protected appService: AppService) {
    super(sessionService, popup, facService, domSanitizer, loader, router, appService)
  }

  ngOnInit() {
    super.ngOnInit();
  }

  setConfig() {
    this.loginResponse = this.sessionService.get('appData');
    super.setConfig();
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
