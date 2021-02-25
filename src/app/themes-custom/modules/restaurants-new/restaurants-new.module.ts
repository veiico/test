import { NgModule, CUSTOM_ELEMENTS_SCHEMA, CompilerFactory, COMPILER_OPTIONS, Compiler } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynamicRestaurantsNewRoutingModule } from './restaurants-new.routing';
import { DynamicHeaderModule } from '../header/header.module';
import { AutoCompleteModule } from '../../../components/autocomplete/autocomplete.module';
import { DynamicRestaurantsNewComponent } from './restaurants-new.component';
import { RestaurantsService } from '../../../components/restaurants-new/restaurants-new.service';
import { FetchLocationService } from '../../../components/fetch-location/fetch-location.service';
import { DynamicBannerModule } from './components/banner/banner.module';
import { DynamicRestaurantsModule } from './components/restaurants/restaurants.module';
import { JitCompilerFactory } from '@angular/platform-browser-dynamic';
import { DynamicMapViewModule } from '../map-view/map-view.module';
import { DynamicAutocompleteModule } from '../dynamic-autocomplete/dynamic-autocomplete.module';
import { DynamicOrderPlacedPopupModule } from '../order-placed-page/order-placed-popup.module';

export function createCompiler(compilerFactory: CompilerFactory) {
  return compilerFactory.createCompiler();
}

@NgModule({
  imports: [
    CommonModule,
    DynamicRestaurantsNewRoutingModule,
    DynamicHeaderModule,
    DynamicBannerModule,
    AutoCompleteModule,
    DynamicRestaurantsModule,
    DynamicMapViewModule,
    DynamicAutocompleteModule,
    DynamicOrderPlacedPopupModule
  ],
  declarations: [
    DynamicRestaurantsNewComponent,
  ],
  providers: [
    RestaurantsService,
    FetchLocationService,
    { provide: COMPILER_OPTIONS, useValue: {}, multi: true },
    {
      provide: CompilerFactory,
      useClass: JitCompilerFactory,
      deps: [COMPILER_OPTIONS]
    },
    { provide: Compiler, useFactory: createCompiler, deps: [CompilerFactory] },
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class DynamicRestaurantsNewModule {
}
