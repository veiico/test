import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhoneEmailHybridComponent } from './phone-email-hybrid.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ValidationService } from '../../services/validation.service';

  
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  declarations: [
    PhoneEmailHybridComponent
  ],
  exports:[
    PhoneEmailHybridComponent
  ],
  providers: [ValidationService]
})
export class PhoneEmailHybridModule { 
}
