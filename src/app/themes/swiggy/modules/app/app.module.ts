import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AppComponent } from "./app.component";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";
import { LogoHeadingComponent } from "./components/logo-heading/logo-heading.component";
import { AutocompleteModule } from "../../../../modules/autocomplete/autocomplete.module";
import { FeaturesComponent } from "./components/features/features.component";
import { FlowComponent } from "./components/flow/flow.component";
//import { FooterModule } from "../../../../modules/footer/footer.module";
//import { FooterNewModule } from '../footer-new/footer-new.module';
import { ScrollToTopModule } from "../../../../modules/scroll-to-top/scroll-to-top.module";
import { LoadChildrenGuard } from "./../../../../guards/loadchildren.guard";
import { SeoGuard } from "../../../../guards/seo.guard";
import { CookieFooterModule } from "../../../../components/cookie-setting-footer/cookie-setting-footer.module";
import { FooterModule } from '../../../../modules/footer/footer.module';

const router: Routes = [
  {
    path: "",
    component: HomeComponent,
    children: [
      {
        path: "custom-login",
        pathMatch: "full",
        loadChildren:'app/themes/swiggy/modules/login-signup-fragment/login-signup-fragment.module#LoginSignupFragmentModule'
      }
    ],
    canActivate: [SeoGuard,LoadChildrenGuard],
    // canActivateChild: [LoadChildrenGuard]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(router),
    AutocompleteModule,
    FooterModule,
    CookieFooterModule,
    //FooterNewModule,
    ScrollToTopModule
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    LogoHeadingComponent,
    FeaturesComponent,
    FlowComponent
  ],
  exports: [
    FeaturesComponent,
    FlowComponent
  ],
  providers: [LoadChildrenGuard]
})
export class AppModule {}
