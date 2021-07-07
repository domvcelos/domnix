import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { ChargeService } from './charge.service';


describe('ChargeService', () => {
  let service: ChargeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
    });
    service = TestBed.inject(ChargeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#setPaymentCardData test', () => {
    it('should be populate variables', () => {
      service.setPaymentCardData(
        10,
        0,
        'percent',
        'card',
        'comentário',
        '2020-12-18',
        5,
        0,
        0,
      );
      expect(service.checkoutOrder.amount).toEqual(10);
      expect(service.checkoutOrder.discount).toEqual(0);
      expect(service.checkoutOrder.discount_type).toEqual('percent');
      expect(service.checkoutOrder.transaction_type).toEqual('card');
      expect(service.checkoutOrder.comments).toEqual('comentário');
      expect(service.checkoutOrder.due_date).toEqual('2020-12-18');
      expect(service.checkoutOrder.shipping).toEqual(5);
    });
  });
  describe('#setPaymentPaymentBookData test', () => {
    it('should be populate variables', () => {
      service.setPaymentPaymentBookData(
        15,
        5,
        'money',
        'payment_book',
        'comentário payment',
        '2020-12-18',
        5,
        0,
        0,
      );
      expect(service.checkoutOrder.amount).toEqual(15);
      expect(service.checkoutOrder.discount).toEqual(5);
      expect(service.checkoutOrder.discount_type).toEqual('money');
      expect(service.checkoutOrder.transaction_type).toEqual('payment_book');
      expect(service.checkoutOrder.comments).toEqual('comentário payment');
    });
  });
});
