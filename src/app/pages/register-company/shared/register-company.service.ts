import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { StorageService } from 'src/app/common/services/storage/storage.service';
import { environment } from 'src/environments/environment';
import { IFeeClientResponse } from '../../manage-plans/shared/plan.model';
import {
  IActivity, ICompany, IUpdateCompanyPayload, IUpdateCompanyResponse, IUserCompany,
} from './register-company.models';


@Injectable({
  providedIn: 'root',
})
export class RegisterCompanyService {
  private apiGateway: string;

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService
  ) {
    this.apiGateway = environment.APIs.GATEWAY;
  }

  getActivitiesList(): Observable<IActivity[]> {
    return this.httpClient
      .get<IActivity[]>(`${this.apiGateway}/nix/companies/categories`)
      .pipe(take(1));
  }

  checkCompanyExists(cnpj: string): Observable<IUserCompany[]> {
    return this.httpClient
      .get<IUserCompany[]>(`${this.apiGateway}/nix/companies/exists?cnpj=${cnpj}`)
      .pipe(take(1));
  }

  createCompany(company: ICompany): Observable<any> {
    return this.httpClient
      .post<any>(`${this.apiGateway}/nix/companies/`, company)
      .pipe(take(1));
  }

  getCompany(): Observable<ICompany> {
    return this.httpClient.get<ICompany>(
      `${this.apiGateway}/nix/companies/${this.storageService.nixCoreID}`
    ).pipe(take(1));
  }

  updateCompany(data: IUpdateCompanyPayload): Observable<IUpdateCompanyResponse> {
    return this.httpClient.patch<IUpdateCompanyResponse>(
      `${this.apiGateway}/nix/companies/${this.storageService.nixCoreID}`, data)
      .pipe(take(1));
  }

}
