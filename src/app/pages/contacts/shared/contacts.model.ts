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
  bank: ISubPeopleBank | null;
}
interface ISubPeopleBank {
  bank: string;
  agency: number;
  agency_cd?: number;
  account: number;
  account_cd: number;
  account_type: string;
}
export interface IPeople {
  id: string;
  user_id: string;
  name: string;
  document_type: string;
  document_value: number;
  official_name: string;
  state_registration: number;
  street: string;
  neighborhood: string;
  number: number;
  complement: string;
  zip_code: number;
  city: string;
  state: string;
  email: string;
  phone: number;
}
export interface IPerson {
  email: string;
  name: string;
  phone: string;
  document_type: string;
  document_value: string;
}
export interface IAddress {
  city: string;
  complement?: string;
  neighborhood: string;
  number: string;
  state: string;
  street: string;
  zip_code: string;
}
export interface IBank {
  account: string;
  account_cd: string;
  agency: string;
  agency_cd?: string;
  account_type?: string;
  bank: number;
}
export interface IContact {
  person: IPerson;
  address: IAddress;
  bank?: IBank;
  groups: string[];
}

export interface IContactUpdatePayload {
  email: string;
  name: string;
  phone: string;
  document_type: string;
  document_value: string;
  city: string;
  neighborhood: string;
  number: string;
  state: string;
  street: string;
  zip_code: string;
  complement?: string;
}
