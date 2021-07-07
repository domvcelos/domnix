import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { StorageService } from 'src/app/common/services/storage/storage.service';
import { environment } from 'src/environments/environment';
import { IFilter } from '../../collection-management/shared/collection-management.model';
import { ICadunUser } from '../../login/shared/login.model';
import {
  IPayListSelect,
  IPayStatusListSelect,
} from '../../pay/shared/pay.model';
import { PAYMENTSTATUSTYPES, PAYMENTTRANSACTIONTYPES } from './mock-payment';
import { DataPayment } from './payment.model';

@Injectable({
  providedIn: 'root',
})
export class PaymentManagementService {
  private apiGateway: string;
  public currentUser: ICadunUser;

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService
  ) {
    this.apiGateway = environment.APIs.GATEWAY;
    this.currentUser = this.storageService.currentUser;
  }

  getPayments(filter: IFilter): Observable<DataPayment> {
    let params = new HttpParams();
    Object.entries(filter).forEach(
      ([key, value]) => (params = params.append(key, value))
    );
    return this.httpClient
      .get<DataPayment>(`${this.apiGateway}/nix/payments`, { params })
      .pipe(take(1));
  }

  getPaymentListSelect(): Promise<IPayListSelect[]> {
    return Promise.resolve(PAYMENTTRANSACTIONTYPES);
  }

  getPaymentStatusListSelect(): Promise<IPayStatusListSelect[]> {
    return Promise.resolve(PAYMENTSTATUSTYPES);
  }

  sendReceiptEmail(payment: string): Observable<any> {
    return this.httpClient
      .post<any>(`${this.apiGateway}/nix/payments/${payment}/sendmail`, null)
      .pipe(take(1));
  }

  getReceiptPDF(payment: string): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/pdf');
    const body = { filename: `${payment}.pdf` };
    return this.httpClient
      .post<any>(`${this.apiGateway}/nix/payments/${payment}/pdf`, body, {
        headers,
        responseType: 'blob' as 'json',
      })
      .pipe(take(1));
  }
}
