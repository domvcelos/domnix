import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';

import { IEditSubscriptionRecurrence, IPaymentType, IRecurrence, IRecurrencePlan } from '../../shared/recurrence-management.model';
import { RecurrenceManagementService } from '../../shared/recurrence-management.service';


@Component({
  selector: 'app-recurrence-edit-modal',
  templateUrl: './recurrence-edit-modal.component.html',
  styleUrls: ['./recurrence-edit-modal.component.scss']
})
export class RecurrenceEditModalComponent implements OnInit {
  recurrencePlans: IRecurrencePlan[] = [];
  recurrenceFormGroup: FormGroup;
  paymentTypes: IPaymentType[] = [];
  loading = false;
  creditCardFee: 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public recurrence: IRecurrence,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public recurrenceManagementService: RecurrenceManagementService
  ) {
    this.recurrenceFormGroup = this.formBuilder.group({
      plan: [this.recurrence.plan_id, Validators.required],
      payment_type: [this.recurrence.payment_type, Validators.required],
      active: [this.recurrence.status === 1],
      nextDate: [this.recurrence.next_date],
      comments: this.recurrence.comments,
    });
  }

  ngOnInit(): void {
    this.getFees();
    this.getPlans();
    this.getPaymentTypes();
  }

  getPlans(): void {
    this.loading = true;
    this.recurrenceManagementService.getPlans().subscribe(
      plans => (this.recurrencePlans = plans.filter(d => d.active)),
      error => this.toastr.error('Falha ao buscar planos.'),
    ).add(() => this.loading = false);
  }

  getPaymentTypes(): void {
    this.recurrenceManagementService
      .getPaymentTypes()
      .then((PAYMENTTYPES) => (this.paymentTypes = PAYMENTTYPES));
  }

  edit(form: any): void {
    this.loading = true;
    return;
    // this.recurrenceManagementService.putSubscription(this.recurrence.id, this.getPayload()).subscribe(
    //   response => {
    //    form.resetForm();
    //   },
    //   error => this.toastr.error('Não foi possível salvar edição do plano!')
    // ).add(() => {
    //   this.loading = false;
    // });
  }

  getPayload(): IEditSubscriptionRecurrence {
    const plan = this.recurrencePlans.filter(p => p.id === this.recurrenceFormGroup.value.plan)[0];
    return {
      plan_id: plan.id,
      plan_name: plan.name,
      plan_interval: plan.interval,
      plan_amount: plan.amount,
      active: this.recurrenceFormGroup.value.active,
      next_date: this.recurrenceFormGroup.value.nextDate,
      comments: this.recurrenceFormGroup.value.comments,
    };
  }

  getFees(): void {
    this.loading = true;
    this.recurrenceManagementService.getFees().subscribe(
      (data) => {
        if (data.results) {
          this.creditCardFee = data.results.filter(
            (d: { transaction_type: string; installment: number }) =>
              d.transaction_type === 'CREDIT' && d.installment === 1
          )[0].amount;
        }
      },
      (error) => this.toastr.error('Falha ao buscar taxas.'),
    ).add(() => this.loading = false);
  }

}
