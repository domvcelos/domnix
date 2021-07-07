import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { ICollection } from 'src/app/pages/collection-management/shared/collection-management.model';


@Pipe({
  name: 'statusCollection'
})
export class StatusCollectionPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(collection: ICollection): SafeHtml {
    const installments = collection.paid_installments ? collection.paid_installments : '';
    switch (collection.status) {
      case 'PAYED': {
        return this.sanitizer.bypassSecurityTrustHtml(
          '<p style=\'color:green\'>Pago ' + installments + '</p>'
        );
      }
      case 'CANCELED': {
        return this.sanitizer.bypassSecurityTrustHtml(
          '<p style=\'color:red\'>Cancelado ' + installments + '</p>'
        );
      }
      case 'CHARGEBACK': {
        return this.sanitizer.bypassSecurityTrustHtml(
          '<p style=\'color:red\'>Estornada ' + installments + '</p>'
        );
      }
      case 'PENDING': {
        return this.sanitizer.bypassSecurityTrustHtml(
          '<p style=\'color:#F2994A\'>Em aberto ' + installments + '</p>'
        );
      }
      case 'PARTIALLY_PAID': {
        return this.sanitizer.bypassSecurityTrustHtml(
          '<p style=\'color:#F2994A\'>Parcialmente paga ' + installments + '</p>'
        );
      }
      case 'EXPIRED': {
        return this.sanitizer.bypassSecurityTrustHtml(
          '<p style=\'color:#2ACAED\'>Expirada ' + installments + '</p>'
        );
      }
      default: {
        return '';
      }
    }
  }

}
