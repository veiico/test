import { NgModule, COMPILER_OPTIONS, CompilerFactory, Compiler, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFooterModule } from '../footer/footer.module';
import { DebtService } from '../../../../app/components/show-debt/services/show-debt.service';
import { DynamicShowDebtRoutingModule } from './show-debt.routing';
import { DynamicDebtAmountComponent } from './components/debt-amount/debt-amount.component';
import { JitCompilerFactory } from '@angular/platform-browser-dynamic';
  
export function createCompiler(compilerFactory: CompilerFactory) {
  return compilerFactory.createCompiler();
}

@NgModule({  
  imports: [ 
    CommonModule,
    DynamicFooterModule,
    DynamicShowDebtRoutingModule  
  ],
  declarations: [
    DynamicDebtAmountComponent
  ],
  entryComponents: [
    DynamicDebtAmountComponent
  ],
  providers: [DebtService,
    { provide: COMPILER_OPTIONS, useValue: {}, multi: true },
    {
      provide: CompilerFactory,
      useClass: JitCompilerFactory,
      deps: [COMPILER_OPTIONS]
    },
    { provide: Compiler, useFactory: createCompiler, deps: [CompilerFactory] }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DynamicDebtModule { 
}
