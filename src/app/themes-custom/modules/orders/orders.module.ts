import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Compiler,
  COMPILER_OPTIONS,
  CompilerFactory,
  CUSTOM_ELEMENTS_SCHEMA,
  Inject,
  Injector,
  NgModule,
  PLATFORM_ID,
} from '@angular/core';
import { JitCompilerFactory } from '@angular/platform-browser-dynamic';

import { OrdersService } from '../../../components/orders/orders.service';
import { SharedModule } from '../../../modules/shared.module';
import { DynamicFooterModule } from '../footer/footer.module';
import { DynamicHeaderModule } from '../header/header.module';
import { DynamicModalModule } from '../modal/modal.module';
import { DynamicShowOrderAdditonalInfoModule } from '../show-order-additional-info/show-order-additional-info.module';
import { DynamicAgentRatingComponent } from './components/agent-rating/agent-rating.component';
import { DynamicOrderRatingComponent } from './components/order-rating/order-rating.component';
import { DynamicOrdersComponent } from './orders.component';
import { DynamicOrdersRoutingModule } from './orders.routing';

const customElementTupleArray: [any, string][] = [
  [DynamicOrderRatingComponent, 'app-order-rating-dynamic'],
  [DynamicAgentRatingComponent, 'app-agent-rating-dynamic'],
]
declare var require: any;

export function createCompiler(compilerFactory: CompilerFactory) {
  return compilerFactory.createCompiler();
}

@NgModule({
  imports: [
    CommonModule,
    DynamicOrdersRoutingModule,
    SharedModule,
    // StarRatingModule.forRoot(),
    DynamicFooterModule,
    DynamicShowOrderAdditonalInfoModule,
    // OverlayPanelModule,
    // BreadcrumbModule,
    DynamicModalModule,
    // DateTimeFormatPipeModule,
    // AgmCoreModule,
    DynamicHeaderModule
  ],
  declarations: [
    DynamicOrdersComponent,
    DynamicOrderRatingComponent,
    DynamicAgentRatingComponent

  ],
  entryComponents: [
    DynamicOrdersComponent,
    DynamicOrderRatingComponent,
    DynamicAgentRatingComponent
  ],
  providers: [
    OrdersService,
    { provide: COMPILER_OPTIONS, useValue: {}, multi: true },
    {
      provide: CompilerFactory,
      useClass: JitCompilerFactory,
      deps: [COMPILER_OPTIONS]
    },
    { provide: Compiler, useFactory: createCompiler, deps: [CompilerFactory] },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DynamicOrdersModule {
  constructor(private injector: Injector, @Inject(PLATFORM_ID) platformId: Object) {
    if (isPlatformBrowser(platformId)) {
      const { createCustomElement } = require('@angular/elements');

      for (const [component, selector] of customElementTupleArray) {
        const elemExist = customElements.get(selector)
        if (!elemExist) {
          const el = createCustomElement(component, { injector: this.injector });
          customElements.define(selector, el);
        }
      }
    }
  }
}
