import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClientModule } from '@angular/common/http';
import { PaymentManagementComponent } from './payment-management.component';
import { PaymentManagementRoutingModule } from './payment-management-routing.module';
import { ActionBarModule } from 'src/app/components/action-bar/action-bar.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { NgxCurrencyModule } from 'ngx-currency';
import { ApplicationPipesModule } from 'src/app/pipes/application-pipes.module';
import { PaymentDetailsModalComponent } from './components/payment-details-modal/payment-details-modal.component';
import { PaymentReceiptModalComponent } from './components/payment-receipt-modal/payment-receipt-modal.component';
import { CustomValidators } from 'src/app/common/custom-validators';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  imports: [
    CommonModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressAnimation: 'decreasing',
      progressBar: true,
      closeButton: true,
    }),
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    PaymentManagementRoutingModule,
    BrowserAnimationsModule,
    ActionBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatSelectModule,
    MatDialogModule,
    NgxCurrencyModule,
    MatMenuModule,
    MatCheckboxModule,
    ApplicationPipesModule,
    NgxMaskModule.forRoot(),
  ],
  declarations: [
    PaymentManagementComponent,
    PaymentDetailsModalComponent,
    PaymentReceiptModalComponent,
  ],
  providers: [CustomValidators],
})
export class PaymentManagementModule {}
