import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/common/services/authentication/auth-guard';
import { SignUpStatus } from 'src/app/common/utils';
import { MainLayoutComponent } from 'src/app/layout/main-layout/main-layout.component';
import { AdjustmentsComponent } from './adjustments/adjustments.component';
import { AnticipationsComponent } from './anticipations/anticipations.component';
import { CreditsComponent } from './credits/credits.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FinancialForecastComponent } from './financial-forecast/financial-forecast.component';
import { RatesComponent } from './rates/rates.component';
import { SalesComponent } from './sales/sales.component';
import { SelfHiringComponent } from './self-hiring/self-hiring.component';

const routes: Routes = [
  {
    path: 'card',
    component: MainLayoutComponent,
    children: [
      {
        path: 'self-hiring',
        component: SelfHiringComponent,
        canActivate: [AuthGuard],
        data: { roles: [SignUpStatus.active] },
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        data: { roles: [SignUpStatus.active] },
      },
      {
        path: 'sales',
        component: SalesComponent,
        canActivate: [AuthGuard],
        data: { roles: [SignUpStatus.active] },
      },
      {
        path: 'financial-forecast',
        component: FinancialForecastComponent,
        canActivate: [AuthGuard],
        data: { roles: [SignUpStatus.active] },
      },
      {
        path: 'credits',
        component: CreditsComponent,
        canActivate: [AuthGuard],
        data: { roles: [SignUpStatus.active] },
      },
      {
        path: 'adjustments',
        component: AdjustmentsComponent,
        canActivate: [AuthGuard],
        data: { roles: [SignUpStatus.active] },
      },
      {
        path: 'anticipations',
        component: AnticipationsComponent,
        canActivate: [AuthGuard],
        data: { roles: [SignUpStatus.active] },
      },
      {
        path: 'rates',
        component: RatesComponent,
        canActivate: [AuthGuard],
        data: { roles: [SignUpStatus.active] },
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CardRoutingModule {}
