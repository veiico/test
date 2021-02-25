import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GoogleLoginComponent } from './google-login.component';
import { GoogleLoginService } from './google-login.service';

@NgModule({
    imports: [CommonModule],
    declarations: [GoogleLoginComponent],
    exports: [GoogleLoginComponent],
    providers: [GoogleLoginService]
})
export class GoogleLoginModule {
}
