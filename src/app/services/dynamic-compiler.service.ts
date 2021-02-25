import { Compiler, Injectable, Component, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IDynamicCompilerData } from '../interfaces/interfaces';


@Injectable()
export class DynamicCompilerService {
  constructor(private compiler: Compiler) { }

  createComponentFactory(config: IDynamicCompilerData) {
    let confObj: any = {};

    confObj[config.template ? 'template' : 'templateUrl'] =
      config.template || config.templateUrl;
    confObj[config.css ? 'styles' : 'stylesURL'] =
      [config.css || config.stylesURL];
    if(config.animations) {
       confObj['animations'] = config.animations;
    }
    if(config.encapsulation) {
      confObj['encapsulation'] = config.encapsulation;
   }
    const tmpCmp = Component(confObj)(config.rootClass);
    const tmpModule = NgModule({
      declarations: [tmpCmp],
      imports: config.imports,
      schemas:[CUSTOM_ELEMENTS_SCHEMA]
    })(class { });

    return this.compiler
      .compileModuleAndAllComponentsAsync(tmpModule)
      .then(factories => {
        const f = factories.componentFactories.find(
          _ => _.componentType === config.rootClass
        );
        const cmpRef = config.templateRef.createComponent(f);
        if (config.inputData) {
          for (const val in config.inputData) {
            if (config.inputData[val]) {
              cmpRef.instance[val] = config.inputData[val];
            }
          }
        }
      });
  }
}
