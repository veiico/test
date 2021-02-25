import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GtbankComponent } from './gtbank.component';

describe('GtbankComponent', () => {
  let component: GtbankComponent;
  let fixture: ComponentFixture<GtbankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GtbankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GtbankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
