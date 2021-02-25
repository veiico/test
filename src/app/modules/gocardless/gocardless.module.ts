import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GocardlessComponent } from './gocardless.component';

@NgModule({
  declarations: [GocardlessComponent],
  imports: [
    CommonModule
  ],
  exports:[GocardlessComponent]
})
export class GocardlessModule { }
