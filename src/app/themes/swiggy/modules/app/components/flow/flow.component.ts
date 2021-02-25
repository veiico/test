import { Component, OnInit, Input, OnDestroy, ElementRef } from '@angular/core';
import { IFlow } from '../../interfaces/flow.interface';
import { ThemeService } from '../../../../../../services/theme.service';
import { Preview } from '../../classes/preview.class';

@Component({
  selector: 'app-flow',
  templateUrl: './flow.component.html',
  styleUrls: ['./flow.component.scss']
})
export class FlowComponent extends Preview implements OnInit, OnDestroy {
  @Input('styles') styles;
  @Input('data') data;

  //array of features
  flow: IFlow[] = []
  title: string;
  rows: Array<IFlow[]> = [];
  constructor(private themeService: ThemeService, private el: ElementRef) {
    super(themeService);
  }

  ngOnInit() {
    this.themeService.setNativeStyles(this.styles, this.el);

    this.title = this.data.title;
    this.flow = this.data.items;
    // this.flow.push(this.flow[0])
    // this.flow.push(this.flow[1])
    this.calculateRows();
    this.initChecksv2()

  }

  public initChecksv2() {
    return new Promise<boolean>((resolve,reject) => {
      if (!this.styles) {
        this.themeService.getThemeModuleData('fetchlocation').subscribe(res => {
          // alert(res,'res')
          const IFeature =  res && res.flow ? res.flow.data : (res.fetchlocation && res.fetchlocation.flow ? res.fetchlocation.flow.data : null);
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
   
    if (data && data.flow) {
      this.flow = data.flow.data.items;
      this.title=data.flow.data.title;
      this.styles = data.flow.styles;
      this.themeService.setNativeStyles(this.styles, this.el);
    }else if (data && data.fetchlocation && data.fetchlocation.flow) {
      this.data = data.fetchlocation.flow.data;
      this.styles = data.fetchlocation.flow.styles;
      this.themeService.setNativeStyles(this.styles, this.el);
      }
      this.calculateRows();
  }



  calculateRows() {
    const length = this.flow.length;
    if (!length) {
      this.rows = [];
      return;
    }
    let noOfRows = 1;
    if (length > 1)
      noOfRows = Math.ceil(length / 2);
    const isEven = length % noOfRows == 0 && length > 1 ? true : false;

    const rows: Array<IFlow[]> = [];
    let counter = 0;

    for (let index = 1; index <= noOfRows; index++) {
      let arr: IFlow[] = [];
      if (length == 1 || (!isEven && index % 2 == 0 && !(index == noOfRows && counter == length - 2))) {
        //only 1 item in even rows if isEven false
        arr.push(this.flow[counter]);
      }
      else {
        //only 2 items 
        arr.push(this.flow[counter]);
        counter++;
        arr.push(this.flow[counter]);
      }
      rows.push(arr);
      counter++;
    }

    this.rows = rows;
  }
  ngOnDestroy() {
    this.alive = false;
  }
}
