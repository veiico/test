/**
 * Created by cl-macmini-51 on 02/05/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReferRoutingModule } from './refer.routing';

import { ReferComponent } from './refer.component';

import { ReferService } from './refer.service';
import { FooterModule } from '../../modules/footer/footer.module';
import { ReferParentComponent } from './refer-parent.component';
import { HeaderModule } from '../header/header.module';



@NgModule({
  imports: [
    CommonModule,
    ReferRoutingModule,
    HeaderModule,
    FooterModule
  ],
  declarations: [
    ReferComponent,
    ReferParentComponent
  ],
  providers: [
    ReferService
  ]
})
export class ReferModule {
}
