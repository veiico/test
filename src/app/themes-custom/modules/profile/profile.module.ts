import { CommonModule } from '@angular/common';
import { NgModule, CompilerFactory, COMPILER_OPTIONS, Compiler } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material';
import { StarRatingModule } from 'angular-star-rating';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { CalendarModule } from 'primeng/calendar';

import { ProfileService } from '../../../components/profile/profile.service';
import { DateTimeFormatPipeModule } from '../../../modules/pipe.module';
import { DynamicFooterModule } from '../../modules/footer/footer.module';
import { DynamicFuguTelInputModule } from '../fugu-tel-input/fugu-tel-input.module';
import { DynamicHeaderModule } from '../header/header.module';
import { DynamicChangePasswordModule } from './components/change-password/change-password.module';
import { DynamicSubscriptionModule } from './components/subscription/subscription.module';
import { DynamicProfileComponent } from './profile.component';
import { DynamicProfileRoutingModule } from './profile.routing';
import { JitCompilerFactory } from '@angular/platform-browser-dynamic';



export function createCompiler(compilerFactory: CompilerFactory) {
  return compilerFactory.createCompiler();
}

@NgModule({
  imports: [
    CommonModule,
    DynamicProfileRoutingModule,
    DynamicHeaderModule,
    DynamicFuguTelInputModule,
    FormsModule,
    ReactiveFormsModule,
    DynamicFooterModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatCheckboxModule,
    DynamicChangePasswordModule,
    DynamicSubscriptionModule,
    DateTimeFormatPipeModule,
    CalendarModule,
    StarRatingModule
  ],
  declarations: [
    DynamicProfileComponent
  ],
  providers: [
    ProfileService,
    { provide: COMPILER_OPTIONS, useValue: {}, multi: true },
    {
      provide: CompilerFactory,
      useClass: JitCompilerFactory,
      deps: [COMPILER_OPTIONS]
    },
    { provide: Compiler, useFactory: createCompiler, deps: [CompilerFactory] },
  ]
})
export class DynamicProfileModule {
}
