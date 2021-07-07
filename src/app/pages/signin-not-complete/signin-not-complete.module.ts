import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';


import { SigninNotCompleteRoutingModule } from './signin-not-complete-routing.module';
import { SigninNotCompleteComponent } from './signin-not-complete.component';


@NgModule({
  imports: [
    CommonModule,
    SigninNotCompleteRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  declarations: [
    SigninNotCompleteComponent,
  ],
})
export class SigninNotCompleteModule { }
