/**
 * Created by mba-214 on 02/11/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FacService } from './fac.service';
import { FacComponent } from './fac.component';
import { ModalModule } from '../../components/modal/modal.module';
import { FacCardListComponent } from './components/get-card/get-card.component';
import { FacAddCardComponent } from './components/add-card/add-card.component';


@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule
  ],
  declarations: [
    FacComponent,
    FacAddCardComponent,
    FacCardListComponent
  ],
  exports: [
    FacComponent,
    FacAddCardComponent,
    FacCardListComponent
  ],
  providers: [
    FacService
  ]
})
export class FacModule {
}
