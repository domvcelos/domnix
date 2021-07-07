import { CommonModule, CurrencyPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';

import { NgxCurrencyModule } from 'ngx-currency';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { ClipboardModule } from 'ngx-clipboard';

import { JsPdfHelper } from 'src/app/common/jsPdf.helper';
import { ActionBarModule } from 'src/app/components/action-bar/action-bar.module';
import { ApplicationPipesModule } from 'src/app/pipes/application-pipes.module';
import { PaymentMethodPipe } from 'src/app/pipes/payment-method/payment-method.pipe';
import { DepositRoutingModule } from './deposit-routing.module';
import { DepositComponent } from './deposit.component';
import { DepositModalComponent } from './components/deposit-modal/deposit-modal.component';
import { LoginService } from '../login/shared/login.service';
import { CpfCnpjPipe } from 'src/app/pipes/cpfCnpj/cpf-cnpj.pipe';


export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

@NgModule({
  imports: [
    DepositRoutingModule,
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
    ActionBarModule,
    NgxMaskModule.forRoot(),
    ClipboardModule
  ],
  exports: [],
  declarations: [DepositComponent, DepositModalComponent],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    JsPdfHelper,
    CurrencyPipe,
    CpfCnpjPipe,
    PaymentMethodPipe,
    LoginService
  ],
})
export class DepositModule { }
