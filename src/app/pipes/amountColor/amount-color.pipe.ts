import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Pipe({
  name: 'amountColor'
})
export class AmountColorPipe implements PipeTransform {

  constructor(
    private sanitizer: DomSanitizer,
    private currencyPipe: CurrencyPipe,
  ) { }

  transform(amount: string): SafeHtml {
    if (Number(amount) < 0) {
      return this.sanitizer.bypassSecurityTrustHtml(
        `<p style=\'color:red\'>${this.currencyPipe.transform(amount)}</p>`
      );
    } else {
      return this.sanitizer.bypassSecurityTrustHtml(
        `<p style=\'color:green\'>${this.currencyPipe.transform(amount)}</p>`
      );
    }
  }

}
