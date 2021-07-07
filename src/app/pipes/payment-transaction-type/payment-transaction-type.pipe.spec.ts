import { PaymentTransactionTypePipe } from './payment-transaction-type.pipe';

describe('PaymentTransactionTypePipe', () => {
  it('create an instance', () => {
    const pipe = new PaymentTransactionTypePipe();
    expect(pipe).toBeTruthy();
  });
});
