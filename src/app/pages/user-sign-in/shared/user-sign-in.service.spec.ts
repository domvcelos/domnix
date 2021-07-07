import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { UserSignInService } from './user-sign-in.service';


describe('UserSignInService', () => {
  let service: UserSignInService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
      ],
    });
    service = TestBed.inject(UserSignInService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
