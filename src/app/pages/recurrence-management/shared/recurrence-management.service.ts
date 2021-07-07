import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { INTERVALS, RECURRENCE, RECURRENCEPAYMENTTYPES, RECURRENCEPLANS, STATUSRECURRENCE } from './mock-recurrence-management';
import {
  DataRecurrence, IEditSubscriptionRecurrence, Interval, IPaymentType, IRecurrence, IRecurrencePlan,
  IStatusPlanRecurrence, IStatusRecurrence
} from './recurrence-management.model';


@Injectable({
  providedIn: 'root',
})
export class RecurrenceManagementService {
  visible = false;
  private apiGateway: string;

  constructor(
    private httpClient: HttpClient,
  ) {
   this.apiGateway = environment.APIs.GATEWAY;
  }

  getPlans(): Observable<IRecurrencePlan[]> {
    return this.httpClient.get<any>(`${this.apiGateway}/nix/plans`).pipe(take(1));
  }

  exportPlans(): Observable<HttpResponse<Blob>> {
    return this.httpClient.get<Blob>(
      `${this.apiGateway}/nix/plans/export`, { responseType: 'blob' as 'json', observe: 'response' }
    ).pipe(take(1));
  }

  createPlan(data: any): Observable<any> {
    return this.httpClient.post<any>(`${this.apiGateway}/nix/plans`, data).pipe(take(1));
  }

  updateAmountPlan(id: any, data: any): Observable<any> {
    return this.httpClient.put<any>(`${this.apiGateway}/nix/plans/${id}/amount`, data).pipe(take(1));
  }

  getFees(): Observable<any> {
    return this.httpClient.get<any>(`${this.apiGateway}/nix/fees`).pipe(take(1));
  }

  getSubscriptions(params: any): Observable<DataRecurrence> {
    return this.httpClient.get<DataRecurrence>(`${this.apiGateway}/nix/plans/recurrences`, { params }).pipe(take(1));
  }

  exportSubscriptions(): Observable<HttpResponse<Blob>> {
    return this.httpClient.get<Blob>(
      `${this.apiGateway}/nix/plans/recurrences/export`, { responseType: 'blob' as 'json', observe: 'response' }
    ).pipe(take(1));
  }

  createSubscription(planID: string, data: any): Observable<any> {
    return this.httpClient.post<any>(`${this.apiGateway}/nix/plans/${planID}/recurrences`, data).pipe(take(1));
  }

  updateStatusPlan(code: string, params: IStatusPlanRecurrence): Observable<IRecurrencePlan> {
    return this.httpClient.put<IRecurrencePlan>(`${this.apiGateway}/nix/plans/${code}/status`, params).pipe(take(1));
  }

  deactivateSubscription(subscriptionID: string): Observable<any> {
    return this.httpClient.put<any>(`${this.apiGateway}/nix/plans/recurrences/${subscriptionID}/deactivate`, null).pipe(take(1));
  }

  putSubscription(subscriptionID: string, params: IEditSubscriptionRecurrence): Observable<any> {
    return this.httpClient.put<any>(`${this.apiGateway}/nix/plans/recurrences/${subscriptionID}`, params).pipe(take(1));
  }

  getRecurrencePlans(): Promise<IRecurrencePlan[]> {
    return Promise.resolve(RECURRENCEPLANS);
  }

  getRecurrences(): Promise<IRecurrence[]> {
    return Promise.resolve(RECURRENCE);
  }
  getIntervals(): Promise<Interval[]> {
    return Promise.resolve(INTERVALS);
  }
  getPaymentTypes(): Promise<IPaymentType[]> {
    return Promise.resolve(RECURRENCEPAYMENTTYPES);
  }
  getStatusRecurrence(): Promise<IStatusRecurrence[]> {
    return Promise.resolve(STATUSRECURRENCE);
  }
  showAutocomplete(): void {
    this.visible = true;
  }
  showOffAutocomplete(): void {
    this.visible = false;
  }

}
