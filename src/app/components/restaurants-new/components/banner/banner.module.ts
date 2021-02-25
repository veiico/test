/**
 * Created by cl-macmini-51 on 11/09/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerComponent } from "./banner.component";
import { BannerService } from "./banner.service";
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    BannerComponent
  ],
  providers: [
    BannerService
  ],
  exports: [BannerComponent]
})
export class BannerModule {
}
