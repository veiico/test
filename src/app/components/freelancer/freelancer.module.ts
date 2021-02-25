/**
 * Created by cl-macmini-51 on 19/07/18.
 */
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FreeLancerRoutingModule } from './freelancer.routing';
import { SharedLoadModule } from '../../modules/shared-load.module';

import { FreeLancerComponent } from './freelancer.component';
import { FreelancerHeaderComponent } from './freelancer-header/freelancer-header.component';
import { PopupModule } from '../../modules/popup/popup.module';
import { LoginGuardService } from "../../guards/loginGuard.service";
import { RestaurantsService } from '../restaurants-new/restaurants-new.service';
import { CategoryService } from './services/category.service';
import { FreelancerService } from "./services/freelancer.service";
import { DateTimeFormatPipeModule } from '../../modules/pipe.module';
import { FreelancerHomePageGuard } from './freelancer-home-page.guard';

@NgModule({
  imports: [
    CommonModule,
    FreeLancerRoutingModule,
    SharedLoadModule,
    PopupModule,
    DateTimeFormatPipeModule
  ],
  declarations: [
    FreeLancerComponent,
    FreelancerHeaderComponent
  ],
  providers: [
    LoginGuardService,
    RestaurantsService,
    CategoryService,
    FreelancerService,
    FreelancerHomePageGuard
  ]
})
export class FreeLancerModule {}
