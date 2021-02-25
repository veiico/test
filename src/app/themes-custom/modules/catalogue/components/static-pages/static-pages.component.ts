import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { StaticPagesComponent } from '../../../../../components/catalogue/components/static-pages/static-pages.component';
import { SessionService } from '../../../../../services/session.service';
import { AppService } from '../../../../../app.service';
import { CatalogueService } from '../../../../../components/catalogue/catalogue.service';

@Component({
  templateUrl: '../../../../../components/catalogue/components/static-pages/static-pages.component.html',
  styleUrls: ['../../../../../components/catalogue/components/static-pages/static-pages.component.scss']
})

export class DynamicStaticPagesComponent extends StaticPagesComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(public sessionService: SessionService,
    public appService: AppService,
    public catalogueService: CatalogueService) {
    super(sessionService, appService, catalogueService)
  }


  ngOnInit() {
    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
