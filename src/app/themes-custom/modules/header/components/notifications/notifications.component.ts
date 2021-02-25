import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NotificationsComponent } from '../../../../../components/header/components/notifications/notifications.component';
import { fadeInOutDOM } from './../../../../../animations/fadeInOut.animation';
import { AppService } from './../../../../../app.service';
import { HeaderService } from './../../../../../components/header/header.service';
import { MessageService } from './../../../../../services/message.service';
import { SessionService } from './../../../../../services/session.service';
@Component({
  templateUrl: "../../../../../components/header/components/notifications/notifications.component.html",
  styleUrls: ["../../../../../components/header/components/notifications/notifications.component.scss"],
  animations: [fadeInOutDOM]
})
export class DynamicNotificationsComponent extends NotificationsComponent implements OnInit {

  constructor(
    protected headerService: HeaderService,
    protected sessionService: SessionService,
    protected appService: AppService,
    protected messageService: MessageService,
    public router: Router
  ) {
    super(headerService, sessionService, appService, messageService, router);
  }

  ngOnInit() {
    super.ngOnInit();

  }


}
