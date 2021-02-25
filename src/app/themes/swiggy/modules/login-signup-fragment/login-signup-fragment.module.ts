import { NgModule } from '@angular/core';

import { LoginSignupFragmentComponent } from './login-signup-fragment.component';
import { LoginSignupFragmentRoutingModule } from './login-signup-fragment.routing';
import { HeaderModule } from '../../../../components/header/header.module';

@NgModule({
    imports: [
        LoginSignupFragmentRoutingModule,
        HeaderModule
    ],
    declarations: [LoginSignupFragmentComponent]
})
export class LoginSignupFragmentModule {
}
