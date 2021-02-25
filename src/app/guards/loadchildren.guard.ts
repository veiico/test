import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import { ThemeService } from '../services/theme.service';
import { SessionService } from '../services/session.service';

@Injectable()
export class LoadChildrenGuard implements CanActivate {

  constructor(private themeService: ThemeService, private sessionService: SessionService) {
  }
  canActivate(childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const config = this.sessionService.get('config');
    const routes = config.routes;
    if (routes && childRoute.data) {
      const keys = Object.keys(routes);
      const key = keys.includes(childRoute.data.type) ? childRoute.data.type : undefined;
      this.themeService.getThemeConfig(key);
      return this.themeService.promise;
    }
    return true;
  }
}
