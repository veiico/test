import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VukaComponent } from './vuka.component';

describe('VukaComponent', () => {
  let component: VukaComponent;
  let fixture: ComponentFixture<VukaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VukaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VukaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
