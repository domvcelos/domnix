import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'creditCard'
})
export class CreditCardPipe implements PipeTransform {

  transform(cardNumber: number, visibleDigits: number = 4): string {
    const plainCreditCard = cardNumber.toString();
    const maskedSection = plainCreditCard.slice(0, -visibleDigits);
    const visibleSection = plainCreditCard.slice(-visibleDigits);
    return maskedSection.replace(/./g, '*') + visibleSection;
  }

}
