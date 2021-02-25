import { Component, OnInit, NgZone } from '@angular/core';
import { AutocompleteComponent } from '../../../../app/components/autocomplete/autocomplete.component';
import { MapsAPILoader } from '@agm/core';
import { SessionService } from '../../../../app/services/session.service';
import { Router } from '@angular/router';
import { AppService } from '../../../../app/app.service';
import { LoaderService } from '../../../../app/services/loader.service';
import { FetchLocationService } from '../../../../app/components/fetch-location/fetch-location.service';
import { MessageService } from '../../../../app/services/message.service';

@Component({
  // selector: 'app-dynamic-autocomplete',
  templateUrl: '../../../../app/components/autocomplete/autocomplete.component.html',
  styleUrls: ['../../../../app/components/autocomplete/autocomplete.component.scss']
})
export class DynamicAutocompleteComponent extends AutocompleteComponent implements OnInit {
 
  constructor(
    protected mapsAPILoader: MapsAPILoader,
    protected ngZone: NgZone,
    protected sessionService: SessionService,
    protected router: Router,
    protected appService: AppService,
    protected loader: LoaderService,
    protected fetchLocationService: FetchLocationService,
    protected messageService: MessageService
  ) {
    super(mapsAPILoader,
      ngZone,
      sessionService,
      router,
      appService,
      loader,
      fetchLocationService,
      messageService)
   }
 
  ngOnInit() {
    super.ngOnInit();
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
  }


}
