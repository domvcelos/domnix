import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { Utils } from 'src/app/common/utils';
import { TransferService } from './transfer.service';


describe('TransferService', () => {
  let service: TransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
      ],
      providers: [
        Utils,
      ]
    });
    service = TestBed.inject(TransferService);
  });

  xit('should be created', () => {
    expect(service).toBeTruthy();
  });
});
