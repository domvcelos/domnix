import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { IAccountType, IBank } from './bank.model';
import { ACCOUNTTYPES, BANKLIST } from './mock-bank';


@Injectable({
    providedIn: 'root',
})

export class BankService {

    banks: any;

    constructor(
        private httpClient: HttpClient,
    ) { }

    private getBanks(): Observable<any> {
        return this.httpClient.get('https://nix-proxy-qa.cloudint.nexxera.com/api/v1/bank-list').pipe(take(1));
    }

    getAccountTypes(): Promise<IAccountType[]> {
        return Promise.resolve(ACCOUNTTYPES);
    }


    // getbanksList(): any {
    //     this.getBanks().subscribe(
    //         response => {
    //             this.banks = response;
    //             return this.banks;
    //         }
    //     );
    // }

    getBankList(): Promise<IBank[]> {
        return Promise.resolve(BANKLIST);
    }

    getBankNameByCode(code: string): IBank {
        return BANKLIST.filter(b => b.compe_code === code)[0];
    }

}
