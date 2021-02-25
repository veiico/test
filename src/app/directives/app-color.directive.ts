import { Directive, Input, ElementRef, Renderer2, OnInit, HostListener } from '@angular/core';
import { SessionService } from '../services/session.service';
declare var $: any;

@Directive({
  selector: '[appColor]'
  // host: {
  //  '(mouseenter)': 'onHover()',
  //  '(mouseleave)': 'onBlur()',
  // }
})
export class AppColorDirective implements OnInit {
  @Input('bg') bg: string;
  @Input('bs') bs: string;
  @Input('hoverbg') hoverbg: string;
  @Input('hoverbgSimple') hoverbgSimple: string;
  @Input('hoverbgWithoutBorder') hoverbgWithoutBorder: string;
  @Input('onlyForStores') onlyForStores: string;
  @Input('onlyColor') onlyColor: string;
  @Input('loginColor') loginColor: string;
  @Input('profileColor') profileColor: string;
  private color: string;
  private header_color: string;
  private header_element_color: string;
  constructor(private el: ElementRef, private sessionService: SessionService, private renderer: Renderer2) {

  }
  ngOnInit() {
    const config = this.sessionService.get('config');
    if (config) {
      this.header_color = config['header_color'];
      this.header_element_color = config['header_element_color'] ? config['header_element_color'] : 'red';
      this.color = config['color'] || '#e13d36';
      this.getAppColor();
    }
  }
  getAppColor() {
    const element = this.el.nativeElement;
    // let color = this.sessionService.getByKey('app', 'config', 'color');

    if (this.onlyColor) {
      this.renderer.setStyle(this.el.nativeElement, 'color', this.color || '#e13d36' + '!important');
    }

    if (this.hoverbg) {
      this.renderer.setStyle(this.el.nativeElement, 'color', this.color || '#e13d36' + '!important');
      this.resetColor(this.color);
    }
    if (this.hoverbgSimple) {
      this.renderer.setStyle(this.el.nativeElement, 'color', this.color || '#e13d36' + '!important');
      this.highlight(this.color);
    }
    if (this.bs) {
      this.renderer.setStyle(this.el.nativeElement, 'color', this.color || '#e13d36' + '!important');
      this.boxShadow(this.color);
    }
    if (this.bg) {
      this.renderer.setStyle(this.el.nativeElement, 'color', this.color || '#e13d36' + '!important');
      this.backGround(this.color);
    }
    if (this.hoverbgWithoutBorder) {
      this.renderer.setStyle(this.el.nativeElement, 'color', this.color || '#e13d36' + '!important');
      this.resetColorWithoutBorder(this.color);
    }
    if (this.onlyForStores) {
      this.resetOnlyForStore(this.color);
    }

    if (this.loginColor) {
      this.initialLogin(this.header_element_color);
    }
    if (this.profileColor) {
      this.initialProfile(this.header_element_color);
    }

  }
  @HostListener('mouseenter') onMouseEnter() {
    const element = this.el.nativeElement;
     if (this.hoverbg) {this.highlight(this.color); }
     if (this.hoverbgSimple) {this.resetColor(this.color); }
    if (this.hoverbgWithoutBorder) {this.backGround(this.color); }
    if (this.onlyForStores) {this.onlyBackground(this.color); }
    if (this.loginColor) {this.hoverLogin(this.header_element_color); }
    if (this.profileColor) {this.hoverProfile(this.header_element_color); }
    // if(this.bs) this.boxShadow(this.color);
  }
  @HostListener('mouseleave') onMouseLeave() {
    if (this.hoverbg) {
      this.resetColor(this.color);
    }
    if (this.hoverbgSimple) {
      this.highlight(this.color);
    }
    if (this.hoverbgWithoutBorder) {
      this.resetColorWithoutBorder(this.color);
    }
    if (this.onlyForStores) {
      this.resetOnlyForStore(this.color);
    }
    if (this.loginColor) {
      this.initialLogin(this.header_element_color);
    }
    if (this.profileColor) {
      this.initialProfile(this.header_element_color);
    }
  }
  private highlight(color: string) {
    this.backGround(color);
    this.renderer.setStyle(this.el.nativeElement, 'border', '2px solid ' + color);
  }
  private resetColor(color: string) {
    this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', '#fff');
    this.renderer.setStyle(this.el.nativeElement, 'color', color);
     this.renderer.setStyle(this.el.nativeElement, 'border', '2px solid ' + color);
  }
  private boxShadow(color: string) {
    this.renderer.setStyle(this.el.nativeElement, 'boxShadow', '0 6px 18px ' + color);
  }
  private backGround(color: string) {
    this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', color);
    this.renderer.setStyle(this.el.nativeElement, 'color', '#fff');
    this.renderer.setStyle(this.el.nativeElement, 'border-color', 'rgba(0, 0, 0, 0)');
  }
  private onlyBackground(color: string) {
    this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', color);
    this.renderer.setStyle(this.el.nativeElement, 'color', '#fff');
  }
  private resetOnlyForStore(color: string) {
    this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', '#fff');
    this.renderer.setStyle(this.el.nativeElement, 'color', '#595b60');

  }
  private resetColorWithoutBorder(color: string) {
    this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', '#fff');
    this.renderer.setStyle(this.el.nativeElement, 'color', color);
  }

  private initialLogin(color: string) {
    this.renderer.setStyle(this.el.nativeElement, 'color', color);
    this.renderer.setStyle(this.el.nativeElement, 'border-color', 'transparent');
  }

  private hoverLogin(color: string) {
    this.renderer.setStyle(this.el.nativeElement, 'color', color);
    this.renderer.setStyle(this.el.nativeElement, 'border-color', color);
  }

  private initialProfile(color: string) {
    if (this.header_color === '#ffffff' || this.header_color === '#fff' || this.header_color === 'white' || this.header_color === '#FFFFFF' || this.header_color === '#FFF') {
      this.renderer.setStyle(this.el.nativeElement, 'background-color', color);
      this.renderer.setStyle(this.el.nativeElement, 'border-color', 'transparent');
    } else {
      this.renderer.setStyle(this.el.nativeElement, 'background-color', this.color);
      this.renderer.setStyle(this.el.nativeElement, 'border-color', 'transparent');
    }

  }

  private hoverProfile(color: string) {
    if (this.header_color === '#ffffff' || this.header_color === '#fff' || this.header_color === 'white' || this.header_color === '#FFFFFF' || this.header_color === '#FFF') {
      this.renderer.setStyle(this.el.nativeElement, 'background-color', color);
      this.renderer.setStyle(this.el.nativeElement, 'border-color', 'transparent');
    } else {
      this.renderer.setStyle(this.el.nativeElement, 'background-color', 'transparent');
      this.renderer.setStyle(this.el.nativeElement, 'border-color', '#fff');
    }

  }
}
