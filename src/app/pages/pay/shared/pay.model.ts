export interface IPay {
  bank_code: number | null;
  bank_name: string | null;
  due_date: string | null;
  amount: number;
}
export interface IPayBillet {
  billetDetails: IBarcodeValidate;
  digitable_line: string;
  digitable_line_masked: string;
}
export interface IBrand {
  name: string;
  value: string;
  logo: string;
  color: string;
}
export interface IBrandColorAndLogo {
  logo: string;
  color: string;
}

export interface IDefaultColorAndBrand {
  brand: string;
  color: string;
}
export interface ICard {
  number: number;
  name: string;
  documentValue: string;
  expDate: string;
  cvv: number;
  brand: string;
}
export interface IDigitalAccount {
  id: string;
  account_type: 'DIGITAL_ACCOUNT';
  name: string;
  unit: 'BRL';
  email: string;
  phone: number;
  created_at: string;
  updated_at: string;
  client_id: string;
  customer_id: number;
  limit: number;
  initial_balance: number;
  balance: number;
  predicted_balance: number;
  status: string;
  account_check_digit: number;
  account_number: number;
  bank_number: number;
  branch_number: number;
}
export interface DataDigitalAccount {
  offset: number;
  limit: number;
  count: number;
  results: IDigitalAccount[];
}
export interface IPayStatusListSelect {
  status_type: 'PENDING' | 'PAYED' | 'CHARGEBACK' | 'EXTERNAL_REJECTION';
  label:
  | 'Pendente'
  | 'Pago'
  | 'Estornada'
  | 'Não aceito';
}

export interface IPayListSelect {
  payment_type: 'CREDIT_CARD' | 'NIX' | 'CREDIT_CARD_NIX' | 'MULTI';
  label:
  | 'Cartão de Crédito'
  | 'Conta Nix'
  | 'Conta Nix + Cartão de Crédito'
  | 'Saldo Nix + Crédito';
}

export interface IPaymentCreditCardPayload {
  barcode: string;
  social_number: string;
  card: IPaymentCreditCard;
  origin: string;
}

export interface IPaymentCreditCardHolder {
  name: string;
  social_number: string;
}

export interface IPaymentCreditCard {
  number: string;
  security_code: string;
  expiration_date: IPaymentCreditCardExpirationDate;
  holder: IPaymentCreditCardHolder;
}

export interface IPaymentCreditCardExpirationDate {
  month: string;
  year: string;
}

export interface IPaymentNIXPayload {
  barcode: string;
  amount: string;
  due_date: string;
  app_name: string;
  origin: string;
  validation_id: string;
  description?: string;
}

export interface IPaymentMultiPayload {
  barcode: string;
  social_number: string;
  card: IPaymentCreditCard;
  origin: string;
  amount_nix: string;
}

export interface IBarcodeValidate {
  allowChangeAmount: boolean;
  amount: number;
  assignor: string;
  businessHours: {
    start: string;
    end: string;
  };
  end: string;
  start: string;
  charges: {
    interestAmountCalculated: number;
    fineAmountCalculated: number;
    discountAmount: number;
  };
  discountAmount: number;
  fineAmountCalculated: number;
  interestAmountCalculated: number;
  digitable: string;
  dueDate: string;
  id: string;
  maxAmount: number;
  minAmount: number;
  nextSettle: false;
  originalAmount: number;
  payer: string;
  recipient: string;
  settleDate: string;
}
