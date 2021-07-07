export interface ICollection {
  id: string;
  amount_values: AmountValue;
  paid_installments: string | null;
  created: string;
  modified: string;
  payer_social_number: string;
  payer_name: string;
  origin: string;
  transaction_type: string;
  amount: string;
  final_amount: string;
  due_date: string;
  status: string;
  response: CollectionResponse | null;
  company: string;
}
interface AmountValue {
  discount: number;
  shipping?: number;
  amount: number;
  final_amount: number;
}
export interface DataCollection {
  count: number;
  limit: number;
  offset: number;
  results: ICollection[];
}

interface CollectionResponse {
  payment: CollectionResponsePayment;
  merchantOrderId: string;
}

interface CollectionResponsePayment {
  amount: number;
  boleto: IBillet;
  customer: ICustomer;
  received: any[];
  paymentToken: string;
  paymentStatus: number;
}

export interface IBillet {
  amount: number;
  boletoNumber: string;
  digitableLine: string;
  expirationDate: string;
  boletoInstruction: any[];
}
export interface ICustomer {
  name: string;
  email: string;
  address: ICustomerAddress;
  identity: string;
  identityType: string;
}
export interface ICustomerAddress {
  country: string;
  zipCode: string;
  street: string;
  city: string;
  state: string;
  neighborhood: string;
  number: string;
  complement: string;
}
export interface IStatusCollection {
  type: string;
  label: string;
}

export interface ICollectionType {
  type: string;
  label: string;
}

export interface IFilter {
  offset: number;
  limit: number;
  start_date_created?: string;
  end_date_created?: string;
  start_due_date?: string;
  end_due_date?: string;
  charge_id?: string;
  payer_name?: string;
  payer_social_number?: string;
  transaction_type?: string;
  status?: string;
  amount?: string;
  ordering?: string;
}

export interface ICollectionResend {
  transaction_type: string;
}
