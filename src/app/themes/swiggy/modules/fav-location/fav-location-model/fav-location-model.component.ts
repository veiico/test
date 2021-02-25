import { Component, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FavLocationModelComponent } from '../../../../../components/fav-location/fav-location-model/fav-location-model.component';
import { FavLocationService } from '../../../../../components/fav-location/fav-location.service';
import { MessageService } from '../../../../../services/message.service';
import { LoaderService } from '../../../../../services/loader.service';
import { SessionService } from '../../../../../services/session.service';
import { ThemeService } from '../../../../../services/theme.service';
import { AppService } from '../../../../../app.service';



@Component({
    selector: 'fav-location-model',
    templateUrl: './fav-location-model.component.html',
    styleUrls: ['./fav-location-model.component.scss', '../../../../../components/fav-location/fav-location-model/fav-location-model.component.scss']
})
export class SwiggyFavLocationModelComponent extends FavLocationModelComponent {
    constructor(protected service: FavLocationService, protected messageService: MessageService,public appService: AppService,
        protected router: Router, protected loader: LoaderService, protected sessionService: SessionService,
        protected themeService: ThemeService, protected el: ElementRef
    ) {
        super(service, messageService,appService, router, loader, sessionService,  themeService, el);
    }
}
