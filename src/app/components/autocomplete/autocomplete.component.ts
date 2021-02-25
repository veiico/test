/**
 * Created by cl-macmini-51 on 17/07/18.
 */
import {
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
  Input,
  AfterViewInit,
  EventEmitter,
  Output
} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import {MapType} from '../../enums/enum'
import { ModalType } from '../../constants/constant';
import { AppService } from '../../app.service';
import { LoaderService } from '../../services/loader.service';
import { FetchLocationService } from '../fetch-location/fetch-location.service';
import { MessageService } from '../../services/message.service';
import { SessionService } from '../../services/session.service';
// declare var $: any;

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent implements OnInit, OnDestroy, AfterViewInit {
  terminology = {};
  public autoCompleteGoogleForm: FormGroup;
  public googleSearch: FormControl;
  @ViewChild('search')
  public searchElementRef: ElementRef;
  public getAddressFromMap: FormControl;
  @ViewChild('searchMapPop')
  public searchElementRefMapPop: ElementRef;
  public formattedAddress: string;
  public lat = 51.678418;
  public lng = 7.809007;
  public fetchingLocation;
  public config: any;
  public mapStyle: any;
  public modalType: ModalType = ModalType;
  public isEcomFlow: boolean;
  public languageSelected: any;
  public direction = 'ltr';
  public showTemplatePopup = false;
  public showPopOver = true;
  public langJson: any = {};
  @Input() hideMapIcon: any;
  public showFetchingLocationError = '';
  public infoMessage = false;
  public timeout: any;
  public placeholder = 'Please select a location';
  @Output() locationAutoFilled: EventEmitter<null> = new EventEmitter<null>();
  auxtoDetectOn: boolean = false;
  languageStrings: any={};
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
    this.initializeForm();
    this.checkForTranslation();
    if (this.sessionService.get('config').business_model_type === 'ECOM') {
      this.fetchLocationOnClickEcom();
    }
    else{
      if(this.sessionService.get('config').is_customer_location_enabled && !this.sessionService.locationTrigger){
        this.fetchLocationOnClickEcom();
        this.auxtoDetectOn = true;
        this.sessionService.locationTrigger = true;
      }
    }
  }

  fetchLocationOnClickEcom() {
    this.mapsAPILoader.load().then(() => {
      this.mapStyle = this.fetchLocationService.getMapStyle();
      this.getLocation();
    });
  }

  fetchLocationOnClick() {
    this.mapsAPILoader.load().then(() => {
      this.mapStyle = this.fetchLocationService.getMapStyle();
      this.timeout = setTimeout(() => {
        this.infoMessage = true;
        this.fetchingLocation = false;
        this.placeholder = this.terminology['SELECT_LOCATION_TEXT'] || 'Please select a location';
      }, 10000);
      this.getLocation();
    });
  }

  // =====================life cycles==========================
  ngOnInit() {
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
     this.placeholder = this.languageStrings.fetching_your_location || 'Fetching your location ....';
    });
    this.config = this.sessionService.get('config');
    this.terminology = this.config.terminology || {};
    this.placeholder = this.terminology['SELECT_LOCATION_TEXT'] || 'Please select a location';
    this.isEcomFlow =
      this.config.business_model_type === 'ECOM' &&
      this.config.nlevel_enabled === 2;
    if (!this.sessionService.getString('location') && this.config.latitude && this.config.home_screen_default_location) {
      this.formattedAddress = this.config.address;
      this.autoCompleteGoogleForm.controls.googleSearch.setValue(this.formattedAddress);
      this.lat = Number(this.config.latitude);
      this.lng = Number(this.config.longitude);
      // this.changePosition(1);
    }
    if (this.sessionService.get('location')) {
      this.changeLocation();

    }
    this.messageService.onLocationChange.subscribe(next => {
      this.changeLocation();
    })
  }
  changeLocation() {
    const location = this.sessionService.get('location');
    if (location) {
      this.lat = location.lat;
      this.lng = location.lng;
      this.formattedAddress = location.city;
      this.autoCompleteGoogleForm.controls.googleSearch.setValue(location.city);
    }
  }

  ngAfterViewInit() {
    // this.loadMapInitializer();
  }

  ngOnDestroy() { }

  // ==================form initailizer=======================
  initializeForm() {
    this.autoCompleteGoogleForm = new FormGroup({
      googleSearch: new FormControl('', [Validators.required])
    });
  }

  // ========================check for translations and direction======================
  async checkForTranslation() {
    if (this.sessionService.getString('language')) {
      this.languageSelected = this.sessionService.getString('language');
      if (this.languageSelected === 'ar') {
        this.direction = 'rtl';
      } else {
        this.direction = 'ltr';
      }
    } else {
      this.languageSelected = 'en';
      if (this.languageSelected === 'ar') {
        this.direction = 'rtl';
      } else {
        this.direction = 'ltr';
      }
    }
  }

  // ================get location from browser location event==================
  getLocation() {

    if (navigator.geolocation) {
      const geocoder = new google.maps.Geocoder();
      this.fetchingLocation = true;
      navigator.geolocation.getCurrentPosition(
        position => {
          const latlng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;

          //if flightmap is activated
          if (this.sessionService.get('config').map_object.map_type == MapType.FLIGHTMAP) {
            this.appService.flightmap_reverse_geocode(latlng).subscribe((results: any) => {
              if (results.status === 200) {
                this.placeholder = this.terminology['SELECT_LOCATION_TEXT'] || 'Please select a location';
                this.showFetchingLocationError = '';
                this.fetchingLocation = false;
                this.infoMessage = false;
                clearTimeout(this.timeout);
                this.autoCompleteGoogleForm.controls['googleSearch'].setValue(results.data.formatted_address);
                this.formattedAddress = results.data.formatted_address;
                this.sessionService.set('location', {
                  lat: latlng.lat,
                  lng: latlng.lng,
                  city: this.formattedAddress
                });
                this.messageService.sendLatlng(latlng.lat, latlng.lng);
                this.loader.hide();
                this.fetchingLocation = false;
                if(!this.auxtoDetectOn)
                  this.sendMessage(latlng.lat, latlng.lng, this.formattedAddress);
                else
                 this.auxtoDetectOn = false;
              }
              else {
                this.fetchingLocation = false;
                // window.alert('No results found');
              }
            })
          } else {
            //if google is activated
            geocoder.geocode({ location: latlng }, (results, status) => {
              this.ngZone.run(() => {
                this.onFetchLocationReverseGeocodeSuccess(status, results, latlng);
              });
            });
          }
        },
        error => {
          this.loader.hide();
          this.fetchingLocation = false;
          this.placeholder = this.terminology['SELECT_LOCATION_TEXT'] || 'Please select a location';
          this.showFetchingLocationError = error.message;
          clearTimeout(this.timeout);
          this.infoMessage = false;
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.log('User denied the request for Geolocation.');
              break;
            case error.POSITION_UNAVAILABLE:
              console.log('Location information is unavailable.');
              break;
            case error.TIMEOUT:
              console.log('The request to get user location timed out.');
              break;
          }
        }
      );
    } else {
      this.fetchingLocation = false;
      console.log('Geolocation is not supported by this browser.');
    }
  }

  private onFetchLocationReverseGeocodeSuccess(status: google.maps.GeocoderStatus, results: google.maps.GeocoderResult[], latlng: { lat: number; lng: number; }) {
    if (status.toString() === 'OK') {
      this.placeholder = this.terminology['SELECT_LOCATION_TEXT'] || 'Please select a location';
      this.showFetchingLocationError = '';
      this.fetchingLocation = false;
      this.infoMessage = false;
      clearTimeout(this.timeout);
      this.autoCompleteGoogleForm.controls['googleSearch'].setValue(results[0].formatted_address);
      this.formattedAddress = results[0].formatted_address;
      this.sessionService.set('location', {
        lat: latlng.lat,
        lng: latlng.lng,
        city: this.formattedAddress
      });
      this.messageService.sendLatlng(latlng.lat, latlng.lng);
      this.loader.hide();
      this.fetchingLocation = false;
      if(!this.auxtoDetectOn)
        this.sendMessage(latlng.lat, latlng.lng, this.formattedAddress);
      else
        this.auxtoDetectOn = false;
    }
    else {
      this.fetchingLocation = false;
      // window.alert('No results found');
    }
  }


  fetchViaIp() {
    const that = this;
    that.appService.getAddressFromIp().subscribe(
      response => {
        try {
          const lats = response.loc.split(',')[0];
          const lngs = response.loc.split(',')[1];
          that.lat = Number(response.loc.split(',')[0]);
          that.lng = Number(response.loc.split(',')[1]);
          // that.changePosition(1);
          // that.sendMessage(lats, lngs, response.city);
        } catch (e) {
          console.error(e);
        }
      },
      error => {
        console.error(error);
      }
    );
  }

  // ===================open map for better and accurate address==========================
  openMap() {
    if (this.sessionService.get('location')) {
      this.lat = this.sessionService.get('location').lat;
      this.lng = this.sessionService.get('location').lng;
      // this.mapAddressForm.controls['getAddressFromMap'].setValue(
      //   this.formattedAddress
      // );
    }

    // $('#mapDialog').modal({backdrop: 'static', keyboard: false});
    // $('#mapAddressDialog').modal('show');
    this.showTemplatePopup = true;

    // setTimeout(() => {
    //   this.initialMapAutoComplete();
    // }, 100);
  }

  /**
   * hide tmplate view modal
   */
  hideTempltePopup() {
    this.showTemplatePopup = false;
  }





  // ====================get proper address from change position=====================


  // ===============form check status=====================
  getFormStatus() {
    if (this.autoCompleteGoogleForm.invalid) {
      return false;
    } else {
      return true;
    }
  }

  // ===============send message for address selected=====================
  sendMessage(lat, lng, city): void {
    // send message to subscribers via observable subject
    this.fetchingLocation = false;
    this.sessionService.set('location', { lat: lat, lng: lng, city: city });
    this.messageService.sendLatlng(lat, lng);
    this.messageService.sendMessage(lat, lng, city, '');
  }

  // ================submit form==================
  onSubmit(form, event, name) { }

  onLatLngEvent(latlng: google.maps.LatLng | any) {
    this.infoMessage = false;
    this.showFetchingLocationError = '';
    clearTimeout(this.timeout);
    if (this.sessionService.get('config').map_object.map_type == MapType.GOOGLEMAP) {
      if (latlng) {
        this.formattedAddress = this.autoCompleteGoogleForm.controls[
          'googleSearch'
        ].value;
        this.lat = latlng.lat();
        this.lng = latlng.lng();
        if(!this.sessionService.noListPageRedirection)
          this.sendMessage(this.lat, this.lng, this.formattedAddress);
        else
          this.sessionService.noListPageRedirection = false;
      } else {
        this.clearLatLng();
      }
    } else {
      if (latlng) {
        this.formattedAddress = this.autoCompleteGoogleForm.controls[
          'googleSearch'
        ].value;
        this.lat = latlng.lat;
        this.lng = latlng.lng;
        if(!this.sessionService.noListPageRedirection)
          this.sendMessage(this.lat, this.lng, this.formattedAddress);
        else
          this.sessionService.noListPageRedirection = false;
      } else {
        this.clearLatLng();
      }

    }
  }

  clearLatLng() {
    this.formattedAddress = this.autoCompleteGoogleForm.controls[
      'googleSearch'
    ].value;
    this.lat = null;
    this.lng = null;

  }

  onMapPopupSave(data: any) {
    this.lat = data.lat;
    this.lng = data.lng;
    this.formattedAddress = data.city;
    this.autoCompleteGoogleForm.controls.googleSearch.setValue(this.formattedAddress);
    this.showTemplatePopup = false;
    // this.sendMessage(this.lat, this.lng, this.formattedAddress);

  }
}
