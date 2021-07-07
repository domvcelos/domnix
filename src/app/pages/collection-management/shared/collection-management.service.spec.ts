import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { CollectionManagementService } from './collection-management.service';


describe('CollectionManagementService', () => {
  let service: CollectionManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
      ],
    });
    service = TestBed.inject(CollectionManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
