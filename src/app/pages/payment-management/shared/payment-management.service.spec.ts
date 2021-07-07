import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ToastrModule } from 'ngx-toastr';

import { PaymentManagementService } from './payment-management.service';

describe('PaymentManagementService', () => {
  let service: PaymentManagementService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, ToastrModule.forRoot()],
      providers: [],
    });
    service = TestBed.inject(PaymentManagementService);
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
