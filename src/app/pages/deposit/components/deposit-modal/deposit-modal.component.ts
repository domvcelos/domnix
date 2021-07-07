import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';

import { IDepositResponse } from '../../shared/deposit.model';


@Component({
  selector: 'app-deposit-modal',
  templateUrl: './deposit-modal.component.html',
  styleUrls: ['./deposit-modal.component.scss'],
})
export class DepositModalComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public depositBillet: IDepositResponse,
    private clipboardService: ClipboardService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void { }

  copy(): void {
   // this.clipboardService.copy(this.depositBillet.typeable_row.toString());
    this.toastr.success('Código de barras copiado com sucesso.');
  }

  download(): void {
    window.open(this.depositBillet.pdf_url, '_blank');
  }

}
