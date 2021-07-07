import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { CustomValidators } from 'src/app/common/custom-validators';

import { PAGESIZEOPTIONS, Utils } from 'src/app/common/utils';
import { Interval, IRecurrence, IStatusRecurrence, IRecurrencePlan } from '../../shared/recurrence-management.model';
import { RecurrenceManagementService } from '../../shared/recurrence-management.service';
import { RecurrenceEditModalComponent } from '../recurrence-edit-modal/recurrence-edit-modal.component';
import { RecurrenceInfoModalComponent } from '../recurrence-info-modal/recurrence-info-modal.component';


@Component({
  selector: 'app-recurrence-list',
  templateUrl: './recurrence-list.component.html',
  styleUrls: ['./recurrence-list.component.scss'],
})
export class RecurrenceListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'customer_name',
    'customer_identity',
    'plan_name',
    'plan_interval',
    'status',
    'payment_type',
    'start_date',
    'end_date',
    'next_date',
    'actions',
  ];
  dataSource: MatTableDataSource<IRecurrence>;
  selection = new SelectionModel<IRecurrence>(true, []);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  length = 0;
  pageSize = 15;
  pageSizeOptions: number[] = PAGESIZEOPTIONS;
  filterRangeFormGroup: FormGroup;
  panelOpenState = false;
  intervals: Interval[] = [];
  statusRecurrence: IStatusRecurrence[] = [];
  recurrences: IRecurrence[] = [];
  plans: IRecurrencePlan[] = [];
  loading = true;
  filters: any;
  date: {
    start: moment.Moment;
    end: moment.Moment;
  };
  exapansionText = 'Filtros avançados ▼';
  constructor(
    private recurrenceManagementService: RecurrenceManagementService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private utils: Utils,
    private customValidators: CustomValidators,
  ) {
    const currentMonth = this.utils.currentMonthRange();
    this.date = { start: currentMonth[0], end: currentMonth[1] };
    this.filterRangeFormGroup = this.formBuilder.group({
      search: '',
      startDate: '',
      endDate: '',
      interval: '',
      status: '',
      plan: '',
    });
  }

  ngOnInit(): void {
    this.getIntervals();
    this.getStatus();
    this.getPlans();
  }

  ngAfterViewInit(): void {
    this.initFiltersAndFetchSubscriptions();
  }

  initFiltersAndFetchSubscriptions(): void {
    const startDateCtrl = this.filterRangeFormGroup.controls['startDate'];
    const endDateCtrl = this.filterRangeFormGroup.controls['endDate'];
    const planCtrl = this.filterRangeFormGroup.controls['plan'];
    const intervalCtrl = this.filterRangeFormGroup.controls['interval'];
    const statusCtrl = this.filterRangeFormGroup.controls['status'];
    const searchCtrl = this.filterRangeFormGroup.controls['search'];

    merge(
      this.paginator.page,
      startDateCtrl.statusChanges,
      endDateCtrl.statusChanges,
      planCtrl.statusChanges,
      intervalCtrl.statusChanges,
      statusCtrl.statusChanges,
      searchCtrl.statusChanges
    )
      .pipe(
        startWith({}),
        switchMap(() => {
          this.loading = true;
          let id = '';
          let customerIdentity = '';
          let customerName = '';
          if (this.utils.isUUID(searchCtrl.value)) {
            id = searchCtrl.value;
          } else if (
            this.customValidators.isCpf(searchCtrl.value) ||
            this.customValidators.isCnpj(searchCtrl.value)
          ) {
            customerIdentity = this.customValidators.onlyNumbers(searchCtrl.value);
          } else {
            customerName = searchCtrl.value;
          }
          const customFilters = {
            id,
            customer_identity: customerIdentity,
            customer_name: customerName,
            plan_interval: intervalCtrl.value,
            plan_name: planCtrl.value,
            status: statusCtrl.value,
            start_date_start: startDateCtrl.value
              ? this.utils.dateToStringUSA(startDateCtrl.value)
              : '',
            start_date_end: endDateCtrl.value
              ? this.utils.dateToStringUSA(endDateCtrl.value)
              : '',
            offset: this.paginator.pageSize * this.paginator.pageIndex,
            limit: this.paginator.pageSize,
          };
          return this.recurrenceManagementService.getSubscriptions(
            customFilters
          );
        }),
        map((data) => {
          this.loading = false;
          this.length = data.count;

          return data.results;
        }),
        catchError(() => {
          this.loading = false;
          return observableOf([]);
        })
      )
      .subscribe(
        (data) => (this.dataSource = new MatTableDataSource<IRecurrence>(data))
      );
  }

  openDetailsModal(row: IRecurrence): void {
    this.dialog.open(RecurrenceInfoModalComponent, {
      width: '100%',
      height: 'auto',
      maxWidth: '645px',
      data: row,
    });
  }
  openEditModal(row: IRecurrence): void {
    this.dialog.open(RecurrenceEditModalComponent, {
      width: '100%',
      height: 'auto',
      maxWidth: '900px',
      data: row,
    });
  }

  openNewRecurrence(): void {
    this.recurrenceManagementService.showAutocomplete();
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
    this.filterRangeFormGroup.controls['startDate'].setValue('');
    this.filterRangeFormGroup.controls['endDate'].setValue('');
    this.filterRangeFormGroup.controls['interval'].setValue('');
    this.filterRangeFormGroup.controls['status'].setValue('');
    this.filterRangeFormGroup.controls['plan'].setValue('');
    this.filterRangeFormGroup.controls['search'].setValue('');
  }

  getIntervals(): void {
    this.recurrenceManagementService
      .getIntervals()
      .then((INTERVALS) => (this.intervals = INTERVALS));
  }

  getStatus(): void {
    this.recurrenceManagementService
      .getStatusRecurrence()
      .then((STATUSRECURRENCE) => (this.statusRecurrence = STATUSRECURRENCE));
  }

  getPlans(): void {
    this.recurrenceManagementService.getPlans().subscribe(
      PLANS => {
        PLANS.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
        this.plans = PLANS;
      });
  }

  exportSubscriptions(): void {
    this.loading = true;
    this.recurrenceManagementService.exportSubscriptions().subscribe(
      (response) => {
        if (response.body) {
          const myBlob: Blob = new Blob([response.body], {
            type: response.body.type,
          });
          saveAs(
            myBlob,
            `adesoesRecorrencia_${this.utils.getCurrentDate('DMMYYYYHmmss')}`
          );
        }
      },
      (error) => this.toastr.error('Falha ao exportar planos.'),
    ).add(() => this.loading = false);
  }

  deactivateSubscription(row: IRecurrence): void {
    this.loading = true;
    this.recurrenceManagementService.deactivateSubscription(row.id).subscribe(
      response => {
        this.initFiltersAndFetchSubscriptions();
        this.toastr.success('Adesão desativada com sucesso!');
      },
      error => this.toastr.error('Não possível desativar adesão!'),
    ).add(() => this.loading = false);
  }
}
