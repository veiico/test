import { Component, OnInit, ViewChild, ViewContainerRef, Input, ElementRef, Compiler, OnChanges, SimpleChanges, NgZone } from '@angular/core';
import { IFooterData } from '../../interfaces/interface';
import { FooterComponent } from '../../../../app/modules/footer/footer.component';
import { ThemeService } from '../../../../app/services/theme.service';
import { DynamicCompilerService } from '../../../../app/services/dynamic-compiler.service';
import { SessionService } from '../../../../app/services/session.service';
import { templates } from '../../constants/template.constant';
import { CommonModule } from '@angular/common';
import { IDynamicCompilerData } from '../../../../app/interfaces/interfaces';

@Component({
  // selector: 'app-footer',
  template: '<ng-container #footerContainer> </ng-container>',
  styleUrls: []
})
export class DynamicFooterComponent extends FooterComponent implements OnInit {
  @ViewChild('footerContainer', { read: ViewContainerRef })
  footerTemplateViewRef: ViewContainerRef;

  constructor(protected themeService: ThemeService,
    protected el: ElementRef,
    protected sessionService: SessionService,
	protected dynamicCompilerService?: DynamicCompilerService
  ) {
    super(themeService, el,sessionService);
  }

  ngOnInit() {
    this.createDynamicTemplate();
  }


  createDynamicTemplate() {
    const dynamicCompilerService = this.dynamicCompilerService;
    const themeService = this.themeService;
	const el = this.el;
	const sessionService = this.sessionService;

    class DynamicFooterTemp extends DynamicFooterComponent {
      public variableWrapper = {};
      constructor() {
        super(themeService, el,sessionService);

      }
      async ngOnInit() {
        await this.initChecks();
          this.variableWrapper = { 
            footer_data: this.data,
            footer_styles: this.styles,
            is_enabled: this.is_enabled 
          }

      }
    }

    const template = (sessionService.get('templates').components && sessionService.get('templates').components.footer) ? sessionService.get('templates').components.footer.html : templates.footer.html;
    const tmpCss = (sessionService.get('templates').components && sessionService.get('templates').components.footer) ? sessionService.get('templates').components.footer.css : templates.footer.css;
    const importsArray = [CommonModule];
    const inputDataArray = {
      styles: this.styles,
      data: this.data
    }
    const componentConfig: IDynamicCompilerData = {
      templateRef: this.footerTemplateViewRef,
      template: template,
      css: tmpCss,
      imports: importsArray,
      rootClass: DynamicFooterTemp,
      inputData: inputDataArray
    };

    dynamicCompilerService.createComponentFactory(componentConfig);
  }

}
