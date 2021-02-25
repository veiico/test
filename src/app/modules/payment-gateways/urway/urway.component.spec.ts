import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UrwayComponent } from './urway.component';

describe('UrwayComponent', () => {
  let component: UrwayComponent;
  let fixture: ComponentFixture<UrwayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrwayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrwayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
