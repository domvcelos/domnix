import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { merge, of as observableOf } from 'rxjs';
import { startWith, switchMap, map, catchError } from 'rxjs/operators';

import { PAGESIZEOPTIONS, Utils } from 'src/app/common/utils';
import { IPayListSelect, IPayStatusListSelect } from '../pay/shared/pay.model';
import { PaymentDetailsModalComponent } from './components/payment-details-modal/payment-details-modal.component';
import { PaymentReceiptModalComponent } from './components/payment-receipt-modal/payment-receipt-modal.component';
import { IPayment, IPaymentsFilter } from './shared/payment.model';
import { PaymentManagementService } from './shared/payment-management.service';
import { IConfig, JsPdfHelper } from 'src/app/common/jsPdf.helper';
import { CpfCnpjPipe } from 'src/app/pipes/cpfCnpj/cpf-cnpj.pipe';
import { CurrencyPipe } from '@angular/common';
import { PaymentMethodPipe } from 'src/app/pipes/payment-method/payment-method.pipe';
import { CustomValidators } from 'src/app/common/custom-validators';


@Component({
  selector: 'app-payment-management',
  templateUrl: './payment-management.component.html',
  styleUrls: ['./payment-management.component.scss'],
})
export class PaymentManagementComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'select',
    'payee_name',
    'payee_social_number',
    'transaction_type',
    'due_date',
    'payment_date',
    'status',
    'amount',
    'actions',
  ];
  dataSource: MatTableDataSource<IPayment>;
  selection = new SelectionModel<IPayment>(true, []);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  length = 0;
  pageSize = 15;
  pageSizeOptions: number[] = PAGESIZEOPTIONS;
  filterRangeFormGroup: FormGroup;
  panelOpenState = false;
  loading = false;
  date: {
    start: moment.Moment;
    end: moment.Moment;
  };
  exapansionText = 'Filtros avançados ▼';
  transactionTypes: IPayListSelect[];
  statusTypes: IPayStatusListSelect[];

  constructor(
    private cpfCnpjPipe: CpfCnpjPipe,
    private currencyPipe: CurrencyPipe,
    private dialog: MatDialog,
    private jsPdf: JsPdfHelper,
    private formBuilder: FormBuilder,
    private paymentMethodPipe: PaymentMethodPipe,
    private service: PaymentManagementService,
    private utils: Utils,
    private customValidators: CustomValidators,
  ) {
    const currentMonth = this.utils.currentMonthRange();
    this.date = { start: currentMonth[0], end: currentMonth[1] };
    this.filterRangeFormGroup = this.formBuilder.group({
      search: '',
      dueStartDate: '',
      dueEndDate: '',
      paymentStartDate: '',
      PaymentndDate: '',
      transactionType: '',
      statusType: '',
    });
    this.dataSource = new MatTableDataSource<IPayment>();
  }

  ngOnInit(): void {
    this.getPayListSelect();
  }

  ngAfterViewInit(): void {
    this.buildFiltersAndFetch();
  }

  buildFiltersAndFetch(): void {
    const dueStartDateCtrl = this.filterRangeFormGroup.controls['dueStartDate'];
    const dueEndDateCtrl = this.filterRangeFormGroup.controls['dueEndDate'];
    const transactionTypeCtrl = this.filterRangeFormGroup.controls['transactionType'];
    const statusTypeCtrl = this.filterRangeFormGroup.controls['statusType'];
    const searchCtrl = this.filterRangeFormGroup.controls['search'];
    const paymentStartCtrl = this.filterRangeFormGroup.controls['paymentStartDate'];
    const PaymentEndCtrl = this.filterRangeFormGroup.controls['PaymentndDate'];
    merge(
      this.paginator.page,
      dueStartDateCtrl.statusChanges,
      dueEndDateCtrl.statusChanges,
      transactionTypeCtrl.statusChanges,
      statusTypeCtrl.statusChanges,
      searchCtrl.statusChanges,
      paymentStartCtrl.statusChanges,
      PaymentEndCtrl.statusChanges
    )
      .pipe(
        startWith({}),
        switchMap(() => {
          this.loading = true;
          let paymentID = '';
          let customerIdentity = '';
          let customerName = '';
          let barcode = '';
          if (this.utils.isUUID(searchCtrl.value)) {
            paymentID = searchCtrl.value;
          } else if (this.customValidators.isCpf(searchCtrl.value) || this.customValidators.isCnpj(searchCtrl.value)) {
            customerIdentity = this.customValidators.onlyNumbers(searchCtrl.value);
          } else if (this.customValidators.onlyNumbers(searchCtrl.value).length >= 44) {
            barcode = this.customValidators.onlyNumbers(searchCtrl.value);
          } else {
            customerName = searchCtrl.value;
          }
          const customFilters: IPaymentsFilter = {
            payment_id: paymentID,
            payee_social_number: customerIdentity,
            payee_name: customerName,
            transaction_type: transactionTypeCtrl.value,
            status: statusTypeCtrl.value,
            start_due_date: dueStartDateCtrl.value ? this.utils.dateToStringUSA(dueStartDateCtrl.value) : '',
            end_due_date: dueEndDateCtrl.value ? this.utils.dateToStringUSA(dueEndDateCtrl.value) : '',
            start_payment_date: paymentStartCtrl.value ? this.utils.dateToStringUSA(paymentStartCtrl.value) : '',
            end_payment_date: PaymentEndCtrl.value ? this.utils.dateToStringUSA(PaymentEndCtrl.value) : '',
            barcode,
            offset: this.paginator.pageSize * this.paginator.pageIndex,
            limit: this.paginator.pageSize,
          };
          return this.service.getPayments(customFilters);
        }),
        map((dataPayment) => {
          this.loading = false;
          this.length = dataPayment.count;
          return dataPayment.results;
        }),
        catchError(() => {
          this.loading = false;
          return observableOf([]);
        })
      )
      .subscribe(
        (payments) =>
          (this.dataSource = new MatTableDataSource<IPayment>(payments))
      );
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  checkboxLabel(row?: IPayment): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id
      }`;
  }

  openExpansion(): void {
    this.panelOpenState = !this.panelOpenState;
    if (this.exapansionText === 'Filtros avançados ▼') {
      this.exapansionText = 'Filtros avançados ▲';
    } else {
      this.exapansionText = 'Filtros avançados ▼';
    }
  }

  clearForm(): void {
    this.filterRangeFormGroup.controls['dueStartDate'].setValue('');
    this.filterRangeFormGroup.controls['dueEndDate'].setValue('');
    this.filterRangeFormGroup.controls['statusType'].setValue('');
    this.filterRangeFormGroup.controls['transactionType'].setValue('');
    this.filterRangeFormGroup.controls['search'].setValue('');
    this.filterRangeFormGroup.controls['paymentStartDate'].setValue('');
    this.filterRangeFormGroup.controls['PaymentndDate'].setValue('');
  }

  getPayListSelect(): void {
    this.service.getPaymentListSelect().then(
      (PAYMENTTRANSACTIONTYPES) =>
        (this.transactionTypes = PAYMENTTRANSACTIONTYPES)
    );
    this.service.getPaymentStatusListSelect().then(
      (PAYMENTSTATUSTYPES) =>
        (this.statusTypes = PAYMENTSTATUSTYPES)
    );
  }

  openDetailsModal(row: IPayment): void {
    this.dialog.open(PaymentDetailsModalComponent, {
      width: '100%',
      height: 'auto',
      maxWidth: '645px',
      data: row,
    });
  }

  openReceiptModal(row: IPayment): void {
    this.dialog.open(PaymentReceiptModalComponent, {
      width: '100%',
      height: 'auto',
      maxWidth: '545px',
      data: row,
    });
  }

  printPayments(): void {
    const rows: string[][] = [];
    const title = 'Relatório de Pagamentos';
    const filename = 'relatorio-de-pagamentos';
    const columns: string[][] = [];
    columns.push([
      'BENEFICIÁRIO',
      'CPF/CNPJ',
      'FORMA',
      'VENCIMENTO',
      'PAGAMENTO',
      'STATUS',
      'VALOR',
    ]);
    this.selection.selected.forEach((item: IPayment) => {
      rows.push([
        item.payee_name || '-',
        this.cpfCnpjPipe.transform(item.payee_social_number) || '-',
        this.paymentMethodPipe.transform(item.transaction_type) || '-',
        this.utils.dateToStringPTBR(item.due_date) || '-',
        this.utils.dateToStringPTBR(item.payment_date) || '-',
        this.utils.translateStatus(item.status) || '-',
        this.currencyPipe.transform(item.amount) || '-',
      ]);
    });
    const complement = new Date().getSeconds();
    const config: IConfig = {
      orientation: 'l',
      rows,
      theme: 'striped',
      styles: { fontSize: 9 },
      columns,
      headerTitle: {
        text: title,
        fontSize: 20,
        font: 'times',
        color: [83, 83, 83],
      },
      fileName: `${filename}-${complement}`,
    };
    this.jsPdf.print(config);
    this.selection.clear();
  }

}
