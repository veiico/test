/**
 * Created by cl-macmini-51 on 19/07/18.
 */
import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import * as $ from 'jquery';

import { SessionService } from '../../services/session.service';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { CategoryService } from './services/category.service';
import { takeWhile } from 'rxjs/operators';
import { FreelancerService } from './services/freelancer.service';


@Component({
  selector: 'app-free-lancer',
  templateUrl: './freelancer.component.html',
  styleUrls: ['./freelancer.component.scss',
    "../../../../node_modules/primeicons/primeicons.css",
    "../../../../node_modules/primeng/resources/themes/omega/theme.css",
    "../../../../node_modules/primeng/resources/primeng.min.css"],
  encapsulation: ViewEncapsulation.None
})
export class FreeLancerComponent implements OnInit, OnDestroy {
  data;
  config: any;
  showAddress:boolean;
  categories:any;
  isPlatformServer:boolean;
  alive:boolean = true;
  public mobileView:boolean = true;

  constructor(private sessionService: SessionService, private router: Router,private activatedRoute:ActivatedRoute, private categoryService: CategoryService,private freelancerService:FreelancerService) { 
    // this.config = this.sessionService.get('config');
  }


  ngOnInit() {
    this.data = this.sessionService.get('config');
    if(this.sessionService.get('appData'))
    {
      this.sessionService.setToString('reg_status',this.sessionService.get('appData').vendor_details.registration_status);
    }
     this.isPlatformServer = this.sessionService.isPlatformServer();
    if (!this.isPlatformServer) {
      if (window.location.pathname.includes("/home")) {
        this.showAddress = true;
      }
    }
  //   if (this.config.is_customer_login_required && !this.sessionService.get('appData')) {
  //     $('#loginDialog').modal('show');
  //     return ;
  // }
    this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        if (
          val.url.toString() === "/" ||
          val.url.toString() === "/home"
        ) {
          this.showAddress = true;
        } else {
          this.showAddress = false;
        }
      }
    });
    this.checkMobileView();
   
    // this.loadAtBottom();
    
  }

  ngOnDestroy() {
    this.alive = false;
  }

  async getCategoriesAll(locationObj?: any) {
    try {
      if(this.categories.length==1 && this.data.business_model_type == 'FREELANCER')
      { 
      if( this.categories[0].has_children && this.categories[0].has_active_children)
      {
    
      this.router.navigate(['categories',  this.categories[0].catalogue_id], {queryParams: {name:  this.categories[0].name}});
    
  }
  else {
    this.sessionService.set('categoryPath', [{
      name:  this.categories[0].name,
      id: this.categories[0].catalogue_id,
    }]);
    this.router.navigate(['create-project', this.categories[0].catalogue_id]); // create-project //freelancer
  }
}  
      
    } catch (e) {
    }
  }

  checkMobileView(){
    this.freelancerService.checkView().pipe(takeWhile(_ => this.alive)).subscribe(response => {
      if(response != 0){
        this.mobileView = false;
      }
    })
  }
}
