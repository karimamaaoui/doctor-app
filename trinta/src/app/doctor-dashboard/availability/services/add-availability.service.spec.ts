import { TestBed } from '@angular/core/testing';

import { AddAvailabilityService } from './add-availability.service';

describe('AddAvailabilityService', () => {
  let service: AddAvailabilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddAvailabilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
