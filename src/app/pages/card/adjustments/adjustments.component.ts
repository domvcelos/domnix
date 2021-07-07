import { Component, OnInit } from '@angular/core';
import { CardService } from '../shared/card.service';

@Component({
  selector: 'app-adjustments',
  templateUrl: './adjustments.component.html',
})
export class AdjustmentsComponent implements OnInit {
  url = '';
  constructor(private cardService: CardService) {}

  ngOnInit(): void {
    this.url = this.cardService.generateUrl('adjustments');
  }
}
