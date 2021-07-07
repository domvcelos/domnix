import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';

import { StorageService } from 'src/app/common/services/storage/storage.service';
import { Utils } from 'src/app/common/utils';
import { PaymentManagementService } from '../../shared/payment-management.service';
import { IPayment } from '../../shared/payment.model';


@Component({
  selector: 'app-payment-receipt-modal',
  templateUrl: './payment-receipt-modal.component.html',
  styleUrls: ['./payment-receipt-modal.component.scss'],
})
export class PaymentReceiptModalComponent implements OnInit {

  loading = false;
  branch = '';
  account = '';
  accountDigit = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public payment: IPayment,
    private service: PaymentManagementService,
    private toastr: ToastrService,
    private storageService: StorageService,
    private utils: Utils,
  ) {
    this.branch = this.storageService.branch;
    this.account = this.storageService.accountNumber;
    this.accountDigit = this.storageService.accountNumberDigit;
  }

  ngOnInit(): void { }

  download(): void {
    this.loading = true;
    this.service.getReceiptPDF(this.payment.id).subscribe(
      response => window.open(URL.createObjectURL(response), '_blank'),
      error => this.toastr.error(error.message),
    ).add(() => this.loading = false);
  }

  sendEmail(): void {
    this.loading = true;
    this.service.sendReceiptEmail(this.payment.id).subscribe(
      data => {
        const words = data.message.split(' ');
        this.toastr.success(`Email enviado para ${words[words.length - 1]}`);
      },
      error => this.toastr.error('Não foi possível enviar o email.'),
    ).add(() => this.loading = false);
  }

  maskBarcode(barcode: string): string {
    return this.utils.maskBarcode(barcode);
  }

}
