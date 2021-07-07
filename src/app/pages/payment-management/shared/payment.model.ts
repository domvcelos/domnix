export interface IPayment {
  id: string;
  created: string;
  modified: string;
  origin: string;
  transaction_type: 'CREDIT_CARD' | 'NIX' | 'MULTI';
  cardpay_transaction_id: string | null;
  motor_transaction_id: string | null;
  nix_account_transaction_id: null;
  barcode: number;
  payee_name: string | null;
  payee_social_number: string;
  amount: number;
  amount_nix: number;
  amount_credit_card: number;
  due_date: string;
  payment_date: string;
  status: string;
  brand_name: string | null;
  end_card_number: number;
  bank_name: string | null;
  bank_authentication: string | null;
  company: string;
}

export interface DataPayment {
  count: number;
  limit: number;
  offset: number;
  results: IPayment[];
}

export interface IPaymentsFilter {
  offset: number;
  limit: number;
  start_date_created?: string;
  end_date_created?: string;
  start_due_date?: string;
  end_due_date?: string;
  start_payment_date?: string;
  end_payment_date?: string;
  payment_id?: string;
  payee_name?: string;
  payee_social_number?: string;
  transaction_type?: string;
  status?: string;
  amount_min?: string;
  amount_max?: string;
  barcode?: string;
}
