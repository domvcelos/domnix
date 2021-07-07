import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { ManagePlansService } from './manage-plans.service';


describe('ManagePlansService', () => {
  let service: ManagePlansService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(ManagePlansService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
