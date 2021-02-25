import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { SeoService } from '../services/seo.service';

@Injectable()
export class SeoGuard implements CanActivate {

  constructor(private seoService: SeoService) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const id =  next.params['id'];
    this.seoService.getRouteSeo(next.data.type, id);
    return true;
  }
}
