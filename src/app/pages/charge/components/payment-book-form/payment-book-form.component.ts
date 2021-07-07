import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

import { ChargeService } from '../../shared/charge.service';
import { ConfirmPaymentDataModalComponent } from '../confirm-payment-data-modal/confirm-payment-data-modal.component';


@Component({
  selector: 'app-payment-book-form',
  templateUrl: './payment-book-form.component.html',
  styleUrls: ['./payment-book-form.component.scss'],
})
export class PaymentoBookComponent implements OnInit {
  carneChargeFormGroup: FormGroup;
  currencyRegex = '^[+-]?[0-9]{1,3}(?:,?[0-9]{3})*(?:.[0-9]{2})?$';
  productRadio = 'card';
  discountRadio = 'money';
  creditCardFee = 0;
  billetFee = 0;
  minDate: Date;
  loading = false;

  constructor(
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private service: ChargeService,
    private toastr: ToastrService,
  ) {
    this.minDate = new Date();
    this.carneChargeFormGroup = this.formBuilder.group({
      amount: [
        '',
        [
          Validators.required,
          Validators.min(10),
          Validators.pattern(this.currencyRegex),
        ],
      ],
      firstBillDueDate: ['', Validators.required],
      numberOfBills: ['', Validators.required],
      discountPercent: ['', [Validators.min(0), Validators.max(100)]],
      discountMoney: ['', Validators.pattern(this.currencyRegex)],
      comments: [''],
    });
  }

  ngOnInit(): void {
    this.getFees();
  }

  openDialog(form: any): void {
    let discount = 0;
    if (!this.carneChargeFormGroup.invalid) {
      const {
        amount,
        firstBillDueDate,
        numberOfBills,
        discountPercent,
        discountMoney,
        comments,
      } = this.carneChargeFormGroup.controls;
      if (discountMoney.value) {
        discount = discountMoney.value;
      } else {
        discount = discountPercent.value;
      }
      this.service.setPaymentPaymentBookData(
        amount.value,
        discount,
        this.discountRadio,
        'payment_book',
        comments.value,
        firstBillDueDate.value,
        numberOfBills.value,
        this.creditCardFee,
        this.billetFee,
      );
      const dialogRef = this.dialog.open(ConfirmPaymentDataModalComponent, {
        width: '100%',
        height: 'auto',
        maxWidth: '645px',
        maxHeight: '95vh',
      });
      dialogRef.componentInstance.onChargeClick.subscribe(() => {
        dialogRef.componentInstance.loading = true;
        dialogRef.disableClose = true;
        const data = this.getChargePayload();
        this.service.paymentBookCheckoutOrder(data).subscribe(
          charge => {
            this.toastr.success('Cobrança enviada por e-mail com sucesso.');
            form.resetForm();
            dialogRef.close();
          },
          error => {
            if (error.status === 400) {
              this.toastr.error('Falha ao enviar cobrança.');
            } else {
              this.toastr.error(
                'Houve um erro inesperado, por favor tente novmanete mais tarde.',
                'Ops!'
              );
            }
          },
        ).add(() => {
          dialogRef.componentInstance.loading = false;
          dialogRef.disableClose = false;
        });
      });
    }
  }

  private getChargePayload(): any {
    const checkoutOrderData = this.service.checkoutOrder;
    const data: any = {
      amount: (checkoutOrderData.amount).toFixed(2),
      discount: checkoutOrderData.discount || 0,
      discount_type: this.getDiscountType(),
      total_installments: checkoutOrderData.numberOfBills,
      first_installment_at: moment(checkoutOrderData.due_date).format('YYYY-MM-DD'),
      demonstrative: checkoutOrderData.comments,
      origin: 'WEB',
      payer: {
        name: checkoutOrderData.payer_name,
        social_number: checkoutOrderData.payer_social_number,
        social_number_type: checkoutOrderData.payer_social_number.length === 11 ? 'CPF' : 'CNPJ',
        email: checkoutOrderData.payer_email,
      },
      send_email: true,
      address: {
        country: 'Brasil',
        zip_code: checkoutOrderData.payer_address.zip_code,
        street: checkoutOrderData.payer_address.street,
        city: checkoutOrderData.payer_address.city,
        state: checkoutOrderData.payer_address.state,
        neighborhood: checkoutOrderData.payer_address.neighborhood,
      }
    };
    if (checkoutOrderData.payer_address.number && checkoutOrderData.payer_address.number !== '') {
      data.address['number'] = checkoutOrderData.payer_address.number;
    }
    if (checkoutOrderData.payer_address.complement && checkoutOrderData.payer_address.complement !== '') {
      data.address['complement'] = checkoutOrderData.payer_address.complement;
    }
    return data;
  }

  private getDiscountType(): string {
    if (this.service.checkoutOrder.discount_type === 'percent' && this.service.checkoutOrder.discount > 0) {
      return 'PERCENTAGE';
    } else {
      return 'FIXED';
    }
  }

  getFees(): void {
    this.service.getFees().subscribe(
      data => {
        if (data.results) {
          this.billetFee = data.results.filter(
            (d: { transaction_type: string; installment: number; }) => d.transaction_type === 'BILLET' && d.installment === 1)[0].amount;
        }
      }
    );
  }

}
