import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { LoginService } from './login.service';
import { JwCommonModule } from '../../modules/jw-common/jw-common.module';
import { RouterModule } from '@angular/router';
import { FuguTelInputModule } from '../fugu-tel-input/fugu-tel-input.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material';
import { OwlNativeDateTimeModule, OwlDateTimeModule } from 'ng-pick-datetime';
import { PhoneEmailHybridModule } from '../phone-email-hybrid/phone-email-hybrid.module';
import { GoogleLoginModule } from '../google-login/google-login.module';

@NgModule({
    imports: [
        CommonModule,
        JwCommonModule,
        RouterModule,
        FuguTelInputModule,
        FormsModule,
        MatCheckboxModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        ReactiveFormsModule,
        PhoneEmailHybridModule,
        GoogleLoginModule
    ],
    declarations: [
        LoginComponent,
    ],
    exports:[
        LoginComponent
    ],
    providers: [
        LoginService
    ]
})
export class LoginModule {
}
