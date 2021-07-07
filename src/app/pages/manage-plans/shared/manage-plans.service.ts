import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { StorageService } from 'src/app/common/services/storage/storage.service';
import { environment } from 'src/environments/environment';
import { IChannelCreateResponse, IChannelGetResponse, IChannelPayload, IFeeClientResponse, IPlan, IPlanPayload, IPlanResponse } from './plan.model';


@Injectable({
  providedIn: 'root'
})
export class ManagePlansService {

  apiGateway: string;
  apiGatewayQA: string;
  selectedPlan: IPlan;

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
  ) {
    this.apiGateway = environment.APIs.GATEWAY;
    this.apiGatewayQA = environment.APIs.NIXFEEQA;
  }

  getMyCompanies(): Observable<any> {
    const params: any = {
      partner_document_number: this.storageService.erp,
    };
    return this.httpClient.get<any>(`${this.apiGateway}/nix/companies-sa-ltda/by-erp`, { params }).pipe(take(1));
  }

  getChannel(planID: string): Observable<IChannelGetResponse> {
    const params: any = {
      fee_plan_id: planID
    };
    return this.httpClient.get<IChannelGetResponse>(`${this.apiGateway}/nix/erp-channel`, { params }).pipe(take(1));
  }

  createChannel(data: IChannelPayload): Observable<IChannelCreateResponse> {
    return this.httpClient.post<IChannelCreateResponse>(`${this.apiGateway}/nix/erp-channel`, data).pipe(take(1));
  }

  updateChannel(code: string, data: any): Observable<any> {
    return this.httpClient.put<any>(`${this.apiGateway}/nix/erp-channel/${code}`, data).pipe(take(1));
  }

  createPlan(data: IPlanPayload): Observable<IPlan> {
    return this.httpClient.post<IPlan>(`${this.apiGatewayQA}/nix-fee/v1/plan`, data).pipe(take(1));
  }

  updatePlan(plan: string, data: IPlanPayload): Observable<IPlan> {
    return this.httpClient.put<IPlan>(`${this.apiGatewayQA}/nix-fee//v1/plan/${plan}`, data).pipe(take(1));
  }

  getMyPlans(): Observable<IPlanResponse> {
    const params: any = {
      partner_document_number: this.storageService.erp,
    };
    return this.httpClient.get<IPlanResponse>(`${this.apiGatewayQA}/nix-fee/v1/plan`, { params }).pipe(take(1));
  }

  getDefaultPlan(): Observable<IPlanResponse> {
    const params: any = {
      partner_document_number: '18286449000123',
      plan_name: this.storageService.erp,
    };
    return this.httpClient.get<IPlanResponse>(`${this.apiGatewayQA}/nix-fee/v1/plan`, { params }).pipe(take(1));
  }

  getFees(): Observable<IFeeClientResponse> {
    return this.httpClient.get<IFeeClientResponse>(`${this.apiGatewayQA}/nix-fee/v1/fee-client`).pipe(take(1));
  }

}
