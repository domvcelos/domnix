import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { IActivity, IChannelCodeResponse } from '../../register-company/shared/register-company.models';
import { ICreateCompanyResponse, ISelectCompanySize, ISelectCompanyType } from './company-sign-in.model';
import { COMPANYSIZES, COMPANYTYPES } from './mock-company-sign-in';


@Injectable({
  providedIn: 'root'
})
export class CompanySignInService {

  private apiGateway: string;

  constructor(
    private httpClient: HttpClient,
  ) {
    this.apiGateway = environment.APIs.GATEWAY;
  }

  getCompanyTypes(): Promise<ISelectCompanyType[]> {
    return Promise.resolve(COMPANYTYPES);
  }

  getCompanySizes(): Promise<ISelectCompanySize[]> {
    return Promise.resolve(COMPANYSIZES);
  }

  createCompany(formData: FormData): Observable<ICreateCompanyResponse> {
    return this.httpClient.post<ICreateCompanyResponse>(`${this.apiGateway}/nix/companies`, formData).pipe(take(1));
  }

  getActivitiesList(): Observable<IActivity[]> {
    return this.httpClient
      .get<IActivity[]>(`${this.apiGateway}/nix/companies/categories`)
      .pipe(take(1));
  }

  checkChannelExists(channel: string): Observable<IChannelCodeResponse> {
    return this.httpClient.get<IChannelCodeResponse>(`${this.apiGateway}/nix/channels/${channel}`).pipe(take(1));
  }

}
