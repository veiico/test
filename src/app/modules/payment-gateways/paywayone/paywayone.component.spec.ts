import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaywayoneComponent } from './paywayone.component';

describe('PaywayoneComponent', () => {
  let component: PaywayoneComponent;
  let fixture: ComponentFixture<PaywayoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaywayoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaywayoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
