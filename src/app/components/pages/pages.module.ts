/**
 * Created by cl-macmini-51 on 02/05/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages.routing';
import { PagesComponent } from './pages.component';
import { PagesService } from './pages.service';
import { HeaderModule } from '../header/header.module';
import { FooterModule } from '../../modules/footer/footer.module';

@NgModule({
  imports: [
    CommonModule,
    HeaderModule,
    PagesRoutingModule,
    FooterModule
  ],
  declarations: [
    PagesComponent
  ],
  providers: [
      PagesService
  ]
})
export class PagesModule {
}
