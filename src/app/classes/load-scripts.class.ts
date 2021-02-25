import { SessionService } from './../services/session.service';
import { environment } from "../../environments/environment";
import { Renderer2, ElementRef } from '@angular/core';
declare var mapboxgl;
// load scripts post app component load
export class LoadScriptsPostAppComponentLoad {
  static stripePromise: Promise<boolean>;
  static init() {
    this.userIpAddress();
  }

  private static userIpAddress() {
    const script = document.createElement('script');
    script.src = 'https://jsonip.com/callback=getIP';
    document.head.appendChild(script);
  }

  static stripe(document: HTMLDocument, renderer: Renderer2, el: ElementRef): Promise<boolean> {
    this.stripePromise = new Promise((resolve, reject) => {
      if (document.getElementById('stripeScript')) return resolve(true);
      const body = renderer.parentNode(el.nativeElement)

      const script = renderer.createElement('script');
      script.id = "stripeScript"
      script.src = 'https://js.stripe.com/v3/';
      script.onload = () => { resolve(true); }
      renderer.appendChild(body, script);
    })
    return this.stripePromise;
  }

  static googleAnalytics() {
    return new Promise((resolve, reject) => {
      if (document.getElementById('gaScript')) return resolve(true);

      ((i, s, o, g, r, a, m) => {
        i['GoogleAnalyticsObject'] = r;
        i[r] = i[r] || function () {
          (i[r].q = i[r].q || []).push(arguments)
        }, i[r].l = 1 * (<any>new Date());
        a = s.createElement(o),
          m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        a.id = "gaScript";
        a.onload = () => {
          resolve(true);
          (<any>window).ga('create', 'UA-113061976-2', 'auto'); // <- add the UA-ID from your tracking code
        };
        m.parentNode.insertBefore(a, m)
      })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

    });
  }

  static netcore(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (document.getElementById('smartech')) return resolve(true);

      const script = document.createElement('script');
      script.id = "smartech";
      script.type = "text/javascript"
      script.src = 'https://cdnt.netcoresmartech.com/smartechclient.js';
      script.onload = () => { resolve(true); }
      document.head.appendChild(script);
    })
  }
  constructor(private sessionService: SessionService) {
  }
  hippo(): Promise<boolean> {
    let hippo_url;
    const config = this.sessionService.get('config');
    const protoCol: string = (location && location.protocol && ['http:', 'https:'].includes(location.protocol)) ? location.protocol : 'https:';
    if (this.sessionService.isMerchantDomain()) {
      hippo_url = `${protoCol}//${config.merchant_domain_obj.domain_name}/widget-scripts/widget.js`;
    } else {
      hippo_url = `${protoCol}//${config.domain_name}/widget-scripts/widget.js`;
    }
    if (!(environment.production || environment.beta)) { hippo_url = 'https://test-chat.fuguchat.com/js/widget.js'; }
    return new Promise((resolve, reject) => {
      if (document.getElementById('hippoScript')) return resolve(true);

      const script = document.createElement('script');
      script.id = "hippoScript";
      script.src = hippo_url;
      script.onload = () => { resolve(true); }
      document.head.appendChild(script);
    })
  }

  static loadFlightmapJs(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (document.getElementById("fm-map-js"))
        return resolve(true);
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.defer = true;
      script.id = "fm-map-js";
      script.src = "https://maps.flightmap.io/flightmapjs"; //flightmap.js //not from dist
      script.onload = () => {
        resolve(true);
        setTimeout(()=> {
          if( mapboxgl && mapboxgl.getRTLTextPluginStatus()=="unavailable"){
            mapboxgl.setRTLTextPlugin(
            'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
            null,
            true // Lazy load the plugin
            );
            }
        });
      };
      document.head.appendChild(script);
    });

  }
  
}
