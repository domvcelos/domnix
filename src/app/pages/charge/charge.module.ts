import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { NgxCurrencyModule } from 'ngx-currency';

import { ChargeComponent } from './charge.component';
import { ChargeRoutingModule } from './charge-routing.module';
import { ActionBarModule } from 'src/app/components/action-bar/action-bar.module';
import { CardFormModule } from './components/card-form/card-form.module';
import { PaymentBookModule } from './components/payment-book-form/payment-book-form.module';
import { ConfirmPaymentDataModalComponent } from './components/confirm-payment-data-modal/confirm-payment-data-modal.component';
import { NewContactModalModule } from 'src/app/components/new-contact-modal/new-contact-modal.module';
import { PixComponent } from './components/pix/pix.component';
import { ApplicationPipesModule } from 'src/app/pipes/application-pipes.module';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ChargeRoutingModule,
    ActionBarModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatStepperModule,
    NgxCurrencyModule,
    CardFormModule,
    PaymentBookModule,
    NewContactModalModule,
    MatProgressSpinnerModule,
    ApplicationPipesModule
  ],
  exports: [],
  declarations: [ChargeComponent, ConfirmPaymentDataModalComponent, PixComponent],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }],
})
export class ChargeModule { }
