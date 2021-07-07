import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { StorageService } from '../storage/storage.service';
import { ISubPeople, ISubPeopleBankAccount } from './contact.model';


@Injectable({
    providedIn: 'root',
})

export class ContactService {

    private GATEWAY: string;
    private GROUP_ID;
    private COMPANY_ID;
    private selectedSubpeople: ISubPeople;
    private selectedSubpeopleBankAccount: ISubPeopleBankAccount;

    constructor(
        private httpClient: HttpClient,
        private storageService: StorageService
    ) {
        this.GATEWAY = environment.APIs.GATEWAY;
        this.GROUP_ID = environment.KEYS.GROUP_ID;
        this.COMPANY_ID = this.storageService.cadunPjIdCompany;
    }

    getSubPeopleList(): Observable<ISubPeople[]> {
        return this.httpClient
            .get<any>(`${this.GATEWAY}/nix/cadunpj/groups/${this.GROUP_ID}/people/${this.COMPANY_ID}/subpeople?ordering=name`)
            .pipe(take(1));
    }

    getSubPeopleBankAccounts(peopleId: string, subpeopleId: string): Observable<ISubPeopleBankAccount[]> {
        return this.httpClient.get<ISubPeopleBankAccount[]>(
            `${this.GATEWAY}/nix/cadunpj/groups/${this.GROUP_ID}/people/${peopleId}/subpeople/${subpeopleId}/bankaccounts`
        ).pipe(take(1));
    }

    set selectedContact(contact: ISubPeople) {
        this.selectedSubpeople = contact;
    }

    get selectedContact(): ISubPeople {
        return this.selectedSubpeople;
    }

    set selectedContactBankAccount(contactBankAccount: ISubPeopleBankAccount) {
        this.selectedSubpeopleBankAccount = contactBankAccount;
    }

    get selectedContactBankAccount(): ISubPeopleBankAccount {
        return this.selectedSubpeopleBankAccount;
    }

}
