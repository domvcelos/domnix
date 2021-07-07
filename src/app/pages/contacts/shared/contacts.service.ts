import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { StorageService } from 'src/app/common/services/storage/storage.service';
import { environment } from 'src/environments/environment';
import { IContact, ISubPeople } from './contacts.model';


@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  private apiGateway: string;
  private GROUP_ID;

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
  ) {
    this.apiGateway = environment.APIs.GATEWAY;
    this.GROUP_ID = environment.KEYS.GROUP_ID;
  }

  createContact(data: IContact): Observable<IContact> {
    return this.httpClient
      .post<IContact>(`${this.apiGateway}/nix/companies/${this.storageService.nixCoreID}/contacts`, data).pipe(take(1));
  }

  createSubpeopleBankaccounts(contactID: string, data: any): Observable<any> {
    return this.httpClient
      .post<any>(
        `${this.apiGateway}/nix/cadunpj/groups/${this.GROUP_ID}/people/${this.storageService.cadunPjIdCompany}/subpeople/${contactID}/bankaccounts`,
        data)
      .pipe(take(1));
  }

  putSubpeople(contactID: string, data: any): Observable<any> {
    return this.httpClient
      .put<any>(
        `${this.apiGateway}/nix/cadunpj/groups/${this.GROUP_ID}/people/${this.storageService.cadunPjIdCompany}/subpeople/${contactID}`,
        data
      ).pipe(take(1));
  }

  putSubpeopleBankAccount(contactID: string, bankAccountID: string, data: any): Observable<any> {
    return this.httpClient
      .put<any>(
        `${this.apiGateway}/nix/cadunpj/groups/${this.GROUP_ID}/people/${this.storageService.cadunPjIdCompany}/subpeople/${contactID}/bankaccounts/${bankAccountID}`,
        data
      ).pipe(take(1));
  }

  getSubPeopleList(): Observable<ISubPeople[]> {
    return this.httpClient
      .get<any>(`${this.apiGateway}/nix/companies/${this.storageService.nixCoreID}/contacts/get_list`)
      .pipe(take(1));
  }

  deleteContact(contactID: string): Observable<any> {
    return this.httpClient.delete<any>(
      `${this.apiGateway}/nix/cadunpj/groups/${this.GROUP_ID}/people/${this.storageService.cadunPjIdCompany}/subpeople/${contactID}`)
      .pipe(take(1));
  }

  getContactBankAccounts(contactID: string): Observable<any> {
    return this.httpClient
      .get<any>(
        `${this.apiGateway}/nix/cadunpj/groups/${this.GROUP_ID}/people/${this.storageService.cadunPjIdCompany}/subpeople/${contactID}/bankaccounts`)
      .pipe(take(1));
  }

  deleteContactBankaccounts(contactID: string, bankaccountID: string): Observable<any> {
    return this.httpClient
      .delete<any>(
        `${this.apiGateway}/nix/cadunpj/groups/${this.GROUP_ID}/people/${this.storageService.cadunPjIdCompany}/subpeople/${contactID}/bankaccounts/${bankaccountID}`)
      .pipe(take(1));
  }

  getSubGroups(): Observable<any> {
    return this.httpClient
      .get<any>(
        `${this.apiGateway}/nix/cadunpj/groups/${this.GROUP_ID}/people/${this.storageService.cadunPjIdCompany}/subgroups`)
      .pipe(take(1));
  }

  deleteUnlinkGroupToContact(contactID: string, subGroupID: string): Observable<any> {
    return this.httpClient
      .delete<any>(
        `${this.apiGateway}/nix/cadunpj/groups/${this.GROUP_ID}/people/${this.storageService.cadunPjIdCompany}/subgroups/${subGroupID}/subpeople/${contactID}`)
      .pipe(take(1));
  }

}
