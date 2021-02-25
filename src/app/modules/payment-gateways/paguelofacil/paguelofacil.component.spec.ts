import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaguelofacilComponent } from './paguelofacil.component';

describe('PaguelofacilComponent', () => {
  let component: PaguelofacilComponent;
  let fixture: ComponentFixture<PaguelofacilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaguelofacilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaguelofacilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
