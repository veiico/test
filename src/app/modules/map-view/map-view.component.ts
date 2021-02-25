import {
  Component, OnInit, Output, EventEmitter, NgZone, Input,
  ViewChild, AfterViewInit,
  OnDestroy, ElementRef, ChangeDetectorRef
} from '@angular/core';
import { ModalType } from '../../constants/constant';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { SessionService } from '../../services/session.service';
import { FetchLocationService } from '../../components/fetch-location/fetch-location.service';
import { JwGoogleAutocompleteComponent } from '../jw-google-autocomplete/components/autocomplete/jw-google-autocomplete.component';
import { AppService } from '../../../app/app.service';
import { MessageService } from '../../services/message.service';
import { PopUpService } from '../../modules/popup/services/popup.service';
import { GoogleAnalyticsEventsService } from '../../services/google-analytics-events.service';
import { GoogleAnalyticsEvent } from '../../enums/enum';
import { Router } from '@angular/router';
import { takeWhile, debounceTime, map } from 'rxjs/operators';
import { ThemeService } from '../../services/theme.service';
import { MapviewService } from './map-view.service';
import { LoadScriptsPostAppComponentLoad } from '../../classes/load-scripts.class';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material';

declare var mapboxgl;
@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements OnInit,AfterViewInit, OnDestroy {
  languageStrings: any={};
  selected_pointer: number = 0;
  popupInfoData: any = [];
  show_popup: boolean = false;
  // popupInfoData: any = {};
  selectedMarkerIndex: number;
  // show_popup: boolean = false;
  intialZoom: number = 12;
  zoom1: number;
  zoom2: number;
  businessId: any;
  restaurantData: any;
  mapRadius: any;
  public deliveryMode: any;
  public formSettings: any;
  infoWindowOpened: any;
  previous_info_window: any;
  bussinessData: any;
  address_limit: number = 10;
  public alive: boolean = true
  map;
  iconUrl = {
    url: 'assets/img/dot-marker.png',
    url2: 'assets/img/markerImage.png',
    current_loc: 'assets/img/bluedotMarker.png'
  };
  modalType = ModalType;
  @ViewChild('search') searchElement: JwGoogleAutocompleteComponent;
  @ViewChild('AgmMap') mapElement: AgmMap;
  @ViewChild('infoWindow') infoWindow: any;

  mapStyle;
  _lat: number
  _lng: number
  public mapAddressForm: FormGroup;
  is_google_map: boolean;
  @Input() set lat(val: number) {
    if (val) {
      this._lat = +val;
    }
    // console.log(val)
  };

  get lat() { return this._lat }
  @Input() set lng(val: number) {
    if (val) {
      this._lng = +val;
    }
    // console.log(val)
  };
  get lng() { return this._lng }
  @Input() formattedAddress = "";
  languageSelected: string;
  direction: string;
  langJson: any;
  terminology: any;
  config: any;
  currency: any;
  businessEnabled: boolean;
  isPlatformServer: boolean;
  hideClosedPreorder: boolean;
  content: any;
  boundCounter: boolean = false;
  mapRadius2: number;
  mapRadius1: number;

  mapChangeEvent: EventEmitter<any> = new EventEmitter<any>();
  flightmapMarkers = [];

  constructor(protected themeService: ThemeService, protected fb: FormBuilder, protected mapsAPILoader: MapsAPILoader,
    protected ngZone: NgZone, protected sessionService: SessionService, protected messageService: MessageService,
    protected fetchLocationService: FetchLocationService, protected mapviewService: MapviewService, protected appService: AppService, protected popupService: PopUpService,
    protected googleAnalyticsEventsService: GoogleAnalyticsEventsService, protected router: Router, protected el: ElementRef, protected cdref: ChangeDetectorRef) {
    
    this.setConfig();
    this.setLanguage();
    this.messageService.getLatlng.pipe(takeWhile(() => this.alive)).subscribe(val => {
      this.lat = val.lat;
      this.lng = val.lng;
    });
    const location = this.sessionService.get('location');
    if(!this.lat){
      this.lat =  location.lat;
      this.lng =  location.lng;
    }
    this.messageService.getBussinessData.pipe(takeWhile(() => this.alive)).subscribe(data => {
      this.previous_info_window = undefined;
      this.infoWindowOpened = undefined;
      this.bussinessData = data.data;
      //Todo: google
      // this.mapElement._mapsWrapper.setZoom(this.intialZoom);
      // this.zoom1 = this.intialZoom;
      // document.getElementById("agmMapHeight").style.height = "100%";
      // console.log(this.bussinessData, "data:", data);
      this.addFlightmapMarkers();
      this.googleMapFitBounds();
    });
    this.messageService.sendCategoryNameLabel.pipe(takeWhile(() => this.alive)).subscribe(data => {
      //Todo: google
      //this.mapElement._mapsWrapper.setZoom(this.intialZoom);

    });

    this.mapChangeEvent.pipe(debounceTime(200), takeWhile(() => this.alive)).subscribe((event) => {
      this.getMerchantHit(event);
    });
  }

  ngOnInit() {
    this.formSettings = this.sessionService.get('config');
    this.terminology = this.formSettings.terminology;
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
     this.setLangKeys();
    });
    this.is_google_map = this.formSettings.map_object.map_type === 2 ? true : false;
    if (this.is_google_map) {
      this.zoom1 = this.intialZoom;
      if (this.sessionService.get('location')) {
        this.lat = this.sessionService.get('location').lat;
        this.lng = this.sessionService.get('location').lng;
      }
      this.mapStyle = this.fetchLocationService.getMapStyle();
      this.subscriptionForListeningBusinessCategory();
      this.bussinessData = this.sessionService.get('stores');
      this.isPlatformServer = this.sessionService.isPlatformServer();
      this.hideClosedPreorder = this.config.marketplace_user_id === 60863;
      this.themeService.getThemeModuleData('storeCard').subscribe(res => {
        this.onPreview(res);
      });
    }
    else {
      this.bussinessData = this.sessionService.get('stores');
      //handle FM in after view init

      // if (mapboxgl && !this.is_google_map) {
      //   const flightmapBounds = new mapboxgl.LngLatBounds();
      //   flightmapBounds.extend([this.lng, this.lat]);
      //   this.boundsChange(flightmapBounds);
      //   //this.map.fitBounds(flightmapBounds, { padding: 40 })
      //   // this.map.flyTo({ center: [this.lng, this.lat], essential: true })
      // }


    }

    this.cdref.detectChanges();
  }
  setLangKeys() {
    this.languageStrings.view_menu = (this.languageStrings.view_menu || 'View Menu').replace('MENU_MENU', this.terminology.MENU);
    this.languageStrings.we_donot_serve_in_your_delivery_areas_please_update_the_location = (this.languageStrings.we_donot_serve_in_your_delivery_areas_please_update_the_location || 'We dont serve in your Delivery areas. Please update the location.').replace('DELIVERY_DELIVERY', this.terminology.DELIVERY);
    this.languageStrings.no_product_available = (this.languageStrings.no_product_available || 'No Product Available.')
    .replace('PRODUCT_PRODUCT', this.terminology.PRODUCT);
  }
  ngAfterViewInit(){
    //initialize FM
    if (!this.is_google_map)
      this.initializeMap();
    else {
      this.mapElement.mapReady.subscribe(map => {
        this.map = map;
        this.googleMapFitBounds();
      });
    }
    window['x']=this;
    let el = document.getElementById("filters");
    el.scrollIntoView();

  }

  onPreview(data) {
    if (data.preorder_tag) {
      this.content = data;
      this.themeService.setNativeStyles(this.content.show_location.styles, this.el);
      this.themeService.setNativeStyles(this.content.show_rating.styles, this.el);
    }
  }

  private googleMapFitBounds(){
    if(!this.is_google_map || !this.map) return;

    const bounds = new google.maps.LatLngBounds();
    if(this.bussinessData)
    {
      for (const mm of this.bussinessData) {
        bounds.extend(new google.maps.LatLng(mm.latitude, mm.longitude));
      }
    }
    else{
      bounds.extend(new google.maps.LatLng(this.lat, this.lng));
    }

    this.map.fitBounds(bounds);
  }


  private addFlightmapMarkers() {
    // let zoom = this.lat ? 12: 1;
    if(this.is_google_map || !this.map) return;
    // this.map.on('load', res => {
    //   this.map.setZoom(12)
    // })
    var popup = new mapboxgl.Popup({ offset: 50, anchor: 'bottom' })
    // this.map.setZoom(0)
    const bounds = new mapboxgl.LngLatBounds();
    this.removeAllFlightmapMarkers();
    if(this.bussinessData && this.bussinessData.length)
    {
      this.bussinessData.forEach((item, index) => {
        bounds.extend([item.longitude, item.latitude])
        const el = document.createElement('div');
        el.className = 'marker-custom';
        el.innerHTML = `<span></span>`;
        const marker = new mapboxgl.Marker(el)
          .setLngLat([item.longitude, item.latitude])
          .addTo(this.map);
        this.flightmapMarkers.push(marker);
        el.addEventListener('click', (res: any) => {
          marker.setPopup(popup);
          this.setPopupContent(popup, item, index);

          this.map.setCenter([item.longitude, item.latitude])
          this.map.setZoom(14)
        });
      });
      this.map.fitBounds(bounds, { padding: 40 ,duration: 0})
    }

  }

  private removeAllFlightmapMarkers(){
    this.flightmapMarkers.forEach(marker=>marker.remove());
  }

  private setPopupContent(popup, item, index) {
    popup.setHTML(
      this.createPopupHtml(item, index)
    );
    setTimeout(() => {
      const element = document.getElementById('viewPopUpId-' + index);
      if (element) {
        element.addEventListener('click', () => {
          this.navigate(item);
        });
      }

      const next = document.getElementById('popup-next');
      const previous = document.getElementById('popup-previous');
      if (next) {
        next.addEventListener('click', () => {
          this.changeMarkerContent(1);
          this.setPopupContent(popup, this.popupInfoData[this.selected_pointer], this.selected_pointer);
        });

      }
      if (previous) {
        previous.addEventListener('click', () => {
          this.changeMarkerContent(0);
          this.setPopupContent(popup, this.popupInfoData[this.selected_pointer], this.selected_pointer);
        });
      }

    });
  }

  private createPopupHtml(item: any, index: any): any {

    const tempData = this.bussinessData.filter((col) => {
      return col.latitude === item.latitude && col.longitude === item.longitude;
    });
    this.popupInfoData = JSON.parse(JSON.stringify(tempData));
    return `
    <div class="card" >
    <div class="card_inner">
    <div class="card_image">
    <img class="card_image_view"
    src="${item && item.thumb_url}"
    alt="logo">
    </div>
    <div class="card_right">
    <div class="top-div">
    <p class="card_heading marginBottomStore">${item && item.store_name}</p>
    ${tempData.length > 1 && this.selected_pointer != 0 ? '<i id="popup-previous" class="fa fa-arrow-circle-left fa-lg" aria-hidden="true" style="cursor: pointer;position:absolute;top:30px;right:-1px; "></i>' : ''} 
    ${tempData.length > 1 && this.selected_pointer != tempData.length - 1 ? '<i id="popup-next" class="fa fa-arrow-circle-right fa-lg" style="cursor: pointer;position:absolute;top:30px;right:-18px" aria-hidden="true"></i> ' : ''}
    </div>
    <div>
    <hr style=" border-radius: 11.7px;margin: 5px 0 5px">
    </div>
    <div class="bottom">
    <div class= "bottom-div"> <span>${item && item.distance}</span> </div>
    <div class= "bottom-div" >
    <div class= "store_rating" >
    ${item.store_rating > 0 ? '<i class="fa fa-star star-green" ></i>'+ '<p class="m-0">' +  item.store_rating + '</p>' : ''}
    </div>
    </div>
    </div>

    <div style="cursor:pointer" class="bottom-right-fix" >
    <p id="viewPopUpId-${index}">View</p>
    </div>
    </div>
    </div>
    </div>
          `;
  }

  select_marker(infoWindow, i, e) {
    this.selectedMarkerIndex = i;
    this.bussinessData.map(a => a['isClicked'] = false);
    this.bussinessData[i]['isClicked'] = true;

    this.popupInfoData = [];
    let temp_data = [];
    temp_data = this.bussinessData.filter((col) => {
      return col.latitude === this.bussinessData[i].latitude && col.longitude === this.bussinessData[i].longitude;
    });
    this.popupInfoData = JSON.parse(JSON.stringify(temp_data));
    this.selected_pointer = 0;
    if (window.innerWidth > 500) {
      this.show_popup = false;
      if (this.previous_info_window == null || this.previous_info_window === undefined) {
        this.previous_info_window = infoWindow;
      } else {
        this.infoWindowOpened = infoWindow;
        this.previous_info_window.close();
      }
      this.previous_info_window = infoWindow;
    }
    else {
      setTimeout(() => { infoWindow.close() })
      document.getElementById("agmMapHeight").style.height = "80%";
      this.show_popup = true;
    }
  }


  close_popup() {
    this.bussinessData[this.selectedMarkerIndex]['isClicked'] = false;
    this.show_popup = false;
    document.getElementById("agmMapHeight").style.height = "100%";

  }

  changeMarkerContent(is_from_next) {
    if (is_from_next) {
      this.selected_pointer++;
    }
    else {
      this.selected_pointer--;
    }
  }
closeMarkerPopup()
{
  this.previous_info_window.close();
}
  // ===============set config for all====================
  setConfig() {
    this.config = this.sessionService.get('config');
    if (this.config) {
      this.config.borderColor = this.config['color'] || '#e13d36';
      this.terminology = this.config.terminology;
      this.currency = this.config['payment_settings'][0].symbol;
    }

    if (this.sessionService.getString('bId') !== '0' && this.config.is_business_category_enabled) {
      this.businessEnabled = true;
    } else {
      this.businessEnabled = false;
    }
  }


  // ===============set language and direction====================
  async setLanguage() {
    // checks for ar translations
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
    await this.appService.langPromise;
    this.langJson = this.appService.getLangJsonData();
  }

  // ========================navigate to direct store if it is one=========================
  navigate(item) {
    if (!item.available && !item.scheduled_task) {
      this.popupService.showPopup('info', 2000, this.langJson['Sorry! this --- is closed for now.'].replace(
        '---', this.terminology.MERCHANT), false);
      return;
    }

    this.sessionService.set('info', item);
    this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.restaurant_click, item.store_name, '', '');
    this.googleAnalyticsEventsService.emitEvent(GoogleAnalyticsEvent.restaurant_detail_order_online, item.store_name, '', '');
    const id = this.sessionService.getByKey('app', 'rest_id') || undefined;
    this.sessionService.remove('preOrderTime');
    if (id !== item.storefront_user_id) {
      this.messageService.clearCartOnly();
      this.router.navigate(['store', item.storepage_slug || '-', item.storefront_user_id]);
    } else {
      this.router.navigate(['store', item.storepage_slug || '-', item.storefront_user_id]);
    }

  }

  /**
 * get delivery mode data
 */
  subscriptionForListeningDeliveryMethod() {
    this.messageService.sendDelivery
      .pipe(takeWhile(_ => this.alive))
      .subscribe((message) => {
        if (!message.checkout) {
          switch (message.type) {
            case 1:
              this.deliveryMode = 1;
              break;
            case 2:
              this.deliveryMode = 2;
              break;
          }
        }
      });
  }

  /**
* to trigger zoom change event
*/
  zoomChange(e) {
    // this.previous_info_window.close();
    this.bussinessData.map(a => a['isClicked'] = false);
    document.getElementById("agmMapHeight").style.height = "100%";

    this.popupInfoData = [];
    this.selected_pointer = 0;
    if (this.previous_info_window) {
      this.previous_info_window.close();
    }
    if (e < this.zoom1) {
      this.mapChangeEvent.next(e);
    }
  }


  protected getMerchantHit(e: any) {
    this.subscriptionForListeningBusinessCategory();
    setTimeout(() => this.getRestaurants(), 100);
    this.zoom1 = e;
  }

  /**
* to trigger bounds  change event
*/
  boundsChange(bounds) {
    // console.warn('test bounds of bound change', bounds);
    const center = bounds.getCenter();
    const ne = bounds.getNorthEast();
    const lat1 = +center.lat();
    const lon1 = +center.lng();
    const lat2 = +ne.lat();
    const lon2 = +ne.lng();
    if ((lat1 === lat2) && (lon1 === lon2)) {
      return 0;
    } else {
      const radlat1 = Math.PI * lat1 / 180;
      const radlat2 = Math.PI * lat2 / 180;
      const theta = lon1 - lon2;
      const radtheta = Math.PI * theta / 180;
      let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180 / Math.PI;
      dist = dist * 60 * 1.1515;
      this.mapRadius = dist * 1.609344;
      if (this.boundCounter === true) {
        this.mapRadius2 = this.mapRadius1;
      }
      this.mapRadius1 = this.mapRadius;
      this.messageService.sendRadius(this.mapRadius);
      this.boundCounter = true;
    }
  }


  /**
* to get stores list while zoom out(as per radius change)
*/
  getRestaurants() {
    if (this.businessId !== '0') {
      const obj = {
        marketplace_reference_id: this.formSettings.marketplace_reference_id,
        marketplace_user_id: this.formSettings.marketplace_user_id,
        latitude: this.lat,
        longitude: this.lng,
        second_radius: this.mapRadius1,
        first_radius: this.mapRadius2,
        business_category_id: this.businessId,
      };
      if (this.sessionService.get('appData')) {
        obj['access_token'] = this.sessionService.get('appData').vendor_details.app_access_token;
      }
      return this.mapviewService
        .getRestaurant(obj)
        .subscribe(response => {
          if (response.status === 200) {
            this.restaurantData = response.data;
            this.bussinessData = this.bussinessData.concat(this.restaurantData);
          } else if (response.status === 400) {
          }
        },
          error => {
            console.error(error);
          });
    } else {
      const obj = {
        marketplace_reference_id: this.formSettings.marketplace_reference_id,
        marketplace_user_id: this.formSettings.marketplace_user_id,
        latitude: this.lat,
        longitude: this.lng,
        second_radius: this.mapRadius1,
        first_radius: this.mapRadius2,
      };
      return this.mapviewService
        .getRestaurant(obj)
        .subscribe(response => {
          console.warn(response, typeof response, 'responseData');
          if (response.status === 200) {
            this.restaurantData = response.data;
            this.bussinessData = this.bussinessData.concat(this.restaurantData);
          } else if (response.status === 400) {
          }
        },
          error => {
            console.error(error);
          });
    }

  }

  /**
* listen business category event
*/
  subscriptionForListeningBusinessCategory() {
    this.businessId = this.sessionService.getString('bId');
    this.messageService.sendBusinessCategoryId
      .pipe(takeWhile(_ => this.alive))
      .subscribe((message) => {
        const location = this.sessionService.get('location');
        // this.getRestaurants(location.lat, location.lng, '', location.city);
      });
  }

  // close_popup() {
  //   this.bussinessData[this.selectedMarkerIndex]['isClicked'] = false;
  //   this.show_popup = false;
  //   document.getElementById("agmMapHeight").style.height = "100%";

  // }

  async initializeMap() {
    // if(this.sessionService.) get from config
    await LoadScriptsPostAppComponentLoad.loadFlightmapJs();
    //get token from config
    mapboxgl.accessToken = this.formSettings.map_object.webapp_map_api_key;

    this.map = new mapboxgl.Map({
      container: 'map',
      hash: false,
      style: this.formSettings.marketplace_user_id==147002? 'raster.json' : 'default.json',  //only file name
      zoom: this.intialZoom,
      maxZoom: 18,
    });


    if (this.bussinessData) {
      this.addFlightmapMarkers();
      //on initial map load plot all markers and set view to his location
      // this.map.setCenter([this.lng, this.lat]);
      // this.map.setZoom(this.intialZoom);
    }
  }

  ngOnDestroy() {
    this.alive = false;
  }

}
