/**
 * Created by cl-macmini-51 on 10/09/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BusinessCategoriesComponent } from "./business-categories.component";
import { BusinessCategoriesService } from "./business-categories.service";
import { CarouselModule } from '../../../../../../node_modules/primeng/carousel';
import { TruncatePipeModule } from '../../../../modules/truncate-pipe.module';


@NgModule({
  imports: [
    CommonModule,
    TooltipModule,
    CarouselModule,
    TruncatePipeModule
  ],
  declarations: [
    BusinessCategoriesComponent
  ],
  providers: [
    BusinessCategoriesService
  ],
  exports: [BusinessCategoriesComponent]
})
export class BusinessCategoriesModule {
}
