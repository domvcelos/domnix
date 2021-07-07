import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { NgxCurrencyModule } from 'ngx-currency';

import { MatPaginatorI18nService } from 'src/app/common/mat-paginator-i18n/mat-paginator-i18n.service';
import { ApplicationPipesModule } from 'src/app/pipes/application-pipes.module';
import { PlanInfoModalComponent } from '../plan-info-modal/plan-info-modal.component';
import { NewPlanModalComponent } from '../new-plan-modal/new-plan-modal.component';
import { RecurrencePlanComponent } from './recurrence-plan.component';


@NgModule({
  imports: [
    CommonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    NgxCurrencyModule,
    MatMenuModule,
    MatCheckboxModule,
    MatStepperModule,
    ApplicationPipesModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
  ],
  exports: [RecurrencePlanComponent],
  declarations: [
    RecurrencePlanComponent,
    PlanInfoModalComponent,
    NewPlanModalComponent,
  ],
  providers: [
    { provide: MatPaginatorIntl, useValue: MatPaginatorI18nService() }, // Here
  ],
})
export class RecurrencePlanModule { }
