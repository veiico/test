import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotDiliverableComponent } from './not-diliverable.component';

describe('NotDiliverableComponent', () => {
  let component: NotDiliverableComponent;
  let fixture: ComponentFixture<NotDiliverableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotDiliverableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotDiliverableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
