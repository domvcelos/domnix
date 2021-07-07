import { Injectable } from '@angular/core';
import { StorageService } from 'src/app/common/services/storage/storage.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  baseUrl = '';
  public url = '';
  constructor(private storage: StorageService) {
    this.baseUrl = environment.APIs.VIRTUAL_ACCOUNT_CARD;
  }

  generateUrl(path: string): string {
    return (
      this.baseUrl +
      path +
      '/' +
      this.storage.currentUser.access_token +
      '/' +
      this.storage.currentUser.refresh_token +
      '/' +
      this.storage.currentUser.user_info.id +
      '/' +
      this.storage.currentUser.user_info.name +
      '/' +
      this.storage.currentUser.user_info.email +
      '/' +
      this.storage.currentUser.user_info.attributes.socialNumber[0] +
      '/' +
      this.storage.currentUser.user_info.enabled +
      '/' +
      this.storage.currentUser.user_info.attributes.phone[0] +
      '/' +
      this.storage.nexxCardActived +
      '/' +
      this.storage.nexxCardClient +
      '/' +
      this.storage.nexxCardGroupId
    );
  }
}
