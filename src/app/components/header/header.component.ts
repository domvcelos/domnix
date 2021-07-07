import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from 'src/app/common/services/authentication/auth.service';
import { StorageService } from 'src/app/common/services/storage/storage.service';
import { ICadunUser } from 'src/app/pages/login/shared/login.model';
import { INotification } from 'src/app/pages/notifications/shared/notifications.model';
import { NotificationsService } from 'src/app/pages/notifications/shared/notifications.service';
import { ActionBarService } from '../action-bar/shared/action-bar.service';
import { ChangePasswordModalComponent } from './components/change-password-modal/change-password-modal.component';
import { SupportModalComponent } from './components/support-modal/support-modal.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  notifications: INotification[];
  countNotifications: number;
  branch = '';
  account = '';
  accountDigit = '';

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router,
    private dialog: MatDialog,
    private notificationsService: NotificationsService,
    private actionBarService: ActionBarService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getNotifications();
    this.getBalance();
  }

  logout(): void {
    this.authService.logout();
  }
  getBalance(): void {
    this.actionBarService.getBalance().subscribe((response) => {
      this.storageService.accountNumber = response.number;
      this.storageService.branch = response.branch;
      this.branch = this.storageService.branch;
      this.account = this.storageService.accountNumber;
      this.accountDigit = this.storageService.accountNumberDigit;
    });
  }

  get user(): ICadunUser {
    return this.storageService.currentUser;
  }

  navigateTo(path: string): void {
    this.router.navigateByUrl(path);
  }

  openModalChangePassword(): void {
    this.dialog.open(ChangePasswordModalComponent, {
      width: '100%',
      height: 'auto',
      maxWidth: '545px',
    });
  }

  openModalSupport(): void {
    this.dialog.open(SupportModalComponent, {
      width: '100%',
      height: 'auto',
      maxWidth: '545px',
    });
  }

  openNotifications(): void {
    this.navigateTo('/notificacoes');
  }

  getNotifications(): void {
    this.notificationsService.getNotifications('false').subscribe((data) => {
      this.notifications = data['results'];
      this.countNotifications = data['count'];
    });
  }

  checkAllNotificationAsRead(): void {
    if (this.countNotifications > 0) {
      this.notificationsService.readAllNotifications().subscribe(
        data => {
          this.toastr.success('Todas as notificações foram marcadas como lidas.');
          this.getNotifications();
        },
      );
    }
  }

  readNotification(row: INotification): void {
    this.notificationsService.readNotification(row.id).subscribe(
      data => {
        this.toastr.success('A notificação foi marcada como lida.');
        this.getNotifications();
      },
    );
  }

}
