import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { IPayment } from 'src/app/pages/payment-management/shared/payment.model';


@Pipe({
  name: 'statusPayment'
})
export class StatusPaymentPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) { }

  transform(status: string): string {
    switch (status) {
      case 'PAYED': {
        return 'Pago';
      }
      case 'CHARGEBACK': {
        return 'Estornada';
      }
      case 'PENDING': {
        return 'Em aberto';
      }
      case 'EXTERNAL_REJECTION': {
        return 'Não aceito';
      }
      default: {
        return '';
      }
    }
  }

}
