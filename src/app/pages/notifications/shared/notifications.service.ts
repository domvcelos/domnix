import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { NOTIFICATIONSTATUSTYPES, NOTIFICATIONTOPICSTYPES } from './mock-notifications';
import { IConfigNotificationResponse, INotificationResponse, INotificationStatusListSelect, INotificationTopicsListSelect } from './notifications.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private apiGateway: string;

  constructor(
    private httpClient: HttpClient,
  ) {
    this.apiGateway = environment.APIs.GATEWAY;
  }

  getPaymentStatusListSelect(): Promise<INotificationStatusListSelect[]> {
    return Promise.resolve(NOTIFICATIONSTATUSTYPES);
  }

  getTopicListSelect(): Promise<INotificationTopicsListSelect[]> {
    return Promise.resolve(NOTIFICATIONTOPICSTYPES);
  }

  readAllNotifications(): Observable<any> {
    return this.httpClient.patch<any>(`${this.apiGateway}/nix/notifications/read-all`, { read: true, origin: 1 }).pipe(take(1));
  }

  readNotification(id: string): Observable<any> {
    return this.httpClient.patch<any>(`${this.apiGateway}/nix/notifications/${id}`, { read: true, origin: 1 });
  }

  getNotifications(notificationRead: string): Observable<INotificationResponse> {
    const params = {
      read: notificationRead,
      origin: '1',
      ordering: '-created',
    };
    return this.httpClient.get<INotificationResponse>(`${this.apiGateway}/nix/notifications`, { params }).pipe(take(1));
  }

  getAllNotifications(params: any): Observable<INotificationResponse> {
    params.origin = '1';
    return this.httpClient.get<INotificationResponse>(`${this.apiGateway}/nix/notifications`, { params }).pipe(take(1));
  }

  getConfigNotifications(): Observable<IConfigNotificationResponse> {
    return this.httpClient.get<IConfigNotificationResponse>(`${this.apiGateway}/nix/notifications/configs`).pipe(take(1));
  }

  updateConfigNotifications(params: any): Observable<any> {
    return this.httpClient.put<any>(`${this.apiGateway}/nix/notifications/configs`, params).pipe(take(1));
  }

}
