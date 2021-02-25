import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EtisalatComponent } from './etisalat.component';

describe('EtisalatComponent', () => {
  let component: EtisalatComponent;
  let fixture: ComponentFixture<EtisalatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtisalatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtisalatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
