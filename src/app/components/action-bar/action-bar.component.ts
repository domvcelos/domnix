import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/common/services/storage/storage.service';
import { IActionBar } from './shared/action-bar-model';
import { ActionBarService } from './shared/action-bar.service';

@Component({
  selector: 'app-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.scss'],
})
export class ActionBarComponent implements OnInit {
  path = '';
  isOpen = false;
  actionList: IActionBar[] = [];
  balance = 0;

  constructor(
    private router: Router,
    private storageService: StorageService,
    private actionBarService: ActionBarService
  ) {}

  ngOnInit(): void {
    this.path = this.router.url;
    this.actionBarService
      .getActionList()
      .then((ACTIONLIST) => (this.actionList = ACTIONLIST));
    this.getBalance();
  }

  getBalance(): void {
    this.actionBarService
      .getBalance()
      .subscribe(
        (response) => (this.balance = response.balance.available.amount)
      );
  }

  navigateTo(path: string): void {
    this.router.navigateByUrl(path);
  }

  hideBalance(): void {
    this.isOpen = !this.isOpen;
  }

  getUserName(): string {
    return this.storageService.currentUser?.user_info.name || 'Usuário';
  }
}
