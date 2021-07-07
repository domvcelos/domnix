import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ICadunUser } from 'src/app/pages/login/shared/login.model';

export enum StorageTypes {
  CURRENT_USER = 'current_user',
  USER_ID = 'user_id',
  USER_NAME = 'user_name',
  USER_EMAIL = 'user_email',
  SOCIAL_NUMBER = 'social_number',
  PHONE = 'phone',
  TOKEN = 'token',
  REFRESH = 'refresh',
  ENABLED = 'enabled',
  SIGNUP_COMPLETED = 'signup_completed',
  CHECKOUT_LINK = 'checkout_item',
  CNPJ = 'cnpj',
  CADUN_COMPANY_ID = 'cadun_company_id',
  NIX_ACCOUNT_ID = 'nix-account-id',
  OFFICIAL_NAME = 'official_name',
  NIX_CORE_ID = 'nix-core-id',
  NEXXCARD_ACTIVED = 'nexxcard_actived',
  NEXXCARD_CLIENT = 'nexxcard_client',
  NEXXCARD_GROUP_ID = 'nexxcard_group_id',
  ACCOUNT_NUMBER = 'account_number',
  BRANCH = 'branch',
  MANAGER = 'manager',
  ERP = 'erp',
}

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  storageTypes = StorageTypes;

  constructor() { }

  get token(): string {
    const result = sessionStorage.getItem(this.storageTypes.TOKEN);
    if (result) {
      return result;
    }
    return '';
  }
  set token(token: string) {
    sessionStorage.setItem(this.storageTypes.TOKEN, token);
  }
  get refreshToken(): string {
    const result = sessionStorage.getItem(this.storageTypes.REFRESH);
    if (result) {
      return result;
    }
    return '';
  }
  set refreshToken(refreshToken: string) {
    sessionStorage.setItem(this.storageTypes.REFRESH, refreshToken);
  }
  get currentUser(): ICadunUser {
    const currentUserSubject = new BehaviorSubject<ICadunUser>(
      JSON.parse(sessionStorage.getItem(StorageTypes.CURRENT_USER)!)
    );
    return currentUserSubject.value;
  }
  set currentUser(user: ICadunUser) {
    sessionStorage.setItem(StorageTypes.CURRENT_USER, JSON.stringify(user));
  }

  get socialNumber(): string {
    const socialNumber = this.currentUser?.user_info.attributes.socialNumber[0];
    return socialNumber ? socialNumber : '';
  }

  get signUpStatus(): string {
    return sessionStorage.getItem(StorageTypes.SIGNUP_COMPLETED)!;
  }
  set signUpStatus(status: string) {
    sessionStorage.setItem(StorageTypes.SIGNUP_COMPLETED, status);
  }
  get nixAccountId(): string {
    return sessionStorage.getItem(StorageTypes.NIX_ACCOUNT_ID)!;
  }
  set nixAccountId(nixAccountId: string) {
    sessionStorage.setItem(StorageTypes.NIX_ACCOUNT_ID, nixAccountId);
  }
  get cnpjCompany(): string {
    const result = sessionStorage.getItem(this.storageTypes.CNPJ);
    if (result) {
      return result;
    }
    return '';
  }
  set cnpjCompany(cnpj: string) {
    sessionStorage.setItem(StorageTypes.CNPJ, cnpj);
  }
  get cadunPjIdCompany(): string {
    const result = sessionStorage.getItem(this.storageTypes.CADUN_COMPANY_ID);
    if (result) {
      return result;
    }
    return '';
  }
  set cadunPjIdCompany(cadunpjID: string) {
    sessionStorage.setItem(StorageTypes.CADUN_COMPANY_ID, cadunpjID);
  }
  get officialName(): string {
    const result = sessionStorage.getItem(this.storageTypes.OFFICIAL_NAME);
    if (result) {
      return result;
    }
    return '';
  }
  set officialName(officialName: string) {
    sessionStorage.setItem(StorageTypes.OFFICIAL_NAME, officialName);
  }

  get nixCoreID(): string {
    const result = sessionStorage.getItem(this.storageTypes.NIX_CORE_ID);
    if (result) {
      return result;
    }
    return '';
  }

  set nixCoreID(nixCoreID: string) {
    sessionStorage.setItem(StorageTypes.NIX_CORE_ID, nixCoreID);
  }
  get signupCompleted(): string {
    const result = sessionStorage.getItem(this.storageTypes.SIGNUP_COMPLETED);
    if (result) {
      return result;
    }
    return '';
  }

  set signupCompleted(status: string) {
    sessionStorage.setItem(StorageTypes.SIGNUP_COMPLETED, status);
  }
  get checkoutLink(): string {
    const result = sessionStorage.getItem(this.storageTypes.CHECKOUT_LINK);
    if (result) {
      return result;
    }
    return '';
  }
  set checkoutLink(link: string) {
    sessionStorage.setItem(StorageTypes.CHECKOUT_LINK, link);
  }
  get nexxCardClient(): boolean {
    const result = sessionStorage.getItem(this.storageTypes.NEXXCARD_CLIENT);
    if (result) {
      return result === 'true';
    }
    return false;
  }
  set nexxCardClient(status: boolean) {
    sessionStorage.setItem(StorageTypes.NEXXCARD_CLIENT, String(status));
  }
  get nexxCardActived(): boolean {
    const result = sessionStorage.getItem(this.storageTypes.NEXXCARD_ACTIVED);
    if (result) {
      return result === 'true';
    }
    return false;
  }
  set nexxCardActived(status: boolean) {
    sessionStorage.setItem(StorageTypes.NEXXCARD_ACTIVED, String(status));
  }

  get nexxCardGroupId(): string {
    const result = sessionStorage.getItem(this.storageTypes.NEXXCARD_GROUP_ID);
    if (result) {
      return result;
    }
    return '';
  }
  set nexxCardGroupId(groupId: string) {
    sessionStorage.setItem(StorageTypes.NEXXCARD_GROUP_ID, groupId);
  }
  get accountNumber(): string {
    const result = sessionStorage.getItem(this.storageTypes.ACCOUNT_NUMBER);
    if (result) {
      return result.slice(0, (result.length - 1));
    }
    return '';
  }
  set accountNumber(accountNumber: string) {
    sessionStorage.setItem(this.storageTypes.ACCOUNT_NUMBER, accountNumber);
  }
  get accountNumberDigit(): string {
    const result = sessionStorage.getItem(this.storageTypes.ACCOUNT_NUMBER);
    if (result) {
      return result.charAt(result.length - 1);
    }
    return '';
  }
  get branch(): string {
    const result = sessionStorage.getItem(this.storageTypes.BRANCH);
    if (result) {
      return result;
    }
    return '';
  }
  set branch(branch: string) {
    sessionStorage.setItem(this.storageTypes.BRANCH, branch);
  }
  get manager(): boolean {
    const result = sessionStorage.getItem(this.storageTypes.MANAGER);
    if (result) {
      return result === 'true';
    }
    return false;
  }
  set manager(manager: boolean) {
    sessionStorage.setItem(this.storageTypes.MANAGER, String(manager));
  }
  get erp(): string {
    const result = sessionStorage.getItem(this.storageTypes.ERP);
    if (result) {
      return result;
    }
    return '';
  }
  set erp(cnpj: string) {
    sessionStorage.setItem(this.storageTypes.ERP, cnpj.replace(/\D/g, ''));
  }
  removeNexxCardGroupId(): void {
    sessionStorage.removeItem(StorageTypes.NEXXCARD_GROUP_ID);
  }
  sessionStorageClear(): void {
    sessionStorage.clear();
  }
}
