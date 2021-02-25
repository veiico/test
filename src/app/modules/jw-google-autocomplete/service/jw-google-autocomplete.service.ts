
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { tookanResponse } from '../../../constants/constant';
import { ApiService } from '../../../services/api.service';
import { SessionService } from '../../../services/session.service';

@Injectable()
export class JwGoogleAutocompleteService {

  constructor(private http: HttpClient, private apiService: ApiService, protected sessionService: SessionService) { }

  getLatLongFromPlaceId(placeId: string,config) {
    const data = {
      "placeId": placeId,
      "currentlatitude": config.latitude ?  config.latitude.toString() : '30',
      "currentlongitude": config.longitude ? config.longitude.toString() : '70',
      "fm_token": config.map_object ? config.map_object.webapp_map_api_key : '',
      "user_unique_key": config.marketplace_user_id ? config.marketplace_user_id.toString() : '',
    };
    return this.http.get(`${environment.maps_api_url}/geocode`, { params: new HttpParams({ fromObject: data }) }).pipe(
      map(this.apiService.tookanResponse).bind(this))
  }

  getPredictions(text: string, config) {
    const data = {
      text,
      currentlatitude: config.latitude.toString(),
      currentlongitude: config.longitude.toString(),
      skip_cache: config.map_object.skip_cache,
      fm_token: config.map_object.webapp_map_api_key,
      user_unique_key: config.marketplace_user_id.toString(),
      offering: '2',
      radius: '0'
    };
    return this.http
      .get(`${environment.maps_api_url}/search`, { params: new HttpParams({ fromObject: data }) })
      .pipe(map(this.apiService.tookanResponse).bind(this));
  }
 
}
