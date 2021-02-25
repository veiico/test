import { Injectable } from '@angular/core';
import { ApiService } from '../../../../app/services/api.service';

@Injectable()
export class JwTelInputService {
  constructor(private api: ApiService) {
  }

  getCountryData() {
    const obj = {
      'url': 'requestCountryCodeGeoIP2'
    };
    return this.api.getCountryData(obj);
  }

}
