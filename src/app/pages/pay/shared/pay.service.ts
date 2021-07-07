import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { StorageService } from 'src/app/common/services/storage/storage.service';

import { environment } from 'src/environments/environment';
import { ICadunUser } from '../../login/shared/login.model';
import { IPayment } from '../../payment-management/shared/payment.model';
import { BRANDLIST, PAYLISTSELECT } from './mock-pay';
import {
  DataDigitalAccount,
  IBarcodeValidate,
  IBrand,
  ICard,
  IPay,
  IPayListSelect,
  IPaymentCreditCardPayload,
  IPaymentMultiPayload,
  IPaymentNIXPayload,
} from './pay.model';

@Injectable({
  providedIn: 'root',
})
export class PayService {
  private apiGateway: string;
  public currentUser: ICadunUser;
  currentCard: ICard;

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService
  ) {
    this.apiGateway = environment.APIs.GATEWAY;
    this.currentUser = this.storageService.currentUser;
  }

  getBarcodeDetails(barcode: string): Observable<IBarcodeValidate> {
    return this.httpClient.post<IBarcodeValidate>(`${this.apiGateway}/nix/payments/bankly-validate-barcode`, { barcode }).pipe(take(1));
  }

  getDigitalAccount(): Observable<DataDigitalAccount> {
    return this.httpClient
      .get<DataDigitalAccount>(`${this.apiGateway}/nix/accounts`, {
        params: this.getCustomerId,
      })
      .pipe(take(1));
  }

  getBrands(): Promise<IBrand[]> {
    return Promise.resolve(BRANDLIST);
  }

  getPayListSelect(): Promise<IPayListSelect[]> {
    return Promise.resolve(PAYLISTSELECT);
  }

  setCurrentCard(card: ICard): void {
    this.currentCard = card;
  }

  get getCurrentCard(): ICard {
    return this.currentCard;
  }

  get getCustomerId(): HttpParams {
    const params = new HttpParams();
    params.append(
      'customer_id',
      this.currentUser.user_info.attributes.socialNumber[0]
    );
    return params;
  }

  getFees(): Observable<any> {
    return this.httpClient
      .get<any>(`${this.apiGateway}/nix/fees`)
      .pipe(take(1));
  }

  paymentsMulti(params: IPaymentMultiPayload): Observable<IPayment> {
    return this.httpClient
      .post<IPayment>(`${this.apiGateway}/nix/payments/multi`, params)
      .pipe(take(1));
  }

  paymentsCreditCard(params: IPaymentCreditCardPayload): Observable<IPayment> {
    return this.httpClient
      .post<IPayment>(`${this.apiGateway}/nix/payments/credit-card`, params)
      .pipe(take(1));
  }

  paymentsNix(params: IPaymentNIXPayload): Observable<IPayment> {
    return this.httpClient
      .post<IPayment>(`${this.apiGateway}/nix/payments/nix`, params)
      .pipe(take(1));
  }
}
