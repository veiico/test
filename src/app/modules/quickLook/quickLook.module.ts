/**
 * Created by mba-214 on 02/11/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuickLookComponent } from './quickLook.component';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    QuickLookComponent
  ],
  exports: [
    QuickLookComponent
  ],
  providers: [

  ]
})
export class QuickLookModule {
}
