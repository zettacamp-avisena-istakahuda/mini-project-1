import { TestBed } from '@angular/core/testing';

import { GeneralGuardGuard } from './general-guard.guard';

describe('GeneralGuardGuard', () => {
  let guard: GeneralGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(GeneralGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
