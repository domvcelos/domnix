import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { ToastrService } from 'ngx-toastr';
import { saveAs } from 'file-saver';

import { IRecurrencePlan } from '../../shared/recurrence-management.model';
import { RecurrenceManagementService } from '../../shared/recurrence-management.service';
import { PlanInfoModalComponent } from '../plan-info-modal/plan-info-modal.component';
import { NewPlanModalComponent } from '../new-plan-modal/new-plan-modal.component';
import { PAGESIZEOPTIONS, Utils } from 'src/app/common/utils';


@Component({
  selector: 'app-recurrence-plan',
  templateUrl: './recurrence-plan.component.html',
  styleUrls: ['./recurrence-plan.component.scss'],
})
export class RecurrencePlanComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'amount',
    'interval',
    'description',
    'created',
    'recurrences',
    'active',
    'actions',
  ];
  dataSource: MatTableDataSource<IRecurrencePlan>;
  selection = new SelectionModel<IRecurrencePlan>(true, []);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  length = 0;
  pageSize = 15;
  pageSizeOptions: number[] = PAGESIZEOPTIONS;
  loading = false;

  constructor(
    private service: RecurrenceManagementService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private utils: Utils,
  ) { }

  ngOnInit(): void {
    this.getPlans();
  }

  getPlans(): void {
    this.loading = true;
    this.service.getPlans().subscribe(
      plans => {
        plans.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
        this.dataSource = new MatTableDataSource<IRecurrencePlan>(plans);
        this.length = this.dataSource.data.length;
        this.dataSource.paginator = this.paginator;
      },
      error => this.toastr.error('Falha ao buscar planos'),
    ).add(() => this.loading = false);
  }

  exportPlans(): void {
    this.loading = true;
    this.service.exportPlans().subscribe(
      response => {
        if (response.body) {
          const myBlob: Blob = new Blob([response.body], { type: response.body.type });
          saveAs(myBlob, `planosRecorrencia_${this.utils.getCurrentDate('DMMYYYYHmmss')}`);
        }
      },
      error => this.toastr.error('Houve um erro inesperado, tente novamente mais tarde.'),
    ).add(() => this.loading = false);
  }

  openDetailsModal(row: IRecurrencePlan): void {
    this.dialog.open(PlanInfoModalComponent, {
      width: '100%',
      height: 'auto',
      maxWidth: '645px',
      data: row,
    });
  }

  openNewPlanModal(): void {
    const dialogRef = this.dialog.open(NewPlanModalComponent, {
      width: '100%',
      height: 'auto',
      maxWidth: '900px',
    });
    dialogRef.afterClosed().subscribe(
      result => this.getPlans(),
    );
    dialogRef.backdropClick().subscribe(_ => {
      if (dialogRef.componentInstance.savedPlan) {
        this.getPlans();
      }
    });
  }

  editPlan(row: IRecurrencePlan): void {
    const dialogRef = this.dialog.open(NewPlanModalComponent, {
      width: '100%',
      height: 'auto',
      maxWidth: '900px',
      data: row,
    });
    dialogRef.afterClosed().subscribe(
      result => this.getPlans(),
    );
    dialogRef.backdropClick().subscribe(_ => {
      if (dialogRef.componentInstance.savedPlan) {
        this.getPlans();
      }
    });
  }

  updateStatusPlan(row: IRecurrencePlan): void {
    this.loading = true;
    this.service.updateStatusPlan(row.id, { status: !row.active }).subscribe(
      data => {
        this.toastr.success(`Plano ${row.active ? 'desativado' : 'ativado'} com sucesso!`);
        this.getPlans();
      },
      error => this.toastr.error(`Não foi possível ${row.active ? 'desativar' : 'ativar'} plano!`),
    ).add(() => this.loading = false);
  }

}
