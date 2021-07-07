export interface ISubPeople {
  city: string;
  complement: string;
  document_type: string;
  document_value: string;
  email: string;
  id: string;
  name: string;
  neighborhood: string;
  number: string;
  phone: string;
  state: string;
  street: string;
  user_id: number | null;
  zip_code: string;
}

export interface ISubPeopleBankAccount {
  account: string;
  account_cd: string;
  account_type: string;
  agency: string;
  agency_account_cd: string;
  agency_cd: string;
  bank: number;
  id: string;
}
