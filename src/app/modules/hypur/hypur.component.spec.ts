import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HypurComponent } from './hypur.component';

describe('HypurComponent', () => {
  let component: HypurComponent;
  let fixture: ComponentFixture<HypurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HypurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HypurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
