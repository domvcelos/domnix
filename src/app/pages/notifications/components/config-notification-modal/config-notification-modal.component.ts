import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

import { ToastrService } from 'ngx-toastr';

import { NotificationsService } from '../../shared/notifications.service';


@Component({
  selector: 'app-config-notification-modal',
  templateUrl: './config-notification-modal.component.html',
  styleUrls: ['./config-notification-modal.component.scss'],
})
export class ConfigNotificationModalComponent implements OnInit {

  loading = false;
  deposit: boolean;
  transfer: boolean;
  charge: boolean;

  constructor(
    private dialogRef: MatDialogRef<ConfigNotificationModalComponent>,
    private service: NotificationsService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getConfigs();
  }

  public toggleDeposit(event: MatSlideToggleChange): void {
    this.deposit = event.checked;
  }

  public toggleTransfer(event: MatSlideToggleChange): void {
    this.transfer = event.checked;
  }

  public toggleCharge(event: MatSlideToggleChange): void {
    this.charge = event.checked;
  }

  getConfigs(): void {
    this.loading = true;
    this.service.getConfigNotifications().subscribe(
      data => {
        this.deposit = data.deposit;
        this.transfer = data.transfer;
        this.charge = data.charge;
      },
      error => this.toastr.error('Não foi possível obter as configurações atuais.'),
    ).add(() => this.loading = false);
  }

  saveConfigs(): void {
    this.loading = true;
    const data = {
      deposit: this.deposit,
      transfer: this.transfer,
      charge: this.charge,
    };
    this.service.updateConfigNotifications(data).subscribe(
      response => {
        this.dialogRef.close();
        this.toastr.success('Configurações salvas.');
      },
      error => this.toastr.error('Não foi possível salvar configurações.'),
    ).add(() => this.loading = false);
  }

  cancel(): void {
    this.dialogRef.close();
  }

}
