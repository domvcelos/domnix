import { CurrencyPipe } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

import { PAGESIZEOPTIONS, Utils } from 'src/app/common/utils';
import { CollectionManagementService } from './shared/collection-management.service';
import { ICollection, IFilter, ICollectionType, IStatusCollection, } from './shared/collection-management.model';
import { CollectionInfoModalComponent } from './components/collection-info-modal/collection-info-modal.component';
import { CollectionResendModalComponent } from './components/collection-resend-modal/collection-resend-modal.component';
import { CollectionCancelModalComponent } from './components/collection-cancel-modal/collection-cancel-modal.component';
import { IConfig, JsPdfHelper } from 'src/app/common/jsPdf.helper';
import { CpfCnpjPipe } from 'src/app/pipes/cpfCnpj/cpf-cnpj.pipe';
import { PaymentMethodPipe } from 'src/app/pipes/payment-method/payment-method.pipe';
import { CustomValidators } from 'src/app/common/custom-validators';


@Component({
  selector: 'app-collection-management',
  templateUrl: './collection-management.component.html',
  styleUrls: ['./collection-management.component.scss'],
})
export class CollectionManagementComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'select',
    'payer_name',
    'payer_social_number',
    'transaction_type',
    'created',
    'due_date',
    'status',
    'amount',
    'discount',
    'shipping',
    'final_amount',
    'actions',
  ];
  dataSource: MatTableDataSource<ICollection>;
  selection = new SelectionModel<ICollection>(true, []);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  length = 0;
  pageSize = 15;
  pageSizeOptions: number[] = PAGESIZEOPTIONS;
  filterRangeFormGroup: FormGroup;
  panelOpenState = false;
  loading = true;
  date: {
    start: moment.Moment;
    end: moment.Moment;
  };
  collectionTypes: ICollectionType[] = [];
  exapansionText = 'Filtros avançados ▼';
  statusCollection: IStatusCollection[] = [];

  constructor(
    private service: CollectionManagementService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private utils: Utils,
    private customValidators: CustomValidators,
    private jsPdf: JsPdfHelper,
    private currencyPipe: CurrencyPipe,
    private cpfCnpjPipe: CpfCnpjPipe,
    private paymentMethodPipe: PaymentMethodPipe,
  ) {
    const currentMonth = this.utils.currentMonthRange();
    this.date = { start: currentMonth[0], end: currentMonth[1] };
    this.filterRangeFormGroup = this.formBuilder.group({
      search: '',
      dueStartDate: '',
      dueEndDate: '',
      createdStartDate: '',
      createdEndDate: '',
      collectionType: '',
      status: '',
    });
    this.dataSource = new MatTableDataSource<ICollection>();
  }

  ngOnInit(): void {
    this.getStatusCollection();
    this.getCollectionTypes();
  }

  ngAfterViewInit(): void {
    this.buildFiltersAndFetch();
  }

  buildFiltersAndFetch(): void {
    const startDateCtrl = this.filterRangeFormGroup.controls['dueStartDate'];
    const endDateCtrl = this.filterRangeFormGroup.controls['dueEndDate'];
    const statusCtrl = this.filterRangeFormGroup.controls['status'];
    const searchCtrl = this.filterRangeFormGroup.controls['search'];
    const collectionCtrl = this.filterRangeFormGroup.controls['collectionType'];
    const createdStartCtrl = this.filterRangeFormGroup.controls['createdStartDate'];
    const createdEndCtrl = this.filterRangeFormGroup.controls['createdEndDate'];
    merge(
      this.paginator.page,
      startDateCtrl.statusChanges,
      endDateCtrl.statusChanges,
      statusCtrl.statusChanges,
      searchCtrl.statusChanges,
      collectionCtrl.statusChanges,
      createdStartCtrl.statusChanges,
      createdEndCtrl.statusChanges
    )
      .pipe(
        startWith({}),
        switchMap(() => {
          this.loading = true;
          let chargeID = '';
          let customerIdentity = '';
          let customerName = '';
          if (this.utils.isUUID(searchCtrl.value)) {
            chargeID = searchCtrl.value;
          } else if (
            this.customValidators.isCpf(searchCtrl.value) ||
            this.customValidators.isCnpj(searchCtrl.value)
          ) {
            customerIdentity = this.customValidators.onlyNumbers(searchCtrl.value);
          } else {
            customerName = searchCtrl.value;
          }
          const customFilters: IFilter = {
            charge_id: chargeID,
            payer_social_number: customerIdentity,
            payer_name: customerName,
            transaction_type: collectionCtrl.value,
            status: statusCtrl.value,
            start_due_date: startDateCtrl.value
              ? this.utils.dateToStringUSA(startDateCtrl.value)
              : '',
            end_due_date: endDateCtrl.value
              ? this.utils.dateToStringUSA(endDateCtrl.value)
              : '',
            start_date_created: createdStartCtrl.value
              ? this.utils.dateToStringUSA(createdStartCtrl.value)
              : '',
            end_date_created: createdEndCtrl.value
              ? this.utils.dateToStringUSA(createdEndCtrl.value)
              : '',
            offset: this.paginator.pageSize * this.paginator.pageIndex,
            limit: this.paginator.pageSize,
            ordering: 'due_date',
          };
          return this.service.getCollections(customFilters);
        }),
        map((dataCollection) => {
          this.loading = false;
          this.length = dataCollection.count;
          return dataCollection.results;
        }),
        catchError(() => {
          this.loading = false;
          return observableOf([]);
        })
      )
      .subscribe(
        (collections) =>
          (this.dataSource = new MatTableDataSource<ICollection>(collections))
      );
  }

  openDetailsModal(row: ICollection): void {
    this.dialog.open(CollectionInfoModalComponent, {
      width: '100%',
      height: 'auto',
      maxWidth: '645px',
      data: row,
    });
  }

  openResendModal(row: ICollection): void {
    this.dialog.open(CollectionResendModalComponent, {
      width: 'auto',
      height: 'auto',
      maxWidth: '65vw',
      data: row,
    });
  }

  openCancelModal(row: ICollection): void {
    const dialogRef = this.dialog.open(CollectionCancelModalComponent, {
      width: 'auto',
      height: 'auto',
      maxWidth: '65vw',
      data: row,
    });
    dialogRef.afterClosed().subscribe((result) => this.buildFiltersAndFetch());
    dialogRef.backdropClick().subscribe((_) => {
      if (dialogRef.componentInstance.canceled) {
        this.buildFiltersAndFetch();
      }
    });
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
    this.filterRangeFormGroup.controls['search'].setValue('');
    this.filterRangeFormGroup.controls['status'].setValue('');
    this.filterRangeFormGroup.controls['createdStartDate'].setValue('');
    this.filterRangeFormGroup.controls['createdEndDate'].setValue('');
    this.filterRangeFormGroup.controls['collectionType'].setValue('');
  }

  getCollectionTypes(): void {
    this.service
      .getCollectionTypes()
      .then((COLLECTIONTYPES) => (this.collectionTypes = COLLECTIONTYPES));
  }

  getStatusCollection(): void {
    this.service
      .getSatusCollection()
      .then((STATUSCOLLECTION) => (this.statusCollection = STATUSCOLLECTION));
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

  checkboxLabel(row?: ICollection): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id
      }`;
  }

  printCollections(): void {
    const rows: string[][] = [];
    const title = 'Relatório de Cobranças';
    const filename = 'relatorio-de-cobrancas';
    const columns: string[][] = [];

    columns.push([
      'CLIENTE',
      'CPF/CNPJ',
      'FORMA',
      'EMISSÃO',
      'VENCIMENTO',
      'STATUS',
      'VALOR',
      'DESCONTO',
      'FRETE',
      'VALOR COBRADO',
    ]);
    this.selection.selected.forEach((item: ICollection) => {
      rows.push([
        item.payer_name || '-',
        this.cpfCnpjPipe.transform(item.payer_social_number) || '-',
        this.paymentMethodPipe.transform(item.transaction_type) || '-',
        this.utils.dateToStringPTBR(item.created) || '-',
        this.utils.dateToStringPTBR(item.due_date) || '-',
        this.utils.translateStatus(item.status) || '-',
        this.currencyPipe.transform(item.amount) || '-',
        item.amount_values.discount
          ? this.currencyPipe.transform(item.amount_values.discount)!
          : '-',
        item.amount_values.shipping
          ? this.currencyPipe.transform(item.amount_values.shipping)!
          : '-',
        this.currencyPipe.transform(item.amount_values.final_amount)! || '-',
      ]);
    });
    const complement = new Date().getSeconds();
    const config: IConfig = {
      // Orientation for page equals 'portrait' (p = default) or 'landscape' (l)
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
