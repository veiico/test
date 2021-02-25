import { Injectable } from '@angular/core';
import { Router, CanLoad, Route, NavigationStart } from '@angular/router';
import { SessionService } from './../services/session.service';
import { Observable } from 'rxjs';
import { RouteHistoryService } from './../services/setGetRouteHistory.service';

@Injectable()
export class EcomFlowGuard implements CanLoad {
  config: any;
  constructor(private sessionService: SessionService, private router: Router) {

    this.config = this.sessionService.get('config');
  }

  canLoad(route: Route): boolean {
    if (this.config.business_model_type !== 'ECOM' && this.config.nlevel_enabled !== 2) {
      return true;
    } else if (this.config.business_model_type === 'ECOM' && (this.config.nlevel_enabled === 1 || this.config.nlevel_enabled === 0)) {
      return true;
    } else {
      this.router.navigate(['categories']);
      return false;
    }

  }
}
