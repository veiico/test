import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';

import { AppService } from '../../../../../app.service';
import { SubHeaderComponent } from '../../../../../components/catalogue/components/sub-header/sub-header.component';
import { SessionService } from '../../../../../services/session.service';

@Component({
  selector: 'app-sub-header-dynamic',
  templateUrl: './sub-header.component.html',
  styleUrls: ['./sub-header.component.scss']
})

export class DynamicSubHeaderComponent extends SubHeaderComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(public sessionService: SessionService, public appService: AppService) {
    super(sessionService, appService);
  }


  ngOnInit() {
    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

}
