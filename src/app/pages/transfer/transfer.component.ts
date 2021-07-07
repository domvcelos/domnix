import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';

import { BankService } from 'src/app/common/services/bank/bank.service';
import { ISubPeople, ISubPeopleBankAccount } from 'src/app/common/services/contact/contact.model';
import { ContactService } from 'src/app/common/services/contact/contact.service';
import { StorageService } from 'src/app/common/services/storage/storage.service';
import { Utils } from 'src/app/common/utils';
import { ActionBarService } from 'src/app/components/action-bar/shared/action-bar.service';
import { NewContactModalComponent } from 'src/app/components/new-contact-modal/new-contact-modal.component';
import { CpfCnpjPipe } from 'src/app/pipes/cpfCnpj/cpf-cnpj.pipe';
import { environment } from 'src/environments/environment';
import { ConfirmTransferDataModalComponent } from './components/confirm-transfer-data-modal/confirm-transfer-data-modal.component';
import { SelectContactModalComponent } from './components/select-contact-modal/select-contact-modal.component';
import { SelectNixAccountModalComponent } from './components/select-nix-account-modal/select-nix-account-modal.component';
import { IBankAccount, INixAccount, ITransferListSelect } from './shared/transfer.model';
import { TransferService } from './shared/transfer.service';


@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss']
})
export class TransferComponent implements OnInit {

  loading = false;
  form: FormGroup;
  transactionType: string;
  currencyRegex = '^[+-]?[0-9]{1,3}(?:,?[0-9]{3})*(?:.[0-9]{2})?$';
  fee = '0';
  balance = 0;
  destinataryName: string;
  destinataryDocumentvalue: string;
  myAccountID: string;
  listSelect: ITransferListSelect[];
  transferSelectFormControl = new FormControl('');
  isTransferToOthersBanks = false;
  isTransferToMyAccount = false;
  isTransferToNix = false;
  showPage = false;
  showSelectContact = true;
  peopleBankAccounts: IBankAccount;

  constructor(
    private service: TransferService,
    private bankService: BankService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private cpfCnpjPipe: CpfCnpjPipe,
    private storageService: StorageService,
    private formBuilder: FormBuilder,
    private utils: Utils,
    private contactService: ContactService,
    private actionBarService: ActionBarService,
  ) {
    this.form = this.formBuilder.group({
      amount: [
        '', [Validators.required, Validators.min(10), Validators.pattern(this.currencyRegex)]
      ],
    });
  }

  ngOnInit(): void {
    // this.getPayListSelect();
    this.transactionType = 'BANK';
    this.getFee();
    this.isTransferToNix = false;
    this.isTransferToOthersBanks = true;
    this.isTransferToMyAccount = false;
    this.openSelectContactModal();
    this.getBalance();
  }

  getFee(): void {
    this.loading = true;
    this.service.getFees().subscribe(
      data => {
        if (data.results) {
          this.fee = data.results.filter(
            (d: { transaction_type: string; installment: number }) =>
              d.transaction_type === 'TED' && d.installment === 1
          )[0].amount;
        }
      },
      error => this.toastr.error('Não foi possível consultar taxa de transferência.'),
    ).add(() => this.loading = false);
  }

  getBalance(): void {
    this.actionBarService.getBalance().subscribe(
      response => this.balance = response.balance.available.amount,
    );
  }

  getPeopleBankAccounts(): void {
    this.loading = true;
    this.service.getCompany().subscribe(
      companies => {
        if (companies && companies.length > 0) {
          const accountOk = companies.filter((account: { account_status: string; }) => account.account_status === 'OK');
          if (accountOk.length) {
            this.service.getPeopleBankAccounts(accountOk[0].cadun_pj_id).subscribe(
              bankAccounts => {
                if (bankAccounts && bankAccounts.length > 0) {
                  this.peopleBankAccounts = bankAccounts[0];
                }
              },
              error => this.toastr.error('Não foi possível buscar dados bancários.'),
            );
          } else {
            this.toastr.error('Não foi possível encontrar empresa.');
          }
        }
      },
      error => this.toastr.error('Não foi possível buscar dados da empresa.'),
    ).add(() => this.loading = false);
  }

  getPayListSelect(): void {
    this.service
      .getTransferListSelect()
      .then((TRANSFERLISTSELECT) => (this.listSelect = TRANSFERLISTSELECT));
  }

  onChangeSelect(): void {
    this.showPage = false;
    this.form.reset();
    switch (this.transferSelectFormControl.value) {
      case 'NIX':
        this.transactionType = 'NIX';
        this.isTransferToNix = true;
        this.isTransferToOthersBanks = false;
        this.isTransferToMyAccount = false;
        this.openSelectNixAccountModal();
        break;
      case 'BANK':
        this.transactionType = 'BANK';
        // this.getFee();
        this.fee = '4.50';
        this.isTransferToNix = false;
        this.isTransferToOthersBanks = true;
        this.isTransferToMyAccount = false;
        this.openSelectContactModal();
        break;
      case 'OWN_ACCOUNT':
        this.transactionType = 'OWN_ACCOUNT';
        this.getFee();
        this.getPeopleBankAccounts();
        this.isTransferToNix = false;
        this.isTransferToOthersBanks = false;
        this.isTransferToMyAccount = true;
        this.showPage = true;
        this.destinataryName = this.storageService.officialName;
        this.destinataryDocumentvalue = this.cpfCnpjPipe.transform(this.storageService.cnpjCompany || '-');
        break;
      default:
        break;
    }
  }

  transfer(form: any): void {
    this.service.setCheckoutOrder(
      String(this.form.value.amount),
      this.peopleBankAccounts.account_number,
      this.peopleBankAccounts.account_digit,
      this.destinataryName,
      this.utils.onlyNumbers(this.destinataryDocumentvalue),
      this.peopleBankAccounts.account_branch,
      this.peopleBankAccounts.account_branch_digit,
      this.peopleBankAccounts.bank_number,
      this.peopleBankAccounts.account_type,
    );
    this.service.setTransferExtraData(
      this.getBankNameAndCode(this.peopleBankAccounts.bank_number),
      this.getBankShortName(this.peopleBankAccounts.bank_number),
      this.fee,
      this.transactionType,
    );
    const dialogRef = this.dialog.open(ConfirmTransferDataModalComponent, {
      width: '100%',
      height: 'auto',
      maxWidth: '845px',
      maxHeight: '95vh',
    });
    dialogRef.afterClosed().subscribe(
      result => {
        this.transferSelectFormControl.reset();
        this.showPage = false;
        this.form.reset();
      }
    );
  }

  openSelectNixAccountModal(): void {
    const dialogRef = this.dialog.open(SelectNixAccountModalComponent, {
      width: '100%',
      height: 'auto',
      maxWidth: '645px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (this.service.selectedNixAccount) {
        this.destinataryName = this.service.selectedNixAccount.name;
        this.destinataryDocumentvalue = this.service.selectedNixAccount.customer_id;
        this.peopleBankAccounts = {
          account_branch: this.service.selectedNixAccount.branch_number,
          account_branch_digit: '0',
          account_digit: this.service.selectedNixAccount.account_check_digit,
          account_number: this.service.selectedNixAccount.account_number,
          account_type: this.service.selectedNixAccount.account_type,
          bank_number: this.service.selectedNixAccount.bank_number,
          id: this.service.selectedNixAccount.id,
        };
        this.service.selectedNixAccount = {} as INixAccount;
        this.showPage = true;
      } else {
        this.transferSelectFormControl.reset();
      }
    });
  }

  openSelectContactModal(): void {
    this.showSelectContact = false;
    const dialogRef = this.dialog.open(SelectContactModalComponent, {
      width: '100%',
      height: 'auto',
      maxWidth: '645px',
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (this.contactService.selectedContact) {
          this.destinataryName = this.contactService.selectedContact.name;
          this.destinataryDocumentvalue = this.cpfCnpjPipe.transform(this.contactService.selectedContact.document_value || '-');
          this.contactBankData(this.contactService.selectedContact.id);
        } else {
          this.transferSelectFormControl.reset();
        }
        this.showSelectContact = true;
      });
  }

  contactBankData(contactID: string): void {
    this.loading = true;
    this.contactService.getSubPeopleBankAccounts(this.storageService.cadunPjIdCompany, contactID).subscribe(
      response => {
        if (response.length) {
          this.contactService.selectedContactBankAccount = response[0];
          this.showTransferPage();
        } else {
          this.toastr.warning('Contato sem dados bancários.');
          this.loading = true;
          const contactData = {
            person: {
              email: this.contactService.selectedContact.email,
              name: this.contactService.selectedContact.name,
              phone: this.contactService.selectedContact.phone,
              document_type: this.contactService.selectedContact.document_type,
              document_value: this.contactService.selectedContact.document_value,
            },
            address: {
              city: this.contactService.selectedContact.city,
              complement: this.contactService.selectedContact.complement,
              neighborhood: this.contactService.selectedContact.neighborhood,
              number: this.contactService.selectedContact.number,
              state: this.contactService.selectedContact.state,
              street: this.contactService.selectedContact.street,
              zip_code: this.contactService.selectedContact.zip_code,
            },
            bank: {},
            groups: [environment.KEYS.GROUP_ID]
          };
          this.loading = false;
          const dialogRef = this.dialog.open(NewContactModalComponent, {
            width: '100%',
            height: 'auto',
            maxWidth: '900px',
            data: {
              info: contactData,
              type: 'edit',
              contactID: this.contactService.selectedContact.id,
              bankID: null,
            },
          });
        }
      },
      error => this.toastr.error('Não foi possível buscar os dados bancários do contato'),
    ).add(() => this.loading = false);
  }

  showTransferPage(): void {
    const subpeopleBankData = {
      account_branch: this.contactService.selectedContactBankAccount.agency,
      account_branch_digit: this.contactService.selectedContactBankAccount.agency_account_cd,
      account_digit: this.contactService.selectedContactBankAccount.account_cd,
      account_number: this.contactService.selectedContactBankAccount.account,
      account_type: this.contactService.selectedContactBankAccount.account_type,
      bank_number: String(this.contactService.selectedContactBankAccount.bank).padStart(3, '0'),
      id: this.contactService.selectedContactBankAccount.id,
    };
    this.contactService.selectedContactBankAccount = {} as ISubPeopleBankAccount;
    this.contactService.selectedContact = {} as ISubPeople;
    this.peopleBankAccounts = subpeopleBankData;
    this.showPage = true;
  }

  getBankNameAndCode(code: any): string {
    const bank = this.bankService.getBankNameByCode(code);
    let bankName = '-';
    if (bank) {
      bankName = bank.compe_code + ' - ' + bank.short_name;
    }
    return bankName;
  }

  getBankShortName(code: any): string {
    const bank = this.bankService.getBankNameByCode(code);
    let bankName = '-';
    if (bank) {
      bankName = bank.short_name;
    }
    return bankName;
  }

  hasBalanceToTransfer(): boolean {
    return Number(this.balance) > Number(this.form.value.amount);
  }

  isSendToCompany(): boolean {
    return this.destinataryDocumentvalue !== undefined && this.utils.onlyNumbers(this.destinataryDocumentvalue).length > 11;
  }

  getAccountType(): string {
    if (this.peopleBankAccounts?.account_type === '1') {
      return 'Poupança';
    } else if (this.peopleBankAccounts?.account_type === 'DIGITAL_ACCOUNT') {
      return 'NIX';
    } else {
      return 'Corrente';
    }
  }

  clearContact(): void {
    this.showSelectContact = true;
    this.transferSelectFormControl.reset();
    this.destinataryName = '';
    this.destinataryDocumentvalue = '';
    this.showPage = false;
    this.peopleBankAccounts = null;
  }

}
