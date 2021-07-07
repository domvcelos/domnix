import { Component, OnInit } from '@angular/core';
import { CardService } from '../shared/card.service';

@Component({
  selector: 'app-anticipations',
  templateUrl: './anticipations.component.html',
})
export class AnticipationsComponent implements OnInit {
  url = '';
  constructor(private cardService: CardService) {}

  ngOnInit(): void {
    this.url = this.cardService.generateUrl('anticipations');
  }
}
