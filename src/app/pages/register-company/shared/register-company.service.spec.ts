import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { RegisterCompanyService } from './register-company.service';


describe('RegisterCompanyService', () => {
  let service: RegisterCompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
      ]
    });
    service = TestBed.inject(RegisterCompanyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
