/**
 * Created by mba-214 on 02/11/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthorizeNetService } from './authorize-net.service';
import { AuthorizeNetComponent } from './authorize-net.component';
import { ModalModule } from '../../components/modal/modal.module';
import { AuthorizeNetCardListComponent } from './components/get-card/get-card.component';
import { AuthorizeNetAddCardComponent } from './components/add-card/add-card.component';


@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule
  ],
  declarations: [
    AuthorizeNetComponent,
    AuthorizeNetAddCardComponent,
    AuthorizeNetCardListComponent
  ],
  exports: [
    AuthorizeNetComponent,
    AuthorizeNetAddCardComponent,
    AuthorizeNetCardListComponent
  ],
  providers: [
    AuthorizeNetService
  ]
})
export class AuthorizeNetModule {
}
