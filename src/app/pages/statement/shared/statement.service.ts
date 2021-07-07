import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { STATEMENTNAMESTRANSLATE } from './statement.mock';
import { IStatementNameTranslate, IStatementResponse } from './statement.model';


@Injectable({
  providedIn: 'root'
})
export class StatementService {

  private apiGateway: string;

  constructor(
    private httpClient: HttpClient,
  ) {
    this.apiGateway = environment.APIs.GATEWAY;
  }

  getStatement(): Observable<IStatementResponse[]> {
    return this.httpClient.get<IStatementResponse[]>(`${this.apiGateway}/nix/statement`).pipe(take(1));
  }

  getTranslateNames(): Promise<IStatementNameTranslate[]> {
    return Promise.resolve(STATEMENTNAMESTRANSLATE);
  }

}
