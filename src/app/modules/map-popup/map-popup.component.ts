import { Component, OnInit, Output, EventEmitter, NgZone, Input, ViewChild } from '@angular/core';
import { ModalType } from '../../constants/constant';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { SessionService } from '../../services/session.service';
import { FetchLocationService } from '../../components/fetch-location/fetch-location.service';
import { JwGoogleAutocompleteComponent } from '../jw-google-autocomplete/components/autocomplete/jw-google-autocomplete.component';
import { AppService } from '../../../app/app.service';
import { LoadScriptsPostAppComponentLoad } from '../../classes/load-scripts.class';
import { MapviewService } from '../map-view/map-view.service';
declare var mapboxgl;
@Component({
  selector: 'app-map-popup',
  templateUrl: './map-popup.component.html',
  styleUrls: ['./map-popup.component.scss']
})
export class MapPopupComponent implements OnInit {
  languageStrings: any={};
  modalType = ModalType;
  @Output('close') onClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output('save') onSave: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('search') searchElement: JwGoogleAutocompleteComponent

  mapStyle;
  public formSettings: any;
  is_google_map: boolean;
  flightmap;
  //formgroup
  public mapAddressForm: FormGroup;
  @Input() lat;
  @Input() lng;
  @Input() formattedAddress = "";
  public flightmaplatlng: any = {};
  public flightmapMarker: any;

  constructor(private fb: FormBuilder, private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone, private sessionService: SessionService,
    private fetchLocationService: FetchLocationService, private appService: AppService, private mapviewService:MapviewService) {
      
     }

  ngOnInit() {
    this.formSettings = this.sessionService.get('config');
    this.is_google_map = this.formSettings.map_object.map_type === 2 ? true : false;
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
    });
    if(!this.is_google_map){
      this.initializeFlightMap()
      this.flightmaplatlng['lat'] = this.lat
      this.flightmaplatlng['lng'] = this.lng
    }
    this.mapStyle = this.fetchLocationService.getMapStyle();
    this.initForm()
    if (!this.formattedAddress || this.formattedAddress.length < 2)
      this.getLocation();
    // this.changePosition(true);
  }

  private initForm() {
    this.mapAddressForm = this.fb.group({
      getAddressFromMap: [this.formattedAddress || '', [Validators.required]]
    });
  }

  hideTempltePopup() {
    this.onClose.emit(true);
  }

  async initializeFlightMap() {
    await LoadScriptsPostAppComponentLoad.loadFlightmapJs();
    mapboxgl.accessToken = this.formSettings.map_object.webapp_map_api_key;
    this.flightmap = new mapboxgl.Map({
      container: 'map',
      hash: false,
      style: this.formSettings.marketplace_user_id==147002? 'raster.json' : 'default.json', //only file name
      center: [76.768066, 30.741482],
      // minZoom: 8,
      maxZoom: 18,
    });
    this.generateFlightMapMarker(this.flightmaplatlng);
  }

  

  changePosition(noSave: boolean = false) {
    const latlng = { lat: this.lat, lng: this.lng };
    if(!this.is_google_map){
      // for flightmap
      this.mapviewService.flightmap_reverse_geocode(latlng).subscribe((res: any) => {
        this.changeFlightMapValues(res.data,latlng);
        this.sessionService.set('location', {
          lat: latlng.lat,
          lng: latlng.lng,
          city: this.formattedAddress
        });
        if (!noSave) {
          this.onSave.emit({
            lat: this.lat,
            lng: this.lng,
            city: this.formattedAddress
          });
        }
      })
    }else{
      this.mapsAPILoader.load().then(() => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: latlng }, (results, status) => {
          this.ngZone.run(() => {
            if (status.toString() === 'OK') {
              this.formattedAddress = results[0].formatted_address;
              this.mapAddressForm.controls['getAddressFromMap'].setValue(
                results[0].formatted_address
              );
              this.sessionService.set('location', {
                lat: this.lat,
                lng: this.lng,
                city: this.formattedAddress
              });
              let add = '';
              for (let i = 0; i < results[0].address_components.length; i++) {
                for (
                  let b = 0;
                  b < results[0].address_components[i].types.length;
                  b++
                ) {
                  if (
                    results[0].address_components[i].types[b] ===
                    'sublocality_level_1'
                  ) {
                    add += results[0].address_components[i].long_name;
                  }
                  if (results[0].address_components[i].types[b] === 'locality') {
                    add += ', ' + results[0].address_components[i].long_name;
                    break;
                  }
                }
              }
              // this.sendMessage(latlng.lat, latlng.lng, this.formattedAddress);
              // this.getRestaurants(this.lat, this.lng, add, this.formattedAddress);
              // if (!type) {
              this.sessionService.set('location', {
                lat: latlng.lat,
                lng: latlng.lng,
                city: this.formattedAddress
              });
              if (!noSave) {
                this.onSave.emit({
                  lat: this.lat,
                  lng: this.lng,
                  city: this.formattedAddress
                });
              }
              // $('#mapAddressDialog').modal('hide');
  
            }
          });
        });
      });
    }
  }
  // ===========marker drag from map and get position===================
  getDraggedPosition(data) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: data.coords }, (results, status) => {
      this.ngZone.run(() => {
        if (status.toString() === 'OK') {
          this.changeValues(results[0]);
        } else {
          // window.alert('No results found');
        }
      });
    });
  }


  generateFlightMapMarker(markerLatlng){
    const bounds = new mapboxgl.LngLatBounds();
    bounds.extend([parseFloat(markerLatlng.lng), parseFloat(markerLatlng.lat)])
    const el = document.createElement('div');
    el.className = 'marker-custom';
    el.innerHTML = `<span></span>`;
    el.draggable = true
    this.flightmapMarker = new mapboxgl.Marker(el, { draggable: true })
    .setLngLat([parseFloat(markerLatlng.lng), parseFloat(markerLatlng.lat)])
    .addTo(this.flightmap)
    this.flightmap.setCenter([parseFloat(markerLatlng.lng), parseFloat(markerLatlng.lat)])
    this.flightmap.setZoom(14)
    this.flightmapMarker.on('dragend', (res) => {
    var lngLat = this.flightmapMarker.getLngLat();
    this.mapviewService.flightmap_reverse_geocode(lngLat).subscribe((res: any) => {
      this.changeFlightMapValues(res.data,lngLat)
    })
    });
    this.flightmap.fitBounds(bounds, { padding: 40 ,duration: 0})
  }

  changeValues(data) {
    this.formattedAddress = data.formatted_address;
    this.lat = data.geometry.location.lat();
    this.lng = data.geometry.location.lng();
    this.searchElement.ctrl.control.markAsPristine();
    this.mapAddressForm.controls['getAddressFromMap'].setValue(
      this.formattedAddress
    );
  }
  changeFlightMapValues(data,lngLat){
    this.formattedAddress = data.address;
    this.lat = lngLat.lat;
    this.lng = lngLat.lng;
    this.searchElement.ctrl.control.markAsPristine();
    this.mapAddressForm.controls['getAddressFromMap'].setValue(
      this.formattedAddress
    );
  }

  onLatLngEvent(latlng: google.maps.LatLng) {
    if (this.is_google_map && latlng) {
      this.lat = latlng.lat();
      this.lng = latlng.lng();
      this.formattedAddress = this.searchElement.el.nativeElement.value;
    }else if(latlng){
      this.lat = latlng.lat;
      this.lng = latlng.lng;
      this.formattedAddress = this.searchElement.el.nativeElement.value;
      if(this.flightmapMarker){
        this.flightmapMarker.remove();
      }
      const LatLng = {
        lat: latlng.lat,
        lng: latlng.lng
      }
      this.generateFlightMapMarker(LatLng)
    }
  }
  clearLatLng() { }


  // ================get location from browser location event==================
  private getLocation() {
    if (navigator.geolocation) {
      const geocoder = new google.maps.Geocoder();
      navigator.geolocation.getCurrentPosition(
        position => {
          const latlng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          this.changePosition(true);
        },
        error => {
          this.fetchViaIp();
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
      console.log('Geolocation is not supported by this browser.');
      this.fetchViaIp();
    }
  }

  private fetchViaIp() {
    this.appService.getAddressFromIp().subscribe(
      response => {
        try {
          this.lat = Number(response.loc.split(',')[0]);
          this.lng = Number(response.loc.split(',')[1]);
          this.formattedAddress = response.city;
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
}
