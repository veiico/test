import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ModalType } from '../../constants/constant';
import { AppService } from '../../app.service';
import { Router } from '@angular/router';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-customer-verification-popup',
  templateUrl: './customer-verification-popup.component.html',
  styleUrls: ['./customer-verification-popup.component.scss']
})
export class CustomerVerificationPopupComponent implements OnInit {
  
  public langJson: any
  modalType: ModalType;

  @Output() popUpClose = new EventEmitter<null>();
  languageStrings: any={};
  constructor(protected router: Router,public appService: AppService, public sessionService: SessionService) { }

  @Input() buttonText;
  
  ngOnInit() {
    this.sessionService.langStringsPromise.then(() =>
      {
       this.languageStrings = this.sessionService.languageStrings;
      });
  }

  onConfirmClick() {

    
    this.popUpClose.emit();
 

  }

}
