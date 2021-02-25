import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacetopayComponent } from './placetopay.component';

describe('PlacetopayComponent', () => {
  let component: PlacetopayComponent;
  let fixture: ComponentFixture<PlacetopayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlacetopayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacetopayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
