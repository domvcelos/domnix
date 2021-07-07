import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { NgxMaskModule } from 'ngx-mask';

import { RegisterCompanyRoutingModule } from './register-company-routing.module';
import { RegisterCompanyComponent } from './register-company.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CustomValidators } from 'src/app/common/custom-validators';


@NgModule({
  imports: [
    CommonModule,
    RegisterCompanyRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatStepperModule,
    MatSelectModule,
    MatAutocompleteModule,
    NgxMaskModule.forRoot(),
    MatProgressSpinnerModule
  ],
  declarations: [RegisterCompanyComponent],
  providers: [CustomValidators]
})
export class RegisterCompanyModule { }
