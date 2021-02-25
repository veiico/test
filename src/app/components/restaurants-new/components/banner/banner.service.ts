/**
 * Created by cl-macmini-51 on 11/09/18.
 */
import { Injectable } from '@angular/core';
import { ApiService } from "../../../../services/api.service";
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { SessionService } from '../../../../services/session.service';
// const BANNERS_KEY = makeStateKey('bannersKey');

@Injectable()
export class BannerService {

  constructor(private api: ApiService, private state: TransferState,private sessionService: SessionService) {
  }

  getBannerDetails(data) {
    // const headers = new Headers();
    // const banners = this.state.get(BANNERS_KEY, null as any);
    const obj = {
      'url': 'banner/getBanner',
      'body': data,
      // 'headers': headers
    };
    // if (banners) return of(banners);

    return this.api.get(obj).pipe(map(res => {
      // this.state.set(BANNERS_KEY, res as any);
      return res;
    }));
  }

  getSingleRestaturant(data) {
    if (this.sessionService.isPlatformServer()) {
      data.source = 0;
    }
    const obj = {
      'url': 'marketplace_get_city_storefronts_single_v2',
      'body': {...data,source:0},
      // 'headers': headers
    };
    return this.api.post(obj);
  }
}
