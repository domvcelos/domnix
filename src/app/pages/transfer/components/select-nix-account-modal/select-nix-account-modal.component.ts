import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { StorageService } from 'src/app/common/services/storage/storage.service';
import { Utils } from 'src/app/common/utils';

import { NixAccountSearchTypes } from '../../shared/mock-transfer';
import { INixAccount } from '../../shared/transfer.model';
import { TransferService } from '../../shared/transfer.service';


@Component({
  selector: 'app-select-nix-account-modal',
  templateUrl: './select-nix-account-modal.component.html',
  styleUrls: ['./select-nix-account-modal.component.scss'],
})
export class SelectNixAccountModalComponent implements OnInit {
  loading = false;
  nixAccount: INixAccount;
  searchInput = '';
  nixAccountSearchTypes = NixAccountSearchTypes;

  constructor(
    private transferService: TransferService,
    private dialogRef: MatDialogRef<SelectNixAccountModalComponent>,
    private toastr: ToastrService,
    private storageService: StorageService,
    private utils: Utils,
  ) { }

  ngOnInit(): void { }

  onBlur(): void {
    if (this.searchInput.length > 3 && this.searchInput !== this.storageService.cnpjCompany &&
      this.searchInput !== this.storageService.currentUser.user_info.email) {
      this.loading = true;
      this.transferService.getNixAccount(this.getSearchType(), this.searchInput).subscribe(
        response => {
          if (response.length) {
            this.nixAccount = response[0];
          }
        },
        error => this.toastr.error('Não foi possível buscar uma conta, tente novamente.'),
      ).add(() => this.loading = false);
    }
  }

  getSearchType(): string {
    if (this.utils.isEmail(this.searchInput)) {
      return this.nixAccountSearchTypes.EMAIL;
    } else if (this.utils.isCpf(this.searchInput) || this.utils.isCnpj(this.searchInput)) {
      return this.nixAccountSearchTypes.CPFCNPJ;
    } else if (this.utils.onlyNumbers(this.searchInput).length > 6) {
      return this.nixAccountSearchTypes.PHONE;
    } else {
      return this.nixAccountSearchTypes.ACCOUNT_NUMBER;
    }
  }

  useNixAccount(): void {
    this.transferService.selectedNixAccount = this.nixAccount;
    this.dialogRef.close();
  }

  getFormattedPhone(): string {
    return '(' + this.nixAccount.phone.substring(0, 2) + ') ' +
      this.nixAccount.phone.substring(2, this.nixAccount.phone.length - 4) + ' - ' +
      this.nixAccount.phone.substring(this.nixAccount.phone.length - 4, this.nixAccount.phone.length);
  }
}
