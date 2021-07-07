import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { DataCollection, ICollectionResend, IFilter, ICollectionType, IStatusCollection } from './collection-management.model';
import { COLLECTIONTYPES, STATUSCOLLECTION } from './mock-collection-management';


@Injectable({
  providedIn: 'root',
})
export class CollectionManagementService {

  private apiGateway: string;

  constructor(
    private httpClient: HttpClient,
  ) {
   this.apiGateway = environment.APIs.GATEWAY;
  }

  getCollectionTypes(): Promise<ICollectionType[]> {
    return Promise.resolve(COLLECTIONTYPES);
  }

  getSatusCollection(): Promise<IStatusCollection[]> {
    return Promise.resolve(STATUSCOLLECTION);
  }

  getCollections(filter: IFilter): Observable<DataCollection> {
    let params = new HttpParams();
    Object.entries(filter).forEach(
      ([key, value]) => params = params.append(key, value)
    );
    return this.httpClient.get<DataCollection>(`${this.apiGateway}/nix/api/charges`, { params }).pipe(take(1));
  }

  deleteCollection(collectionID: string): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiGateway}/nix/charges/${collectionID}`).pipe(take(1));
  }

  resendCollection(collectionID: string, data: ICollectionResend): Observable<any> {
    return this.httpClient.post<any>(`${this.apiGateway}/nix/charges/resend/${collectionID}`, data).pipe(take(1));
  }

}
