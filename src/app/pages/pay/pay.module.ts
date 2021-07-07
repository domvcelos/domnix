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
import { ActionBarModule } from 'src/app/components/action-bar/action-bar.module';
import { PayRoutingModule } from './pay-routing.module';
import { PayComponent } from './pay.component';
import { NgxMaskModule } from 'ngx-mask';
import { MatSelectModule } from '@angular/material/select';
import { CreditCardModalComponent } from './components/credit-card-modal/credit-card-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { Utils } from 'src/app/common/utils';
import { MatStepperModule } from '@angular/material/stepper';
import { ApplicationPipesModule } from 'src/app/pipes/application-pipes.module';
import { NgxCurrencyModule } from 'ngx-currency';
import { CustomValidators } from 'src/app/common/custom-validators';

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
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatSelectModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatStepperModule,
    PayRoutingModule,
    BrowserAnimationsModule,
    ActionBarModule,
    NgxMaskModule.forRoot(),
    ApplicationPipesModule,
    NgxCurrencyModule,
  ],
  declarations: [PayComponent, CreditCardModalComponent],
  providers: [Utils, CustomValidators],
})
export class PayModule {}
