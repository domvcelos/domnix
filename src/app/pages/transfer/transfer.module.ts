import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';

import { ToastrModule } from 'ngx-toastr';
import { NgxCurrencyModule } from 'ngx-currency';

import { TransferComponent } from './transfer.component';
import { ActionBarModule } from 'src/app/components/action-bar/action-bar.module';
import { TransferRoutingModule } from './transfer-routing.module';
import { SelectContactModalComponent } from './components/select-contact-modal/select-contact-modal.component';
import { ConfirmTransferDataModalComponent } from './components/confirm-transfer-data-modal/confirm-transfer-data-modal.component';
import { SelectNixAccountModalComponent } from './components/select-nix-account-modal/select-nix-account-modal.component';
import { ApplicationPipesModule } from 'src/app/pipes/application-pipes.module';


@NgModule({
  imports: [
    CommonModule,
    TransferRoutingModule,
    ActionBarModule,
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
    MatAutocompleteModule,
    NgxCurrencyModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatStepperModule,
    MatIconModule,
    ApplicationPipesModule,
  ],
  declarations: [
    TransferComponent,
    SelectContactModalComponent,
    ConfirmTransferDataModalComponent,
    SelectNixAccountModalComponent,
  ],
})
export class TransferModule { }
