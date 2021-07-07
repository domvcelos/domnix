import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/common/services/storage/storage.service';
import { IMenu } from './shared/sidebar.model';
import { SidebarService } from './shared/sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  menuList: IMenu[] = [];
  hasCardPage = false;
  constructor(
    private sideBarService: SidebarService,
    private router: Router,
    public storage: StorageService
  ) {}

  ngOnInit(): void {
    this.sideBarService
      .getMenuList()
      .then((menuList) => (this.menuList = menuList));
  }
  navigateTo(path: string): void {
    this.router.navigateByUrl(path);
  }
}
