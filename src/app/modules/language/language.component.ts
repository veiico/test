import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss']
})
export class LanguageComponent implements OnInit {

  public direction: string;
  public langJson: any = {};
  public languageSelected: any;
  public allLanguages: any = [];

  constructor(private sessionService: SessionService,
              public appService: AppService) { }

  ngOnInit() {
    this.getLanguageFromConfig();
  }

  /**
   * set language
   */
  setLanguage() {
    // checks for ar translations
    if (this.sessionService.getString('language')) {
      this.languageSelected = {
        label: this.sessionService.getString('language').toUpperCase(),
        id: this.sessionService.getString('language')
      };
      if (this.languageSelected.id === 'ar') {
        this.direction = 'rtl';
      } else {
        this.direction = 'ltr';
      }
    } else {
      this.languageSelected.id = 'en';
      if (this.languageSelected.id === 'ar') {
        this.direction = 'rtl';
      } else {
        this.direction = 'ltr';
      }
    }
    this.langJson = this.appService.getLangJsonData();
  }

  /**
   * get config of language enabled from dropdown
   */
  getLanguageFromConfig() {
    const language = this.sessionService.get('config').languages;

    language.forEach((o) => {
      this.allLanguages.push({
        label: o.language_code.toUpperCase(),
        id: o.language_code
      })
    })
  }

  /**
   * on language change
   */
  onLanguageSelection(event) {
    this.sessionService.setToString("language", this.languageSelected.id);
    this.appService.hitLangJson(this.languageSelected.id).subscribe(
      response => {
        try {
          location.pathname = this.languageSelected.id + "/";
        } catch (e) {
          console.error(e);
        }
      },
      error => {
        console.error(error);
      }
    );
    this.appService.hitLanguageStrings();
  }
}
