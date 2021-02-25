/**
 * Created by cl-macmini-51 on 20/07/18.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { NgxPageScrollModule } from 'ngx-page-scroll';

import { SharedLoadModule } from '../../../modules/shared-load.module';
import { FreelancerHomepageComponent } from './freelancer-homepage.component';
import { FooterModule } from '../../../modules/footer/footer.module';
import { FreeLancerHomePageRoutingModule } from './freelancer-homepage.routing';


@NgModule({
  imports: [
    CommonModule,
    FooterModule,
    FreeLancerHomePageRoutingModule,
    SharedLoadModule
    
  ],
  declarations: [
    FreelancerHomepageComponent
  ],
  providers: [

  ]
})

export class FreeLancerHomePageModule { }
