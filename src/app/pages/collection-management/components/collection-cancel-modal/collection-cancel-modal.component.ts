import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';

import { ToastrService } from 'ngx-toastr';

import { ICollection } from '../../shared/collection-management.model';
import { CollectionManagementService } from '../../shared/collection-management.service';


@Component({
  selector: 'app-collection-cancel-modal',
  templateUrl: './collection-cancel-modal.component.html',
  styleUrls: ['./collection-cancel-modal.component.scss'],
})
export class CollectionCancelModalComponent implements OnInit, AfterViewInit {
  @ViewChild('stepper') private stepper: MatStepper;
  loading = false;
  canceled = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public collection: ICollection,
    private service: CollectionManagementService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<CollectionCancelModalComponent>
  ) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.stepper._getIndicatorType = () => 'number';
  }

  cancelCollection(collection: ICollection): void {
    this.loading = true;
    this.dialogRef.disableClose = true;
    this.service.deleteCollection(collection.id).subscribe(
      response => {
        this.canceled = true;
        this.stepper.next();
      },
      error => this.toastr.error('Cobrança não pode ser cancelada.'),
    ).add(() => this.loading = false);
  }

}
