/**
 * Created by Ankit on 20/09/19.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VistaService } from './vista.service';
import { VistaComponent } from './vista.component';
import { ModalModule } from '../../components/modal/modal.module';
import { VistaCardListComponent } from './components/get-card/get-card.component';
import { VistaAddCardComponent } from './components/add-card/add-card.component';


@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule
  ],
  declarations: [
    VistaComponent,
    VistaAddCardComponent,
    VistaCardListComponent
  ],
  exports: [
    VistaComponent,
    VistaAddCardComponent,
    VistaCardListComponent
  ],
  providers: [
    VistaService
  ]
})
export class VistaModule {
}

