import { Component, OnInit } from '@angular/core';
import { CardService } from '../shared/card.service';

@Component({
  selector: 'app-self-hiring',
  templateUrl: './self-hiring.component.html',
})
export class SelfHiringComponent implements OnInit {
  url = '';
  constructor(private cardService: CardService) {}

  ngOnInit(): void {
    this.url = this.cardService.generateUrl('self-hiring');
  }
}
