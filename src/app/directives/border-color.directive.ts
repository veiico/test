import { Directive, Input, ElementRef, Renderer2, OnInit, HostListener } from '@angular/core';
import { SessionService } from '../services/session.service';

@Directive({
    selector: '[appBc]'
    // host: {
    //    '(mouseenter)': 'onHover()',
    //    '(mouseleave)': 'onBlur()',
    // }
})
export class BorderColorDirective {
    color: any;
    constructor(private el: ElementRef, private renderer: Renderer2, private sessionService: SessionService) {
      const config = this.sessionService.get('config');
      if (config) {
        this.color = config['color'] || '#e13d36';
      }
    }
  @HostListener('mouseenter') onMouseEnter() {
        this.renderer.setStyle(this.el.nativeElement, 'borderColor', this.color);
    }
  @HostListener('mouseleave') onMouseLeave() {
        this.renderer.removeStyle(this.el.nativeElement, 'borderColor');

    }

}
