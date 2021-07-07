import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { IActionBar, IBalanceResponse } from './action-bar-model';
import { ACTIONLIST } from './mock-action-bar';


@Injectable({
  providedIn: 'root',
})
export class ActionBarService {

  private apiGateway: string;

  constructor(
    private httpClient: HttpClient,
  ) {
    this.apiGateway = environment.APIs.GATEWAY;
  }

  getActionList(): Promise<IActionBar[]> {
    return Promise.resolve(ACTIONLIST);
  }

  getBalance(): Observable<IBalanceResponse> {
    return this.httpClient.get<IBalanceResponse>(`${this.apiGateway}/nix/accounts/balance`).pipe(take(1));
  }

}
