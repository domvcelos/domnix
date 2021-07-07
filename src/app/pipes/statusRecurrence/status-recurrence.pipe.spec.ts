import { inject, TestBed } from '@angular/core/testing';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { StatusRecurrencePipe } from './status-recurrence.pipe';

describe('StatusRecurrencePipe', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserModule],
    });
  });
  it('create an instance', inject(
    [DomSanitizer],
    (domSanitizer: DomSanitizer) => {
      const pipe = new StatusRecurrencePipe(domSanitizer);
      expect(pipe).toBeTruthy();
    }
  ));
});
