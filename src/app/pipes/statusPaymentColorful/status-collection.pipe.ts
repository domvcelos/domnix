import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { IPayment } from 'src/app/pages/payment-management/shared/payment.model';


@Pipe({
  name: 'statusPaymentColorful'
})
export class StatusPaymentColorfulPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) { }

  transform(payment: IPayment): SafeHtml {
    switch (payment.status) {
      case 'PAYED': {
        return this.sanitizer.bypassSecurityTrustHtml(
          '<p style=\'color:green\'>Pago</p>'
        );
      }
      case 'CHARGEBACK': {
        return this.sanitizer.bypassSecurityTrustHtml(
          '<p style=\'color:red\'>Estornada</p>'
        );
      }
      case 'PENDING': {
        return this.sanitizer.bypassSecurityTrustHtml(
          '<p style=\'color:#F2994A\'>Em aberto</p>'
        );
      }
      case 'EXTERNAL_REJECTION': {
        return this.sanitizer.bypassSecurityTrustHtml(
          '<p style=\'color:#2ACAED\'>Não aceito</p>'
        );
      }
      default: {
        return '';
      }
    }
  }

}
