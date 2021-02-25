import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DokuComponent } from './doku.component';

describe('DokuComponent', () => {
  let component: DokuComponent;
  let fixture: ComponentFixture<DokuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DokuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DokuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
