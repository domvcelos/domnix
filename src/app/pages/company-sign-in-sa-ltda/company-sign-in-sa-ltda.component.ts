import { AfterViewInit } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControlOptions } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';

import { NgxImageCompressService } from 'ngx-image-compress';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import * as moment from 'moment';

import { CustomValidators } from 'src/app/common/custom-validators';
import { AuthService } from 'src/app/common/services/authentication/auth.service';
import { IAddress, IState } from 'src/app/common/services/cep/cep.model';
import { CepService } from 'src/app/common/services/cep/cep.service';
import { StorageService } from 'src/app/common/services/storage/storage.service';
import { IActivity } from '../register-company/shared/register-company.models';
import { ISelectCompanySize, ISelectCompanyType } from './shared/company-sign-in.model';
import { CompanySignInService } from './shared/company-sign-in.service';


@Component({
  selector: 'app-company-sign-in',
  templateUrl: './company-sign-in-sa-ltda.component.html',
  styleUrls: ['./company-sign-in-sa-ltda.component.scss'],
})
export class CompanySignInSaLtdaComponent implements OnInit, AfterViewInit {
  @ViewChild('stepper') private stepper: MatStepper;
  signInFormGroup: FormGroup;
  personalAddressFormGroup: FormGroup;
  addressFormGroup: FormGroup;
  companyFormGroup: FormGroup;
  aboutCompanyFormGroup: FormGroup;
  channelCodeFormGroup: FormGroup;
  loading = false;
  isRegisterDone = false;
  isStepChannelCodeOK = false;
  checkoutURL: string;
  imgResultAfterCompress: string;
  fileUploadMaxSize = 27477900; // 20.1 MB
  docFormControl = new FormControl('', [Validators.required]);
  states: IState[];
  activityFilteredOptions: Observable<IActivity[]> | undefined;
  activities: IActivity[] = [];
  companyTypes: ISelectCompanyType[];
  companySizes: ISelectCompanySize[];
  myFiles: Array<string> = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private service: CompanySignInService,
    private toastr: ToastrService,
    private customValidators: CustomValidators,
    private imageCompress: NgxImageCompressService,
    private cepService: CepService,
    private authService: AuthService,
    private storageService: StorageService,
  ) {
    this.getStates();
    this.signInFormGroup = this.formBuilder.group(
      {
        name: ['', [Validators.required]],
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
    this.personalAddressFormGroup = this.formBuilder.group({
      personal_street: ['', Validators.required],
      personal_zip_code: ['', Validators.required],
      personal_neighborhood: ['', Validators.required],
      personal_number: ['', Validators.required],
      personal_state: ['', [Validators.required, Validators.maxLength(2)]],
      personal_city: ['', Validators.required],
      personal_complement: [''],
    });
    this.addressFormGroup = this.formBuilder.group({
      street: ['', Validators.required],
      zip_code: ['', Validators.required],
      neighborhood: ['', Validators.required],
      number: ['', Validators.required],
      state: ['', [Validators.required, Validators.maxLength(2)]],
      city: ['', Validators.required],
      complement: [''],
    });
    this.companyFormGroup = this.formBuilder.group({
      razaoSocial: ['', Validators.required],
      nomeFantasia: ['', Validators.required],
      cnpj: ['', [Validators.required, this.customValidators.cpfCnpjValidator()]],
      inscricaoEstadual: '',
    });
    this.aboutCompanyFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      size: ['', Validators.required],
      activity: ['', Validators.required],
    });
    this.channelCodeFormGroup = this.formBuilder.group({
      channelCode: ['', Validators.required],
    });
    this.getActivitiesAndBuildForm();
    this.service.getCompanyTypes().then(COMPANYTYPES => this.companyTypes = COMPANYTYPES);
    this.service.getCompanySizes().then(COMPANYSIZES => this.companySizes = COMPANYSIZES);
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.stepper._getIndicatorType = () => 'number';
  }

  signIn(): void {
    if (this.companyFormGroup.valid && this.aboutCompanyFormGroup.valid && this.myFiles.length > 0 &&
      this.addressFormGroup.valid && this.personalAddressFormGroup.valid && this.channelCodeFormGroup.valid) {
      this.loading = true;
      this.service.createCompanySaLtda(this.getPayload()).subscribe(
        success => {
          this.checkoutURL = success.checkout_url;
          this.stepper.selected.completed = true;
          this.stepper.next();
          this.storageService.sessionStorageClear();
        },
        error => {
          if (error.status === 400) {
            if (error.error.cnpj) {
              this.toastr.error('CNPJ já cadastrado.');
            } else if (error.error.activity_code) {
              this.toastr.error('Ramo de atividade da empresa não foi selecionado.');
            } else {
              this.toastr.error('Não foi possível criar empresa');
            }
          } else {
            this.toastr.error('Não foi possível criar empresa');
          }
        },
      ).add(() => this.loading = false);
    }
  }

  private getPayload(): FormData {
    const formData = new FormData();
    formData.append('channel_code', this.channelCodeFormGroup.value.channelCode);
    formData.append('cnpj', this.companyFormGroup.value.cnpj);
    formData.append('business_name', this.companyFormGroup.value.razaoSocial);
    formData.append('business_trading_name', this.companyFormGroup.value.nomeFantasia);
    formData.append('activity_code', this.aboutCompanyFormGroup.value.activity.id);
    formData.append('business_email', this.aboutCompanyFormGroup.value.email);
    formData.append('business_type', this.service.typePage);
    formData.append('business_size', this.aboutCompanyFormGroup.value.size);
    formData.append('business_address_number', this.addressFormGroup.value.number);
    formData.append('business_address_neighborhood', this.addressFormGroup.value.neighborhood);
    formData.append('business_address_complement', this.addressFormGroup.value.complement);
    formData.append('business_address_country', 'BR');
    formData.append('business_address_line', this.addressFormGroup.value.street);
    formData.append('business_address_city', this.addressFormGroup.value.city);
    formData.append('business_address_state', this.addressFormGroup.value.state);
    formData.append('business_address_zip_code', this.addressFormGroup.value.zip_code);
    formData.append('documents', JSON.stringify(this.myFiles));
    formData.append('state_registration', this.companyFormGroup.value.inscricaoEstadual);
    formData.append('representative_register_name', this.signInFormGroup.value.name);
    formData.append('cpf', this.signInFormGroup.value.cpf);
    formData.append('representative_email', this.signInFormGroup.value.email);
    formData.append('representative_phone_number', this.signInFormGroup.value.phone);
    formData.append('representative_birth_date', moment(this.signInFormGroup.value.birthday, 'DDMMYYYY').format('DD/MM/YYYY'));
    formData.append('representative_mother_name', this.signInFormGroup.value.mother_name);
    formData.append('representative_social_name', this.signInFormGroup.value.social_name);
    formData.append('representative_phone_country_code', '55');
    formData.append('representative_address_number', this.personalAddressFormGroup.value.personal_number);
    formData.append('representative_address_neighborhood', this.personalAddressFormGroup.value.personal_neighborhood);
    formData.append('representative_address_complement', this.personalAddressFormGroup.value.personal_complement);
    formData.append('representative_address_country', 'BR');
    formData.append('representative_address_line', this.personalAddressFormGroup.value.personal_street);
    formData.append('representative_address_city', this.personalAddressFormGroup.value.personal_city);
    formData.append('representative_address_state', this.personalAddressFormGroup.value.personal_state);
    formData.append('representative_address_zip_code', this.personalAddressFormGroup.value.personal_zip_code);
    formData.append('representative_password', this.signInFormGroup.value.password);
    return formData;
  }

  checkDocsUpload(): void {
    if (this.myFiles.length > 0 ) {
      this.stepper.next();
    } else {
      this.toastr.warning(
        'Para continuar o cadastro é necessário fazer o upload dos documentos.'
      );
    }
  }

  fetchAddress(personal: boolean): void {
    let cep;
    if (personal){
      cep = this.personalAddressFormGroup.value.personal_zip_code;
    }else{
      cep = this.addressFormGroup.value.zip_code;
    }

    if (this.cepService.isCepValid(cep)) {
      this.loading = true;
      this.cepService.getAddress(cep).subscribe(
        address => this.updateAddress(address, personal),
        err => this.toastr.warning('CEP não encontrado.')
      ).add(() => this.loading = false);
    }
  }

  updateAddress(address: IAddress, personal: boolean): void {
    if (personal){
      this.personalAddressFormGroup.reset();
      this.personalAddressFormGroup.patchValue({
        personal_zip_code: address.cep,
        personal_state: address.state,
        personal_city: address.city,
        personal_street: address.street,
        personal_neighborhood: address.neighborhood,
      });
    }else{
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

  displayActivityFn(activity: IActivity): string {
    return activity ? activity.name : '';
  }

  getActivitiesAndBuildForm(): void {
    this.service.getActivitiesList().subscribe((activities: IActivity[]) => {
      this.activities = activities;
      this.activityFilteredOptions = this.aboutCompanyFormGroup.controls[
        'activity'
      ].valueChanges.pipe(
        startWith(''),
        map((activity: string) =>
          activity ? this._filterActivity(activity) : this.activities.slice()
        )
      );
    });
  }

  _filterActivity(filterActivity: string): IActivity[] {
    return this.activities.filter((activity) =>
      activity.name.toLowerCase().match(filterActivity.toLocaleLowerCase())
    );
  }

  goHome(): void {
    this.authService.logout();
  }

  navigateTo(path: string): void {
    this.router.navigateByUrl(path);
  }

  getStates(): void {
    this.cepService.getStates().then((states) => (this.states = states));
  }

  checkChannelCode(): void {
    if (this.channelCodeFormGroup.valid) {
      this.loading = true;
      this.service.checkChannelExists(this.channelCodeFormGroup.value.channelCode.trim().toLowerCase()).subscribe(
        channel => {
          if (channel.activated) {
            this.stepper.selected.completed = true;
            this.stepper.next();
          } else {
            this.channelCodeFormGroup.controls['channelCode'].setErrors({ inactive: true });
          }
        },
        error => this.channelCodeFormGroup.controls['channelCode'].setErrors({ incorrect: true }),
      ).add(() => this.loading = false);
    }
  }

  getCheckoutLink(): void {
    window.open(this.checkoutURL, '_blank');
  }

  onFileChange(event: { target: { files: string | any[]; }; }): void {
    this.myFiles = [];
    // tslint:disable-next-line
    for (let i = 0; i < event.target.files.length; i++) {
      this.getBase64(event.target.files[i]).then(
        data => this.myFiles.push(String(data).slice(String(data).indexOf(',') + 1))
      );
    }
  }

  // tslint:disable-next-line
  getBase64(file: Blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

}
