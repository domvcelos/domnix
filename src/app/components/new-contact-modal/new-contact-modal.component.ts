import { ViewChild } from '@angular/core';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';

import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { CustomValidators } from 'src/app/common/custom-validators';
import { IAccountType, IBank } from 'src/app/common/services/bank/bank.model';
import { BankService } from 'src/app/common/services/bank/bank.service';
import { BANKLIST } from 'src/app/common/services/bank/mock-bank';
import { IAddress, IState } from 'src/app/common/services/cep/cep.model';
import { CepService } from 'src/app/common/services/cep/cep.service';
import { IContact, IContactUpdatePayload } from 'src/app/pages/contacts/shared/contacts.model';
import { ContactsService } from 'src/app/pages/contacts/shared/contacts.service';
import { environment } from 'src/environments/environment';


interface DialogData {
  info: IContact;
  type: 'edit' | 'create';
  contactID: string;
  bankID: null | string;
}

@Component({
  selector: 'app-new-contact-modal',
  templateUrl: './new-contact-modal.component.html',
  styleUrls: ['./new-contact-modal.component.scss'],
})
export class NewContactModalComponent implements OnInit {
  @ViewChild('stepper') private stepper: MatStepper;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  filteredOptions: Observable<IBank[]>;
  bankList: IBank[] = [];
  states: IState[];
  contactSaved = true;
  loading = false;
  accoutTypes: IAccountType[];

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public contactDialog: DialogData,
    private dialogRef: MatDialogRef<NewContactModalComponent>,
    private bankService: BankService,
    private contactsService: ContactsService,
    private cepService: CepService,
    private toastr: ToastrService,
    private customValidators: CustomValidators
  ) {
    this.getStates();
    this.firstFormGroup = this.formBuilder.group(
      {
        name: [contactDialog.info.person.name, Validators.required],
        document_value: [
          contactDialog.info.person.document_value,
          [Validators.required, this.customValidators.cpfCnpjValidator()],
        ],
        phone: [contactDialog.info.person.phone, Validators.required],
        email: [
          contactDialog.info.person.email,
          [Validators.required, Validators.email],
        ],
        street: [contactDialog.info.address.street, Validators.required],
        zip_code: [contactDialog.info.address.zip_code, Validators.required],
        neighborhood: [contactDialog.info.address.neighborhood, Validators.required],
        number: [contactDialog.info.address.number, Validators.required],
        state: [
          contactDialog.info.address.state.toLocaleUpperCase(),
          [Validators.required, Validators.maxLength(2)],
        ],
        city: [contactDialog.info.address.city, Validators.required],
        complement: [contactDialog.info.address.complement],
      },
    );
    this.secondFormGroup = this.formBuilder.group({
      bank: [
        contactDialog.info.bank?.bank ? this.filterBankByCode(String(contactDialog.info.bank?.bank)) : '',
      ],
      agency: [
        contactDialog.info.bank?.agency,
        [],
      ],
      agency_cd: [
        contactDialog.info.bank?.agency_cd,
        [],
      ],
      account: [
        contactDialog.info.bank?.account,
        [],
      ],
      account_cd: [
        contactDialog.info.bank?.account_cd,
        [],
      ],
      account_type: [
        contactDialog.info.bank?.account_type,
      ],
    });
    this.getBanksAndBuildForm();
    this.bankService
      .getAccountTypes()
      .then((ACCOUNTTYPES) => (this.accoutTypes = ACCOUNTTYPES));
  }

  ngOnInit(): void { }

  displayFn(bank: IBank): string {
    return bank && bank.long_name ? bank.long_name : '';
  }

  private _filterBank(bankName: string): IBank[] {
    return this.bankList.filter((bank) =>
      bank.long_name.toLowerCase().match(bankName.toLowerCase())
    );
  }

  saveContact(): void {
    if (this.contactDialog.type === 'edit') {
      this.editContact();
    } else {
      this.dialogRef.disableClose = true;
      if (this.firstFormGroup.valid && this.secondFormGroup.valid) {
        this.loading = true;
        this.contactsService
          .createContact(this.getCreateContactPayload())
          .subscribe(
            (contact) => this.contactSaved = true,
            (error) => {
              this.toastr.error('Erro ao cadastrar contato.');
              this.contactSaved = false;
            }
          )
          .add(() => (
            this.loading = false,
            this.stepper.next()
          ));
      }
    }
  }

  editContact(): void {
    this.dialogRef.disableClose = true;
    if (this.firstFormGroup.valid && this.secondFormGroup.valid) {
      this.loading = true;
      this.contactsService.putSubpeople(this.contactDialog.contactID, this.getUpdateContactPayload()).subscribe(
        update => {
          if (this.contactDialog.bankID) {
            this.contactsService.putSubpeopleBankAccount(this.contactDialog.contactID, this.contactDialog.bankID,
              this.getUpdateBankAccountPayload()).subscribe(
                updatebank => this.contactSaved = true,
                error => {
                  this.contactSaved = false;
                  this.toastr.error('Não foi possível salvar os dados bancários.');
                }
              );
          } else if (this.secondFormGroup.value.bank && this.secondFormGroup.valid) {
            this.contactsService.createSubpeopleBankaccounts(this.contactDialog.contactID, this.getUpdateBankAccountPayload()).subscribe(
              createbank => this.contactSaved = true,
              error => {
                this.contactSaved = false;
                this.toastr.error('Não foi possível salvar os dados bancários.');
              },
            );
          } else {
            this.contactSaved = true;
          }
        },
        error => {
          this.contactSaved = false;
          this.toastr.error('Não foi possível cadastrar o novo contato.');
        },
      ).add(() => (
        this.loading = false,
        this.stepper.next()
      ));
    }
  }

  getUpdateBankAccountPayload(): any {
    let data = {
      account: this.secondFormGroup.value.account,
      account_cd: this.secondFormGroup.value.account_cd,
      agency: this.secondFormGroup.value.agency,
      bank: Number(this.secondFormGroup.value.bank.compe_code),
      account_type: this.secondFormGroup.value.account_type,
    };
    if (this.secondFormGroup.value.agency_cd) {
      data = Object.assign(data, { agency_cd: this.secondFormGroup.value.agency_cd });
    }
    return data;
  }

  getUpdateContactPayload(): IContactUpdatePayload {
    const data: IContactUpdatePayload = {
      email: this.firstFormGroup.value.email,
      name: this.firstFormGroup.value.name,
      phone: this.firstFormGroup.value.phone,
      document_type: this.firstFormGroup.value.document_value.length > 11 ? 'CNPJ' : 'CPF',
      document_value: this.firstFormGroup.value.document_value,
      city: this.firstFormGroup.value.city,
      neighborhood: this.firstFormGroup.value.neighborhood,
      number: this.firstFormGroup.value.number,
      state: this.firstFormGroup.value.state,
      street: this.firstFormGroup.value.street,
      zip_code: this.firstFormGroup.value.zip_code,
    };
    if (this.firstFormGroup.value.complement) {
      data.complement = this.firstFormGroup.value.complement;
    }
    return data;
  }

  private getCreateContactPayload(): IContact {
    const data: IContact = {
      person: {
        email: this.firstFormGroup.value.email,
        name: this.firstFormGroup.value.name,
        phone: this.firstFormGroup.value.phone,
        document_type: this.firstFormGroup.value.document_value.length > 11 ? 'CNPJ' : 'CPF',
        document_value: this.firstFormGroup.value.document_value
      },
      address: {
        city: this.firstFormGroup.value.city,
        neighborhood: this.firstFormGroup.value.neighborhood,
        number: this.firstFormGroup.value.number,
        state: this.firstFormGroup.value.state,
        street: this.firstFormGroup.value.street,
        zip_code: this.firstFormGroup.value.zip_code,
      },
      bank: undefined,
      groups: [environment.KEYS.GROUP_ID]
    };
    if (this.firstFormGroup.value.complement) {
      data.address.complement = this.firstFormGroup.value.complement;
    }
    if (this.secondFormGroup.value.bank) {
      data.bank = {
        account: this.secondFormGroup.value.account,
        account_cd: this.secondFormGroup.value.account_cd,
        agency: this.secondFormGroup.value.agency,
        account_type: this.secondFormGroup.value.account_type,
        bank: Number(this.secondFormGroup.value.bank.compe_code),
      };
      if (this.secondFormGroup.value.agency_cd) {
        data.bank.agency_cd = this.secondFormGroup.value.agency_cd;
      }
    }
    return data;
  }

  getStates(): void {
    this.cepService.getStates().then((states) => (this.states = states));
  }

  fetchAddress(): void {
    const cep = this.firstFormGroup.value.zip_code;
    if (this.cepService.isCepValid(cep)) {
      this.loading = true;
      this.cepService
        .getAddress(cep)
        .subscribe(
          (address) => this.updateAddress(address),
          (err) => this.toastr.warning('CEP não encontrado.')
        )
        .add(() => (this.loading = false));
    }
  }

  updateAddress(address: IAddress): void {
    this.resetAddress();
    this.firstFormGroup.patchValue({
      state: address.state,
      city: address.city,
      street: address.street,
      neighborhood: address.neighborhood,
    });
  }

  resetAddress(): void {
    this.firstFormGroup.patchValue({
      state: null,
      city: null,
      street: null,
      neighborhood: null,
    });
  }

  filterBankByCode(code: string): IBank {
    return BANKLIST.filter(b => b.compe_code === code.padStart(3, '0'))[0];
  }

  getBanksAndBuildForm(): void {
    this.bankService
      .getBankList()
      .then((bankList) => (this.bankList = bankList));
    this.filteredOptions = this.secondFormGroup.controls[
      'bank'
    ].valueChanges.pipe(
      startWith(''),
      map((bank) => (typeof bank === 'string' ? bank : bank.long_name)),
      map((bankName: string) =>
        bankName ? this._filterBank(bankName) : this.bankList.slice()
      )
    );
  }

}
