import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';

import { Utils } from 'src/app/common/utils';
import { DepositModalComponent } from './components/deposit-modal/deposit-modal.component';
import { IDepositResponse, IDepositPayload } from './shared/deposit.model';
import { DepositService } from './shared/deposit.service';


@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.scss'],
})
export class DepositComponent implements OnInit {
  amountControl = new FormControl('');
  loading = false;

  constructor(
    private depositService: DepositService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private utils: Utils,
  ) { }

  ngOnInit(): void { }

  generateBillet(): void {
    this.loading = true;
    this.depositService.generateBillet(this.getPayload()).subscribe(
      billet => this.openModal(billet),
      error => this.toastr.error('Não foi possível gerar boleto. Tente novamente mais tarde.'),
    ).add(() => this.loading = false);
  }

  getPayload(): IDepositPayload {
    return {
      amount: this.amountControl.value,
      dueDate: this.utils.dateToStringUSA(this.utils.nDaysAfterToday(3)),
      emissionFee: false,
      alias: 'deposito',
    };
  }

  openModal(depositBillet: IDepositResponse): void {
    const dialogRef = this.dialog.open(DepositModalComponent, {
      width: '100%',
      height: 'auto',
      maxWidth: '545px',
      data: depositBillet,
    });
    dialogRef.afterClosed().subscribe((result) => this.amountControl.setValue(''));
  }

}
