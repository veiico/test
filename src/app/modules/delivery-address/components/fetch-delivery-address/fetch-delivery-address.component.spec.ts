import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FetchDeliveryAddressComponent } from './fetch-delivery-address.component';

describe('FetchDeliveryAddressComponent', () => {
  let component: FetchDeliveryAddressComponent;
  let fixture: ComponentFixture<FetchDeliveryAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FetchDeliveryAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FetchDeliveryAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
