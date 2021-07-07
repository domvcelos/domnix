import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CurrencyPipe } from '@angular/common';

import { merge, of as observableOf } from 'rxjs';
import { startWith, switchMap, map, catchError, delay } from 'rxjs/operators';

import { PAGESIZEOPTIONS, Utils } from 'src/app/common/utils';
import { IConfig, JsPdfHelper } from 'src/app/common/jsPdf.helper';
import { CashflowService } from 'src/app/common/services/cashflow/cashflow.service';
import { IEntry, IEntriesResponse, IEntriesFilter } from 'src/app/common/services/cashflow/cashflow.model';


@Component({
  selector: 'app-analitic-cash-flow',
  templateUrl: './analitic-cash-flow.component.html',
  styleUrls: ['./analitic-cash-flow.component.scss']
})
export class AnaliticCashFlowComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'select',
    'entity_name',
    'entity_id',
    'value',
    'when',
  ];
  dataSource: MatTableDataSource<IEntry>;
  selection = new SelectionModel<IEntry>(true, []);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  length = 0;
  pageSize = 15;
  pageSizeOptions: number[] = PAGESIZEOPTIONS;
  filterRangeFormGroup: FormGroup;
  loading = false;
  date: {
    start: moment.Moment;
    end: moment.Moment;
  };
  startAmount = 0;
  endAmount = 0;
  entries: IEntriesResponse;

  constructor(
    private currencyPipe: CurrencyPipe,
    private jsPdf: JsPdfHelper,
    private formBuilder: FormBuilder,
    private utils: Utils,
    private cashflowService: CashflowService,
  ) {
    const currentMonth = this.utils.currentMonthRange();
    this.date = { start: currentMonth[0], end: currentMonth[1] };
    this.filterRangeFormGroup = this.formBuilder.group({
      dueStartDate: this.date.start.toDate(),
      dueEndDate: this.date.end.toDate(),
    });
    this.dataSource = new MatTableDataSource<IEntry>();
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.buildFiltersAndFetch();
  }

  buildFiltersAndFetch(): void {
    const dueStartDateCtrl = this.filterRangeFormGroup.controls['dueStartDate'];
    const dueEndDateCtrl = this.filterRangeFormGroup.controls['dueEndDate'];
    merge(
      this.paginator.page,
      dueStartDateCtrl.statusChanges,
      dueEndDateCtrl.statusChanges,
    )
      .pipe(
        startWith({}),
        delay(0),
        switchMap(() => {
          this.loading = true;
          const customFilters: IEntriesFilter = {
            date_start: dueStartDateCtrl.value ? this.utils.dateToStringUSA(dueStartDateCtrl.value) : '',
            date_end: dueEndDateCtrl.value ? this.utils.dateToStringUSA(dueEndDateCtrl.value) : '',
            begin: dueStartDateCtrl.value ? this.utils.dateToStringUSA(dueStartDateCtrl.value) : '',
            end: dueEndDateCtrl.value ? this.utils.dateToStringUSA(dueEndDateCtrl.value) : '',
            status: 1,
            type: 1,
            page: this.paginator.pageIndex + 1,
            limit: this.paginator.pageSize,
            ordering: '-when',
          };
          return this.cashflowService.getEntries(customFilters);
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
        entries => {
          this.dataSource = new MatTableDataSource<IEntry>(entries);
          this.getConsolidations();
        },
      );
  }

  getConsolidations(): void {
    const filtersConsolidations = {
      ordering: 'when', limit: 'disable',
      begin: this.filterRangeFormGroup.value.dueStartDate ? this.utils.dateToStringUSA(this.filterRangeFormGroup.value.dueStartDate) : '',
      end: this.filterRangeFormGroup.value.dueEndDate ? this.utils.dateToStringUSA(this.filterRangeFormGroup.value.dueEndDate) : '',
      date_start: this.filterRangeFormGroup.value.dueStartDate ? this.utils.dateToStringUSA(this.filterRangeFormGroup.value.dueStartDate) : '',
      date_end: this.filterRangeFormGroup.value.dueEndDate ? this.utils.dateToStringUSA(this.filterRangeFormGroup.value.dueEndDate) : '',
      status: 1
    };
    this.cashflowService.getConsolidations(filtersConsolidations).subscribe(
      consolidations => {
        if (consolidations.length > 0) {
          this.startAmount = consolidations[0].value;
          this.endAmount = consolidations[consolidations.length - 1].value;
        } else {
          this.startAmount = 0;
          this.endAmount = 0;
        }
      }
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

  checkboxLabel(row?: IEntry): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id
      }`;
  }

  printAnalitics(): void {
    const rows: string[][] = [];
    const title = 'Visão analítica';
    const filename = 'fluxo-de-caixa-visao-analitica';
    const columns: string[][] = [];
    columns.push([
      'TRANSAÇÃO',
      'PROTOCOLO',
      'VALOR',
      'DATA',
    ]);
    this.selection.selected.forEach((item: IEntry) => {
      rows.push([
        item.entity_name || '-',
        String(item.entity_id) || '-',
        this.currencyPipe.transform(item.value) || '-',
        this.utils.dateToStringPTBR(item.when) || '-',
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
