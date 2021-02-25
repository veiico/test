/**
 * Created by cl-macmini-51 on 17/07/18.
 */
import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ModalType } from '../../constants/constant';
// import { layer, slideup } from '../../../../animations/common.animation'

@Component({
  moduleId: module.id,
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // animations: [layer, slideup]
})
export class ModalComponent implements OnInit {
  @Input() header: string;
  @Input() minHeight: string = '';
  @Input() minWidth: string = '';
  @Input() modalType: string = ModalType.LARGE;
  @Input() showCross: boolean;
  @Output() onClose: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  onCloseClick(e) {
    this.onClose.emit(true);
  }

}
