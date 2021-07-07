import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from 'src/app/common/services/authentication/auth.service';
import { StorageService } from 'src/app/common/services/storage/storage.service';
import { SignUpStatus } from 'src/app/common/utils';


@Component({
  selector: 'app-signin-not-complete',
  templateUrl: './signin-not-complete.component.html',
  styleUrls: ['./signin-not-complete.component.scss'],
})
export class SigninNotCompleteComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void { }

  logout(): void {
    this.authService.logout();
  }

  getCheckoutLink(): void {
    if (this.storageService.checkoutLink) {
      window.open(this.storageService.checkoutLink, '_blank');
    } else {
      this.toastr.warning('Não foi possível gerar link para pagamento.');
    }
  }

  goHome(): void {
    this.authService.logout();
  }

  isStatusError(): boolean {
    return this.storageService.signUpStatus === SignUpStatus.error;
  }

  isStatusWaitingPayment(): boolean {
    return this.storageService.signUpStatus === SignUpStatus.waiting;
  }

  isStatusPending(): boolean {
    return this.storageService.signUpStatus === SignUpStatus.pending;
  }

}
