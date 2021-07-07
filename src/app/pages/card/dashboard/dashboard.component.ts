import { Component, OnInit } from '@angular/core';
import { CardService } from '../shared/card.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  url = '';
  constructor(private cardService: CardService) {}

  ngOnInit(): void {
    this.url = this.cardService.generateUrl('dashboard');
  }
}
