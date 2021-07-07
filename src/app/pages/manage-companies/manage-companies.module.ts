import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';

import { ManageCompaniesRoutingModule } from './manage-companies-routing.module';
import { ManageCompaniesComponent } from './manage-companies.component';


@NgModule({
  declarations: [
    ManageCompaniesComponent,
  ],
  imports: [
    CommonModule,
    ManageCompaniesRoutingModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatProgressSpinnerModule,
  ]
})
export class ManageCompaniesModule { }
