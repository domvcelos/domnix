
export interface IActivity {
  id: number;
  code: number;
  name: string;
  businessActivity: string;
  subclass: string;
  description: string;
}

export interface ICreatedCompany {
  company: IUserCompany;
  checkout_url: string;
}
export interface IUserCompany {
  id: string;
  account_status: string;
  created: string;
  modified: string;
  cadun_user_id: string;
  cpf: string;
  cnpj: string;
  name: string;
  email: string;
  official_name: string;
  nix_account_id: string;
  cadun_pj_id: string;
  gateway_id: string;
  cashflow_created: boolean;
  error: any;
  data: IUserCompanyData;
  activated: boolean;
  checkout_link: any;
  channel: number;
}
export interface IUserCompanyData {
  cnpj: string;
  name: string;
  email: string;
  address: ICompanyAddress;
  user_id: string;
  bank_account: ICompanyBankAccount;
  channel_code: string;
  phone_number: string;
  official_name: string;
  social_number: string;
  corporate_name: string;
}
export interface ICompanyAddress {
  city: string;
  state: string;
  number: string;
  street: string;
  country?: string;
  zip_code: string;
  neighborhood: string;
  address_line_2?: string;
  complement?: string;
}
export interface ICompanyBankAccount {
  bank_number: number;
  account_type: string;
  account_digit: number;
  account_branch: number;
  account_number: number;
  account_branch_digit: number;
}

export interface ICompany {
  corporate_name: string;
  name: string;
  cnpj: string;
  social_number: string;
  official_name: string;
  activity_code: number;
  user_id: string;
  phone_number: string;
  email: string;
  state_registration?: string;
  address: ICompanyAddress;
  bank_account: ICompanyBankAccount;
  channel_code: string;
  entity: string;
}

export interface IUpdateCompanyPayload {
  name: string;
  official_name: string;
  state_registration?: string;
  address: ICompanyAddress;
  bank_account: ICompanyBankAccount;
}

export interface IUpdateCompanyResponse {
  name: string;
  official_name: string;
  state_registration: string;
}

export interface IChannelCodeResponse {
  activated: boolean;
  free: boolean;
  id: number;
  code: string;
  created: string;
  modified: string;
  name: string;
  plan_id: string;
}
