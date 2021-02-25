import { Component, EventEmitter, Output } from '@angular/core';

import { AppService } from '../../../app.service';
import { GoogleLoginComponent } from '../../../components/google-login/google-login.component';
import { GoogleLoginService } from '../../../components/google-login/google-login.service';
import { PopupModalService } from '../../../modules/popup/services/popup-modal.service';
import { GoogleAnalyticsEventsService } from '../../../services/google-analytics-events.service';
import { LoaderService } from '../../../services/loader.service';
import { MessageService } from '../../../services/message.service';
import { SessionService } from '../../../services/session.service';

@Component({
    templateUrl: '../../../components/google-login/google-login.component.html',
    styleUrls: ['../../../components/google-login/google-login.component.scss']
})


export class DynamicGoogleLoginComponent extends GoogleLoginComponent {
    @Output() googleInfoEvent: EventEmitter<any> = new EventEmitter<any>();
    constructor(protected sessionService: SessionService,
        protected loader: LoaderService,
        protected popup: PopupModalService,
        public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
        public googleLoginService: GoogleLoginService, protected messageService: MessageService, protected appService: AppService) {

        super(sessionService, loader, popup, googleAnalyticsEventsService, googleLoginService, messageService, appService)

    }

    ngAfterViewInit() {
        if (!this.sessionService.isPlatformServer())
            this.googleInit();

        super.ngAfterViewInit()
    }
}
