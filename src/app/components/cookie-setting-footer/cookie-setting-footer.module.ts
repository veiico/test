/**
 * Created by cl-macmini-51 on 11/09/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CookieFooterComponent } from './cookie-setting-footer.component';
import { RouterModule } from '@angular/router';
import { CookieSettingService } from './cookie-setting-footer.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    CookieFooterComponent
  ],
  providers: [
    CookieSettingService
  ],
  exports: [CookieFooterComponent]
})
export class CookieFooterModule {
}
