import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VivaComponent } from './viva.component';

describe('VivaComponent', () => {
  let component: VivaComponent;
  let fixture: ComponentFixture<VivaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VivaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VivaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
