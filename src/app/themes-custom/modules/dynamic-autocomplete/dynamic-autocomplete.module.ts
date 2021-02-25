import { NgModule, CompilerFactory, Injector, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DynamicAutocompleteComponent } from './dynamic-autocomplete.component';
import { LAZY_MAPS_API_CONFIG, AgmCoreModule } from '@agm/core';
import { GoogleMapsConfig } from '../../../../app/services/googleConfig';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwCommonModule } from '../../../../app/modules/jw-common/jw-common.module';
import { ModalModule } from '../../../../app/components/modal/modal.module';
import { JwGoogleAutocompleteModule } from '../../../../app/modules/jw-google-autocomplete/jw-google-autocomplete.module';
import { MapPopupModule } from '../../../../app/modules/map-popup/map-popup.module';
declare var require: any;

export function createCompiler(compilerFactory: CompilerFactory) {
    return compilerFactory.createCompiler();
  }

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    JwCommonModule,
    ModalModule,
    AgmCoreModule.forRoot(),
    JwGoogleAutocompleteModule,
    MapPopupModule
  ],
  declarations: [
    DynamicAutocompleteComponent
  ],
  exports: [
    DynamicAutocompleteComponent
  ],
  entryComponents: [
    DynamicAutocompleteComponent
  ],
  providers: [
    {
      provide: LAZY_MAPS_API_CONFIG,
      useClass: GoogleMapsConfig,
      useExisting: true
    }
  ]
})
export class DynamicAutocompleteModule {
    constructor(private injector: Injector ,  @Inject(PLATFORM_ID) platformId: Object) { 
        if(isPlatformBrowser(platformId)) {
          const { createCustomElement } = require('@angular/elements'); 
          const elemExist = customElements.get('app-dynamic-autocomplete')
          if(!elemExist){
            const el = createCustomElement(DynamicAutocompleteComponent, { injector: this.injector }); 
            customElements.define('app-dynamic-autocomplete', el);  
          }
        }
        }                   
}
