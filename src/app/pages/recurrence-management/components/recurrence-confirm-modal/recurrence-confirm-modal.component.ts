import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';

import { ToastrService } from 'ngx-toastr';

import { Utils } from 'src/app/common/utils';
import { ISubPeople } from 'src/app/pages/contacts/shared/contacts.model';
import { IRecurrencePlan } from '../../shared/recurrence-management.model';
import { RecurrenceManagementService } from '../../shared/recurrence-management.service';

interface DialogData {
  people: ISubPeople;
  plan: IRecurrencePlan;
  fee: number;
  totalToReceive: number;
  paymentType: string;
  initialDate: Date;
  finalDate: Date;
  comments: string;
}

@Component({
  selector: 'app-recurrence-confirm-modal',
  templateUrl: './recurrence-confirm-modal.component.html',
  styleUrls: ['./recurrence-confirm-modal.component.scss'],
})
export class RecurrenceConfirmModalComponent implements OnInit, AfterViewInit {
  @ViewChild('stepper') private stepper!: MatStepper;
  contactSaved = true;
  loading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<RecurrenceConfirmModalComponent>,
    private service: RecurrenceManagementService,
    private toastr: ToastrService,
    private utils: Utils
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.stepper) {
      this.stepper._getIndicatorType = () => 'number';
    }
  }

  saveSubscription(): void {
    this.loading = true;
    this.dialogRef.disableClose = true;
    this.service
      .createSubscription(this.data.plan.id, this.getPayload())
      .subscribe(
        (response) => this.stepper.next(),
        (error) => this.toastr.error('Falha ao criar adesão de recorrência')
      )
      .add(() => {
        this.loading = false;
        this.dialogRef.disableClose = false;
      });
  }

  getPayload(): any {
    const data: any = {
      plan_name: this.data.plan.name,
      plan_interval: this.data.plan.interval,
      plan_amount: this.data.plan.amount,
      start_date: this.utils.dateToStringUSA(this.data.initialDate),
      customer_name: this.data.people.name,
      customer_identity: this.data.people.document_value,
      customer_email: this.data.people.email,
      payment_type: this.data.paymentType,
    };
    if (this.data.finalDate) {
      data['end_date'] = this.utils.dateToStringUSA(this.data.finalDate);
    }
    if (this.data.comments) {
      data['comments'] = this.data.comments;
    }
    return data;
  }
}
