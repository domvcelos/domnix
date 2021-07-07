import { AfterViewInit } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControlOptions } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';

import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

import { CustomValidators } from 'src/app/common/custom-validators';
import { IAddress, IState } from 'src/app/common/services/cep/cep.model';
import { CepService } from 'src/app/common/services/cep/cep.service';
import { ICadunUserPayload, INixCoreUserPayload } from './shared/user-sign-in.model';
import { UserSignInService } from './shared/user-sign-in.service';


@Component({
  selector: 'app-user-sign-in',
  templateUrl: './user-sign-in.component.html',
  styleUrls: ['./user-sign-in.component.scss']
})
export class UserSignInComponent implements OnInit, AfterViewInit {
  @ViewChild('stepper') private stepper: MatStepper;
  signInFormGroup: FormGroup;
  addressFormGroup: FormGroup;
  editable = true;
  isFinished = false;
  loading = false;
  states: IState[];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private service: UserSignInService,
    private toastr: ToastrService,
    private customValidators: CustomValidators,
    private cepService: CepService
  ) {
    this.getStates();
    this.signInFormGroup = this.formBuilder.group(
      {
        name: ['', [Validators.required, Validators.pattern('^.*?\\b \\b.*?$')]],
        social_name: ['', [Validators.required]],
        mother_name: ['', [Validators.required]],
        cpf: ['', [Validators.required, this.customValidators.cpfCnpjValidator()]],
        birthday: ['', [Validators.required, this.customValidators.checkFormatDate, this.customValidators.checkMinAge()]],
        phone: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
        email: ['', [Validators.required, Validators.email]],
      },
      { validator: this.customValidators.mustMatch('password', 'confirmPassword') } as AbstractControlOptions
    );
    this.addressFormGroup = this.formBuilder.group({
      street: ['', Validators.required],
      zip_code: ['', Validators.required],
      neighborhood: ['', Validators.required],
      number: ['', Validators.required],
      state: ['', [Validators.required, Validators.maxLength(2)]],
      city: ['', Validators.required],
      complement: [''],
    });
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.stepper._getIndicatorType = () => 'number';
  }

  signIn(): void {
    if (this.signInFormGroup.valid && this.addressFormGroup.valid) {
      this.loading = true;
      const data = this.getCadunUserPayload();
      this.service.createCadunUser(data).subscribe(
        success => {
          this.service.sendVerifyEmail(success['user_id']).subscribe(
            response => {
              this.service.createNixCoreUser(this.getNixCoreUserPayload(success['user_id'])).subscribe(
                coreuser => {
                  this.editable = false;
                  this.stepper.next();
                },
                error => this.toastr.error('Não foi possível criar usuário no Nix core.'),
              );
            },
            error => this.toastr.error('Não foi possível enviar email de confirmação.')
          );
        },
        error => {
          if (error.status === 406) {
            if (error.error.message === 'User with this username already exists') {
              this.toastr.error('CPF já cadastrado.');
            } else if (error.error.message === 'User with this email already exists') {
              this.toastr.error('Email já cadastrado.');
            } else {
              this.toastr.error('Não foi possível criar usuário.');
            }
          } else {
            this.toastr.error('Não foi possível criar usuário.');
          }
        },
      ).add(() => this.loading = false);
    }
  }

  getNixCoreUserPayload(userID: string): INixCoreUserPayload {
    return {
      cadun_id: userID,
      name: this.signInFormGroup.value.name,
      cpf: this.signInFormGroup.value.cpf,
      password: this.signInFormGroup.value.password,
      email: this.signInFormGroup.value.email,
      phone: this.signInFormGroup.value.phone,
      birthday: moment(this.signInFormGroup.value.birthday, 'DDMMYYYY').format('DD/MM/YYYY'),
      mother_name: this.signInFormGroup.value.mother_name,
      social_name: this.signInFormGroup.value.social_name,
      phone_country_code: '55',
      address_number: this.addressFormGroup.value.number,
      address_neighborhood: this.addressFormGroup.value.neighborhood,
      address_complement: this.addressFormGroup.value.complement,
      address_country: 'BR',
      address_line: this.addressFormGroup.value.street,
      address_city: this.addressFormGroup.value.city,
      address_state: this.addressFormGroup.value.state,
      address_zip_code: this.addressFormGroup.value.zip_code,
    };
  }

  private getCadunUserPayload(): ICadunUserPayload {
    return {
      name: this.signInFormGroup.value.name,
      username: this.customValidators.onlyNumbers(this.signInFormGroup.value.cpf),
      password: this.signInFormGroup.value.password,
      email: this.signInFormGroup.value.email,
      social_number: this.signInFormGroup.value.cpf.replace(/\D/g, ''),
      phone: this.signInFormGroup.value.phone,
      birthday: moment(this.signInFormGroup.value.birthday, 'DDMMYYYY').format('DD/MM/YYYY'),
      optional_attributes: { cpf: this.signInFormGroup.value.cpf.replace(/\D/g, ''), },
    };
  }

  getStates(): void {
    this.cepService.getStates().then((states) => (this.states = states));
  }

  navigateTo(path: string): void {
    this.router.navigateByUrl(path);
  }

  fetchAddress(): void {
    const cep = this.addressFormGroup.value.zip_code;
    if (this.cepService.isCepValid(cep)) {
      this.loading = true;
      this.cepService.getAddress(cep).subscribe(
        address => this.updateAddress(address),
        err => this.toastr.warning('CEP não encontrado.')
      ).add(() => this.loading = false);
    }
  }

  updateAddress(address: IAddress): void {
    this.addressFormGroup.reset();
    this.addressFormGroup.patchValue({
      zip_code: address.cep,
      state: address.state,
      city: address.city,
      street: address.street,
      neighborhood: address.neighborhood,
    });
  }

}
