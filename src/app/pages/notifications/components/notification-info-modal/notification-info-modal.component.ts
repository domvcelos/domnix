import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { INotification, INotificationTopicsListSelect } from '../../shared/notifications.model';
import { NotificationsService } from '../../shared/notifications.service';


@Component({
  selector: 'app-notification-info-modal',
  templateUrl: './notification-info-modal.component.html',
  styleUrls: ['./notification-info-modal.component.scss'],
})
export class NotificationInfoModalComponent implements OnInit {

  topicTypes: INotificationTopicsListSelect[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public notification: INotification,
    private service: NotificationsService,
  ) { }

  ngOnInit(): void {
    this.getNotificationListSelect();
  }

  getNotificationListSelect(): void {
    this.service.getTopicListSelect().then(
      (PAYMENTTRANSACTIONTYPES) =>
        (this.topicTypes = PAYMENTTRANSACTIONTYPES)
    );
  }

  translateCategory(category: string): string {
    const element = this.topicTypes.filter(item => item.topic_type === category)[0];
    return element.label;
  }

}
