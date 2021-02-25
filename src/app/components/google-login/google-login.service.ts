import { Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Injectable()
export class GoogleLoginService {

    constructor(private api: ApiService) { }

    loginUsingGoogle(data) {
        const obj = {
            'url': 'vendor/googleLogin',
            'body': data,
        };
        return this.api.post(obj);
    }

    loginUsingGoogleDual(data) {
        const obj = {
            'url': 'dualUserGoogleLogin',
            'body': data,
        };
        return this.api.post(obj);
    }

    registerUsingGoogle(data) {
        const obj = {
          'url': 'vendor/googleRegister',
          'body': data,
        };
        return this.api.post(obj);
      }
}

