import { Component, OnInit, Input } from '@angular/core';
@Component({
  selector: 'app-catalogue-shimmer',
  templateUrl: './catalogue-shimmer.component.html',
  styleUrls: ['./catalogue-shimmer.component.scss',
  '../../../../modules/n-level-catalogue/components/n-level-category/n-level-category.component.scss']

})
export class CatalogueShimmerComponent implements OnInit {

  @Input('shimmerType') public shimmerType;
  constructor() { }

  ngOnInit() {
  }

}
