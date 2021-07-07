import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CardRoutingModule } from './card-routing.module';
import { ApplicationPipesModule } from 'src/app/pipes/application-pipes.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SalesComponent } from './sales/sales.component';
import { FinancialForecastComponent } from './financial-forecast/financial-forecast.component';
import { CreditsComponent } from './credits/credits.component';
import { AdjustmentsComponent } from './adjustments/adjustments.component';
import { RatesComponent } from './rates/rates.component';
import { AnticipationsComponent } from './anticipations/anticipations.component';
import { SelfHiringComponent } from './self-hiring/self-hiring.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    CardRoutingModule,
    ApplicationPipesModule,
  ],
  declarations: [
    DashboardComponent,
    SalesComponent,
    FinancialForecastComponent,
    CreditsComponent,
    AdjustmentsComponent,
    RatesComponent,
    AnticipationsComponent,
    SelfHiringComponent,
  ],
})
export class CardModule {}
