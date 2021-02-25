/**
 * Created by cl-macmini-51 on 25/07/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';

import { SharedModule } from '../../../modules/shared.module';
import { PostedProjectRoutingModule } from './posted-projects.routing';

import { PostedProjectComponents } from './posted-projects.component';

import { PostedProjectService } from './posted-projects.service';
import { BreadcrumbModule } from '../../../../../node_modules/primeng/breadcrumb';
import { FooterModule } from '../../../modules/footer/footer.module';
import { PathBreadcrumbPipe } from '../../../pipes/path-breadcrumb.pipe';
import { DateTimeFormatPipeModule } from '../../../modules/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DropdownModule,
    PostedProjectRoutingModule,
    BreadcrumbModule,
    FooterModule,
    DateTimeFormatPipeModule
  ],
  declarations: [
    PostedProjectComponents,
    PathBreadcrumbPipe
  ],
  providers: [
    PostedProjectService
  ]
})
export class PostedProjectModule {
}
