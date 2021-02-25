import { Injectable, Inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { tookanResponse } from '../constants/constant';
import { Subscription } from 'rxjs';
import { Meta, Title } from '@angular/platform-browser';
import { SessionService } from './session.service';
import { HttpParamEncoder } from '../classes/encoder.class';
import { ApiService } from './api.service';
import { DOCUMENT } from '@angular/common';

@Injectable()
export class SeoService {

    subscription: Subscription;
    constructor(private meta: Meta, private sessionService: SessionService,
      @Inject(DOCUMENT) private _document: HTMLDocument,
       private titleService: Title, private apiService: ApiService) {
    }

    private getSeoData(route: string, id: string) {
        const config = this.sessionService.get('config');
        id = id || config.marketplace_user_id.toString();
        const body = {
            route,
            post_to_get: '1',
            marketplace_user_id: config.marketplace_user_id.toString(),
            id
        };
        const params = new HttpParams({ encoder: new HttpParamEncoder(), fromObject: body });

        const data = {
          url: 'seo/getPageSeo',
          params
        };
        return this.apiService.getWithEncodedParams(data.url, data.params);
    }

    getRouteSeo(path: string, id: string) {
        const config = this.sessionService.get('config');
        if (!config.seo_active) { return; }
        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        this.subscription = this.getSeoData(path, id).subscribe(response => {
            response.data = response.data || {};
            response.data.seo_fields = response.data.seo_fields || {};

            this._document.getElementById('size32')
            .setAttribute('href', response.data.image_url || config.background_image );

            this._document.getElementById('size192')
            .setAttribute('href', response.data.image_url || config.background_image );

            this.meta.updateTag({ name: 'google-site-verification', content: response.data.google_site_verification });
             this.meta.updateTag({ name: 'title', content: response.data.seo_fields.title || response.data.seo_title });
            this.meta.updateTag({ name: 'description', content: response.data.seo_fields.description || response.data.seo_description });
            this.meta.updateTag({ name: 'keywords', content: response.data.seo_fields.keywords });
            this.meta.updateTag({ name: 'googlebot', content: 'index' });


            this.meta.updateTag({ property: 'twitter:card', content: 'summary_large_image' });
            this.meta.updateTag({ property: 'twitter:title', content: response.data.seo_title || config.app_description });
            this.meta.updateTag({ property: 'twitter:description', content: response.data.seo_description || response.data.seo_fields.description  });
            this.meta.updateTag({ property: 'twitter:image', content: response.data.image_url || config.background_image });

            let oglUrl = this.sessionService.getString('domain') + (window.location.pathname ? window.location.pathname : '');

            this.meta.updateTag({ property: 'og:url', content: this.sessionService.getString('domain') + oglUrl });
            this.meta.updateTag({ property: 'og:type', content: "website" });
            this.meta.updateTag({ property: 'og:title', content: response.data.seo_title || config.app_description });
            this.meta.updateTag({ property: 'og:description', content: response.data.seo_description || response.data.seo_fields.description  });
            this.meta.updateTag({ property: 'og:image', content: response.data.image_url || config.background_image });
            this.meta.updateTag({ property: 'og:image:width', content: "400" });
            this.meta.updateTag({ property: 'og:image:height', content: "300" });

            this.meta.updateTag({ itemprop: 'image', content: response.data.image_url || config.background_image });
            this.meta.updateTag({ itemprop: 'description', content: response.data.seo_description || response.data.seo_fields.description  });
            this.meta.updateTag({ itemprop: 'name', content: response.data.seo_title || config.app_description  });

            if(response.data.apple_app_id)
              this.meta.updateTag({ name: 'apple-itunes-app', content: `app-id=${response.data.apple_app_id}`  });

            if (response.data.seo_fields.title) {
                this.titleService.setTitle(response.data.seo_fields.title);
            } else {
                this.titleService.setTitle(config.form_name ? config.form_name : '');
            }
        }, error => {
            console.error(error);
        });
    }
}
