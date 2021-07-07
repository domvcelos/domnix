import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICollection } from '../../shared/collection-management.model';

@Component({
  selector: 'app-collection-info-modal',
  templateUrl: './collection-info-modal.component.html',
  styleUrls: ['./collection-info-modal.component.scss']
})
export class CollectionInfoModalComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public collection: ICollection) { }

  ngOnInit(): void {
  }

}
