export interface IPaymanetMethod {
  name: string;
  value: string;
}

export interface ICheckoutOrder {
  creditCardFee: number;
  billetFee: number;
  origin: string;
  transaction_type: string;
  company_id: string;
  company_email: string;
  payer_account_id: string;
  payer_social_number: string;
  payer_name: string;
  payer_email: string;
  amount: number;
  numberOfBills: number;
  due_date: string;
  shipping: number;
  discount: number;
  discount_type: string;
  options: string;
  comments: string;
  payer_address: IAddress;
}

export interface IAddress {
  country: string;
  zip_code: string;
  street: string;
  city: string;
  state: string;
  neighborhood: string;
  number: string;
  complement: string;
}
