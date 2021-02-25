import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaykuComponent } from './payku.component';

describe('PaykuComponent', () => {
  let component: PaykuComponent;
  let fixture: ComponentFixture<PaykuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaykuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaykuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
