import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { StorageService } from 'src/app/common/services/storage/storage.service';
import { IEmailSupport } from 'src/app/components/header/components/support-modal/support-modal';
import { environment } from 'src/environments/environment';
import { CardBlacklist, ICadunUser, ICredentials, IUpdatePasswordPayload } from './login.model';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiGateway: string;

  constructor(
    private httpClient: HttpClient,
    private toastr: ToastrService,
    private storageService: StorageService
  ) {
    this.apiGateway = environment.APIs.GATEWAY;
  }

  login(credentials: ICredentials): Observable<ICadunUser> {
    return this.httpClient.post<ICadunUser>(`${this.apiGateway}/nix/cadun/empresas/auth`, credentials).pipe(take(1));
  }

  sendEmail(data: IEmailSupport): Observable<any> {
    const headers: any = {
      "Content-Type": "application/json",
    };
    let url = "https://api-notification-dispatcher-qa.cloudint.nexxera.com/simple-email";
    // let url = `${this.apiGateway}/nix/support/send-email`;
    return this.httpClient.post<any>(url, data, {headers}).pipe(take(1));
  }

  updatePassword(data: IUpdatePasswordPayload): Observable<any> {
    const userID = this.storageService.currentUser.user_info.id;
    return this.httpClient.put<any>(`${this.apiGateway}/nix/cadun/empresas/user/${userID}/password_by_id/`, data).pipe(take(1));
  }

  resetPassword(user: string): Observable<any> {
    return this.httpClient
      .post<any>(`${this.apiGateway}/nix/cadun/empresas/user/reset_password/`, {
        user,
      })
      .pipe(take(1));
  }

  userHasCompanyRegistered(): Observable<any> {
    return this.httpClient
      .get<any>(`${this.apiGateway}/nix/companies`)
      .pipe(take(1));
  }
  refreshToken(): Observable<any> {
    const headers: any = {
      'refresh-token': this.storageService.refreshToken,
    };
    return this.httpClient.post<any>(
      `${this.apiGateway}/nix/cadun/empresas/auth/refresh`,
      null,
      { headers }
    );
  }

  updateLocalTokenUser(token: string, refreshToken: string): void {
    this.storageService.token = token;
    this.storageService.refreshToken = refreshToken;
  }

  setCNPJCompany(cnpj: string): void {
    this.storageService.cnpjCompany = cnpj;
  }

  setCadunPjIdCompany(cadunpjID: string): void {
    this.storageService.cadunPjIdCompany = cadunpjID;
  }

  setNixAccountId(nixAccountId: string): void {
    this.storageService.nixAccountId = nixAccountId;
  }

  setOfficialName(officialName: string): void {
    this.storageService.officialName = officialName;
  }

  setNixCoreID(nixCoreID: string): void {
    this.storageService.nixCoreID = nixCoreID;
  }

  setSignupCompleted(status: string): void {
    this.storageService.signUpStatus = status;
  }

  setCheckoutLink(checkoutLink: string): void {
    this.storageService.checkoutLink = checkoutLink;
  }

  getGroupNexxcard(params: any): Observable<any> {
    return this.httpClient
      .get<any>(`${this.apiGateway}/nix/vizzoo/groups`, { params })
      .pipe(take(1));
  }

  setNexxcardCompany(cnpj: string, cb: any): void {
    if (cnpj !== 'false') {
      this.getBlacklist({ cnpj }).subscribe(
        (blackList) => {
          if (blackList.length) {
            this.storageService.nexxCardClient = true;
            this.getGroupNexxcard({ cnpj_number: blackList[0].cnpj }).subscribe(
              (groupNexxcard) => {
                if (groupNexxcard && groupNexxcard.data.length) {
                  this.storageService.nexxCardActived = true;
                  this.storageService.nexxCardGroupId =
                    groupNexxcard.data[0].id;
                }
                cb();
              },
              () => {
                this.toastr.error(
                  'Falha ao consultar dados. Tente novamente mais tarde.'
                );
                cb();
              }
            );
          } else {
            cb();
          }
        },
        () => {
          this.toastr.error(
            'Falha ao consultar dados. Tente novamente mais tarde.'
          );
          cb();
        }
      );
    } else {
      this.storageService.nexxCardClient = false;
      this.storageService.nexxCardActived = false;
      this.storageService.removeNexxCardGroupId();
      cb();
    }
  }

  getBlacklist(params: any): Observable<CardBlacklist[]> {
    return this.httpClient
      .get<CardBlacklist[]>(
        `${this.apiGateway}/nix/autoc-vizzoo/autocontratacao/blacklist`,
        { params }
      )
      .pipe(take(1));
  }
}
