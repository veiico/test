/**
 * Created by mba-214 on 23/11/18.
 */
import { Injectable } from '@angular/core';
import { SessionService } from './session.service';
import { AppService } from '../app.service';
import { MapsAPILoader } from '@agm/core';
@Injectable()
export class GeoLocationService {
  public config: any;
  public lat: any;
  public lng: any;
  public formattedAddress: any;
  constructor(
    public sessionService: SessionService,
    public appService: AppService,
    protected mapService: MapsAPILoader
  ) {
    this.config = this.sessionService.get('config');
  }

  public async fetchLocation() {
    // const self = this;

    await this.mapService.load();
    // this.loader.show();
    if (navigator.geolocation) {
      const geocoder = new google.maps.Geocoder();

      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          async position => {
            // this.loader.hide();
            const latlng = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            const that = this;
            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;
            geocoder.geocode({ location: latlng }, (results, status) => {
              if (status.toString() === 'OK') {
                // this.autoCompleteGoogleForm.controls['googleSearch'].setValue(
                //   results[0].formatted_address
                // );
                this.formattedAddress = results[0].formatted_address;
                this.sessionService.set('location', {
                  lat: latlng.lat,
                  lng: latlng.lng,
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
                    if (
                      results[0].address_components[i].types[b] === 'locality'
                    ) {
                      add += ', ' + results[0].address_components[i].long_name;
                      // that.loader.hide();
                      break;
                    }
                  }
                }
                // that.sendMessage(latlng.lat, latlng.lng, self.formattedAddress);
              } else {
                // window.alert('No results found');
              }
              resolve(true);
            });
          },
          async error => {
            // this.loader.hide();
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
            await this.fetchViaIp();
            resolve(true);
          }
        );
      });
    } else {
      console.log('Geolocation is not supported by this browser.');
      return this.fetchViaIp();
    }

    // navigator['permissions'] &&
    //   navigator['permissions'].query({ name: 'geolocation' }).then(perm => {
    //     if (perm.state !== 'granted') {
    //       if (this.sessionService.getString('marketplace_reference_id')) {
    //         return this.fetchViaIp();
    //       } else {
    //         setTimeout(() => {
    //           return this.fetchViaIp();
    //         }, 2000);
    //       }
    //     }
    //   });
  }

  public fetchViaIp() {
    // const that = this;
    return this.appService
      .getAddressFromIp()
      .toPromise()
      .then(response => {
        try {
          // const lats = response.loc.split(',')[0];
          // const lngs = response.loc.split(',')[1];

          this.sessionService.set('location', {
            lat: response.loc.split(',')[0],
            lng: Number(response.loc.split(',')[1]),
            address: response.city
          });
          // that.changePosition(1);
          // that.sendMessage(lats, lngs, response.city);
        } catch (e) {
          console.error(e);
        }
      })
      .catch(error => {
        console.error(error);
      });
  }
}
