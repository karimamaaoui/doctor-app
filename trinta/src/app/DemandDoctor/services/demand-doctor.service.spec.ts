import { TestBed } from '@angular/core/testing';

import { DemandDoctorService } from './demand-doctor.service';

describe('DemandDoctorService', () => {
  let service: DemandDoctorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DemandDoctorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
