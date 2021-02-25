import { Component, OnInit, Input, OnDestroy, ElementRef } from '@angular/core';
import { IFeature } from '../../interfaces/features.interface';
import { ThemeService } from '../../../../../../services/theme.service';
import { Preview } from '../../classes/preview.class';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss']
})
export class FeaturesComponent extends Preview implements OnInit, OnDestroy {

  @Input('styles') styles;
  @Input('data') data;

  //array of features
  features: IFeature[] = []
  constructor(private themeService: ThemeService, private el:ElementRef) { 
    super(themeService);
  }

  ngOnInit() {
    this.features = this.data.features;
    this.themeService.setNativeStyles(this.styles,this.el);
    this.initChecksv2()
  }

  ngOnDestroy() {
    this.alive = false;
  }
  public initChecksv2() {
    return new Promise<boolean>((resolve,reject) => {
      if (!this.styles) {
        this.themeService.getThemeModuleData('fetchlocation').subscribe(res => {
          const IFeature = res && res.features && res.features.data ? res.features.data : (res.fetchlocation && res.fetchlocation.features ? res.fetchlocation.features.data : null);
          this.onPreview(res);
          resolve(true);
        });
      } else {
        // this.is_enabled = true;
        setTimeout(() => {
          this.themeService.setNativeStyles(this.styles, this.el);
          resolve(true);
        });
      }
    });

  }


  onPreview(data) {
    if (data && data.features) {
      this.features = data.features.data.features;
      this.styles = data.features.styles;
      this.themeService.setNativeStyles(this.styles, this.el);
    }else if (data && data.fetchlocation && data.fetchlocation.features) {
      this.data = data.fetchlocation.features.data;
      this.styles = data.fetchlocation.features.styles;
      this.themeService.setNativeStyles(this.styles, this.el);
      }
  }

}
