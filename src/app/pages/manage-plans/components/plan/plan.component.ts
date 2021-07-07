import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { StorageService } from 'src/app/common/services/storage/storage.service';
import { currencyRegex, PAGESIZEOPTIONS } from 'src/app/common/utils';
import { ManagePlansService } from '../../shared/manage-plans.service';
import { IChannelPayload, IPlan, IPlanPayload } from '../../shared/plan.model';


@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss']
})
export class PlanComponent implements OnInit {

  loading = false;
  form: FormGroup;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = [
    'type',
    'tariff_value',
    'fee_amount',
    'free_quantities',
    'tax',
    'percent',
  ];
  length = 0;
  pageSize = 15;
  pageSizeOptions: number[] = PAGESIZEOPTIONS;
  defaultPlan: IPlan;
  selectedPlan: IPlan;
  oldChannel: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private formBuilder: FormBuilder,
    private service: ManagePlansService,
    private storageService: StorageService,
    private toastr: ToastrService,
    private router: Router,
  ) {
    this.form = this.formBuilder.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      transferTariff: ['', Validators.required],
      transferFee: ['', Validators.required],
      transferQuantities: ['0'],
      bill_paymentTariff: ['', Validators.required],
      bill_paymentFee: ['', Validators.required],
      bill_paymentQuantities: ['0'],
      pixTariff: ['', Validators.required],
      pixFee: ['', Validators.required],
      pixQuantities: ['0'],
      createAccountTariff: ['', Validators.required],
      createAccountFee: ['', Validators.required],
      createAccountQuantities: ['0'],
    });
    if (this.service.selectedPlan) {
      this.selectedPlan = this.service.selectedPlan;
    }
    this.getDefaultPlanAndBuild();
  }

  ngOnInit(): void { }

  getDefaultPlanAndBuild(): void {
    this.loading = true;
    this.service.getDefaultPlan().subscribe(
      PLAN => {
        this.defaultPlan = PLAN.results[0];
        const defaultFees = this.defaultPlan.fees;
        this.dataSource = new MatTableDataSource<any>(
          [
            {
              type: 'Taxa de Ted',
              tax: defaultFees.filter(f => f.event_type === 'transfer')[0].tariff_value.slice(0, -1),
              percent: defaultFees.filter(f => f.event_type === 'transfer')[0].fee_amount.slice(0, -1),
              tariffForm: 'transferTariff',
              feeForm: 'transferFee',
              quantitiesForm: 'transferQuantities',
            },
            {
              type: 'Taxa de boleto',
              tax: defaultFees.filter(f => f.event_type === 'bill-payment')[0].tariff_value.slice(0, -1),
              percent: defaultFees.filter(f => f.event_type === 'bill-payment')[0].fee_amount.slice(0, -1),
              tariffForm: 'bill_paymentTariff',
              feeForm: 'bill_paymentFee',
              quantitiesForm: 'bill_paymentQuantities',
            },
            {
              type: 'Taxa de Pix',
              tax: defaultFees.filter(f => f.event_type === 'pix')[0].tariff_value.slice(0, -1),
              percent: defaultFees.filter(f => f.event_type === 'pix')[0].fee_amount.slice(0, -1),
              tariffForm: 'pixTariff',
              feeForm: 'pixFee',
              quantitiesForm: 'pixQuantities',
            },
            {
              type: 'Criação de conta',
              tax: defaultFees.filter(f => f.event_type === 'create-account')[0]?.tariff_value.slice(0, -1),
              percent: defaultFees.filter(f => f.event_type === 'create-account')[0]?.fee_amount.slice(0, -1),
              tariffForm: 'createAccountTariff',
              feeForm: 'createAccountFee',
              quantitiesForm: 'createAccountQuantities',
            },
          ]
        );
        if (this.selectedPlan) {
          this.getChannel(this.selectedPlan.id);
        }
      },
      ERROR => this.toastr.error('Não foi possível obter plano padrão.'),
    ).add(() => this.loading = false);
  }

  buildUpdateForm(): void {
    this.form.patchValue(
      {
        name: this.selectedPlan.plan_name,
        transferFee: this.selectedPlan.fees.filter(f => f.event_type === 'transfer')[0].fee_amount.slice(0, -1),
        transferTariff: this.selectedPlan.fees.filter(f => f.event_type === 'transfer')[0].tariff_value.slice(0, -1),
        transferQuantities: this.selectedPlan.fees.filter(f => f.event_type === 'transfer')[0].free_quantities,
        bill_paymentFee: this.selectedPlan.fees.filter(f => f.event_type === 'bill-payment')[0].fee_amount.slice(0, -1),
        bill_paymentTariff: this.selectedPlan.fees.filter(f => f.event_type === 'bill-payment')[0].tariff_value.slice(0, -1),
        bill_paymentQuantities: this.selectedPlan.fees.filter(f => f.event_type === 'bill-payment')[0].free_quantities,
        pixFee: this.selectedPlan.fees.filter(f => f.event_type === 'pix')[0].fee_amount.slice(0, -1),
        pixTariff: this.selectedPlan.fees.filter(f => f.event_type === 'pix')[0].tariff_value.slice(0, -1),
        pixQuantities: this.selectedPlan.fees.filter(f => f.event_type === 'pix')[0].free_quantities,
        createAccountFee: this.selectedPlan.fees.filter(f => f.event_type === 'create-account')[0].fee_amount.slice(0, -1),
        createAccountTariff: this.selectedPlan.fees.filter(f => f.event_type === 'create-account')[0].tariff_value.slice(0, -1),
        createAccountQuantities: this.selectedPlan.fees.filter(f => f.event_type === 'create-account')[0].free_quantities,
      }
    );
  }

  savePlan(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const data = this.getPayload();
    this.loading = true;
    if (this.selectedPlan) {
      this.service.updatePlan(this.selectedPlan.id, data).subscribe(
        PLAN => this.updateCodeChannel(),
        ERROR => {
          this.router.navigateByUrl('empresas');
          this.toastr.error('Não foi possível atualizar plano.');
        },
      ).add(() => this.loading = false);
    } else {
      this.service.createPlan(data).subscribe(
        PLAN => this.createChannel(PLAN.id),
        ERROR => this.toastr.error('Não foi possível criar plano.'),
      ).add(() => this.loading = false);
    }
  }

  createChannel(planID: string): void {
    this.loading = true;
    this.service.createChannel(this.getChannelPayload(planID)).subscribe(
      CHANNEL => {
        this.router.navigateByUrl('empresas');
        this.toastr.success('Plano criado com sucesso.');
      },
      ERROR => {
        if (ERROR.status === 400) {
          this.toastr.error('Código de plano já existente.');
        } else {
          this.toastr.error('Não foi possível criar canal para o plano.');
        }
      },
    ).add(() => this.loading = false);
  }

  getChannelPayload(planID: string): IChannelPayload {
    return {
      fee_plan_id: planID,
      partner_document_number: this.storageService.erp,
      name: this.form.value.name,
      code: this.form.value.code,
      free: true,
      activated: true,
    };
  }

  getChannel(planID: string): void {
    this.loading = true;
    this.service.getChannel(planID).subscribe(
      PLAN => {
        this.oldChannel = PLAN.results[0].code;
        this.form.patchValue(
          { code: PLAN.results[0].code },
        );
        this.buildUpdateForm();
      },
      ERROR => this.toastr.error('Não foi possível buscar canal.'),
    ).add(() => this.loading = false);
  }

  updateCodeChannel(): void {
    const data: any = {
      code: this.form.value.code,
      name: this.form.value.name,
    };
    this.loading = true;
    this.service.updateChannel(this.oldChannel, data).subscribe(
      CHANNEL => {
        this.router.navigateByUrl('empresas');
        this.toastr.success('Plano atualizado com sucesso.');
      },
      ERROR => {
        this.router.navigateByUrl('empresas');
        this.toastr.error('Não foi possível atualizar plano.');
      },
    ).add(() => this.loading = false);
  }

  getPayload(): IPlanPayload {
    return {
      plan_name: this.form.value.name,
      partner_document_number: this.storageService.erp,
      products: [
        'NIX-EMPRESAS', 'NIX-PROXY', 'GATEWAY'
      ],
      id_product_establishment: { NIX_EMPRESAS: this.storageService.erp,
        NIX_PROXY: this.storageService.erp, GATEWAY: this.storageService.erp},
      frequency: 'TRANSACTIONAL',
      fees: [
        {
          event_type: 'bill-payment',
          fee_amount: String(this.form.value.bill_paymentFee / 100),
          tariff_value: String(this.form.value.bill_paymentTariff.toFixed(2)),
          free_quantities: this.form.value.bill_paymentQuantities,
        },
        {
          event_type: 'transfer',
          fee_amount: String(this.form.value.transferFee / 100),
          tariff_value: String(this.form.value.transferTariff.toFixed(2)),
          free_quantities: this.form.value.transferQuantities,
        },
        {
          event_type: 'pix',
          fee_amount: String(this.form.value.pixFee / 100),
          tariff_value: String(this.form.value.pixTariff.toFixed(2)),
          free_quantities: this.form.value.pixQuantities,
        },
        {
          event_type: 'create-account',
          fee_amount: String(this.form.value.createAccountFee / 100),
          tariff_value: String(this.form.value.createAccountTariff.toFixed(2)),
          free_quantities: this.form.value.createAccountQuantities,
        },
      ]
    };
  }

  feesHasError(): boolean {
    return (this.form.controls['transferTariff'].touched && this.form.controls['transferTariff'].status === 'INVALID') ||
      (this.form.controls['transferFee'].touched && this.form.controls['transferFee'].status === 'INVALID') ||
      (this.form.controls['bill_paymentTariff'].touched && this.form.controls['bill_paymentTariff'].status === 'INVALID') ||
      (this.form.controls['bill_paymentFee'].touched && this.form.controls['bill_paymentFee'].status === 'INVALID') ||
      (this.form.controls['pixTariff'].touched && this.form.controls['pixTariff'].status === 'INVALID') ||
      (this.form.controls['pixFee'].touched && this.form.controls['pixFee'].status === 'INVALID') ||
      (this.form.controls['createAccountTariff'].touched && this.form.controls['createAccountTariff'].status === 'INVALID') ||
      (this.form.controls['createAccountFee'].touched && this.form.controls['createAccountFee'].status === 'INVALID');
  }

  quantitiesHasError(): boolean {
    return (this.form.controls['transferQuantities'].touched && this.form.controls['transferQuantities'].status === 'INVALID') ||
      (this.form.controls['bill_paymentQuantities'].touched && this.form.controls['bill_paymentQuantities'].status === 'INVALID') ||
      (this.form.controls['pixQuantities'].touched && this.form.controls['pixQuantities'].status === 'INVALID') ||
      (this.form.controls['createAccountQuantities'].touched && this.form.controls['createAccountQuantities'].status === 'INVALID');
  }

}
