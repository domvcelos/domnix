import { TestBed } from '@angular/core/testing';

import { DepositService } from './deposit.service';

describe('DepositService', () => {
  let service: DepositService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DepositService);
  });

  xit('should be created', () => {
    expect(service).toBeTruthy();
  });
});
