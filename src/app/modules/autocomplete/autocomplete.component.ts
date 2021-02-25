import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input,
  OnDestroy,
  NgZone
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  AbstractControl
} from '../../../../node_modules/@angular/forms';
import { IAutocompleteTemplate } from './interfaces/autocomplete.interface';
import { MapsAPILoader } from '@agm/core';
import { Router } from '../../../../node_modules/@angular/router';
import { ThemeService } from '../../services/theme.service';
import { SessionService } from '../../services/session.service';
import { ValidationService } from '../../services/validation.service';
import { Preview } from '../../themes/swiggy/modules/app/classes/preview.class';
import { GoogleAnalyticsEvent } from '../../enums/enum';
import { GoogleAnalyticsEventsService } from '../../services/google-analytics-events.service';
import { RestaurantsService } from '../../components/restaurants-new/restaurants-new.service';
import { LoaderService } from '../../services/loader.service';
import { MessageService } from '../../services/message.service';
import { AppService } from '../../app.service';
import {MapType} from '../../enums/enum'
declare var $: any;
@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent extends Preview
  implements OnInit, OnDestroy {
  languageStrings: any={};
  //global
  terminology = {};

  @Input() showDateRange: boolean;
  @ViewChild('search') searchElement: ElementRef;

  config: IAutocompleteTemplate;
  autoCompleteGoogleForm: FormGroup;
  public direction = 'ltr';
  public businessData: any;
  public appConfig: any;

  //location
  latLng: google.maps.LatLng;
  address: string;
  formattedAddress: string;
  lat: number;
  lng: number;

  //for rentals
  bsConfig = {};
  minDate = new Date();
  dateRangePlacement: string = 'top';
  public fetchingLocation;
  public showFetchingLocationError = '';
  public infoMessage = false;
  public timeout: any;
  public langJson: any = {};
  public placeholder: string;

  constructor(
    private fb: FormBuilder,
    private themeService: ThemeService,
    private validationService: ValidationService,
    private mapsAPILoader: MapsAPILoader,
    private router: Router,
    private loader: LoaderService,
    private sessionService: SessionService,
    private restaurantsService: RestaurantsService,
    private messageService: MessageService,
    private googleAnalyticsEventsService: GoogleAnalyticsEventsService,
    private el: ElementRef,
    private ngZone: NgZone,
    protected appService: AppService,
  ) {
    super(themeService);
  }

  ngOnInit() {
    this.appConfig = this.sessionService.get('config');
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
    });
    this.initAutocompleteForm();
    this.initThemeConfig();
    this.terminology = this.appConfig.terminology || {};
    // this.getUserLocation();
    this.setDirection();
    window['ac'] = this;

    if (!this.sessionService.isPlatformServer()) {
      this.mapsAPILoader.load().then(() => {
        this.defaultLatLng();
      })
    }
  }

  // ngAfterViewInit() {
  //   this.initGoogleAutocomplete();
  // }

  initAutocompleteForm() {
    const currentDate = new Date();
    const checkOutDate = new Date(
      currentDate.setDate(currentDate.getDate() + 1)
    );
    this.autoCompleteGoogleForm = this.fb.group({
      googleSearch: ['', [Validators.required]],
      checkInDate: [[new Date(), new Date(checkOutDate)]]
    });

    if (this.showDateRange) {
      const appSettings = this.sessionService.get('config');
      this.terminology = appSettings.terminology || {};
      this.autoCompleteWithDateRange();
      this.setDateRangePlacement();
    }
  }

  private setDateRangePlacement() {
    const matches = !this.sessionService.isPlatformServer() ? window.matchMedia('(min-width: 992px)').matches : true;
    if (!matches) {
      this.dateRangePlacement = 'bottom';
    } else {
      this.dateRangePlacement = 'top';
    }
  }

  private autoCompleteWithDateRange() {
    this.bsConfig = Object.assign(
      {},
      {
        containerClass: 'theme-dynamic',
        showWeekNumbers: false,
        dateInputFormat: 'LL'
      }
    );
    this.setCalenderValues();
  }

  private setCalenderValues() {
    let storeDate: any = this.sessionService.getString('dateFiltered');
    if (storeDate) {
      storeDate = JSON.parse(storeDate);
      storeDate.start = new Date(storeDate.start);
      storeDate.end = new Date(storeDate.end);

      const currentDate = new Date();

      const startDate = new Date(
        Date.UTC(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate()
        )
      );
      const endDate = new Date(
        Date.UTC(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() + 1
        )
      );

      if (storeDate.start < startDate) {
        storeDate.start = new Date(
          Date.UTC(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate()
          )
        );
      }
      if (storeDate.end < endDate) {
        storeDate.start = new Date(
          Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())
        );
      }

      this.autoCompleteGoogleForm.controls.checkInDate.setValue([
        storeDate.start,
        storeDate.end
      ]);
      this.sessionService.setString('dateFiltered', storeDate);
    }
  }

  initThemeConfig() {
    this.config = this.themeService.config.autoComplete;
    this.themeService.setNativeStyles(this.config.styles, this.el);
  }

  onSubmit() {
    if (!this.autoCompleteGoogleForm.valid) {
      return this.validationService.validateAllFormFields(
        this.autoCompleteGoogleForm
      );
    }
    try {
      if (this.sessionService.get('config').map_object.map_type == MapType.GOOGLEMAP) {
        this.sessionService.set('location', {
          lat: this.latLng.lat(),
          lng: this.latLng.lng(),
          city: this.autoCompleteGoogleForm.get('googleSearch').value || this.address
        });
        this.messageService.sendLatlng(this.latLng.lat(), this.latLng.lng());
      }
      else {
        this.sessionService.set('location', {
          lat: this.latLng.lat,
          lng: this.latLng.lng,
          city: this.autoCompleteGoogleForm.get('googleSearch').value || this.address
        });
        this.messageService.sendLatlng(this.latLng.lat, this.latLng.lng);
      }

      const range: Array<Date> = this.autoCompleteGoogleForm.controls
        .checkInDate.value;
      const startDate = new Date(
        Date.UTC(
          range[0].getFullYear(),
          range[0].getMonth(),
          range[0].getDate()
        )
      );
      const endDate = new Date(
        Date.UTC(
          range[1].getFullYear(),
          range[1].getMonth(),
          range[1].getDate()
        )
      );
      const storeDate = {
        start: startDate,
        end: endDate
      };
      this.sessionService.setString('dateFiltered', storeDate);
    } catch (e) {
      console.error(e);
    } finally {
      this.googleAnalyticsEventsService.emitEvent(
        GoogleAnalyticsEvent.find_business,
        'List', '', ''
      );


      if (this.sessionService.get('config').is_customer_login_required && !this.sessionService.get('appData')) {
        this.router.navigate(['custom-login'], { skipLocationChange: true });
        try {
          $('#loginDialog').modal('show');
          this.loader.hide();
        } catch (error) {
          console.error(error);
        }
      } else {
        if (this.businessData && this.businessData.length === 1) {
          this.navigate(this.businessData[0]);
        } else {
          this.router.navigate([this.config.data.navigate_to]);
        }
      }


    }
  }
  /**
   * init google autocomplete for textbox
   */
  // initGoogleAutocomplete() {
  //   this.mapsAPILoader.load().then(() => {
  //     const autocomplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement, {
  //     });
  //     autocomplete.addListener('place_changed', () => {
  //       // this.ngZone.run(() => {
  //       const place: google.maps.places.PlaceResult = autocomplete.getPlace();
  //       this.latLng = place.geometry.location;
  //       this.autoCompleteGoogleForm.controls.googleSearch.setValue(this.searchElement.nativeElement.value);
  //       this.address = this.searchElement.nativeElement.value;
  //       // });
  //     });
  //   });
  // }

  /**
   * get user location using location api
   */
  getUserLocation() {
    this.timeout = setTimeout(() => {
      this.infoMessage = true;
    }, 10000);
    this.appService.langPromise.then(() => {
      this.langJson = this.appService.getLangJsonData();
      this.placeholder = this.langJson['Fetching your location ....'] || 'Fetching your location ....';
    });

    this.mapsAPILoader.load().then(() => {
      if (navigator.geolocation) {
        this.fetchingLocation = true;
        navigator.geolocation.getCurrentPosition(
          position => {
            this.latLng = new google.maps.LatLng(
              position.coords.latitude,
              position.coords.longitude
            );
            const latlng = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            if (this.sessionService.get('config').map_object.map_type == MapType.GOOGLEMAP) {
              this.getAddressFromLatLng(this.latLng);
            } else {
              this.appService.flightmap_reverse_geocode(latlng).subscribe((results: any) => {
                if (results.status === 200) {
                  this.placeholder = this.terminology['SELECT_LOCATION_TEXT'] || 'Please  location';
                  // this.placeholder = 'Please select a location';
                  this.showFetchingLocationError = '';
                  this.fetchingLocation = false;
                  this.infoMessage = false;
                  clearTimeout(this.timeout);
                  this.address = results.data.formatted_address;
                  this.autoCompleteGoogleForm
                    .get('googleSearch')
                    .setValue(this.address);
                  this.getRestaurants(this.latLng.lat, this.latLng.lng, '', this.address);
                } else {
                  this.fetchingLocation = false;
                }
              })
            }
          },
          error => {
            this.fetchingLocation = false;
            this.placeholder = this.terminology['SELECT_LOCATION_TEXT'] || 'Please select a ';
            // this.placeholder = 'Please select a location' ;
            this.showFetchingLocationError = error.message;
            this.infoMessage = false;
            clearTimeout(this.timeout);
            console.error(error.message);
          }
        );
      }
    });
  }

  /**
   * get address from lat lng using geocoder service
   * @param latLng google.maps.LatLng object
   */
  getAddressFromLatLng(latLng: google.maps.LatLng) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: latLng }, (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
      this.ngZone.run(() => {
        if (status === google.maps.GeocoderStatus.OK) {
          this.placeholder = this.terminology['SELECT_LOCATION_TEXT'] || 'Please  location';
          // this.placeholder = 'Please select a location';
          this.showFetchingLocationError = '';
          this.fetchingLocation = false;
          this.infoMessage = false;
          clearTimeout(this.timeout);
          this.address = results[0].formatted_address;
          this.autoCompleteGoogleForm
            .get('googleSearch')
            .setValue(this.address);
          this.getRestaurants(this.latLng.lat(), this.latLng.lng(), '', this.address);
        } else {
          this.fetchingLocation = false;
        }
      });
    }
    );
  }

  setDirection() {
    const direction = this.sessionService.getString('language');
    if (direction === 'ar') {
      this.direction = 'rtl';
    } else {
      this.direction = 'ltr';
    }
  }

  clearLatLng() {
    this.latLng = null;
    this.address = '';
  }
  onLatLngEvent(latlng: google.maps.LatLng | any, fc: FormControl | AbstractControl) {
    this.infoMessage = false;
    this.showFetchingLocationError = '';
    clearTimeout(this.timeout);
    if (this.sessionService.get('config').map_object.map_type == MapType.GOOGLEMAP) {
      if (latlng) {
        this.latLng = latlng;
        this.address = fc.value;
        this.getRestaurants(this.latLng.lat(), this.latLng.lng(), '', this.address);
      } else {
        this.clearLatLng();
      }
    } else {
      if (latlng) {
        this.latLng = latlng;
        this.address = fc.value;
        this.getRestaurants(this.latLng.lat, this.latLng.lng, '', this.address);
      } else {
        this.clearLatLng();
      }
    }
  }

  ngOnDestroy() {
    this.alive = false;
  }

  /**
   * get restaurant list
   */
  getRestaurants(lat, lng, city, search) {
    this.loader.show();
    const obj = {
      'marketplace_reference_id': this.sessionService.get('config').marketplace_reference_id,
      'marketplace_user_id': this.sessionService.get('config').marketplace_user_id,
      'latitude': lat,
      'longitude': lng,
      'search_text': search
    };
    if (this.sessionService.get('appData')) {
      obj['vendor_id'] = this.sessionService.get('appData').vendor_details.vendor_id;
      obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
    }
    this.restaurantsService.getRestaurants(obj)
      .subscribe(
        response => {
          try {
            if (response.status === 200) {
              this.businessData = response.data;
              this.sessionService.setToString('available_stores', response.data.length);
              this.sessionService.setToString('no_of_stores', response.data.length);
              this.sessionService.set('stores', response.data);
              this.onSubmit();
            } else if (response.status === 400) {
            }
          } catch (e) {
            console.error(e);
          }
          this.loader.hide();
        },
        error => {
          console.error(error);
        }
      );
  }

  /**
   * navigate
   */
  navigate(item) {
    this.sessionService.set('info', item);
    this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.restaurant_click, item.store_name, '', '');

    this.messageService.clearCartOnly();
    this.sessionService.remove('preOrderTime');
    this.router.navigate(['store', item.storepage_slug || '-', item.storefront_user_id]);
  }

  /**
   * make default lant lngs
   */
  defaultLatLng() {
    if (!this.sessionService.getString('location') && this.appConfig.latitude && this.appConfig.home_screen_default_location) {
      this.formattedAddress = this.appConfig.address;
      this.autoCompleteGoogleForm.controls.googleSearch.setValue(this.formattedAddress);
      this.lat = Number(this.appConfig.latitude);
      this.lng = Number(this.appConfig.longitude);
      this.latLng = new google.maps.LatLng(
        this.lat,
        this.lng
      );
      // this.changePosition(1);
    } else {
      let location = this.sessionService.get('location');
      if (location) {
        this.formattedAddress = this.sessionService.get('location').city;
        this.autoCompleteGoogleForm.controls.googleSearch.setValue(this.formattedAddress);
        this.lat = Number(this.sessionService.get('location').lat);
        this.lng = Number(this.sessionService.get('location').lng);
        this.latLng = new google.maps.LatLng(
          this.lat,
          this.lng
        );
      }

    }
  }
}
