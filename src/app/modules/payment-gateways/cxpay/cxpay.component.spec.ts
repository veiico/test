import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CxpayComponent } from './cxpay.component';

describe('CxpayComponent', () => {
  let component: CxpayComponent;
  let fixture: ComponentFixture<CxpayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CxpayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CxpayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
