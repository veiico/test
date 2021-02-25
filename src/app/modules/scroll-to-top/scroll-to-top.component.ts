import { Component, OnInit, OnDestroy, Input, Renderer2, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, } from '@angular/core';
import { Preview } from '../../themes/swiggy/modules/app/classes/preview.class';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-scroll-to-top',
  templateUrl: './scroll-to-top.component.html',
  styleUrls: ['./scroll-to-top.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollToTopComponent extends Preview implements OnInit, OnDestroy {
  showFloatingBtn: boolean;
  @Input('scrollTop') scrollTop: number = 100;

  @Input('styles') styles = {};
  @Input('data') data;

  private timerRef;
  private listener;
  constructor(private ref: ChangeDetectorRef, private renderer: Renderer2, private elementRef: ElementRef, private themeService: ThemeService) {
    super(themeService);
  }

  ngOnInit() {
    this.themeService.setNativeStyles(this.styles, this.elementRef);
    this.listener = this.renderer.listen('body', 'scroll', (e) => {
      this.onscroll(e);
    })
    // window.addEventListener('scroll', (e) => { this.onscroll(e) }, true); //third parameter
  }


  scrollToTop() {
    (document.getElementsByTagName('body')[0]).scrollTo({ top: 0, behavior: 'smooth' });
  }

  onscroll(e) {
    if (this.timerRef) clearTimeout(this.timerRef);
    this.timerRef = setTimeout(() => {
      if (e.target.scrollTop > this.scrollTop) {
        this.showFloatingBtn = true;
      }
      else {
        this.showFloatingBtn = false;
      }
      this.ref.detectChanges();
    })

  }

  ngOnDestroy() {
    if (this.listener)
      this.listener();
    this.alive = false;
    // window.removeEventListener('scroll', this.onscroll, true); //third parameter
  }
}
