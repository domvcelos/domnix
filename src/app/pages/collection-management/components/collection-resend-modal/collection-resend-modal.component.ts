import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';

import { ToastrService } from 'ngx-toastr';

import { ICollection } from '../../shared/collection-management.model';
import { CollectionManagementService } from '../../shared/collection-management.service';


@Component({
  selector: 'app-collection-resend-modal',
  templateUrl: './collection-resend-modal.component.html',
  styleUrls: ['./collection-resend-modal.component.scss'],
})
export class CollectionResendModalComponent implements OnInit, AfterViewInit {
  @ViewChild('stepper') private stepper: MatStepper;
  loading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public collection: ICollection,
    private dialogRef: MatDialogRef<CollectionResendModalComponent>,
    private service: CollectionManagementService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.stepper._getIndicatorType = () => 'number';
  }

  resendCollection(collection: ICollection): void {
    this.loading = true;
    this.dialogRef.disableClose = true;
    this.service.resendCollection(collection.id, { transaction_type: collection.transaction_type }).subscribe(
      response => this.stepper.next(),
      error => this.toastr.error('Cobrança não pode ser reenviada. Tente novamente mais tarde.'),
    ).add(() => this.loading = false);
  }
}
