import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { LoginService } from '../login/shared/login.service';


@Component({
  selector: 'app-login',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  public forgotPasswordFormGroup: FormGroup;
  public loginError: any = {};
  public loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    private toastr: ToastrService
  ) {
    this.forgotPasswordFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void { }

  navigateTo(path: string): void {
    this.router.navigateByUrl(path);
  }

  retrieve(): void {
    if (this.forgotPasswordFormGroup.invalid) {
      this.forgotPasswordFormGroup.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.loginService
      .resetPassword(this.forgotPasswordFormGroup.value.email)
      .subscribe(
        (response) => {
          this.toastr.success(
            'As instruções para troca de senha foram enviadas para o seu e-mail.'
          );
          this.navigateTo('/');
        },
        (error) => this.toastr.error('Falha ao recuperar senha.'),
      ).add(() => this.loading = false);
  }

}
