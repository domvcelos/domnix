import { NgModule } from '@angular/core';

import { IntervalPipe } from './interval/interval.pipe';
import { StatusPlanPipe } from './statusPlan/statusPlan.pipe';
import { StatusRecurrencePipe } from './statusRecurrence/status-recurrence.pipe';
import { PaymentMethodPipe } from './payment-method/payment-method.pipe';
import { StatusCollectionPipe } from './statusCollection/status-collection.pipe';
import { CreditCardPipe } from './credit-card/credit-card.pipe';
import { PaymentTransactionTypePipe } from './payment-transaction-type/payment-transaction-type.pipe';
import { StatusPaymentColorfulPipe } from './statusPaymentColorful/status-collection.pipe';
import { StatusPaymentPipe } from './statusPayment/status-collection.pipe';
import { StatePipe } from './state/state.pipe';
import { SafeUrlPipe } from './safeUrl/safe-url.pipe';
import { AmountColorPipe } from './amountColor/amount-color.pipe';
import { TransactionTypesPipe } from './transaction-types/transaction-types.pipe';
import { CpfCnpjPipe } from './cpfCnpj/cpf-cnpj.pipe';


@NgModule({
  declarations: [
    StatusPlanPipe,
    StatusRecurrencePipe,
    IntervalPipe,
    PaymentMethodPipe,
    CpfCnpjPipe,
    StatusCollectionPipe,
    StatusPaymentColorfulPipe,
    StatusPaymentPipe,
    CreditCardPipe,
    PaymentTransactionTypePipe,
    StatePipe,
    SafeUrlPipe,
    AmountColorPipe,
    TransactionTypesPipe,
  ],
  exports: [
    StatusPlanPipe,
    StatusRecurrencePipe,
    IntervalPipe,
    PaymentMethodPipe,
    CpfCnpjPipe,
    StatusCollectionPipe,
    StatusPaymentColorfulPipe,
    StatusPaymentPipe,
    CreditCardPipe,
    PaymentTransactionTypePipe,
    StatePipe,
    SafeUrlPipe,
    AmountColorPipe,
    TransactionTypesPipe,
  ],
})
export class ApplicationPipesModule { }
