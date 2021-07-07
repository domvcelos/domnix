import { Component, OnInit } from '@angular/core';

import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';

import { StorageService } from 'src/app/common/services/storage/storage.service';
import { CpfCnpjPipe } from 'src/app/pipes/cpfCnpj/cpf-cnpj.pipe';


@Component({
  selector: 'app-pix',
  templateUrl: './pix.component.html',
  styleUrls: ['./pix.component.scss'],
})
export class PixComponent implements OnInit {
  bank = '332 - Banco Acesso';
  name = '';
  branch = '';
  account = '';
  documentNumber = '';

  constructor(
    private clipboardService: ClipboardService,
    private toastr: ToastrService,
    private storage: StorageService,
    private cpfCnpjPipe: CpfCnpjPipe
  ) {
    this.documentNumber = this.storage.cnpjCompany;
    this.name = this.storage.officialName;
    this.branch = this.storage.branch;
    this.account = this.storage.accountNumber + '-' + this.storage.accountNumberDigit;
  }

  ngOnInit(): void { }

  copy(): void {
    const copyText = `Banco: ${this.bank}\nNome: ${this.name}\nAgência: ${this.branch
      }\nConta: ${this.account}\nCNPJ: ${this.cpfCnpjPipe.transform(
        this.documentNumber
      )}`;
    this.clipboardService.copy(copyText);
    this.toastr.success('Informações copiadas.');
  }

}
