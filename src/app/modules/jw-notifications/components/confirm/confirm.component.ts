import { Component, OnInit } from '@angular/core';
import { layer, scale } from '../../animations/common.animation'
import { ConfirmationService } from '../../services/confirmation.service';
import { SessionService } from '../../../../services/session.service';
@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss', '../alert/alert.component.scss'],
  animations: [layer, scale]

})
export class ConfirmComponent implements OnInit {

  languageStrings: any={};
  constructor(public confirmationService: ConfirmationService,protected sessionService: SessionService) {

   }

  ngOnInit() {
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
    });
  }


  onYesClick(e) {
    this.confirmationService.onAccept();
  }

  onNoClick(e) {
    this.confirmationService.onReject();
  }

}
