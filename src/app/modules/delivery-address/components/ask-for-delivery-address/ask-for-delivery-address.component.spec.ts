import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AskForDeliveryAddressComponent } from './ask-for-delivery-address.component';

describe('AskForDeliveryAddressComponent', () => {
  let component: AskForDeliveryAddressComponent;
  let fixture: ComponentFixture<AskForDeliveryAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AskForDeliveryAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AskForDeliveryAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
