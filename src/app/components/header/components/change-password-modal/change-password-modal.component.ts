import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';

import { CustomValidators } from 'src/app/common/custom-validators';
import { AuthService } from 'src/app/common/services/authentication/auth.service';
import { IUpdatePasswordPayload } from 'src/app/pages/login/shared/login.model';
import { LoginService } from 'src/app/pages/login/shared/login.service';


@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.scss'],
})
export class ChangePasswordModalComponent implements OnInit {
  loading = false;
  passwordFormGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private customValidators: CustomValidators,
    private loginService: LoginService,
    private toastr: ToastrService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<ChangePasswordModalComponent>,
  ) {
    this.passwordFormGroup = this.formBuilder.group(
      {
        currentPassword: ['', [Validators.required, Validators.minLength(6)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      },
      {
        validator: this.customValidators.mustMatch('password', 'confirmPassword'),
      } as AbstractControlOptions
    );
  }

  ngOnInit(): void { }

  onSubmit(): void {
    if (this.passwordFormGroup.valid) {
      this.loading = true;
      this.loginService.updatePassword(this.getPayload()).subscribe(
        response => {
          this.dialogRef.close();
          this.authService.logout();
          this.toastr.success('Senha alterada.');
        },
        error => this.toastr.error('Falha ao atualizar a senha.'),
      ).add(() => this.loading = false);
    }
  }

  getPayload(): IUpdatePasswordPayload {
    return {
      old_password: this.passwordFormGroup.value.currentPassword,
      new_password_1: this.passwordFormGroup.value.password,
      new_password_2: this.passwordFormGroup.value.confirmPassword,
    };
  }

}
