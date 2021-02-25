import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { layer, scale } from '../../animations/common.animation';
import { SessionService } from '../../../../services/session.service';
@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  animations: [layer, scale]
})
export class AlertComponent implements OnInit {
  languageStrings: any={};
  @Input() header: string;
  @Input() message: string;
  @Input() buttonText: string = "Ok";
  @Output() okClick: EventEmitter<Event> = new EventEmitter<Event>();

  constructor(protected sessionService: SessionService) { 
 
  }

  ngOnInit() {
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
    });
  }

  onOkClick(e) {
    this.okClick.emit(e);
  }

  onEnterPress(e) {
    this.onOkClick(e);
  }

}
