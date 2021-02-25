import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymarkComponent } from './paymark.component';

describe('PaymarkComponent', () => {
  let component: PaymarkComponent;
  let fixture: ComponentFixture<PaymarkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymarkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
