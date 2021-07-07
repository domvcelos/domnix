import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

import { StorageService } from 'src/app/common/services/storage/storage.service';
import { currencyRegex } from 'src/app/common/utils';
import { ICheckoutOrder, IPaymanetMethod } from 'src/app/pages/charge/shared/charge.model';
import { ChargeService } from 'src/app/pages/charge/shared/charge.service';
import { ICompany } from 'src/app/pages/register-company/shared/register-company.models';
import { RegisterCompanyService } from 'src/app/pages/register-company/shared/register-company.service';
import { ConfirmPaymentDataModalComponent } from '../confirm-payment-data-modal/confirm-payment-data-modal.component';


@Component({
  selector: 'app-card-form',
  templateUrl: './card-form.component.html',
  styleUrls: ['./card-form.component.scss'],
})
export class CardFormComponent implements OnInit {
  cardChargeFormGroup: FormGroup;
  paymentMethods: IPaymanetMethod[] = [];
  discountRadio = 'money';
  checkoutOrder!: ICheckoutOrder;
  creditCardFee = 0;
  billetFee = 0;
  loading = false;
  company: ICompany;
  minDate: Date;

  constructor(
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private service: ChargeService,
    private toastr: ToastrService,
    private storageService: StorageService,
    private registerCompanyService: RegisterCompanyService,
  ) {
    this.minDate = new Date();
    this.cardChargeFormGroup = this.formBuilder.group({
      amount: [
        '',
        [
          Validators.required,
          Validators.min(10),
          Validators.pattern(currencyRegex),
        ],
      ],
      comments: [''],
      shipping: [''],
      transaction: ['', Validators.required],
      dueDate: ['', Validators.required],
      discountPercent: ['', [Validators.min(0), Validators.max(100)]],
      discountMoney: ['', Validators.pattern(currencyRegex)],
    });
    this.service
      .getPaymentMethods()
      .then((paymentMethods) => (this.paymentMethods = paymentMethods));
  }

  ngOnInit(): void {
    this.getFees();
    this.getCompany();
  }

  getCompany(): void {
    this.loading = true;
    this.registerCompanyService.getCompany().subscribe(
      COMPANY => this.company = COMPANY,
      error => this.toastr.error('Não foi possível obter dados da empresa.'),
    ).add(() => this.loading = false);
  }

  openDialog(form: any): void {
    let discount = 0;
    if (!this.cardChargeFormGroup.invalid) {
      const {
        amount,
        shipping,
        transaction,
        dueDate,
        discountMoney,
        discountPercent,
        comments,
      } = this.cardChargeFormGroup.controls;
      if (discountMoney.value) {
        discount = discountMoney.value;
      } else {
        discount = discountPercent.value;
      }
      this.service.setPaymentCardData(
        amount.value,
        discount,
        this.discountRadio,
        transaction.value.value,
        comments.value,
        dueDate.value,
        shipping.value,
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
        this.service.linkCheckoutOrder(data).subscribe(
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
      }
      );
    }
  }

  private getChargePayload(): any {
    const checkoutOrderData = this.service.checkoutOrder;
    const data: any = {
      origin: 'WEB',
      transaction_type: 'LINK',
      company_id: this.storageService.nixCoreID,
      company_email: this.company.email,
      payer_account_id: checkoutOrderData.payer_account_id,
      payer_social_number: checkoutOrderData.payer_social_number,
      payer_name: checkoutOrderData.payer_name,
      payer_email: checkoutOrderData.payer_email,
      amount: (checkoutOrderData.amount).toFixed(2),
      due_date: moment(checkoutOrderData.due_date).format('YYYY-MM-DD'),
      shipping: checkoutOrderData.shipping,
      discount: checkoutOrderData.discount || 0,
      discount_type: this.getDiscountType(),
      options: checkoutOrderData.transaction_type,
      payer_address: {
        country: 'Brasil',
        zip_code: checkoutOrderData.payer_address.zip_code,
        street: checkoutOrderData.payer_address.street,
        city: checkoutOrderData.payer_address.city,
        state: checkoutOrderData.payer_address.state,
        neighborhood: checkoutOrderData.payer_address.neighborhood,
      },
    };
    if (checkoutOrderData.comments && checkoutOrderData.comments !== '') {
      data['comments'] = checkoutOrderData.comments;
    }
    if (checkoutOrderData.payer_address.number && checkoutOrderData.payer_address.number !== '') {
      data.payer_address['number'] = checkoutOrderData.payer_address.number;
    }
    if (checkoutOrderData.payer_address.complement && checkoutOrderData.payer_address.complement !== '') {
      data.payer_address['complement'] = checkoutOrderData.payer_address.complement;
    }
    return data;
  }

  private getDiscountType(): string {
    if (this.service.checkoutOrder.discount_type === 'money' && this.service.checkoutOrder.discount > 0) {
      return 'FIXED';
    } else if (this.service.checkoutOrder.discount_type === 'percent' && this.service.checkoutOrder.discount > 0) {
      return 'PERCENTAGE';
    } else {
      return 'NONE';
    }
  }

  getFees(): void {
    this.service.getFees().subscribe(
      data => {
        if (data.results) {
          this.creditCardFee = data.results.filter(
            (d: { transaction_type: string; installment: number; }) => d.transaction_type === 'CREDIT' && d.installment === 1)[0].amount;
          this.billetFee = data.results.filter(
            (d: { transaction_type: string; installment: number; }) => d.transaction_type === 'BILLET' && d.installment === 1)[0].amount;
        }
      }
    );
  }

}
