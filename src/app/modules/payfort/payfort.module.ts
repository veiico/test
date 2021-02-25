/**
 * Created by mba-214 on 17/11/18.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PayfortService } from './payfort.service';
import { PayfortComponent } from './payfort.component';
import { PayfortAddCardComponent } from './components/add-card/add-card.component';
import { PayfortCardListComponent } from './components/get-card/get-card.component';
import { ModalModule } from '../../components/modal/modal.module';
import { JwCommonModule } from '../jw-common/jw-common.module';


@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule,
    JwCommonModule
  ],
  declarations: [
    PayfortComponent,
    PayfortAddCardComponent,
    PayfortCardListComponent
  ],
  exports: [
    PayfortComponent,
    PayfortAddCardComponent,
    PayfortCardListComponent
  ],
  providers: [
    PayfortService
  ]
})
export class PayfortModule {
}
