import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreelancerHomepageComponent } from './freelancer-homepage.component';

describe('FreelancerHomepageComponent', () => {
  let component: FreelancerHomepageComponent;
  let fixture: ComponentFixture<FreelancerHomepageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreelancerHomepageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreelancerHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
