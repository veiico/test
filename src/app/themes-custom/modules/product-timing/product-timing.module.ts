import { NgModule, Injector, Inject, PLATFORM_ID, CompilerFactory } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material';
import { CalendarModule } from 'primeng/calendar';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { DateTimeFormatPipeModule } from '../../../modules/pipe.module';
import { DynamicAppProductTimingComponent } from './product-timing.component';
import { ProductTimingService } from '../../../components/product-timing/product-timing.service';


const customElementTupleArray: [any, string][] = [
  [DynamicAppProductTimingComponent, 'app-product-timing-dynamic'],
]
declare var require: any;

export function createCompiler(compilerFactory: CompilerFactory) {
  return compilerFactory.createCompiler();
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    BsDatepickerModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatButtonModule,
    DateTimeFormatPipeModule
  ],
  declarations: [
    DynamicAppProductTimingComponent
  ],
  exports: [
    DynamicAppProductTimingComponent
  ],
  providers: [
    ProductTimingService
  ],
  entryComponents:[DynamicAppProductTimingComponent]
})
export class DynamicProductTimingModule {
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
