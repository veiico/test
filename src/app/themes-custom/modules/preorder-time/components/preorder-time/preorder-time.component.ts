import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppService } from '../../../../../app.service';
import { PopUpService } from '../../../../../modules/popup/services/popup.service';
import { PreorderTimeComponent } from '../../../../../modules/preorder-time/components/preorder-time/preorder-time.component';
import { SessionService } from '../../../../../services/session.service';


@Component({
  templateUrl: '../../../../../modules/preorder-time/components/preorder-time/preorder-time.component.html',
  styleUrls: ['../../../../../modules/preorder-time/components/preorder-time/preorder-time.component.scss']
})
export class DynamicPreorderTimeComponent extends PreorderTimeComponent implements OnInit {

  constructor(protected formBuilder: FormBuilder, protected popUpService: PopUpService,
    protected sessionService: SessionService, protected appService: AppService) {
    super(formBuilder, popUpService, sessionService, appService)
  }

}
