import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { IDepositResponse, IDepositPayload } from './deposit.model';


@Injectable({
  providedIn: 'root',
})
export class DepositService {
  apiGateway: string;

  constructor(
    private httpClient: HttpClient,
  ) {
    this.apiGateway = environment.APIs.GATEWAY;
  }

  generateBillet(data: IDepositPayload): Observable<IDepositResponse> {
    return this.httpClient.post<IDepositResponse>(`${this.apiGateway}/nix/deposit`, data).pipe(take(1));
  }

}
