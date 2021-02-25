import { NgModule, Injector, Inject, PLATFORM_ID } from "@angular/core";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { HeaderComponent } from "./header.component";
import { HeaderService } from "./header.service";
import { SignupModule } from "../signup/signup.module";
import { LoginModule } from "../login/login.module";
import { JwCommonModule } from "../../modules/jw-common/jw-common.module";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { PopupModule } from "../../modules/popup/popup.module";
import { PhoneEmailHybridModule } from "../phone-email-hybrid/phone-email-hybrid.module";
import { RouterModule } from "@angular/router";
import { AppCartService } from "../catalogue/components/app-cart/app-cart.service";
import { ChangeUrlModule } from "./components/change-api-url/change-api-url.module";
import { NotificationsComponent } from "./components/notifications/notifications.component";
import { CookieFooterModule } from "../cookie-setting-footer/cookie-setting-footer.module";
import { DeliveryModesModule } from '../restaurants-new/components/delivery-modes/delivery-modes.module';
import { AutoCompleteModule } from '../autocomplete/autocomplete.module';
import { TruncatePipeModule } from '../../modules/truncate-pipe.module';
import {DateTimeFormatPipeModule} from "../../modules/pipe.module";
import { OtpVerificationModule } from '../otp-verification/otp-verification.module';
import { RestaurantsService } from '../restaurants-new/restaurants-new.service';

declare var require: any;
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SignupModule,
    LoginModule,
    PopupModule,
    CookieFooterModule,
    PhoneEmailHybridModule,
    RouterModule,
    ChangeUrlModule,
    DeliveryModesModule,
    AutoCompleteModule,
    TruncatePipeModule,
    DateTimeFormatPipeModule,
    OtpVerificationModule
  ],
  declarations: [
    HeaderComponent,
    NotificationsComponent
  ],
  entryComponents: [
    HeaderComponent
  ],
  exports: [
    HeaderComponent,
    LoginModule,
    SignupModule,
    JwCommonModule,
    PopupModule,
    ChangeUrlModule
  ],
  providers: [HeaderService, AppCartService, RestaurantsService]
})
export class HeaderModule {

}
