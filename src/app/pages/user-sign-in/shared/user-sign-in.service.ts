import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { ICadunUserPayload, INixCoreUserPayload } from './user-sign-in.model';


@Injectable({
  providedIn: 'root'
})
export class UserSignInService {

  private apiGateway: string;

  constructor(
    private httpClient: HttpClient,
  ) {
    this.apiGateway = environment.APIs.GATEWAY;
  }

  createCadunUser(data: ICadunUserPayload): Observable<any> {
    return this.httpClient.post<any>(`${this.apiGateway}/nix/cadun/empresas/user/`, data).pipe(take(1));
  }

  createNixCoreUser(data: INixCoreUserPayload): Observable<any> {
    return this.httpClient.post<any>(`${this.apiGateway}/nix/users/`, data).pipe(take(1));
  }

  sendVerifyEmail(id: string): Observable<any> {
    return this.httpClient.put<any>(`${this.apiGateway}/nix/cadun/empresas/user/${id}/send_verify_email_by_id/`, {}).pipe(take(1));
  }

}
