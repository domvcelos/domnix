import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { IBank } from 'src/app/common/services/bank/bank.model';
import { BANKLIST } from 'src/app/common/services/bank/mock-bank';
import { environment } from 'src/environments/environment';
import { ISubPeople } from '../../contacts/shared/contacts.model';
import { ICheckoutOrder, IPaymanetMethod } from './charge.model';
import { PAYMENTMETHODS } from './mock-charge';

@Injectable({
  providedIn: 'root',
})
export class ChargeService {
  checkoutOrder!: ICheckoutOrder;
  private apiGateway: string;

  constructor(private httpClient: HttpClient) {
    this.apiGateway = environment.APIs.GATEWAY;

    this.checkoutOrder = {
      creditCardFee: 0,
      billetFee: 0,
      origin: '',
      transaction_type: '',
      company_id: '',
      company_email: '',
      payer_account_id: '',
      payer_social_number: '',
      payer_name: '',
      payer_email: '',
      amount: 0,
      numberOfBills: 1,
      due_date: '',
      shipping: 0,
      discount: 0,
      discount_type: '',
      options: '',
      comments: '',
      payer_address: {
        country: '',
        zip_code: '',
        street: '',
        city: '',
        state: '',
        neighborhood: '',
        number: '',
        complement: '',
      },
    };
  }

  getBanks(): Observable<any> {
    return this.httpClient
      .get<any>(`${this.apiGateway}/nixbank/banklist`)
      .pipe(take(1));
  }

  getPaymentMethods(): Promise<IPaymanetMethod[]> {
    return Promise.resolve(PAYMENTMETHODS);
  }

  getCheckOrder(): ICheckoutOrder {
    return this.checkoutOrder;
  }
  setPayer(payer: ISubPeople): void {
    this.checkoutOrder.payer_account_id = payer.id;
    this.checkoutOrder.payer_social_number = payer.document_value;
    this.checkoutOrder.payer_name = payer.name;
    this.checkoutOrder.payer_email = payer.email;
    this.checkoutOrder.payer_address.city = payer.city;
    this.checkoutOrder.payer_address.zip_code = payer.zip_code;
    this.checkoutOrder.payer_address.street = payer.street;
    this.checkoutOrder.payer_address.state = payer.state;
    this.checkoutOrder.payer_address.neighborhood = payer.neighborhood;
    this.checkoutOrder.payer_address.city = payer.city;
    this.checkoutOrder.payer_address.number = payer.number;
    this.checkoutOrder.payer_address.complement = payer.complement;
  }
  setPaymentCardData(
    amount: number,
    discount: number,
    discountType: string,
    transactionType: string,
    comments: string,
    dueDate: string,
    shipping: number,
    creditCardFee: number,
    billetFee: number
  ): void {
    this.checkoutOrder.amount = amount;
    if (dueDate) {
      this.checkoutOrder.due_date = dueDate;
    }
    if (shipping) {
      this.checkoutOrder.shipping = shipping;
    }
    this.checkoutOrder.discount = discount;
    this.checkoutOrder.discount_type = discountType;
    this.checkoutOrder.transaction_type = transactionType;
    this.checkoutOrder.comments = comments;
    this.checkoutOrder.billetFee = billetFee;
    this.checkoutOrder.creditCardFee = creditCardFee;
  }
  setPaymentPaymentBookData(
    amount: number,
    discount: number,
    discountType: string,
    transactionType: string,
    comments: string,
    firstBillDueDate: string,
    numberOfBills: number,
    creditCardFee: number,
    billetFee: number
  ): void {
    this.checkoutOrder.amount = amount;
    this.checkoutOrder.due_date = firstBillDueDate;
    this.checkoutOrder.discount = discount;
    this.checkoutOrder.discount_type = discountType;
    this.checkoutOrder.transaction_type = transactionType;
    this.checkoutOrder.comments = comments;
    this.checkoutOrder.billetFee = billetFee;
    this.checkoutOrder.creditCardFee = creditCardFee;
    this.checkoutOrder.numberOfBills = numberOfBills;
  }

  sendEmailCollection(data: any): Observable<any> {
    return this.httpClient
      .post<any>(
        this.apiGateway + '/notifier/messages/send-mail-by-template',
        data
      )
      .pipe(take(1));
  }

  getFees(): Observable<any> {
    return this.httpClient
      .get<any>(`${this.apiGateway}/nix/fees`)
      .pipe(take(1));
  }

  linkCheckoutOrder(data: any): Observable<any> {
    return this.httpClient
      .post<any>(`${this.apiGateway}/nix/charges/link`, data)
      .pipe(take(1));
  }

  paymentBookCheckoutOrder(data: any): Observable<any> {
    return this.httpClient
      .post<any>(`${this.apiGateway}/nix/charges/payment-book`, data)
      .pipe(take(1));
  }

  makeCollectionBillet(
    billetValue: number,
    accountsPK: any,
    daysExpire: number,
    subPeople: any
  ): any {
    const data = {
      amount: billetValue.toFixed(2),
      days_to_expire: daysExpire,
      address: {
        country: 'Brasil',
        zip_code: subPeople.zip_code,
        number: subPeople.number,
        street: subPeople.street,
        complement: subPeople.complement,
        city: subPeople.city,
        state: subPeople.state,
        neighborhood: subPeople.neighborhood,
      },
      name: subPeople.name,
      email: subPeople.email,
      tags: [
        'charge',
        'contact:' + subPeople.id,
        'contact_name:' + subPeople.name,
        'contact_social_number:' + subPeople.document_value,
      ],
    };

    return this.accountBillet(accountsPK, data);
  }

  accountBillet(account: string, data: any): Observable<any> {
    return this.httpClient
      .post<any>(this.apiGateway + '/' + account + '/billets', data)
      .pipe(take(1));
  }
}
