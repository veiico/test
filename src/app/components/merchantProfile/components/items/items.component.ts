import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemsComponent implements OnInit {

  @Input('fields') fields = [];
  @Output() imagePopup: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }

  openImagePopup(data){
    this.imagePopup.emit(data);
  }
}
