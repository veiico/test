import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProxypayComponent } from './proxypay.component';

describe('ProxypayComponent', () => {
  let component: ProxypayComponent;
  let fixture: ComponentFixture<ProxypayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProxypayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProxypayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
