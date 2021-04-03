import { TestBed } from '@angular/core/testing';

import { LeadsServiceService } from './leads-service.service';

describe('LeadsServiceService', () => {
  let service: LeadsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeadsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
