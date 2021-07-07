import { Component } from '@angular/core';
import { StorageService } from 'src/app/common/services/storage/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  isOpen = false;

  constructor(private storageService: StorageService) {}

  hideBalance(): void {
    this.isOpen = !this.isOpen;
  }

  getUsername(): string {
    return this.storageService.officialName || 'Usuário';
  }
}
