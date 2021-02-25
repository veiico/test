/**
 * Created by cl-macmini-51 on 26/06/18.
 */
import { Injectable } from '@angular/core';

@Injectable()
export class RouteHistoryService {
  history = [];
  constructor() {
  }

  setHistory(data) {
    this.history.push(data);
  }
  getHistory() {
    return this.history;
  }

  public getPreviousUrl(): string {
    return this.history[this.history.length - 1] || '/index';
  }


}
