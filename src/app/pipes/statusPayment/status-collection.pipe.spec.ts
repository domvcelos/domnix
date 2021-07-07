import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { inject, TestBed } from '@angular/core/testing';

import { StatusPaymentPipe } from './status-collection.pipe';


describe('StatusPaymentPipe', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserModule],
    });
  });
  it('create an instance', inject(
    [DomSanitizer],
    (domSanitizer: DomSanitizer) => {
      const pipe = new StatusPaymentPipe(domSanitizer);
      expect(pipe).toBeTruthy();
    }
  ));
});
