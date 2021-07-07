import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import jwtDecode, { JwtPayload } from 'jwt-decode';

import { StorageService } from '../storage/storage.service';
import { environment } from 'src/environments/environment';
import { ICadunUserValidatePassword } from 'src/app/pages/login/shared/login.model';


@Injectable()
export class AuthService {

  private GATEWAY;

  constructor(
    private router: Router,
    private storageService: StorageService,
    private httpClient: HttpClient,
  ) {
    this.GATEWAY = environment.APIs.GATEWAY;
  }

  getTokenExpirationDate(token: string): Date | null {
    const decoded = jwtDecode<JwtPayload>(token);

    if (decoded.exp === undefined) {
      return null;
    }

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  isTokenExpired(token?: string): boolean {
    if (!token) {
      token = this.storageService.token;
    }
    if (!token) {
      return true;
    }

    const date = this.getTokenExpirationDate(token);
    if (date) {
      return !(date.valueOf() > new Date().valueOf());
    } else {
      return false;
    }
  }

  logout(): void {
    this.storageService.sessionStorageClear();
    this.router.navigateByUrl('/');
  }

  validatePassword(passwd: string): Observable<ICadunUserValidatePassword> {
    const params = {
      old_password: passwd,
      new_password_1: passwd,
      new_password_2: passwd
    };
    const id = this.storageService.currentUser.user_info.id;
    return this.httpClient
      .put<ICadunUserValidatePassword>(`${this.GATEWAY}/nix/cadun/empresas/user/${id}/password_by_id`, params)
      .pipe(take(1));
  }

}
