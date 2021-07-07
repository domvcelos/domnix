import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';

import { NgxCurrencyModule } from 'ngx-currency';
import { IConfig } from 'ngx-mask';

import { CollectionManagementComponent } from './collection-management.component';
import { CollectionManagementRoutingModule } from './collection-management-routing.module';
import { ApplicationPipesModule } from 'src/app/pipes/application-pipes.module';
import { CollectionInfoModalComponent } from './components/collection-info-modal/collection-info-modal.component';
import { CollectionResendModalComponent } from './components/collection-resend-modal/collection-resend-modal.component';
import { CollectionCancelModalComponent } from './components/collection-cancel-modal/collection-cancel-modal.component';
import { JsPdfHelper } from 'src/app/common/jsPdf.helper';
import { PaymentMethodPipe } from 'src/app/pipes/payment-method/payment-method.pipe';
import { CustomValidators } from 'src/app/common/custom-validators';
import { CpfCnpjPipe } from 'src/app/pipes/cpfCnpj/cpf-cnpj.pipe';


export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

@NgModule({
  imports: [
    CollectionManagementRoutingModule,
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
  exports: [],
  declarations: [
    CollectionManagementComponent,
    CollectionInfoModalComponent,
    CollectionResendModalComponent,
    CollectionCancelModalComponent,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    JsPdfHelper,
    CurrencyPipe,
    CpfCnpjPipe,
    PaymentMethodPipe,
    CustomValidators
  ],
})
export class CollectionManagementModule { }
