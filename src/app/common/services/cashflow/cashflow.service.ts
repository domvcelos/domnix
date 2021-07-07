import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { CASHFLOWDATA } from './cashflow.mock';
import { IConsolidation, IConsolidationsFilters, IEntriesFilter, IEntriesResponse } from './cashflow.model';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class CashflowService {
  private apIConsolidation = `${environment.APIs.GATEWAY}/nix/cashflow/v1`;

  constructor(
    private httpClient: HttpClient,
  ) { }

  getCashFlow(): Promise<IConsolidation[]> {
    return Promise.resolve(CASHFLOWDATA);
  }

  getConsolidations(filters?: IConsolidationsFilters): Observable<IConsolidation[]> {
    const url = `${this.apIConsolidation}/consolidations`;
    const params: any = filters;
    return this.httpClient.get<IConsolidation[]>(url, { params }).pipe(take(1));
  }

  getEntries(filter: IEntriesFilter): Observable<IEntriesResponse> {
    let params = new HttpParams();
    Object.entries(filter).forEach(
      ([key, value]) => (params = params.append(key, value))
    );
    return this.httpClient.get<IEntriesResponse>(`${this.apIConsolidation}/entries`, { params }).pipe(take(1));
  }

}
