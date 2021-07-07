import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IRecurrence } from '../../shared/recurrence-management.model';

@Component({
  selector: 'app-recurrence-info-modal',
  templateUrl: './recurrence-info-modal.component.html',
  styleUrls: ['./recurrence-info-modal.component.scss']
})
export class RecurrenceInfoModalComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public recurrence: IRecurrence) { }

  ngOnInit(): void {
  }

}
