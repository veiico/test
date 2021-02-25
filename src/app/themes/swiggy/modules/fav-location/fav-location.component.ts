

import { FavLocationComponent } from '../../../../components/fav-location/fav-location.component';
import { FavLocationService } from '../../../../components/fav-location/fav-location.service';
import { LoaderService } from '../../../../services/loader.service';
import { MessageService } from '../../../../services/message.service';
import { SessionService } from '../../../../services/session.service';
import { ThemeService } from '../../../../services/theme.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-fav',
  templateUrl: './fav-location.component.html',
  styleUrls: ['./fav-location.component.scss', '../../../../components/fav-location/fav-location.component.scss']
})
export class SwiggyFavLocationComponent extends FavLocationComponent {
  constructor(
    protected service: FavLocationService,
    protected messageService: MessageService,
    protected loader: LoaderService, protected sessionService: SessionService,
    protected themeService: ThemeService) {
    super(service, messageService, loader, sessionService, themeService);
  }
}
