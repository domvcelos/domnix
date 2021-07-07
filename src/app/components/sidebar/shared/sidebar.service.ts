import { Injectable } from '@angular/core';
import { MENULIST } from './mock-sidebar';
import { IMenu } from './sidebar.model';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  constructor() {}

  getMenuList(): Promise<IMenu[]> {
    return Promise.resolve(MENULIST);
  }
}
