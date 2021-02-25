import { Component, OnInit, Input, OnDestroy, ElementRef } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { IFooterData } from './interfaces/footer.interface';
import { Preview } from '../../themes/swiggy/modules/app/classes/preview.class';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent extends Preview implements OnInit, OnDestroy {

  @Input('styles') styles;
  @Input('data') data: IFooterData;

  public is_enabled: boolean;
  public config;

  constructor(protected themeService: ThemeService, protected el: ElementRef,protected sessionService:SessionService) {
    super(themeService);
  }

  ngOnInit() {
    this.config = this.sessionService.get('config');
    this.initChecks();
  }

  public initChecks() {
    return new Promise<boolean>((resolve,reject) => {
      if (!this.styles) {
        this.themeService.getThemeModuleData('footer').subscribe(res => {
          const footerData = res.footer ? res.footer.data : (res.fetchlocation && res.fetchlocation.footer ? res.fetchlocation.footer.data : null);
          if (footerData) {
            if (footerData.logo && footerData.logo.includes('https://yelodotred')) {
              footerData.logo = footerData.logo.replace('https://yelodotred.s3.amazonaws.com', 'https://cdn.ec2dashboard.com');
            }
            if (footerData.socialLinks) {
              footerData.socialLinks.forEach(item => {
                if (item.image && item.image.includes('https://yelodotred')) {
                  item.image = item.image.replace('https://yelodotred.s3.amazonaws.com', 'https://cdn.ec2dashboard.com');
                }
              });
            }
          }
          this.onPreview(res);
          resolve(true);
        });
      } else {
        this.is_enabled = true;
        setTimeout(() => {
          this.themeService.setNativeStyles(this.styles, this.el);
          resolve(true);
        });
      }
    });

  }

  /**
   * get footer json
   */
  onPreview(data) {
    // console.log('=====> existing data', data);
    if (data.footer) {
      this.data = data.footer.data;
      this.styles = data.footer.styles;
      this.is_enabled = data.footer.is_enabled;
      this.themeService.setNativeStyles(this.styles, this.el);
    }else if (data && data.fetchlocation && data.fetchlocation.footer) {
      this.data = data.fetchlocation.footer.data;
      this.styles = data.fetchlocation.footer.styles;
      this.is_enabled = data.fetchlocation.footer.is_enabled;
      this.themeService.setNativeStyles(this.styles, this.el);
      }
  }


  ngOnDestroy() {
    this.alive = false;
  }
}
