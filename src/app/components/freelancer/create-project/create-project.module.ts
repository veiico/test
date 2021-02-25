/**
 * Created by cl-macmini-51 on 20/07/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
// import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';

import { FreeLancerProjectRoutingModule } from './create-project.routing';
import { SharedModule } from '../../../modules/shared.module';

import { FreelancerProjectComponent } from './create-project.component';
import { FreelancerTemplateComponent } from './components/template/template.component';

import { CreateProjectService } from './create-project.service';
import { FuguTelInputModule } from '../../fugu-tel-input/fugu-tel-input.module';
import { JwGoogleAutocompleteModule } from '../../../modules/jw-google-autocomplete/jw-google-autocomplete.module';
import { FooterModule } from '../../../modules/footer/footer.module';
import { MapPopupModule } from '../../../modules/map-popup/map-popup.module';
@NgModule({
  imports: [
    CommonModule,
    DropdownModule,
    FreeLancerProjectRoutingModule,
    SharedModule,
    MultiSelectModule,
    CalendarModule,
    FuguTelInputModule,
    JwGoogleAutocompleteModule,
    FooterModule,
    MapPopupModule
    // NgMultiSelectDropDownModule.forRoot()
  ],
  declarations: [
    FreelancerProjectComponent,
    FreelancerTemplateComponent
  ],
  providers: [
    CreateProjectService
  ]
})

export class FreeLancerProjectModule { }
