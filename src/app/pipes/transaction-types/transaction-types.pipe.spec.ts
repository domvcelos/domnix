import { TransactionTypesPipe } from './transaction-types.pipe';

describe('TransactionTypesPipe', () => {
  it('create an instance', () => {
    const pipe = new TransactionTypesPipe();
    expect(pipe).toBeTruthy();
  });
});
