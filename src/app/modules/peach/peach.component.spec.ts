import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeachComponent } from './peach.component';

describe('PeachComponent', () => {
  let component: PeachComponent;
  let fixture: ComponentFixture<PeachComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeachComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
