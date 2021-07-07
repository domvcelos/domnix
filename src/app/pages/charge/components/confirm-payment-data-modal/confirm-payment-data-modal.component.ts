import { Component, EventEmitter, OnInit } from '@angular/core';

import { ICheckoutOrder } from '../../shared/charge.model';
import { ChargeService } from '../../shared/charge.service';


@Component({
  selector: 'app-confirm-payment-data-modal',
  templateUrl: './confirm-payment-data-modal.component.html',
  styleUrls: ['./confirm-payment-data-modal.component.scss'],
})
export class ConfirmPaymentDataModalComponent implements OnInit {

  checkOutOrder!: ICheckoutOrder;
  loading = false;
  onChargeClick = new EventEmitter();

  constructor(
    private chargeService: ChargeService
  ) {
    this.checkOutOrder = this.chargeService.getCheckOrder();
  }

  ngOnInit(): void { }

  onButtonClick(): void {
    this.onChargeClick.emit();
  }

  getDiscount(): string {
    let discount = 0;
    if (this.checkOutOrder.discount_type === 'percent') {
      discount = (this.checkOutOrder.discount || 0) * ((this.checkOutOrder.amount || 0) / 100);
    } else {
      discount = this.checkOutOrder.discount || 0;
    }
    return discount.toString();
  }

  getTax(type?: string): string {
    if (type === 'BILLET' || this.checkOutOrder.transaction_type === 'BILLET' || this.checkOutOrder.transaction_type === 'payment_book') {
      return this.checkOutOrder.billetFee.toString();
    } else if (type === 'CREDIT_CARD' || this.checkOutOrder.transaction_type === 'CREDIT_CARD') {
      return ((this.checkOutOrder.creditCardFee || 0) * (Number(this.getTotalToPay()) / 100)).toString();
    } else {
      return '0';
    }
  }

  getTotalToPay(): string {
    return (((this.checkOutOrder.amount || 0) + this.checkOutOrder.shipping) - Number(this.getDiscount())).toString();
  }

  getTotalToReceive(type?: string): string {
    if (this.checkOutOrder.transaction_type === 'payment_book') {
      return (Number(this.getTotalToPay()) - (Number(this.checkOutOrder.numberOfBills) * Number(this.getTax()))).toString();
    } else {
      return (Number(this.getTotalToPay()) - Number(this.getTax(type))).toString();
    }
  }

  getBillValue(): string {
    if (this.checkOutOrder.transaction_type === 'payment_book') {
      return (Number(this.getTotalToPay()) / this.checkOutOrder.numberOfBills).toString();
    } else {
      return this.getTotalToPay();
    }
  }

}
