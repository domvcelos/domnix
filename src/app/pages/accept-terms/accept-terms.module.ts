import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { AcceptTermsComponent } from './accept-terms.component';
import { AcceptTermsRoutingModule } from './accept-terms-routing.module';

@NgModule({
  imports: [
    CommonModule,
    AcceptTermsRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  declarations: [
    AcceptTermsComponent,
  ],
})
export class AcceptTermsModule { }
