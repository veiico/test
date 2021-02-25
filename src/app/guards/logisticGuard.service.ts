import { Injectable } from '@angular/core';
import { Router, CanActivate, CanLoad } from '@angular/router';
import { SessionService } from "./../services/session.service";

//
//@Injectable()
//export class LogisticsGuard implements CanActivate, CanLoad {
//
//    constructor(private router: Router, private sessionService: SessionService) { }
//
//    canLoad() {
//        if (this.sessionService.get('config') && this.sessionService.get('config').business_model_type !== 'LOGISTICS') {
//          return true;
//        } else {
//          this.router.navigate(['logistics']);
//          return false;
//        }
//     }
//
//    canActivate() {
//        if (this.sessionService.get('config').business_model_type !== 'LOGISTICS') {
//          return true;
//        } else {
//          this.router.navigate(['logistics']);
//          return false;
//        }
//    }
//
//}


@Injectable()
export class OtherWorkflowGuard implements CanActivate, CanLoad {

    constructor(private router: Router, private sessionService: SessionService) { }

    canLoad() {
        if (this.sessionService.get('config') && this.sessionService.get('config').business_model_type === 'FREELANCER') {
          return true;
        } else {
          return false;
        }
     }

    canActivate() {
        if (this.sessionService.get('config').business_model_type === 'FREELANCER') {
          return true;
        } else {
          return false;
        }
    }

}

@Injectable()
export class EcommerceGuard implements CanActivate, CanLoad {

    constructor(private router: Router, private sessionService: SessionService) {
     }

    canLoad() {
      return true;
     }

    canActivate() {
        return true;
    }

}
