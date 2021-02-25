import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { ApiService } from '../../services/api.service';
import { SessionService } from '../../services/session.service';
import { HttpParams, HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class MapviewService {
  constructor(
    private apiService: ApiService,
    private sessionService: SessionService,
    private http: HttpClient,
  ) { }

  getRestaurant(data) {
    const obj = {
      'url': 'marketplace/marketplace_get_city_storefronts_v3',
      'body': data,
    };
    return this.apiService.get(obj);
  }
  public flightmap_reverse_geocode(lngLat) {
    const data = {
    lat: lngLat.lat,
    lng: lngLat.lng,
    fm_token: this.sessionService.get('config') && this.sessionService.get('config').map_object ? this.sessionService.get('config').map_object.webapp_map_api_key : '',
    user_unique_key: this.sessionService.get('config') ? this.sessionService.get('config').marketplace_user_id.toString() : '', 
    zoom: '18'
    };
    return this.http.get(`${environment.maps_api_url}/search_reverse`, { params: new HttpParams({ fromObject: data }) }).pipe(
    map(this.apiService.tookanResponse).bind(this))
    }
}
