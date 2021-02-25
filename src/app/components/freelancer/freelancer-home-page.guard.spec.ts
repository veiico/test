import { TestBed, async, inject } from '@angular/core/testing';

import { FreelancerHomePageGuard } from './freelancer-home-page.guard';

describe('FreelancerHomePageGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FreelancerHomePageGuard]
    });
  });

  it('should ...', inject([FreelancerHomePageGuard], (guard: FreelancerHomePageGuard) => {
    expect(guard).toBeTruthy();
  }));
});
