import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { StorageService } from 'src/app/common/services/storage/storage.service';
import { Utils } from 'src/app/common/utils';
import { IBalanceResponse } from 'src/app/components/action-bar/shared/action-bar-model';
import { ActionBarService } from 'src/app/components/action-bar/shared/action-bar.service';
import { environment } from 'src/environments/environment';
import { PaymentReceiptModalComponent } from '../payment-management/components/payment-receipt-modal/payment-receipt-modal.component';
import { IPayment } from '../payment-management/shared/payment.model';
import { CreditCardModalComponent } from './components/credit-card-modal/credit-card-modal.component';
import {
  IBarcodeValidate, IPayBillet, IPayListSelect, IPaymentCreditCardPayload, IPaymentMultiPayload, IPaymentNIXPayload
} from './shared/pay.model';
import { PayService } from './shared/pay.service';


@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.scss'],
})
export class PayComponent implements OnInit {
  codeBarFormControl = new FormControl('');
  paymentSelectFormControl = new FormControl('');
  amountFormGroup: FormGroup;
  creditCardFee: 0;
  today = new Date();
  loading = false;
  billet: IPayBillet;
  panelOpenState = false;
  digitalAccount: IBalanceResponse;
  listSelect: IPayListSelect[];
  digitalAccountSelected = false;
  displayAmountInputs = false;

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private storageService: StorageService,
    public payService: PayService,
    private router: Router,
    private utils: Utils,
    private toastr: ToastrService,
    private actionBarService: ActionBarService,
  ) {
    this.amountFormGroup = this.formBuilder.group({
      creditAmount: ['', Validators.required],
      nixAmount: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getFees();
    this.getBalance();
    this.getPayListSelect();
  }

  checkBarCode(): void {
    if (this.codeBarFormControl.value.length < 3) {
      this.panelOpenState = false;
      return;
    }
    if (this.codeBarFormControl.value.length >= 44) {
      this.loading = true;
      this.payService.getBarcodeDetails(this.codeBarFormControl.value).subscribe(
        payment => {
          if (this.validBillet(payment)) {
            if (payment.dueDate) {
              this.billet = {
                billetDetails: payment,
                digitable_line: this.codeBarFormControl.value,
                digitable_line_masked: this.utils.maskBarcode(
                  this.codeBarFormControl.value
                ),
              };
              this.panelOpenState = true;
            } else {
              this.toastr.warning(
                'Não é possível efetuar pagamento de boleto de serviço ou sem data de vencimento.'
              );
            }
          } else {
            this.panelOpenState = false;
          }
        },
        error => {
          if (error.status === 400) {
            this.toastr.error('Boleto inválido.');
          } else {
            this.toastr.warning(
              'Houve algum problema inesperado, por favor tente novamente mais tarde',
              'Ops'
            );
          }
          this.panelOpenState = false;
        }
      )
        .add(() => this.loading = false);
    } else {
      this.panelOpenState = false;
    }
  }

  validBillet(payment: IBarcodeValidate): boolean {
    if (!payment) {
      return false;
    }
    if (new Date(payment.dueDate + 'T00:00:00') < new Date()) {
      this.toastr.error('Boleto com data expirada');
      return false;
    }
    return true;
  }

  onChangeSelect(): void {
    switch (this.paymentSelectFormControl.value) {
      case 'CREDIT_CARD':
        this.openModal();
        this.digitalAccountSelected = false;
        this.displayAmountInputs = false;
        break;
      case 'NIX':
        this.digitalAccountSelected = true;
        this.displayAmountInputs = false;
        break;
      case 'CREDIT_CARD_NIX':
        this.openModal();
        this.digitalAccountSelected = true;
        this.displayAmountInputs = true;
        break;
      default:
        break;
    }
  }

  openModal(): void {
    const dialogRef = this.dialog.open(CreditCardModalComponent, {
      width: '100%',
      height: 'auto',
      maxWidth: '60vw',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!this.payService.currentCard) {
        // this.paymentSelectFormControl.setValue('');  SOLUÇÃO ENQUANTO HOUVER PAGAMENTO SOMENTE POR CONTA NIX
      }
    });
  }

  getBalance(): void {
    this.loading = true;
    this.actionBarService.getBalance().subscribe(
      response => this.digitalAccount = response,
      error => this.toastr.error('Não foi possível obter o saldo da conta.'),
    ).add(() => this.loading = false);
  }

  getPayListSelect(): void {
    this.payService.getPayListSelect().then(
      PAYLISTSELECT => {
        this.listSelect = PAYLISTSELECT;
        this.selectPaymentNIX();
      }
    );
  }

  selectPaymentNIX(): void {
    // SOLUÇÃO ENQUANTO HOUVER PAGAMENTO SOMENTE POR CONTA NIX
    this.paymentSelectFormControl.setValue(this.listSelect[0].payment_type);
    this.digitalAccountSelected = true;
    this.displayAmountInputs = false;
  }

  isValidPayment(): boolean {
    if (
      this.paymentSelectFormControl.value === 'CREDIT_CARD' &&
      this.payService.currentCard
    ) {
      return true;
    } else if (
      this.paymentSelectFormControl.value === 'NIX' &&
      this.billet.billetDetails.amount <= this.digitalAccount.balance.available.amount
    ) {
      return true;
    } else if (
      this.paymentSelectFormControl.value === 'CREDIT_CARD_NIX' &&
      this.amountFormGroup.valid &&
      this.payService.currentCard &&
      this.amountFormGroup.value.nixAmount <= this.digitalAccount.balance.available.amount &&
      Number(this.amountFormGroup.value.nixAmount) +
      Number(this.amountFormGroup.value.creditAmount) === this.getTotalValue()
    ) {
      return true;
    } else {
      return false;
    }
  }

  getTotalValue(): number {
    return Number(this.billet.billetDetails.amount) + this.getFeeValue();
  }

  getFeeValue(): number {
    if (this.paymentSelectFormControl.value === 'CREDIT_CARD') {
      return this.creditCardFee * (this.billet.billetDetails.amount / 100);
    } else if (this.paymentSelectFormControl.value === 'CREDIT_CARD_NIX') {
      return (
        this.creditCardFee * (this.amountFormGroup.value.creditAmount / 100)
      );
    } else {
      return 0;
    }
  }

  getFees(): void {
    this.loading = true;
    this.payService.getFees().subscribe(
      data => {
        if (data.results) {
          this.creditCardFee = data.results.filter(
            (d: { transaction_type: string; installment: number }) =>
              d.transaction_type === 'CREDIT' && d.installment === 1
          )[0].amount;
        }
      },
      error => this.toastr.error('Falha ao buscar taxas.')
    ).add(() => (this.loading = false));
  }

  keyupCreditValue(event: any): void {
    if (event.target.value) {
      const v = this.getTotalValue() - this.amountFormGroup.value.creditAmount;
      if (v < 0) {
        this.amountFormGroup.controls['nixAmount'].setValue('0');
      } else {
        this.amountFormGroup.controls['nixAmount'].setValue(String(v));
      }
    } else {
      this.amountFormGroup.controls['nixAmount'].setValue('0');
    }
  }

  keyupNixValue(event: any): void {
    if (event.target.value) {
      const v = this.getTotalValue() - this.amountFormGroup.value.nixAmount;
      if (v < 0) {
        this.amountFormGroup.controls['creditAmount'].setValue('0');
      } else {
        this.amountFormGroup.controls['creditAmount'].setValue(String(v));
      }
    } else {
      this.amountFormGroup.controls['creditAmount'].setValue('0');
    }
  }

  payment(): void {
    if (this.paymentSelectFormControl.value === 'CREDIT_CARD') {
      this.processCreditCardPayment();
    } else if (this.paymentSelectFormControl.value === 'CREDIT_CARD_NIX') {
      this.processMultiPayment();
    } else {
      this.processNixPayment();
    }
  }

  processCreditCardPayment(): void {
    this.loading = true;
    this.payService.paymentsCreditCard(this.getCreditCardPaymentPayload()).subscribe(
      data => {
        this.clearForm();
        this.toastr.success('Pagamento realizado com sucesso.');
      },
      error => this.toastr.error('Não foi possível realizar o pagamento.')
    ).add(() => (this.loading = false));
  }

  processMultiPayment(): void {
    this.loading = true;
    this.payService.paymentsMulti(this.getMultiPaymentPayload()).subscribe(
      data => {
        this.clearForm();
        this.toastr.success('Pagamento realizado com sucesso.');
      },
      error => this.toastr.error('Não foi possível realizar o pagamento.')
    ).add(() => (this.loading = false));
  }

  processNixPayment(): void {
    this.loading = true;
    this.payService.paymentsNix(this.getNixPaymentPayload()).subscribe(
      data => {
        this.clearForm();
        this.toastr.success('Pagamento realizado com sucesso.');
      },
      error => this.toastr.error('Não foi possível realizar o pagamento.')
    ).add(() => (this.loading = false));
  }

  showReceipt(data: IPayment): void {
    const dialogRef = this.dialog.open(PaymentReceiptModalComponent, {
      width: '100%',
      height: 'auto',
      maxWidth: '45vw',
      data,
    });
    dialogRef.afterClosed().subscribe(result => this.router.navigateByUrl('/gestao-de-pagamento'));
  }

  getMultiPaymentPayload(): IPaymentMultiPayload {
    return Object.assign({}, this.getCreditCardPaymentPayload(), {
      amount_nix: parseFloat(this.amountFormGroup.value.nixAmount).toFixed(2),
    });
  }

  getNixPaymentPayload(): IPaymentNIXPayload {
    return {
      barcode: this.codeBarFormControl.value,
      amount: String(this.billet.billetDetails.amount),
      due_date: this.utils.dateToStringUSA(String(this.billet.billetDetails.dueDate)),
      app_name: environment.KEYS.APP_NAME,
      validation_id: this.billet.billetDetails.id,
      origin: 'WEB',
      description: 'Pagamento com conta nix',
    };
  }

  getCreditCardPaymentPayload(): IPaymentCreditCardPayload {
    const currentUser = this.storageService.currentUser;
    return {
      barcode: this.codeBarFormControl.value,
      social_number: currentUser.user_info.attributes.socialNumber[0],
      card: {
        number: String(this.payService.currentCard.number),
        security_code: String(this.payService.currentCard.cvv),
        expiration_date: {
          month: this.payService.currentCard.expDate.slice(0, 2),
          year: this.payService.currentCard.expDate.slice(2),
        },
        holder: {
          name: this.payService.currentCard.name,
          social_number: this.payService.currentCard.documentValue,
        },
      },
      origin: 'WEB',
    };
  }

  clearForm(): void {
    this.codeBarFormControl.reset();
    // this.paymentSelectFormControl.reset(); SOLUÇÃO ENQUANTO HOUVER PAGAMENTO SOMENTE POR CONTA NIX
    this.amountFormGroup.reset();
    this.billet = null;
  }

}
