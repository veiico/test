import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductTemplateComponent } from './components/product-template/product-template.component';
import { ModalModule } from '../modal/modal.module';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckoutTemplateModule } from '../../modules/checkout-template/checkout-template.module';
import { SharedModule } from '../../modules/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DataFieldsComponent } from './components/data-fields/data-fields.component';
import { JwTelInputModule } from '../../modules/jw-tel-input/jw-tel-input.module';
import { ProductTemplateService } from './services/product-template.service';


@NgModule({
  declarations: [ProductTemplateComponent, DataFieldsComponent],
  imports: [
    CommonModule,
    ModalModule,
    JwTelInputModule,
    SharedModule,
    DropdownModule,
    MultiSelectModule,
    CheckoutTemplateModule,
    ReactiveFormsModule
  ],
  exports:[
    ProductTemplateComponent
  ],
  providers : [ProductTemplateService]
})
export class ProductTemplateModule { }
