import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DropdownModule } from "primeng/dropdown";
import { LanguageComponent } from './language.component';

@NgModule({
  declarations: [LanguageComponent],
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers:[

  ],
  exports:[LanguageComponent]
})
export class LanguageModule { }
