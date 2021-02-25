import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DropDownListService {

  private menuStatus = new BehaviorSubject('+91');
  currentStatus = this.menuStatus.asObservable();

  constructor() { }

  changeStatus(code: string) {
    this.menuStatus.next(code);
  }

}
