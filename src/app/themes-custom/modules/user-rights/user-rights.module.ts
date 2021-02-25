import { NgModule, CompilerFactory, COMPILER_OPTIONS, Compiler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicUserRightsRoutingModule } from './user-rights.routing';
import { DynamicJwCommonModule } from '../jw-common/jw-common.module';
import { DynamicFooterModule } from '../footer/footer.module';
import { PopupModalService } from '../../../modules/popup/services/popup-modal.service';
import { UserRightsService } from '../../../components/user-rights/user-rights.service';
import { JitCompilerFactory } from '@angular/platform-browser-dynamic';
import { DynamicUserRightsComponent } from './user-rights.component';
import { ReactiveFormsModule } from '@angular/forms';


export function createCompiler(compilerFactory: CompilerFactory) {
  return compilerFactory.createCompiler();
}


@NgModule({
  imports: [
    CommonModule,
    DynamicUserRightsRoutingModule,
    DynamicJwCommonModule,
    DynamicFooterModule,
    ReactiveFormsModule
  ],
  declarations: [
    DynamicUserRightsComponent
  ],
  providers: [
    PopupModalService,
    UserRightsService,
    { provide: COMPILER_OPTIONS, useValue: {}, multi: true },
    {
      provide: CompilerFactory,
      useClass: JitCompilerFactory,
      deps: [COMPILER_OPTIONS]
    },
    { provide: Compiler, useFactory: createCompiler, deps: [CompilerFactory] },
  ]
})
export class DynmaicUserRightsModule {
}
