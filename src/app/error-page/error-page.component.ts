import { Component, OnInit } from '@angular/core';
import { SessionService } from '../services/session.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent implements OnInit {
  languageStrings: any={};
  formSettings: any;

  constructor(
    protected sessionService: SessionService,
    public router: Router,
  ) { 
  }

  ngOnInit() {
    this.formSettings = this.sessionService.get("config");
    this.sessionService.langStringsPromise.then(() =>
    {
     this.languageStrings = this.sessionService.languageStrings;
    });
  }

  goToHome() {
    if (this.formSettings && this.formSettings.landing_page_url) {
      window.open(this.formSettings.landing_page_url, "_self");
    } else {
      if (
        this.formSettings.nlevel_enabled === 2 &&
        this.formSettings.business_model_type === "ECOM"
      ) {
        this.router.navigate(["categories"]);
      } else if (this.formSettings.business_model_type === "FREELANCER") {
        this.router.navigate(["/"]);//freelancer
      } else {
        if (this.formSettings.is_landing_page_enabled) {
          this.router.navigate([""]);
        } else {
          this.router.navigate(["list"]);
        }
      }
    }
  }
}
