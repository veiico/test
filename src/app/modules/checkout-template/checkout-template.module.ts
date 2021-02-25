import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutTemplateComponent } from './checkout-template.component';
import { CheckoutTemplateService } from './services/checkout-template.service';
import { ReactiveFormsModule } from '@angular/forms';
import { DataControlsComponent } from './components/data-controls/data-controls.component';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { JwTelInputModule } from '../jw-tel-input/jw-tel-input.module';
import { JwCommonModule } from '../jw-common/jw-common.module';
import { SharedModule } from '../shared.module';
import { ProductTemplateService } from '../../../app/components/product-template/services/product-template.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DropdownModule,
    CalendarModule,
    JwTelInputModule,
    JwCommonModule,
    SharedModule
  ],
  providers: [CheckoutTemplateService,ProductTemplateService],
  declarations: [CheckoutTemplateComponent, DataControlsComponent],
  exports: [CheckoutTemplateComponent,DataControlsComponent]
})
export class CheckoutTemplateModule { }
