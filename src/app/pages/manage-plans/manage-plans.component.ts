import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { PAGESIZEOPTIONS } from 'src/app/common/utils';
import { ManagePlansService } from './shared/manage-plans.service';
import { IPlan } from './shared/plan.model';


@Component({
  selector: 'app-manage-plans',
  templateUrl: './manage-plans.component.html',
  styleUrls: ['./manage-plans.component.scss']
})
export class ManagePlansComponent implements OnInit {

  loading = false;
  displayedColumns: string[] = [
    'type',
    'tariff_value',
    'fee_amount',
    'free_quantities',
    'tax',
    'percent',
  ];
  dataSource: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  length = 0;
  pageSize = 15;
  pageSizeOptions: number[] = PAGESIZEOPTIONS;
  defaultPlan: IPlan;
  selectedPlan: IPlan;
  channelCode: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private service: ManagePlansService,
    private router: Router,
    private toastr: ToastrService,
  ) {
    if (!this.service.selectedPlan) {
      this.router.navigateByUrl('empresas');
    } else {
      this.selectedPlan = this.service.selectedPlan;
      this.getDefaultPlanAndBuild();
      this.getChannel(this.selectedPlan.id);
    }
  }

  ngOnInit(): void {
  }

  getDefaultPlanAndBuild(): void {
    this.loading = true;
    this.service.getDefaultPlan().subscribe(
      PLAN => {
        this.defaultPlan = PLAN.results[0];
        const fees = this.service.selectedPlan.fees;
        const defaultFees = this.defaultPlan.fees;
        this.dataSource = new MatTableDataSource<any>(
          [
            {
              type: 'Taxa de Ted',
              fee_amount: fees.filter(f => f.event_type === 'transfer')[0].fee_amount.slice(0, -1),
              tariff_value: fees.filter(f => f.event_type === 'transfer')[0].tariff_value.slice(0, -1),
              free_quantities: fees.filter(f => f.event_type === 'transfer')[0].free_quantities,
              tax: defaultFees.filter(f => f.event_type === 'transfer')[0].tariff_value.slice(0, -1),
              percent: defaultFees.filter(f => f.event_type === 'transfer')[0].fee_amount.slice(0, -1),
            },
            {
              type: 'Taxa de boleto',
              fee_amount: fees.filter(f => f.event_type === 'bill-payment')[0].fee_amount.slice(0, -1),
              tariff_value: fees.filter(f => f.event_type === 'bill-payment')[0].tariff_value.slice(0, -1),
              free_quantities: fees.filter(f => f.event_type === 'bill-payment')[0].free_quantities,
              tax: defaultFees.filter(f => f.event_type === 'bill-payment')[0].tariff_value.slice(0, -1),
              percent: defaultFees.filter(f => f.event_type === 'bill-payment')[0].fee_amount.slice(0, -1),
            },
            {
              type: 'Taxa de Pix',
              fee_amount: fees.filter(f => f.event_type === 'pix')[0].fee_amount.slice(0, -1),
              tariff_value: fees.filter(f => f.event_type === 'pix')[0].tariff_value.slice(0, -1),
              free_quantities: fees.filter(f => f.event_type === 'pix')[0].free_quantities,
              tax: defaultFees.filter(f => f.event_type === 'pix')[0].tariff_value.slice(0, -1),
              percent: defaultFees.filter(f => f.event_type === 'pix')[0].fee_amount.slice(0, -1)
            },
            {
              type: 'Criação de conta',
              fee_amount: fees.filter(f => f.event_type === 'create-account')[0]?.fee_amount.slice(0, -1),
              tariff_value: fees.filter(f => f.event_type === 'create-account')[0]?.tariff_value.slice(0, -1),
              free_quantities: fees.filter(f => f.event_type === 'create-account')[0]?.free_quantities,
              tax: defaultFees.filter(f => f.event_type === 'create-account')[0]?.tariff_value.slice(0, -1),
              percent: defaultFees.filter(f => f.event_type === 'create-account')[0]?.fee_amount.slice(0, -1)
            },
          ]
        );
      },
      ERROR => this.toastr.error('Não foi possível obter plano padrão.'),
    ).add(() => this.loading = false);
  }

  newPlan(): void {
    this.service.selectedPlan = null;
    this.router.navigateByUrl('plano');
  }

  updatePlan(): void {
    this.router.navigateByUrl('plano');
  }

  listPlans(): void {
    this.router.navigateByUrl('empresas');
  }

  getChannel(planID: string): void {
    this.loading = true;
    this.service.getChannel(planID).subscribe(
      PLAN => this.channelCode = PLAN.results[0].code,
      ERROR => this.toastr.error('Não foi possível buscar canal.'),
    ).add(() => this.loading = false);
  }

}
