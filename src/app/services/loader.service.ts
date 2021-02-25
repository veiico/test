import { Injectable } from '@angular/core';
import * as $ from 'jquery';

@Injectable()
export class LoaderService {
  active = false;
  config: any;
  constructor() {
    // this.config = localStorage.getItem('config');
    // $('body #loader').css('border-bottom-color', this.config.color);
    // $('body #loader').css('border-left-color', this.config.color);
  }

  hide() {
    $('#global_loader').css('display', 'none');
    this.active = false;
  }
  show() {
    $('#global_loader').css('display', 'block');
    this.active = true;
  }
  isActive() {
   return this.active;
  }

}
