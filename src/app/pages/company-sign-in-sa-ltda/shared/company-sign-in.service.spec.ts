import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { CompanySignInService } from './company-sign-in.service';

describe('CompanySignInService', () => {
  let service: CompanySignInService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
      ],
    });
    service = TestBed.inject(CompanySignInService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
