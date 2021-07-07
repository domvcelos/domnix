import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paymentTransactionType',
})
export class PaymentTransactionTypePipe implements PipeTransform {
  transform(paymentMethod: string): string {
    switch (paymentMethod) {
      case 'CREDIT_CARD': {
        return 'Cartão de crédito';
      }
      case 'NIX': {
        return 'Conta Nix';
      }
      case 'MULTI': {
        return 'Saldo Nix + Cŕedito';
      }
      default: {
        return '';
      }
    }
  }
}
