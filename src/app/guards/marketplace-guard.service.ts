/**
 * Created by cl-macmini-51 on 19/07/18.
 */
import { Injectable } from '@angular/core';
import { Router, CanLoad, Route } from '@angular/router';
import { SessionService } from "./../services/session.service";

@Injectable()
export class MarketplaceGuardService implements CanLoad {

  constructor(private router: Router, private sessionService: SessionService) { }

  canLoad(route:Route) {
    if (this.sessionService.get('config') &&
      this.sessionService.get('config').business_model_type !== 'FREELANCER' &&
      this.sessionService.get('config').business_model_type !== 'LOGISTICS' &&
      this.sessionService.get('config').business_model_type !== 'ECOM' &&
      this.sessionService.get('config').nlevel_enabled !== 2) {
      return true;
    } else if (this.sessionService.get('config') && this.sessionService.get('config').business_model_type === 'LOGISTICS') {
      // this.router.navigate(['logistics']);
      return true;//false;
    } else if (this.sessionService.get('config') && this.sessionService.get('config').business_model_type === 'ECOM' &&
      this.sessionService.get('config').nlevel_enabled === 2) {
        route.loadChildren = 'app/components/freelancer/freelancer.module#FreeLancerModule';
        return true;
      } else {
        route.loadChildren = 'app/components/freelancer/freelancer.module#FreeLancerModule';
        return true;
      // this.router.navigate(['freelancer']);
      // return false;
    }
  }
}
