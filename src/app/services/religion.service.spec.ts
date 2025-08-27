import { TestBed } from '@angular/core/testing';

import { ReligionService } from './religion.service';

describe('ReligionService', () => {
  let service: ReligionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReligionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
