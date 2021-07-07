export interface ICredentials {
  email: string;
  password: string;
}
export interface CardBlacklist {
  id: number;
  razaosocial: string;
  cnpj: string;
  is_ativo: boolean;
}

export interface ICompany {
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
  data: ICompanyData;
  activated: boolean;
  checkout_link: any;
  channel: number;
}

export interface ICompanyData {
  cnpj: string;
  name: string;
  email: string;
  address: ICompanyddress;
  user_id: string;
  bank_account: ICompanyBankAccount;
  channel_code: string;
  phone_number: string;
  official_name: string;
  social_number: string;
  corporate_name: string;
}
export interface ICompanyddress {
  city: string;
  state: string;
  number: string;
  street: string;
  country: string;
  zip_code: string;
  neighborhood: string;
  address_line_2: string;
}
export interface ICompanyBankAccount {
  bank_number: string;
  account_type: string;
  account_digit: string;
  account_branch: string;
  account_number: string;
  account_branch_digit: string;
}

export interface ICadunUser {
  access_token: string;
  expires_in: number;
  not_before_policy: number;
  refresh_expires_in: number;
  refresh_token: string;
  scope: string;
  session_state: string;
  token_type: string;
  user_info: ICadunUserInfo;
  permissions: ICadunUserPermission[];
}

export interface ICadunUserInfo {
  access: ICadunUserInfoAcess;
  attributes: ICadunUserInfoAttributes;
  createdTimestamp: number;
  disableableCredentialTypes: any;
  email: string;
  emailVerified: boolean;
  enabled: boolean;
  id: string;
  name: string;
  notBefore: number;
  requiredActions: any;
  totp: boolean;
  username: string;
}

export interface ICadunUserInfoAcess {
  impersonate: boolean;
  manage: boolean;
  manageGroupMembership: boolean;
  mapRoles: boolean;
  view: boolean;
}

export interface ICadunUserInfoAttributes {
  birthday: string[];
  phone: string[];
  socialNumber: string[];
}

export interface ICadunUserPermission {
  rsid: string;
  rsname: string;
  scope: string[];
}

export interface IUpdatePasswordPayload {
  old_password: string;
  new_password_1: string;
  new_password_2: string;
}

export interface ICadunUserValidatePassword {
  message: string;
  data?: any;
}

export interface IAccessToken {
  realm_access: {
    roles: string[];
  };
}
