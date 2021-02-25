import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AppService } from '../../../app.service';
import { PopUpService } from '../../../modules/popup/services/popup.service';
import { QuickLookComponent } from '../../../modules/quickLook/quickLook.component';
import { LoaderService } from '../../../services/loader.service';
import { SessionService } from '../../../services/session.service';

@Component({
  templateUrl: '../../../modules/quickLook/quickLook.component.html',
  styleUrls: ['../../../modules/quickLook/quickLook.component.scss']
})
export class DynamicQuickLookComponent extends QuickLookComponent implements OnInit, AfterViewInit, OnDestroy {

  get productData() { return this._productData };
  @Input() set productData(val: any) {
    this._productData = val;
  };


  constructor(protected sessionService: SessionService,
    public loader: LoaderService,
    protected popup: PopUpService,
    protected appService: AppService) {
    super(sessionService, loader, popup, appService)
  }

  ngOnInit() {
    super.ngOnInit()
  }

}
