import { NgModule, CompilerFactory, COMPILER_OPTIONS, Compiler, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DynamicFetchLocationComponent } from './fetch-location.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderModule } from '../../../../app/components/header/header.module';

import { DynamicFooterModule } from '../footer/footer.module';
import { AgmCoreModule, LAZY_MAPS_API_CONFIG } from '@agm/core';
import { FetchLocationService } from '../../../../app/components/fetch-location/fetch-location.service';
import { LoginService } from '../../../../app/components/login/login.service';
import { PopupModalService } from '../../../../app/modules/popup/services/popup-modal.service';
import { GoogleMapsConfig } from '../../../../app/services/googleConfig';
import { GoogleAnalyticsEventsService } from '../../../../app/services/google-analytics-events.service';
import { RestaurantsService } from '../../../../app/components/restaurants-new/restaurants-new.service';
import { JitCompilerFactory } from '@angular/platform-browser-dynamic';

import { DynamicCompilerService } from '../../../../app/services/dynamic-compiler.service';
import { BsLocaleService, BsDatepickerModule } from 'ngx-bootstrap';
import { DynamicAutocompleteModule } from '../dynamic-autocomplete/dynamic-autocomplete.module';
import { DynamicHeaderModule } from '../header/header.module';
import { DynamicModalModule } from '../modal/modal.module';


export function createCompiler(compilerFactory: CompilerFactory) {
    return compilerFactory.createCompiler();
  }

const route: Routes = [
  {
    path: '',
    component: DynamicFetchLocationComponent,
    children: []
  }
];

@NgModule({
  declarations: [DynamicFetchLocationComponent],
  exports: [DynamicFetchLocationComponent],
  imports: [CommonModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    DynamicHeaderModule,
    RouterModule,
    DynamicFooterModule,
    DynamicModalModule,
    RouterModule.forChild(route),
    AgmCoreModule,
  DynamicAutocompleteModule
  ],
  entryComponents : [
    DynamicFetchLocationComponent
  ],
  providers: [
    FetchLocationService,
    LoginService,
    PopupModalService,
    BsLocaleService,
    {
      provide: LAZY_MAPS_API_CONFIG,
      useClass: GoogleMapsConfig
    },
    GoogleAnalyticsEventsService,
    RestaurantsService ,
    { provide: COMPILER_OPTIONS, useValue: {}, multi: true },
    {
      provide: CompilerFactory,
      useClass: JitCompilerFactory,
      deps: [COMPILER_OPTIONS]
    },
    { provide: Compiler, useFactory: createCompiler, deps: [CompilerFactory] },
    DynamicCompilerService

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DynamicFetchLocationModule {
}
