import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ToastrModule } from 'ngx-toastr';

import { LoginService } from './login.service';


describe('LoginserviceService', () => {
  let service: LoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        RouterTestingModule,
        ToastrModule.forRoot(),
      ],
    });
    service = TestBed.inject(LoginService);
  });

  xit('should be created', () => {
    expect(service).toBeTruthy();
  });
});
