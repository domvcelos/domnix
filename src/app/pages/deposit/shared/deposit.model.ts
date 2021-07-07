export interface IDepositResponse {
  alias: string;
  amount: string;
  authentication_code: string;
  company: string;
  created: string;
  due_date: string;
  id: string;
  modified: string;
  pdf_url: string;
  status: string;
}

export interface IDepositPayload {
  amount: string;
  dueDate: string;
  alias: string;
  emissionFee: boolean;
}
