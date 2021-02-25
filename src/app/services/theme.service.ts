
import { Injectable, Output, ElementRef, Renderer2, RendererStyleFlags2 } from '@angular/core';
import { SessionService } from './session.service';
import { EventEmitter } from '@angular/core';
import { HttpParamEncoder } from '../classes/encoder.class';
import { HttpParams, HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';


@Injectable()
export class ThemeService {

  promise: Promise<boolean>;
  config;
  @Output() themeChange: EventEmitter<any> = new EventEmitter;
  public renderer: Renderer2;

  constructor(private apiService: ApiService, private sessionService: SessionService) {
  }

  onThemeChange(config?) {
    this.themeChange.emit(config || this.config);
  }

  previewOn() {
    this.themeChange.emit({'type':'previewOn'});
  }

  /**
   * set css styles
   * @param styles key value pair for style values
   * @deprecated use setNativeStyles instead
   */
  setStyles(styles: any) {
    Object.keys(styles).forEach(key => {
      document.documentElement.style.setProperty(`--${key}`, styles[key]);
    })
  }

  setNativeStyles(styles: any, el: ElementRef) {
    Object.keys(styles).forEach(key => {
      this.renderer.setStyle(el.nativeElement, `--${key}`, styles[key], RendererStyleFlags2.DashCase);
    })
  }

  getThemeConfig(module) {
    this.promise = new Promise((resolve, reject) => {
      this.getThemeModuleData(module).subscribe((response: any) => {
        this.config = response;
        resolve(true);
      }, error => {
        console.error('on reject', error);
        reject(true);
      })
    })
  }

  getThemeModuleData(module) {
    const domain_name = this.sessionService.get('config').domain_name;
    const obj = {
      domain_name,
      module,
      post_to_get: '1'
    };
    // if (this.sessionService.isPlatformServer())
    obj['source'] = '0';

    const params = new HttpParams({ encoder: new HttpParamEncoder(), fromObject: obj });

    const data = {
      url: 'themes/getUserTheme',
      params
    };
    return this.apiService.getWithEncodedParams(data.url, data.params);
    // return this.apiService.get({ url:`themes/getUserTheme`, body: obj });
  }
}
