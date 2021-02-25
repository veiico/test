import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PickupOptionComponent } from './pickup-option.component';

describe('PickupOptionComponent', () => {
  let component: PickupOptionComponent;
  let fixture: ComponentFixture<PickupOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickupOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickupOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
