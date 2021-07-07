import { AfterViewInit } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatHorizontalStepper } from '@angular/material/stepper';

import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CustomValidators } from 'src/app/common/custom-validators';
import { IBank } from 'src/app/common/services/bank/bank.model';
import { BankService } from 'src/app/common/services/bank/bank.service';

import { IAddress, IState } from 'src/app/common/services/cep/cep.model';
import { CepService } from 'src/app/common/services/cep/cep.service';
import { StorageService } from 'src/app/common/services/storage/storage.service';
import { SignUpStatus } from 'src/app/common/utils';
import { environment } from 'src/environments/environment';
import { LoginService } from '../login/shared/login.service';
import { IActivity, ICompany } from './shared/register-company.models';
import { RegisterCompanyService } from './shared/register-company.service';


enum CompanyFormStep {
  companyInfo = 'companyInfo',
  companyBank = 'companyBank',
  companyAddress = 'companyAddress',
}

@Component({
  selector: 'app-register-company',
  templateUrl: './register-company.component.html',
  styleUrls: ['./register-company.component.scss'],
})
export class RegisterCompanyComponent implements OnInit, AfterViewInit {
  @ViewChild(MatHorizontalStepper) stepper!: MatHorizontalStepper;
  companyFormGroup: FormGroup;
  companyAdrressFormGroup: FormGroup;
  companyBankFormGroup: FormGroup;
  activityFilteredOptions: Observable<IActivity[]> | undefined;
  bankFilteredOptions: Observable<IBank[]> | undefined;
  activities: IActivity[] = [];
  bankList: IBank[] = [];
  states: IState[];
  loading = false;
  companyFormStep = CompanyFormStep;
  constructor(
    private formBuilder: FormBuilder,
    private registerCompanyService: RegisterCompanyService,
    private service: RegisterCompanyService,
    private bankService: BankService,
    private loginService: LoginService,
    private toastr: ToastrService,
    private cepService: CepService,
    private storageService: StorageService,
    private customValidators: CustomValidators
  ) {
    this.companyFormGroup = this.formBuilder.group({
      razaoSocial: ['', Validators.required],
      nomeFantasia: ['', Validators.required],
      cnpj: ['', Validators.required, this.customValidators.cpfCnpjValidator()],
      inscricaoEstadual: '',
      activity: ['', Validators.required],
    });
    this.companyAdrressFormGroup = this.formBuilder.group({
      street: ['', Validators.required],
      zipCode: ['', Validators.required],
      neighborhood: ['', Validators.required],
      number: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
    });
    this.companyBankFormGroup = this.formBuilder.group({
      bank: ['', Validators.required],
      agency: ['', Validators.required],
      agencyDv: '',
      account: ['', Validators.required],
      accountDv: ['', Validators.required],
    });
    this.getStates();
    this.getActivitiesAndBuildForm();
    this.getBanksAndBuildForm();
  }

  ngOnInit(): void { }

  getBanksAndBuildForm(): void {
    this.bankService
      .getBankList()
      .then((bankList) => (this.bankList = bankList));
    this.bankFilteredOptions = this.companyBankFormGroup.controls[
      'bank'
    ].valueChanges.pipe(
      startWith(''),
      map((bankName: string) =>
        bankName ? this._filterBank(bankName) : this.bankList.slice()
      )
    );
  }

  getActivitiesAndBuildForm(): void {
    this.registerCompanyService.getActivitiesList().subscribe((activities) => {
      this.activities = activities;
      this.activityFilteredOptions = this.companyFormGroup.controls[
        'activity'
      ].valueChanges.pipe(
        startWith(''),
        map((activity: string) =>
          activity ? this._filterActivity(activity) : this.activities.slice()
        )
      );
    });
  }

  ngAfterViewInit(): void {
    if (this.stepper) {
      this.stepper._getIndicatorType = () => 'number';
    }
  }

  displayActivityFn(activity: IActivity): string {
    return activity ? activity.name : '';
  }

  displayBankFn(bank: IBank): string {
    return bank && bank.long_name ? bank.long_name : '';
  }

  _filterActivity(filterActivity: string): IActivity[] {
    return this.activities.filter((activity) =>
      activity.name.toLowerCase().match(filterActivity.toLocaleLowerCase())
    );
  }

  _filterBank(bankName: string): IBank[] {
    return this.bankList.filter((bank) =>
      bank.long_name.toLocaleLowerCase().match(bankName.toLowerCase())
    );
  }

  next(form: string): void {
    if (
      form === this.companyFormStep.companyInfo &&
      this.companyFormGroup.valid
    ) {
      this.loading = true;
      this.service
        .checkCompanyExists(
          this.customValidators.onlyNumbers(this.companyFormGroup.value.cnpj)
        )
        .subscribe(
          (response) => this.toastr.error('CNPJ já cadastrado.'),
          (error) => this.stepper.next()
        )
        .add(() => (this.loading = false));
    } else if (
      form === this.companyFormStep.companyBank &&
      this.companyBankFormGroup.valid
    ) {
      const data: ICompany = this.getPayload();
      this.service
        .createCompany(data)
        .subscribe(
          (response) => {
            this.loginService.setNexxcardCompany(response.company.cnpj, () => {
              this.storageService.signUpStatus = SignUpStatus.active;
              this.storageService.cadunPjIdCompany =
                response.company.cadun_pj_id;
              this.storageService.cnpjCompany = response.company.cnpj;
            });
            window.location.href = response.checkout_url;
          },
          (error) => {
            switch (error.status) {
              case 403: {
                break;
              }
              case 404: {
                this.toastr.error('CNPJ e empresa não encontrados.');
                break;
              }
              default: {
                this.toastr.error(
                  'Falha ao enviar dados. Tente novamente mais tarde.'
                );
              }
            }
          }
        )
        .add(() => (this.loading = false));
    } else {
      this.stepper.next();
    }
  }

  private getPayload(): any {
    const currentUser = this.storageService.currentUser;
    const data: ICompany = {
      channel_code: environment.KEYS.SELF_HIRING_CODE,
      corporate_name: this.companyFormGroup.value.nomeFantasia,
      name: currentUser.user_info.name,
      cnpj: this.customValidators.onlyNumbers(this.companyFormGroup.value.cnpj),
      social_number: currentUser.user_info.attributes.socialNumber[0],
      official_name: this.companyFormGroup.value.razaoSocial,
      user_id: currentUser.user_info.id,
      phone_number: currentUser.user_info.attributes.phone[0],
      email: currentUser.user_info.email,
      activity_code: this.companyFormGroup.value.activity.id,
      entity: currentUser.user_info.attributes.socialNumber[0],
      bank_account: {
        bank_number: this.companyBankFormGroup.value.bank.compe_code,
        account_branch: this.companyBankFormGroup.value.agency,
        account_branch_digit: this.companyBankFormGroup.value.agencyDv,
        account_number: this.companyBankFormGroup.value.account,
        account_digit: this.companyBankFormGroup.value.accountDv,
        account_type: '0',
      },
      address: {
        neighborhood: this.companyAdrressFormGroup.value.neighborhood,
        number: this.companyAdrressFormGroup.value.number,
        address_line_2: this.companyAdrressFormGroup.value.complement
          ? this.companyAdrressFormGroup.value.complement
          : '',
        street: this.companyAdrressFormGroup.value.street,
        zip_code: this.customValidators.onlyNumbers(
          this.companyAdrressFormGroup.value.zipCode
        ),
        city: this.companyAdrressFormGroup.value.city,
        state: this.companyAdrressFormGroup.value.state,
        country: 'Brasil',
      },
    };
    if (this.companyFormGroup.value.inscricaoEstadual) {
      data[
        'state_registration'
      ] = this.companyFormGroup.value.inscricaoEstadual;
    }
    return data;
  }

  getStates(): void {
    this.cepService.getStates().then((states) => (this.states = states));
  }

  fetchAddress(): void {
    const cep = this.companyAdrressFormGroup.value.zipCode;
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
    this.companyAdrressFormGroup.patchValue({
      state: address.state,
      city: address.city,
      street: address.street,
      neighborhood: address.neighborhood,
    });
  }

  resetAddress(): void {
    this.companyAdrressFormGroup.patchValue({
      state: null,
      city: null,
      street: null,
      neighborhood: null,
    });
  }
}
