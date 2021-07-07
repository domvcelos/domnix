import { CurrencyPipe } from '@angular/common';
import { inject, TestBed } from '@angular/core/testing';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { AmountColorPipe } from './amount-color.pipe';

describe('AmountColorPipe', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserModule],
    });
  });
  it('create an instance', inject(
    [DomSanitizer],
    (domSanitizer: DomSanitizer, currencyPipe: CurrencyPipe) => {
      const pipe = new AmountColorPipe(domSanitizer, currencyPipe);
      expect(pipe).toBeTruthy();
    }
  ));
});
