import { StatusCollectionPipe } from './status-collection.pipe';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { inject, TestBed } from '@angular/core/testing';

describe('StatusCollectionPipe', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserModule],
    });
  });
  it('create an instance', inject(
    [DomSanitizer],
    (domSanitizer: DomSanitizer) => {
      const pipe = new StatusCollectionPipe(domSanitizer);
      expect(pipe).toBeTruthy();
    }
  ));
});
