import { AfterViewInit } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';

import { NgxImageCompressService } from 'ngx-image-compress';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

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
  templateUrl: './company-sign-in.component.html',
  styleUrls: ['./company-sign-in.component.scss'],
})
export class CompanySignInComponent implements OnInit, AfterViewInit {
  @ViewChild('stepper') private stepper: MatStepper;
  addressFormGroup: FormGroup;
  selfieFormGroup: FormGroup;
  docFormGroup: FormGroup;
  companyFormGroup: FormGroup;
  aboutCompanyFormGroup: FormGroup;
  channelCodeFormGroup: FormGroup;
  loading = false;
  isRegisterDone = false;
  isStepChannelCodeOK = false;
  checkoutURL: string;
  imgResultAfterCompress: string;
  fileUploadMaxSize = 2747790; // 2.1 MB
  docFormControl = new FormControl('', [Validators.required]);
  states: IState[];
  activityFilteredOptions: Observable<IActivity[]> | undefined;
  activities: IActivity[] = [];
  companyTypes: ISelectCompanyType[];
  companySizes: ISelectCompanySize[];

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
    this.addressFormGroup = this.formBuilder.group({
      street: ['', Validators.required],
      zip_code: ['', Validators.required],
      neighborhood: ['', Validators.required],
      number: ['', Validators.required],
      state: ['', [Validators.required, Validators.maxLength(2)]],
      city: ['', Validators.required],
      complement: [''],
    });
    this.selfieFormGroup = this.formBuilder.group({
      selfie: ['', Validators.required],
    });
    this.docFormGroup = this.formBuilder.group({
      docFront: ['', Validators.required],
      docBack: ['', Validators.required],
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
      type: ['', Validators.required],
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
    if (this.companyFormGroup.valid && this.aboutCompanyFormGroup.valid &&
      this.addressFormGroup.valid && this.selfieFormGroup.valid && this.docFormGroup.valid) {
      this.loading = true;
      this.service.createCompany(this.getPayload()).subscribe(
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
    formData.append('user_id', this.storageService.currentUser.user_info.id);
    formData.append('entity', this.storageService.currentUser.user_info.attributes.socialNumber[0]);
    formData.append('cnpj', this.companyFormGroup.value.cnpj);
    formData.append('business_name', this.companyFormGroup.value.razaoSocial);
    formData.append('business_trading_name', this.companyFormGroup.value.nomeFantasia);
    formData.append('activity_code', this.aboutCompanyFormGroup.value.activity.id);
    formData.append('business_email', this.aboutCompanyFormGroup.value.email);
    formData.append('business_type', this.aboutCompanyFormGroup.value.type);
    formData.append('business_size', this.aboutCompanyFormGroup.value.size);
    formData.append('business_address_number', this.addressFormGroup.value.number);
    formData.append('business_address_neighborhood', this.addressFormGroup.value.neighborhood);
    formData.append('business_address_complement', this.addressFormGroup.value.complement);
    formData.append('business_address_country', 'BR');
    formData.append('business_address_line', this.addressFormGroup.value.street);
    formData.append('business_address_city', this.addressFormGroup.value.city);
    formData.append('business_address_state', this.addressFormGroup.value.state);
    formData.append('business_address_zip_code', this.addressFormGroup.value.zip_code);
    formData.append('document_type', this.docFormControl.value);
    formData.append('selfie', this.selfieFormGroup.value.selfie);
    formData.append('document_front', this.docFormGroup.value.docFront);
    formData.append('document_back', this.docFormGroup.value.docBack);
    formData.append('state_registration', this.companyFormGroup.value.inscricaoEstadual);
    return formData;
  }

  uploadSelfie(): void {
    this.imageCompress.uploadFile().then(({ image, orientation }) => {
      if (this.imageCompress.byteCount(image) <= this.fileUploadMaxSize) {
        this.imageCompress
          .compressFile(image, orientation, 50, 50)
          .then((compressedFile) => {
            this.selfieFormGroup.patchValue({ selfie: this.b64toBlob(compressedFile) });
          });
      } else {
        this.toastr.error('O Tamanho máximo é 2MB.');
      }
    });
  }

  uploadDocFront(): void {
    this.imageCompress.uploadFile().then(({ image, orientation }) => {
      if (this.imageCompress.byteCount(image) <= this.fileUploadMaxSize) {
        this.imageCompress
          .compressFile(image, orientation, 50, 50)
          .then((compressedFile) => {
            this.docFormGroup.patchValue({ docFront: this.b64toBlob(compressedFile) });
          });
      } else {
        this.toastr.error('O Tamanho máximo é 2MB.');
      }
    });
  }

  uploadDocBack(): void {
    this.imageCompress.uploadFile().then(({ image, orientation }) => {
      if (this.imageCompress.byteCount(image) <= this.fileUploadMaxSize) {
        this.imageCompress
          .compressFile(image, orientation, 50, 50)
          .then((compressedFile) => {
            this.docFormGroup.patchValue({ docBack: this.b64toBlob(compressedFile) });
          });
      } else {
        this.toastr.error('O Tamanho máximo é 2MB.');
      }
    });
  }

  b64toBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/jpeg' });
  }

  checkSelfieUpload(): void {
    if (this.selfieFormGroup.valid) {
      this.stepper.next();
    } else {
      this.toastr.warning(
        'Para continuar o cadastro é necessário fazer o upload da foto.'
      );
    }
  }

  checkDocUpload(): void {
    if (this.docFormGroup.valid && this.docFormControl.valid) {
      this.stepper.next();
    } else {
      if (!this.docFormControl.value) {
        this.docFormControl.markAllAsTouched();
      }
      this.toastr.warning(
        'Para continuar o cadastro é necessário fazer o upload da foto.'
      );
    }
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

}
