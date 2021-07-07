import { Component, OnInit } from '@angular/core';
import { CardService } from '../shared/card.service';

@Component({
  selector: 'app-financial-forecast',
  templateUrl: './financial-forecast.component.html',
})
export class FinancialForecastComponent implements OnInit {
  url = '';
  constructor(private cardService: CardService) {}

  ngOnInit(): void {
    this.url = this.cardService.generateUrl('financial-forecast');
  }
}
