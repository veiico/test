import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad, Router, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionService } from '../../services/session.service';


@Injectable({
  providedIn: 'root'
})
export class FreelancerHomePageGuard implements CanLoad{
  config: any;
  constructor(
    private router: Router,
    private sessionService: SessionService
) {
  this.config = this.sessionService.get('config');
}
async canLoad(route: Route): Promise<boolean> {
  if(this.config.is_freelancer_homepage_enabled){
    return true;
  } else {
    this.router.navigate(['home']);
    return false;      
  }
}

}
