import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatStepperModule } from '@angular/material/stepper';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ToastrModule } from 'ngx-toastr';

import { RecurrenceManagementComponent } from './recurrence-management.component';
import { RecurrenceManagementRoutingModule } from './recurrence-management-routing.module';
import { RecurrencePlanModule } from './components/recurrence-plan/recurrence-plan.module';
import { RecurrenceListModule } from './components/recurrence-list/recurrence-list.module';
import { RecurrenceInfoModalComponent } from './components/recurrence-info-modal/recurrence-info-modal.component';
import { ApplicationPipesModule } from 'src/app/pipes/application-pipes.module';
import { RecurrenceConfirmModalComponent } from './components/recurrence-confirm-modal/recurrence-confirm-modal.component';
import { RecurrenceEditModalComponent } from './components/recurrence-edit-modal/recurrence-edit-modal.component';


@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressAnimation: 'decreasing',
      progressBar: true,
      closeButton: true,
    }), // ToastrModule added
    RecurrenceManagementRoutingModule,
    HttpClientModule,
    MatTabsModule,
    MatDialogModule,
    RecurrencePlanModule,
    RecurrenceListModule,
    ApplicationPipesModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatStepperModule,
    MatProgressSpinnerModule,
  ],
  declarations: [
    RecurrenceManagementComponent,
    RecurrenceInfoModalComponent,
    RecurrenceConfirmModalComponent,
    RecurrenceEditModalComponent,
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }],
})
export class RecurrenceManagementModule { }
