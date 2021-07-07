import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { StorageService } from 'src/app/common/services/storage/storage.service';
import { Utils } from 'src/app/common/utils';
import { environment } from 'src/environments/environment';
import { ICompany } from '../../login/shared/login.model';
import { DataDigitalAccount } from '../../pay/shared/pay.model';
import { NixAccountSearchTypes, TRANSFERLISTSELECT } from './mock-transfer';
import { IBankAccount, INixAccount, ITransferExtraData, ITransferListSelect, ITransferPayload } from './transfer.model';


@Injectable({
  providedIn: 'root'
})
export class TransferService {

  private GATEWAY;
  private groupId;
  private nixAccountSearchTypes = NixAccountSearchTypes;
  private nixAccountToTransfer: INixAccount;
  checkoutOrder: ITransferPayload = {
    amount: '',
    recipient_account: '',
    recipient_account_digit: '',
    recipient_name: '',
    recipient_social_number: '',
    recipient_branch: '',
    recipient_branch_digit: '',
    recipient_bank_code: '',
    recipient_account_type: '',
    description: '',
  };

  transferExtraData: ITransferExtraData = {
    destinataryName: '',
    bankCodeName: '',
    bankShortName: '',
    fee: '',
    transferType: '',
  };

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
    private utils: Utils,
  ) {
    this.GATEWAY = environment.APIs.GATEWAY;
    this.groupId = environment.KEYS.GROUP_ID;
  }

  set selectedNixAccount(nixAccount: INixAccount) {
    this.nixAccountToTransfer = nixAccount;
  }

  get selectedNixAccount(): INixAccount {
    return this.nixAccountToTransfer;
  }

  getTransferListSelect(): Promise<ITransferListSelect[]> {
    return Promise.resolve(TRANSFERLISTSELECT);
  }

  getFees(): Observable<any> {
    return this.httpClient.get<any>(`${this.GATEWAY}/nix/fees`).pipe(take(1));
  }

  getAccounts(): Observable<DataDigitalAccount> {
    const params: any = {};
    params.customer_id = this.storageService.socialNumber;
    return this.httpClient.get<DataDigitalAccount>(`${this.GATEWAY}/nix/accounts`, { params }).pipe(take(1));
  }

  getCompany(): Observable<ICompany[]> {
    return this.httpClient.get<ICompany[]>(`${this.GATEWAY}/nix/companies`).pipe(take(1));
  }

  getPeopleBankAccounts(personPK: string): Observable<IBankAccount[]> {
    return this.httpClient.get<IBankAccount[]>
      (`${this.GATEWAY}/nix/cadunpj/groups/${this.groupId}/people/${personPK}/personbankaccounts`)
      .pipe(take(1));
  }

  getCheckoutOrder(): ITransferPayload {
    return this.checkoutOrder;
  }

  getTransferExtraData(): ITransferExtraData {
    return this.transferExtraData;
  }

  setCheckoutOrder(
    amount: string,
    recipientAccount: string,
    recipientAccountDigit: string,
    recipientName: string,
    recipientSocialNumber: string,
    recipientBranch: string,
    recipientBranchDigit: string,
    recipientBankCode: string,
    recipientAccountType: string,
  ): void {
    this.checkoutOrder.amount = amount;
    this.checkoutOrder.recipient_account = recipientAccount;
    this.checkoutOrder.recipient_account_digit = recipientAccountDigit;
    this.checkoutOrder.recipient_name = recipientName;
    this.checkoutOrder.recipient_social_number = recipientSocialNumber;
    this.checkoutOrder.recipient_branch = recipientBranch;
    this.checkoutOrder.recipient_branch_digit = recipientBranchDigit;
    this.checkoutOrder.recipient_bank_code = recipientBankCode;
    this.checkoutOrder.recipient_account_type = recipientAccountType;
  }

  setTransferExtraData(
    bankCodeName: string,
    bankShortName: string,
    fee: string,
    transferType: string,
  ): void {
    this.transferExtraData.bankCodeName = bankCodeName;
    this.transferExtraData.bankShortName = bankShortName;
    this.transferExtraData.fee = fee;
    this.transferExtraData.transferType = transferType;
  }

  transferToOtherBank(params: ITransferPayload): Observable<any> {
    return this.httpClient.post<any>(`${this.GATEWAY}/nix/accounts/transfer/bank`, params).pipe(take(1));
  }

  transferToNix(params: ITransferPayload, senderAccountID: any): Observable<any> {
    return this.httpClient.post<any>(`${this.GATEWAY}/nix/accounts/${senderAccountID}/transfers`, params).pipe(take(1));
  }

  getNixAccount(searchType: string, search: string): Observable<INixAccount[]> {
    const params: any = {};
    params[searchType] = searchType !== this.nixAccountSearchTypes.EMAIL ? this.utils.onlyNumbers(search) : search;
    return this.httpClient.get<INixAccount[]>(`${this.GATEWAY}/nix/accounts/filters`, { params }).pipe(take(1));
  }

  getReceiptPDF(transferID: string): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/pdf');
    const body = { filename: `${transferID}.pdf` };
    return this.httpClient.post<any>(
      `${this.GATEWAY}/nix/accounts/transfer/${transferID}/pdf`, body, { headers, responseType: 'blob' as 'json' }
    ).pipe(take(1));
  }

  sendReceiptEmail(transferID: string): Observable<any> {
    return this.httpClient.post<any>(`${this.GATEWAY}/nix/accounts/transfer/${transferID}/sendmail`, null).pipe(take(1));
  }

}
