import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PixelpayComponent } from './pixelpay.component';

describe('PixelpayComponent', () => {
  let component: PixelpayComponent;
  let fixture: ComponentFixture<PixelpayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PixelpayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PixelpayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
