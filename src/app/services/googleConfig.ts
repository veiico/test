/**
 * Created by cl-macmini-51 on 13/07/18.
 */
import { Injectable } from '@angular/core';
import { LazyMapsAPILoaderConfigLiteral } from '@agm/core';

import { environment } from '../../environments/environment';
import { SessionService } from "./session.service";

@Injectable()
export class GoogleMapsConfig implements LazyMapsAPILoaderConfigLiteral {
  public apiKey: string;
  public channel: string;
  public clientId: string;
  public libraries: Array<string>;
  //google
  public isSocomoKeyUsed: boolean;
  public isIframeLoaded: Promise<boolean> = new Promise<boolean>(() => { });;
  public iframeRef: Window;

  constructor(private sessionService: SessionService, ) {

    if ((environment.production || environment.beta)) {
      if (this.sessionService.get('config') && this.sessionService.get('config').webapp_google_api_key) {
        this.apiKey = this.sessionService.get('config').webapp_google_api_key;
      } else {
        this.apiKey = 'AIzaSyCC8Lq3YxDSF89KSf-L2XffD7Rq5smXJ00';
        // this.useSocomoKey();
      }
    } else {
      if (this.sessionService.get('config') && this.sessionService.get('config').webapp_google_api_key) {
        this.apiKey = this.sessionService.get('config').webapp_google_api_key;
      } else {
        this.apiKey = 'AIzaSyBaEg1qxFF_v0ZQPGWrt8FBmsOGVu6FTEA';
      }
    }
    if (!this.isSocomoKeyUsed)
      this.isIframeLoaded = Promise.resolve(true);

    this.libraries = ['places'];
  }

  private useSocomoKey() {
    // this.isSocomoKeyUsed = true;
    this.clientId = 'gme-socomotechnologies';
    this.channel = 'yelo_webapp-' + window.location.hostname;
    // this.intializeScript('socomokey2');
  }

  private intializeScript(iframeId) {
    if (!this.sessionService.isPlatformServer()) {
      const iframe = document.getElementById(iframeId) as HTMLIFrameElement;
      this.iframeRef = iframe.contentWindow;
      if ((iframe.contentWindow.window as any).mapLoaded)
        this.isIframeLoaded = Promise.resolve(true);
    }
    // alert('init');
    // const id = document.getElementById(iframeId) as HTMLIFrameElement;
    // if (id) {
    //   return;
    // }
    // const iframe = document.createElement('iframe');
    // iframe.id = iframeId;
    // iframe.src = "/index2.html";
    // this.isIframeLoaded = new Promise((resolve, reject) => { iframe.onload = () => { this.iframeRef = iframe.contentWindow; resolve(true); } })
    // document.body.appendChild(iframe);

  }
}
