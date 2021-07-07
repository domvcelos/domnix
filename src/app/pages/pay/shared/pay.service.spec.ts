import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ToastrModule } from 'ngx-toastr';
import { LoginService } from '../../login/shared/login.service';

import { PayService } from './pay.service';

describe('PayService', () => {
  let service: PayService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, ToastrModule.forRoot()],
      providers: [LoginService],
    });
    service = TestBed.inject(PayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
