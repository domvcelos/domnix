import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { IPayment } from '../../shared/payment.model';


@Component({
  selector: 'app-payment-details-modal',
  templateUrl: './payment-details-modal.component.html',
  styleUrls: ['./payment-details-modal.component.scss'],
})
export class PaymentDetailsModalComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public payment: IPayment) { }

  ngOnInit(): void { }

}
