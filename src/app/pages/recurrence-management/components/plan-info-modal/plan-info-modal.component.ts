import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Interval, IRecurrencePlan } from '../../shared/recurrence-management.model';
import { RecurrenceManagementService } from '../../shared/recurrence-management.service';


@Component({
  selector: 'app-plan-info-modal',
  templateUrl: './plan-info-modal.component.html',
  styleUrls: ['./plan-info-modal.component.scss'],
})
export class PlanInfoModalComponent implements OnInit {

  intervals: Interval[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public plan: IRecurrencePlan,
    private service: RecurrenceManagementService,
  ) {
    this.getIntervals();
  }

  ngOnInit(): void { }

  getInterval(interval: number): string {
    return this.intervals.filter(
      (i: Interval) => i.id === interval
    )[0]?.label;
  }

  getIntervals(): void {
    this.service
      .getIntervals()
      .then((INTERVALS) => (this.intervals = INTERVALS));
  }

}
