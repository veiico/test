/**
 * Created by cl-macmini-51 on 20/07/18.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { NgxPageScrollModule } from 'ngx-page-scroll';

import { SharedLoadModule } from '../../../modules/shared-load.module';
import { FreeLancerHomeRoutingModule } from './home.routing';

import { FreelancerHomeComponent } from './home.component';
import { FirstLevelCatComponent } from './components/first-level-cat/first-level-cat.component';

import { RestaurantsService } from '../../restaurants-new/restaurants-new.service';
import {FooterModule} from '../../../modules/footer/footer.module'
import { ShimmerComponent } from './components/shimmer/shimmer.component'

@NgModule({
  imports: [
    CommonModule,
    DropdownModule,
    NgxPageScrollModule,
    SharedLoadModule,
    FreeLancerHomeRoutingModule,
    FooterModule
  ],
  declarations: [
    FreelancerHomeComponent,
    FirstLevelCatComponent,
    ShimmerComponent
  ],
  providers: [
    RestaurantsService
  ]
})

export class FreeLancerHomeModule { }
