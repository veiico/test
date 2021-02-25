/**
 * Created by cl-macmini-51 on 21/05/18.
 */
import { Injectable } from '@angular/core';

@Injectable()
export class FetchLocationService {
  constructor() {
  }

  getMapStyle() {
    return [
      {
        featureType: 'poi',
        stylers: [
          { visibility: 'off' }
        ]
      },
      {
        'featureType': 'poi.business',
        'stylers': [
          {
            'visibility': 'off'
          }
        ]
      },
      {
        'featureType': 'road',
        'elementType': 'labels.icon',
        'stylers': [
          {
            'visibility': 'off'
          }
        ]
      },
      {
        'featureType': 'transit',
        'stylers': [
          {
            'visibility': 'off'
          }
        ]
      }
    ];
  }

}
