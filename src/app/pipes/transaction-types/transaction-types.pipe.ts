import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'transactionTypes'
})
export class TransactionTypesPipe implements PipeTransform {

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
      case 'CHARGE': {
        return 'Cobrança';
      }
      case 'TRANSFER': {
        return 'Transferência';
      }
      case 'PAYMENT': {
        return 'Pagamento';
      }
      case 'CREDIT': {
        return 'Crédito';
      }
      case 'DEBIT': {
        return 'Débito';
      }
      default: {
        return '';
      }
    }
  }

}
