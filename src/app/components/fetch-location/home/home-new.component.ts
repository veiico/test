import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {LoaderService} from "../../../services/loader.service";
import {SessionService} from "../../../services/session.service";
import {FetchLocationComponent} from "../fetch-location.component";
import {MessageService} from "../../../services/message.service";
import {ThemeService} from "../../../services/theme.service";
import {LoginService} from "../../login/login.service";
import {GoogleAnalyticsEventsService} from "../../../services/google-analytics-events.service";
import {AppService} from "../../../app.service";
import {PopupModalService} from "../../../modules/popup/services/popup-modal.service";
import {RestaurantsService} from "../../restaurants-new/restaurants-new.service";
import {BsLocaleService} from "ngx-bootstrap/datepicker";
import {ExternalLibService} from "../../../services/set-external-lib.service";
import { slideInOutState } from '../../../../app/animations/slideInOut.animation';
import { BusinessCategoriesService } from '../../restaurants-new/components/business-categories/business-categories.service';
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'app-home-new',
  templateUrl: './home-new.component.html',
  styleUrls: ['./home-new.component.scss'],
  animations: [slideInOutState]
})
export class HomeNewComponent extends FetchLocationComponent implements OnInit, OnDestroy {

  constructor(public loader: LoaderService, public sessionService: SessionService,
              public ngZone: NgZone, public messageService: MessageService,
              public router: Router,
              public themeService: ThemeService,
              public loginService: LoginService, public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
              public appService: AppService, public popup: PopupModalService, public restaurantService: RestaurantsService,
              public localeService: BsLocaleService, public extService: ExternalLibService,protected activatedRoute: ActivatedRoute,protected domSanitizer: DomSanitizer, protected businessCategoriesService: BusinessCategoriesService) {
    super(loader, sessionService, ngZone, messageService, router, themeService, loginService, googleAnalyticsEventsService, appService, popup, restaurantService, localeService, extService,activatedRoute,domSanitizer, businessCategoriesService);
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  ngOnInit() {
    super.ngOnInit();
  }
}
