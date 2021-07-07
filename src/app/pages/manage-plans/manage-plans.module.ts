import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

import { ManagePlansComponent } from './manage-plans.component';
import { ManagePlansRoutingModule } from './manage-plans-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApplicationPipesModule } from 'src/app/pipes/application-pipes.module';
import { PlanComponent } from './components/plan/plan.component';


@NgModule({
  declarations: [
    ManagePlansComponent,
  ],
  imports: [
    CommonModule,
    ManagePlansRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatTableModule,
    MatPaginatorModule,
    MatMenuModule,
    ApplicationPipesModule,
    MatSortModule,
  ]
})
export class ManagePlansModule { }
