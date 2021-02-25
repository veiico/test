import { Component, OnInit, ViewChild, ViewContainerRef, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicCompilerService } from '../../../services/dynamic-compiler.service';
import { SessionService } from '../../../services/session.service';
import { OrderPlacedPopupComponent } from '../../../components/order-placed-page/order-placed-popup.component';

@Component({
  templateUrl: '../../../components/order-placed-page/order-placed-popup.component.html',
  styleUrls: ['../../../components/order-placed-page/order-placed-popup.component.scss']
})
export class DynamicOrderPlacedPopupComponent extends OrderPlacedPopupComponent implements OnInit, OnDestroy {
  constructor(protected dynamicCompilerService: DynamicCompilerService, protected sessionService: SessionService) {
    super(sessionService);
  }

  ngOnInit() {
    super.ngOnInit()
  }
  
  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
