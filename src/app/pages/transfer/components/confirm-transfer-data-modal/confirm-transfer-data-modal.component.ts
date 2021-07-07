import { AfterViewInit, Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';

import { ToastrService } from 'ngx-toastr';

import { AuthService } from 'src/app/common/services/authentication/auth.service';
import { StorageService } from 'src/app/common/services/storage/storage.service';
import { Utils } from 'src/app/common/utils';
import { ICompany } from 'src/app/pages/register-company/shared/register-company.models';
import { RegisterCompanyService } from 'src/app/pages/register-company/shared/register-company.service';
import { ITransferExtraData, ITransferPayload } from '../../shared/transfer.model';
import { TransferService } from '../../shared/transfer.service';


enum TransferFormStep {
  transfer = 'transfer',
  password = 'password',
}

@Component({
  selector: 'app-confirm-transfer-data-modal',
  templateUrl: './confirm-transfer-data-modal.component.html',
  styleUrls: ['./confirm-transfer-data-modal.component.scss'],
})
export class ConfirmTransferDataModalComponent implements OnInit, AfterViewInit {
  @ViewChild('stepper') private stepper: MatStepper;
  nixBankCode = '332';
  transferFormStep = TransferFormStep;
  passwordFormGroup: FormGroup;
  checkOutOrder!: ITransferPayload;
  transferExtraData!: ITransferExtraData;
  loading = false;
  authenticationCode: string;
  transferDate: string;
  onChargeClick = new EventEmitter();
  company: ICompany;

  constructor(
    private transferService: TransferService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private storageService: StorageService,
    private utils: Utils,
    private registerCompanyService: RegisterCompanyService,
  ) {
    this.checkOutOrder = this.transferService.getCheckoutOrder();
    this.transferExtraData = this.transferService.getTransferExtraData();
    this.passwordFormGroup = this.formBuilder.group({
      password: [
        '', [Validators.required]
      ],
    });
  }

  ngOnInit(): void {
    this.getCompany();
  }

  ngAfterViewInit(): void {
    if (this.stepper) {
      this.stepper._getIndicatorType = () => 'number';
    }
  }

  getFeeValue(): string {
    if (this.checkOutOrder.recipient_bank_code === '332') {
      return '0';
    } else {
      return this.transferExtraData.fee;
    }
  }

  getCompany(): void {
    this.loading = true;
    this.registerCompanyService.getCompany().subscribe(
      COMPANY => this.company = COMPANY,
    ).add(() => this.loading = false);
  }

  onButtonClick(): void {
    this.onChargeClick.emit();
  }

  getTransferTotal(): number {
    if (this.checkOutOrder.recipient_bank_code === this.nixBankCode) {
      return Number(this.checkOutOrder.amount);
    } else {
      return Number(this.checkOutOrder.amount) + Number(this.transferExtraData.fee);
    }
  }

  next(step: string): void {
    if (step === this.transferFormStep.password && this.passwordFormGroup.valid) {
      this.loading = true;
      this.authService.validatePassword(this.passwordFormGroup.value.password).subscribe(
        response => this.transfer(),
        error => {
          this.loading = false;
          if (error.status === 401) {
            this.toastr.error('Senha incorreta');
          } else {
            this.toastr.error('Não foi possível confirmar transação');
          }
        },
      );
    }
  }

  transfer(): void {
    switch (this.transferExtraData.transferType) {
      case 'OWN_ACCOUNT': {
        this.transferToBank();
        break;
      }
      case 'BANK': {
        this.transferToBank();
        break;
      }
      case 'NIX': {
        this.transferToNix();
        break;
      }
      default: {
        break;
      }
    }
  }

  getPayload(): ITransferPayload {
    return {
      amount: this.checkOutOrder.amount,
      recipient_name: this.checkOutOrder.recipient_name,
      recipient_account: this.checkOutOrder.recipient_account + this.checkOutOrder.recipient_account_digit,
      recipient_social_number: this.checkOutOrder.recipient_social_number,
      recipient_branch: this.checkOutOrder.recipient_branch,
      recipient_bank_code: this.checkOutOrder.recipient_bank_code,
      recipient_account_type: this.checkOutOrder.recipient_account_type ? this.checkOutOrder.recipient_account_type : '0',
      description: 'Transferência via Nix empresas',
      recipient_bank_name: this.transferExtraData.bankShortName,
    };
  }

  transferToNix(): void {
    this.loading = true;
    this.transferService.transferToNix(this.getPayload(), this.storageService.nixAccountId).subscribe(
      response => '',
      error => this.toastr.error('Não foi possível realizar a transferência.'),
    ).add(() => this.loading = false);
  }

  transferToBank(): void {
    this.loading = true;
    this.transferService.transferToOtherBank(this.getPayload()).subscribe(
      response => {
        this.transferDate = this.utils.getCurrentDate('');
        this.authenticationCode = response['authenticationCode'];
        this.stepper.selected.completed = true;
        this.stepper.next();
      },
      error => this.toastr.error('Não foi possível realizar a transferência.'),
    ).add(() => this.loading = false);
  }

  getAccountType(): string {
    if (this.checkOutOrder.recipient_account_type === '1') {
      return 'Poupança';
    } else if (this.checkOutOrder.recipient_account_type === 'DIGITAL_ACCOUNT') {
      return 'NIX';
    } else {
      return 'Corrente';
    }
  }

  download(): void {
    this.loading = true;
    this.transferService.getReceiptPDF(this.authenticationCode).subscribe(
      response => window.open(URL.createObjectURL(response), '_blank'),
      error => this.toastr.error('Não foi possível gerar o comprovante'),
    ).add(() => this.loading = false);
  }

  sendEmail(): void {
    this.loading = true;
    this.transferService.sendReceiptEmail(this.authenticationCode).subscribe(
      (data) => {
        const words = data.message.split(' ');
        this.toastr.success(`Email enviado para ${words[words.length - 1]}`);
      },
      (error) => this.toastr.error('Não foi possível enviar o comprovante por email'),
    ).add(() => this.loading = false);
  }

}
