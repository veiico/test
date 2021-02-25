import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';

import { ModalComponent } from '../../../components/modal/modal.component';
import { ModalType } from '../../../constants/constant';


@Component({
  templateUrl: '../../../components/modal/modal.component.html',
  styleUrls: ['../../../components/modal/modal.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class DynamicModalComponent extends ModalComponent implements OnInit {

  constructor() {
    super();
  }

  onCloseClick(e) {
    this.onClose.emit(true);
  }

}
