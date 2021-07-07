import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatHorizontalStepper } from '@angular/material/stepper';

import { ToastrService } from 'ngx-toastr';

import { currencyRegex } from 'src/app/common/utils';
import { Interval, IRecurrencePlan } from '../../shared/recurrence-management.model';
import { RecurrenceManagementService } from '../../shared/recurrence-management.service';


@Component({
  selector: 'app-new-plan-modal',
  templateUrl: './new-plan-modal.component.html',
  styleUrls: ['./new-plan-modal.component.scss'],
})
export class NewPlanModalComponent implements OnInit, AfterViewInit {
  @ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;
  recurrencePlanFormGroup: FormGroup;
  intervals: Interval[] = [];
  loading = false;
  billetFee = 0;
  isEditMode = false;
  savedPlan = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public plan: IRecurrencePlan,
    private dialogRef: MatDialogRef<NewPlanModalComponent>,
    private formBuilder: FormBuilder,
    private service: RecurrenceManagementService,
    private toastr: ToastrService,
  ) {
    this.getIntervals();
    this.buildForm();
    this.getFees();
    if (plan) {
      this.buildEditForm();
      this.isEditMode = true;
    }
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {

    this.stepper._getIndicatorType = () => 'number';

  }

  buildForm(): void {
    this.recurrencePlanFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      interval: ['', Validators.required],
      amount: [
        '',
        [
          Validators.required,
          Validators.min(10),
          Validators.pattern(currencyRegex),
        ],
      ],
      active: [true, Validators.required],
    });
  }

  buildEditForm(): void {
    const { name, interval, description, amount } = this.plan;
    this.recurrencePlanFormGroup.patchValue({
      name,
      interval,
      description,
      amount: amount / 100,
    });
    this.recurrencePlanFormGroup.controls['name'].disable();
    this.recurrencePlanFormGroup.controls['description'].disable();
    this.recurrencePlanFormGroup.controls['interval'].disable();
  }

  getIntervals(): void {
    this.service
      .getIntervals()
      .then((INTERVALS) => (this.intervals = INTERVALS));
  }

  savePlan(): void {
    if (this.isEditMode) {
      this.saveEditPlan();
    } else {
      this.createPlan();
    }
  }

  createPlan(): void {
    this.loading = true;
    this.dialogRef.disableClose = true;
    const data = Object.assign({}, this.recurrencePlanFormGroup.value);
    data.amount = (Math.round(Number(this.recurrencePlanFormGroup.value.amount) * 100)).toFixed(2);
    this.service.createPlan(data).subscribe(
      response => {
        this.savedPlan = true;
        this.stepper.next();
      },
      error => this.toastr.error('Houve um erro inesperado, tente novamente mais tarde.'),
    ).add(() => {
      this.loading = false;
      this.dialogRef.disableClose = false;
    });
  }

  saveEditPlan(): void {
    this.loading = true;
    this.dialogRef.disableClose = true;
    const data = { amount: (Math.round(Number(this.recurrencePlanFormGroup.value.amount) * 100)).toFixed(2) };
    this.service.updateAmountPlan(this.plan.id, data).subscribe(
      response => {
        this.savedPlan = true;
        this.stepper.next();
      },
      (error) => this.toastr.error('Falha ao atualizar valor do plano!'),
    ).add(() => this.loading = false)
      .add(() => this.dialogRef.disableClose = false);
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

  getInterval(): string {
    if (this.intervals.length > 0 && this.recurrencePlanFormGroup.value.interval) {
      return this.intervals.filter(
        (i: Interval) => i.id === this.recurrencePlanFormGroup.value.interval
      )[0].label;
    } else {
      return '';
    }
  }

  isAmountsEqual(): boolean {
    return this.recurrencePlanFormGroup.value.amount === this.plan.amount;
  }

}
