import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

import { CustomValidators } from 'src/app/common/custom-validators';
import { IAccountType, IBank } from 'src/app/common/services/bank/bank.model';
import { BankService } from 'src/app/common/services/bank/bank.service';
import { IAddress, IState } from 'src/app/common/services/cep/cep.model';
import { CepService } from 'src/app/common/services/cep/cep.service';
import { ManagePlansService } from '../manage-plans/shared/manage-plans.service';
import { IFeeClient } from '../manage-plans/shared/plan.model';
import { ICompany, IUpdateCompanyPayload } from '../register-company/shared/register-company.models';
import { RegisterCompanyService } from '../register-company/shared/register-company.service';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  companyFormGroup: FormGroup;
  companyBankFormGroup: FormGroup;
  company: ICompany;
  loading = false;
  states: IState[];
  bankFilteredOptions: Observable<IBank[]>;
  bankList: IBank[] = [];
  accoutTypes: IAccountType[];
  billet: IFeeClient = { tariff_value: '0', fee_amount: '0', free_quantities: 0 };
  pix: IFeeClient = { tariff_value: '0', fee_amount: '0', free_quantities: 0 };
  ted: IFeeClient = { tariff_value: '0', fee_amount: '0', free_quantities: 0 };
  createAccount: IFeeClient = { tariff_value: '0', fee_amount: '0', free_quantities: 0 };
  planName: string;
  planCode: string;

  constructor(
    private formBuilder: FormBuilder,
    private registerCompanyService: RegisterCompanyService,
    private bankService: BankService,
    private cepService: CepService,
    private customValidators: CustomValidators,
    private toastr: ToastrService,
    private managePlansService: ManagePlansService,
  ) {
    this.companyFormGroup = this.formBuilder.group(
      {
        officialName: ['', Validators.required],
        name: ['', Validators.required],
        cnpj: ['', [Validators.required, this.customValidators.cpfCnpjValidator()]],
        stateRegistration: '',
        street: ['', Validators.required],
        zipCode: ['', Validators.required],
        neighborhood: ['', Validators.required],
        number: ['', Validators.required],
        state: ['', Validators.required],
        city: ['', Validators.required],
        addressLineTwo: '',
      }
    );
    this.companyBankFormGroup = this.formBuilder.group({
      bank: ['', Validators.required],
      agency: ['', Validators.required],
      agencyDv: '',
      account: ['', Validators.required],
      accountDv: ['', Validators.required],
    });
    this.bankService.getAccountTypes().then((ACCOUNTTYPES) => (this.accoutTypes = ACCOUNTTYPES));
  }

  ngOnInit(): void {
    this.getBanksAndBuildForm();
    this.getStates();
    this.getCompany();
    this.getFees();
  }

  getFees(): void {
    this.loading = true;
    this.managePlansService.getFees().subscribe(
      FEES => {
        this.billet = FEES.results.filter(f => f.event_type === 'bill-payment')[0];
        this.ted = FEES.results.filter(f => f.event_type === 'transfer')[0];
        this.pix = FEES.results.filter(f => f.event_type === 'pix')[0];
        this.createAccount = FEES.results.filter(f => f.event_type === 'create-account')[0];
        this.getChannel(this.ted.plan);
      },
    ).add(() => this.loading = false);
  }

  getChannel(planID: string): void {
    this.loading = true;
    this.managePlansService.getChannel(planID).subscribe(
      PLAN => {
        this.planName = PLAN.results[0].code;
        this.planCode = PLAN.results[0].name;
      },
      ERROR => this.toastr.error('Não foi possível buscar canal.'),
    ).add(() => this.loading = false);
  }

  getCompany(): void {
    this.loading = true;
    this.registerCompanyService.getCompany().subscribe(
      COMPANY => this.company = COMPANY,
    ).add(() => {
      this.loading = false;
      this.populateForm();
    });
  }

  getBanksAndBuildForm(): void {
    this.bankService.getBankList().then((bankList) => (this.bankList = bankList));
    this.bankFilteredOptions = this.companyBankFormGroup.controls['bank'].valueChanges.pipe(
      startWith(''),
      map((bank) => (typeof bank === 'string' ? bank : bank.long_name)),
      map((bankName: string) => bankName ? this._filterBank(bankName) : this.bankList.slice()
      )
    );
  }

  displayBankFn(bank: IBank): string {
    return bank && bank.long_name ? bank.long_name : '';
  }

  _filterBank(bankName: string): IBank[] {
    return this.bankList.filter((bank) =>
      bank.long_name.toLowerCase().match(bankName.toLowerCase()
      )
    );
  }

  _filterBankByNumber(bankNumber: number): IBank[] {
    return this.bankList.filter((bank) =>
      bank.compe_code.match(bankNumber.toString())
    );
  }

  populateForm(): void {
    this.companyFormGroup.controls['officialName'].setValue(this.company.official_name);
    this.companyFormGroup.controls['name'].setValue(this.company.name);
    this.companyFormGroup.controls['cnpj'].setValue(this.customValidators.onlyNumbers(this.company.cnpj));
    this.companyFormGroup.controls['stateRegistration'].setValue(this.company.state_registration);
    this.companyFormGroup.controls['street'].setValue(this.company.address.street);
    this.companyFormGroup.controls['zipCode'].setValue(this.company.address.zip_code);
    this.companyFormGroup.controls['neighborhood'].setValue(this.company.address.neighborhood);
    this.companyFormGroup.controls['number'].setValue(this.company.address.number);
    this.companyFormGroup.controls['state'].setValue(this.company.address.state);
    this.companyFormGroup.controls['city'].setValue(this.company.address.city);
    this.companyFormGroup.controls['addressLineTwo'].setValue(this.company.address.complement);
    this.companyBankFormGroup.controls['bank'].setValue(this._filterBankByNumber(this.company.bank_account.bank_number)[0]);
    this.companyBankFormGroup.controls['agency'].setValue(this.company.bank_account.account_branch);
    this.companyBankFormGroup.controls['agencyDv'].setValue(this.company.bank_account.account_branch_digit);
    this.companyBankFormGroup.controls['account'].setValue(this.company.bank_account.account_number);
    this.companyBankFormGroup.controls['accountDv'].setValue(this.company.bank_account.account_digit);
  }

  getStates(): void {
    this.cepService.getStates().then((states) => (this.states = states));
  }

  fetchAddress(): void {
    const cep = this.companyFormGroup.value.zipCode;
    if (this.cepService.isCepValid(cep)) {
      this.loading = true;
      this.cepService.getAddress(cep).subscribe(
        address => this.updateAddress(address),
        err => this.toastr.warning('CEP não encontrado.')
      ).add(() => this.loading = false);
    }
  }

  updateAddress(address: IAddress): void {
    this.companyFormGroup.controls['zipCode'].reset();
    this.companyFormGroup.controls['state'].reset();
    this.companyFormGroup.controls['city'].reset();
    this.companyFormGroup.controls['street'].reset();
    this.companyFormGroup.controls['neighborhood'].reset();
    this.companyFormGroup.patchValue({
      zipCode: address.cep,
      state: address.state,
      city: address.city,
      street: address.street,
      neighborhood: address.neighborhood,
    });
  }

  saveSettings(): void {
    this.loading = true;
    this.registerCompanyService.updateCompany(this.getPayload()).subscribe(
      response => {
        this.companyFormGroup.reset();
        this.companyBankFormGroup.reset();
        this.getCompany();
        this.toastr.success('Empresa atualizada.');
      },
      error => this.toastr.error('Não foi possível atualizar os dados da empresa.'),
    ).add(() => this.loading = false);
  }

  getPayload(): IUpdateCompanyPayload {
    return {
      name: this.companyFormGroup.value.name,
      official_name: this.companyFormGroup.value.officialName,
      state_registration: this.companyFormGroup.value.stateRegistration,
      address: {
        zip_code: this.companyFormGroup.value.zipCode,
        street: this.companyFormGroup.value.street,
        state: this.companyFormGroup.value.state,
        neighborhood: this.companyFormGroup.value.neighborhood,
        number: this.companyFormGroup.value.number,
        complement: this.companyFormGroup.value.addressLineTwo,
        city: this.companyFormGroup.value.city
      },
      bank_account: {
        bank_number: this.companyBankFormGroup.value.bank.compe_code,
        account_branch: this.companyBankFormGroup.value.agency,
        account_branch_digit: this.companyBankFormGroup.value.agencyDv,
        account_number: this.companyBankFormGroup.value.account,
        account_digit: this.companyBankFormGroup.value.accountDv,
        account_type: '0',
      }
    };
  }

}
