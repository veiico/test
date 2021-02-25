import { NgModule, COMPILER_OPTIONS, CompilerFactory, Compiler, Injector, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DynamicFooterComponent } from './footer.component';
import { JitCompilerFactory } from '@angular/platform-browser-dynamic';
import { DynamicCompilerService } from '../../../../app/services/dynamic-compiler.service';
declare var require: any;

export function createCompiler(compilerFactory: CompilerFactory) {
    return compilerFactory.createCompiler();
  }

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    DynamicFooterComponent
  ],
  exports: [
    DynamicFooterComponent
  ],
  entryComponents: [
    DynamicFooterComponent
  ],
  providers: [
    { provide: COMPILER_OPTIONS, useValue: {}, multi: true },
    {
      provide: CompilerFactory,
      useClass: JitCompilerFactory,
      deps: [COMPILER_OPTIONS]
    },
    { provide: Compiler, useFactory: createCompiler, deps: [CompilerFactory] },
    DynamicCompilerService
  ]
})
export class DynamicFooterModule {
    constructor(private injector: Injector ,  @Inject(PLATFORM_ID) platformId: Object) { 
        if(isPlatformBrowser(platformId)) {
          const { createCustomElement } = require('@angular/elements'); 
          const elemExist = customElements.get('app-dynamic-footer')
          if(!elemExist){
            const el = createCustomElement(DynamicFooterComponent, { injector: this.injector }); 
            customElements.define('app-dynamic-footer', el);  
          }
        }
        }                   
}
