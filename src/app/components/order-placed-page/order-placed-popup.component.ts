import { Component, OnInit, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import { ModalType } from '../../constants/constant';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-order-placed-popup',
  templateUrl: './order-placed-popup.component.html',
  styleUrls: ['./order-placed-popup.component.scss']
})
export class OrderPlacedPopupComponent implements OnInit, OnDestroy {

  modalType: ModalType;
  appConfig;
  show: boolean;
  pageData: any;
  constructor( protected sessionService: SessionService)
  { }


  ngOnInit() {
    this.appConfig = this.sessionService.get('config');
    this.show = this.sessionService.get('OrderPlacedPage');
    if(this.show){
      this.pageData = this.sessionService.thankYouPageHtml ? this.sessionService.thankYouPageHtml : this.sessionService.get('thankYouPageHtml');
    }
  }

  hidePopUp()
  {
    this.show = false;
    this.sessionService.set('OrderPlacedPage', 0);
    this.sessionService.remove('thankYouPageHtml')
  }

  ngOnDestroy(){
    // this.show = false;
    // this.sessionService.set('OrderPlacedPage', 0);
    // this.sessionService.remove('thankYouPageHtml')
  }
}
