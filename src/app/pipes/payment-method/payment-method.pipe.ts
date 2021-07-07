import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paymentMethod',
})
export class PaymentMethodPipe implements PipeTransform {
  transform(paymentMethod: string): string {
    switch (paymentMethod) {
      case 'CREDIT_CARD': {
        return 'Cartão de crédito';
      }
      case 'PAYMENT_BOOK': {
        return 'Carnê';
      }
      case 'LINK': {
        return 'Link';
      }
      case 'BILLET': {
        return 'Boleto';
      }
      case 'NIX': {
        return 'Nix';
      }
      case 'MULTI': {
        return 'Multi';
      }
      default: {
        return '';
      }
    }
  }
}
