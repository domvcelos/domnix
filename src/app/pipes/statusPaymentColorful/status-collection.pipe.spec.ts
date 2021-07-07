import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { inject, TestBed } from '@angular/core/testing';

import { StatusPaymentColorfulPipe } from './status-collection.pipe';


describe('StatusPaymentColorfulPipe', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserModule],
    });
  });
  it('create an instance', inject(
    [DomSanitizer],
    (domSanitizer: DomSanitizer) => {
      const pipe = new StatusPaymentColorfulPipe(domSanitizer);
      expect(pipe).toBeTruthy();
    }
  ));
});
