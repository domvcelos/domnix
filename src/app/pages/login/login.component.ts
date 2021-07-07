import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import jwtDecode from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';

import { StorageService } from 'src/app/common/services/storage/storage.service';
import { SignUpStatus, Utils } from 'src/app/common/utils';
import { IUserCompany } from '../register-company/shared/register-company.models';
import { IAccessToken } from './shared/login.model';
import { LoginService } from './shared/login.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loginFormGroup: FormGroup;
  public loginError: any = {};
  public loading = false;
  public logo = 'nix-empresas-logo-black';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    private toastr: ToastrService,
    private storageService: StorageService,
    private utils: Utils,
    private activatedRoute: ActivatedRoute
  ) {
    const currentUser = this.storageService.currentUser;
    if (currentUser) {
      this.navigateTo('home');
    }
    this.loginFormGroup = this.formBuilder.group({
      user: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      if (params.empresa) {
        this.logo = params.empresa;
      }
    });
  }

  onImgError(event: any): void {
    event.target.src = '../../../assets/nix-empresas-logo-black.svg';
    this.router.navigate(['/']);
  }

  login(): void {
    if (this.loginFormGroup.invalid) {
      this.loginFormGroup.markAllAsTouched();
      return;
    }
    this.loading = true;
    if (this.loginFormGroup.value.user.indexOf('@') === -1) {
      this.loginFormGroup.patchValue({
        user: this.utils.onlyNumbers(this.loginFormGroup.value.user),
      });
    }
    this.loginService.login(this.loginFormGroup.value).subscribe(
      user => {
        if (user && user.access_token) {
          this.storageService.currentUser = user;
        }
        const decoded: IAccessToken = jwtDecode(user.access_token);
        this.storageService.manager = decoded.realm_access.roles.filter((role) => role.toLowerCase() === 'client-manager')[0] !== undefined;
        if (this.storageService.manager) {
          this.storageService.erp = decoded.realm_access.roles.filter((role) => role.toLowerCase().match(/cnpj-\d/))[0];
          this.loginService.setSignupCompleted(SignUpStatus.active);
          this.navigateTo('empresas');
        } else {
          this.redirectUser();
        }
      },
      (error) => {
        if (error.status === 400) {
          this.toastr.error('Usuário ou senha inválidos.');
        } else if (error.status === 406) {
          this.toastr.error('Email não validado, verifique seu email.');
        } else {
          this.toastr.error(
            'Houve um erro inesperado, por favor tente novamente mais tarde.',
            'Ops!'
          );
        }
        this.loading = false;
      }
    );
  }

  navigateTo(path: string): void {
    this.router.navigateByUrl(path);
  }

  redirectUser(): void {
    this.loginService.userHasCompanyRegistered().subscribe(
      data => {
        if (data && data.length) {
          const accountOk: IUserCompany[] = data.filter(
            (account: IUserCompany) => account.account_status.toLowerCase() === 'ok'
          );
          const accountPending: IUserCompany[] = data.filter(
            (account: IUserCompany) => account.account_status.toLowerCase() === 'pending'
          );
          const accountError: IUserCompany[] = data.filter(
            (account: IUserCompany) => account.account_status.toLowerCase() === 'error'
          );
          if (accountOk.length) {
            this.loginService.setOfficialName(accountOk[0].official_name);
            this.loginService.setCNPJCompany(accountOk[0].cnpj);
            this.loginService.setCadunPjIdCompany(accountOk[0].cadun_pj_id);
            this.loginService.setNixAccountId(accountOk[0].nix_account_id);
            this.loginService.setNixCoreID(accountOk[0].id);
            this.loginService.setNexxcardCompany(accountOk[0].cnpj, () => {
              if (accountOk[0].activated) {
                this.loginService.setSignupCompleted(SignUpStatus.active);
                this.navigateTo('home');
              } else {
                this.loginService.setCheckoutLink(accountOk[0].checkout_link);
                this.loginService.setSignupCompleted(SignUpStatus.waiting);
                this.accessSigninNotComplete();
              }
            });
          } else if (accountPending.length) {
            this.loginService.setNexxcardCompany('false', () => {
              this.loginService.setSignupCompleted(SignUpStatus.pending);
              this.accessSigninNotComplete();
            });
          } else if (accountError.length) {
            this.loginService.setNexxcardCompany('false', () => {
              this.loginService.setSignupCompleted(SignUpStatus.error);
              this.accessSigninNotComplete();
            });
          }
        } else {
          this.loginService.setNexxcardCompany('false', () => {
            this.loginService.setSignupCompleted(SignUpStatus.inactive);
            this.accessSelfHiring();
          });
        }
      },
      error => this.toastr.error(error),
    );
  }

  private accessSigninNotComplete(): void {
    this.navigateTo('cadastro-nao-completo');
  }

  private accessSelfHiring(): void {
    this.navigateTo('termo-de-adesao');
  }
}
