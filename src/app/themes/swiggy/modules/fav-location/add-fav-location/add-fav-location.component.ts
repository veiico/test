import { Component, NgZone } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { Router } from '@angular/router';
import { AddFavLocationComponent } from '../../../../../components/fav-location/add-fav-location/add-fav-location.component';
import { FavLocationService } from '../../../../../components/fav-location/fav-location.service';
import { MessageService } from '../../../../../services/message.service';
import { LoaderService } from '../../../../../services/loader.service';
import { SessionService } from '../../../../../services/session.service';
import { PopupModalService } from '../../../../../modules/popup/services/popup-modal.service';
import { AppService } from '../../../../../app.service';

@Component({
    selector: 'add-fav-location',
    templateUrl: './add-fav-location.component.html',
    styleUrls: ['./add-fav-location.component.scss','../../../../../components/fav-location/add-fav-location/add-fav-location.component.scss']
})
export class SwiggyAddFavLocationComponent extends AddFavLocationComponent {

    constructor(protected formBuilder: FormBuilder,
        protected service: FavLocationService,
        protected mapsAPILoader: MapsAPILoader, protected ngZone: NgZone, protected messageService: MessageService,
        protected router: Router, protected loader: LoaderService, protected sessionService: SessionService, protected popup: PopupModalService,protected appService: AppService,) {
            super(formBuilder, service, mapsAPILoader, ngZone, messageService, router, loader, sessionService, popup,appService);
    }

}
