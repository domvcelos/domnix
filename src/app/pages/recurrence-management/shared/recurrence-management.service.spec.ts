import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { RecurrenceManagementService } from './recurrence-management.service';


describe('RecurrenceManagementService', () => {
  let service: RecurrenceManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
      ],
    });
    service = TestBed.inject(RecurrenceManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
