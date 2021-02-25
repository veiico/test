import { Component, OnInit, ViewChild, ChangeDetectorRef, forwardRef, ElementRef, Output, EventEmitter, AfterViewInit, Input, NgZone } from '@angular/core';
import { NgModel, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { debounceTime, distinctUntilChanged, takeWhile } from 'rxjs/operators';
import { JwGoogleAutocompleteService } from '../../service/jw-google-autocomplete.service';
import { MapsAPILoader } from '@agm/core';
import { GoogleMapsConfig } from '../../../../services/googleConfig';
import { SessionService } from '../../../../services/session.service';
import { AppService } from '../../../../app.service';
import { MessageService } from '../../../../services/message.service';
import {MapType} from '../../../../enums/enum'
import {  ActivatedRoute } from '@angular/router';
const COUNTER_CONTROL_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => JwGoogleAutocompleteComponent),
  multi: true
};
@Component({
  selector: 'app-jw-google-autocomplete',
  templateUrl: './jw-google-autocomplete.component.html',
  styleUrls: ['./jw-google-autocomplete.component.scss'],
  providers: [COUNTER_CONTROL_ACCESSOR],
})
export class JwGoogleAutocompleteComponent implements OnInit, ControlValueAccessor {
  languageStrings: any={};
  checkForYeloDomain: boolean;
  flightMapError: boolean;
  googleKeyError: any;
  googleApiError: boolean;
  @Output('latLng') latLng: EventEmitter<google.maps.LatLng> = new EventEmitter<google.maps.LatLng>();
  @Output('autocomlpeteResultSelect') autocomlpeteResultSelect: EventEmitter<google.maps.GeocoderResult> = new EventEmitter<google.maps.GeocoderResult>();
  @ViewChild('ctrl') ctrl: NgModel;
  @ViewChild('el') el: ElementRef;
  @Input('placeholder') placeholder: string;
  text: string;
  config: any;
  service: google.maps.places.AutocompleteService;
  alive: boolean = true;
  predictions: Array<google.maps.places.AutocompletePrediction> = [];
  is_google_map: boolean;
  //lat lng
  latitude: number;
  longitude: number;
  showLatLongLoader: boolean;

  onModelChange: Function;
  onTouch: Function;
  langJson: any;
  //key sroll
  scrollIndex: number = -1;

  constructor(private mapsAPILoader: MapsAPILoader,
    private ref: ChangeDetectorRef,
    private autocompleteService: JwGoogleAutocompleteService,
    private googleConfig: GoogleMapsConfig,
    public sessionService: SessionService,
    private ngZone: NgZone,
    private messageService: MessageService,
    private appService: AppService,
    private router: ActivatedRoute) {
     }

  async ngOnInit() {
    this.is_google_map = this.sessionService.get('config').map_object.map_type === MapType.GOOGLEMAP ? true : false;
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
    });
    if (!this.sessionService.isPlatformServer()) {
      this.config = this.sessionService.get('config');
      await this.mapsAPILoader.load();
      this.appService.langPromise.then(() => {
        this.langJson = this.appService.getLangJsonData();
        this.placeholder = this.langJson[this.placeholder] || this.placeholder;
      });

      await this.googleConfig.isIframeLoaded;
      this.initialize();
      this.checkForWhiteLabelDomain()
      if (!this.sessionService.getString('location') && this.config.latitude && this.config.home_screen_default_location) {
        this.latitude = Number(this.config.latitude);
        this.longitude = Number(this.config.longitude);
        this.getLocationOfMarketplace();
      }
      this.router.queryParams.subscribe(
        (data) => {
          if (data != null && data.lat && data.lng) {
            this.latitude = Number(data.lat.replace('_', '.'));
            this.longitude = Number(data.lng.replace('_', '.'));
            if (!isNaN(this.latitude) && !isNaN(this.longitude)) {
              this.getLocationOfMarketplace();
            }
          }
        });
    }

  }
  openApiKeyError()
  {
this.googleApiError=true;
  }
  async checkForWhiteLabelDomain()
  {
    const domainName=this.sessionService.get('config').domain_name
    if(domainName)
    {
     this.checkForYeloDomain= await this.sessionService.checkForYeloDomains(domainName);
    }
    this.googleKeyError = (this.config && this.is_google_map && !this.config.webapp_google_api_key && !this.checkForYeloDomain )?true:false;
    this.flightMapError = (this.config && !this.is_google_map &&  !this.config.map_object.webapp_map_api_key  && !this.checkForYeloDomain )?true:false;
  }

  onLocationSelect(prediction: google.maps.places.AutocompletePrediction) {
    this.el.nativeElement.value = prediction.description;
    // this.writeValue(prediction.description);
    this.onModelChange(this.el.nativeElement.value);
    // this.onTouch();
    this.predictions = [];
    this.scrollIndex = -1;
    this.ref.detectChanges();
    this.getLatlngByGeocoder(prediction.place_id);
  }

  onFlightmapLocationSelect(prediction: any) {
    this.el.nativeElement.value = prediction.address || prediction.description;
    this.onModelChange(this.el.nativeElement.value);
    this.predictions = [];
    this.ref.detectChanges();
    if (prediction.place_id) {
      ///use lightmap with google key
      this.autocompleteService.getLatLongFromPlaceId(prediction.place_id,this.config).subscribe((res: any) => {
        this.latitude = res.data.results[0].geometry.location.lat;
        this.longitude = res.data.results[0].geometry.location.lng;
        const latlng: any = { address: prediction.address, lat: this.latitude, lng: this.longitude };
        this.latLng.emit(latlng);
      })
    }
    else {
      this.latitude = prediction.lat;
      this.longitude = prediction.lng;
      const latlng: any = { address: prediction.address, lat: this.latitude, lng: this.longitude };
      this.latLng.emit(latlng);
    }

  }

  writeValue(value: string): void {
    this.text = value;
  }
  registerOnChange(fn: any) {
    this.onModelChange = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouch = () => {
      fn();
    };
  }

  outsideClick() {
    this.predictions = [];
    this.scrollIndex = -1;
    this.onModelChange(this.el.nativeElement.value);
    this.ref.detectChanges();
  }

  private getLatlngByGeocoder(placeId: string) {
    //get saved latlong first
    this.showLatLongLoader = true;
    new google.maps.Geocoder().geocode({
      'placeId': placeId,
    }, (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
      this.showLatLongLoader = false;
      const item = results[0];
      this.latitude = item.geometry.location.lat();
      this.longitude = item.geometry.location.lng();
      const latlng = new google.maps.LatLng(this.latitude, this.longitude);
      this.latLng.emit(latlng);
      this.autocomlpeteResultSelect.emit(item);

    });



  }

  /**
   * initialize autocomplete
   */
  private initialize() {
    if (this.is_google_map) {
      this.service = this.googleConfig.isSocomoKeyUsed ?
        new (this.googleConfig.iframeRef as any).google.maps.places.AutocompleteService()
        : new google.maps.places.AutocompleteService();
    }
    this.ctrl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged(), takeWhile(() => this.alive))
      .subscribe(data => {
        if (!data)
          this.latLng.emit(null);

        if (data && this.ctrl.dirty) {
          if (this.is_google_map)
            this.getPredictions(data);
          else
            this.getFlightmapPredictions(data)
        }
        else if (this.ctrl.dirty) {
          this.onModelChange(this.el.nativeElement.value);
        }



        // this.onModelChange(this.text);
      })
  }

  /**
   * get predictions on ngModelChange
   * @param input input string
   */
  private getPredictions(input) {
    let location;
    if (this.sessionService.get('location')) {
      location = new google.maps.LatLng(this.sessionService.get('location').lat, this.sessionService.get('location').lng);
    }
    let obj = {
      input: input,
    };
    if (location) {
      obj['location'] = location;
      obj['radius'] = 50000;
    }

    this.latLng.emit(null);
    this.service.getPlacePredictions(obj,
      (result: google.maps.places.AutocompletePrediction[], status: google.maps.places.PlacesServiceStatus) => {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          this.predictions = result;
          this.ref.detectChanges();
        }
      });
    this.onModelChange(input);
  }




  private getFlightmapPredictions(input) {
    this.config = this.sessionService.get('config');
    this.autocompleteService.getPredictions(input, this.config)
      .subscribe((res: any) => {
        this.predictions = res.data;

        this.ref.detectChanges();
      });
    this.onModelChange(input);
  }

  onKeyDown(e: KeyboardEvent) {
    this.openApiKeyError();
    switch (e.key) {
      case 'ArrowDown':
        this.onArrowDown(e);
        break;
      case 'ArrowUp':
        this.onArrowUp(e);
        break;
      case 'Enter':
        e.stopPropagation();
        e.preventDefault();
        this.onEnterEvent(e);
        break;
    }
  }

  private onArrowDown(e) {
    const len = this.predictions.length;
    if (this.scrollIndex == len - 1)
      return;
    this.scrollIndex++;
  }
  private onArrowUp(e) {
    if (this.scrollIndex == 0)
      return;
    this.scrollIndex--;
  }
  private onEnterEvent(e) {
    this.onLocationSelect(this.predictions[this.scrollIndex]);
    this.scrollIndex = -1;
  }

  /**
   * get location if don't have any
   */
  getLocationOfMarketplace() {
    this.mapsAPILoader.load().then(() => {
      const latlng = { lat: this.latitude, lng: this.longitude };
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: latlng }, (results, status) => {
        this.ngZone.run(() => {
          if (status.toString() === 'OK') {
            const item = results[0];
            this.sessionService.set('location', {
              lat: this.latitude,
              lng: this.longitude,
              city: results[0].formatted_address
            });
            this.messageService.sendLatlng(this.latitude, this.longitude);
            this.text = results[0].formatted_address;
            this.onModelChange(results[0].formatted_address);
            if(window.location.pathname == "/")
              this.sessionService.noListPageRedirection = true;
            this.latitude = item.geometry.location.lat();
            this.longitude = item.geometry.location.lng();
            const latlng = new google.maps.LatLng(this.latitude, this.longitude);
            this.latLng.emit(latlng);
            this.autocomlpeteResultSelect.emit(item);
          } else {
            // window.alert('No results found');
          }
        });
      });
    });
  }
}
