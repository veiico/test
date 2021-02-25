import { Component, OnInit, OnDestroy } from '@angular/core';
import { ThemeService } from '../../../../../../services/theme.service';
import { Preview } from '../../classes/preview.class';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends Preview implements OnInit, OnDestroy {

  content;
  constructor(private themeService: ThemeService) {
    super(themeService);
  }

  ngOnInit() {
    this.content = this.themeService.config;
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
