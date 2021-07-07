import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';

import { ToastrModule } from 'ngx-toastr';
import { NgxCurrencyModule } from 'ngx-currency';
import { NgxMaskModule } from 'ngx-mask';

import { ApplicationPipesModule } from 'src/app/pipes/application-pipes.module';
import { StatementRoutingModule } from './statement-routing.module';
import { CustomValidators } from 'src/app/common/custom-validators';
import { ActionBarModule } from 'src/app/components/action-bar/action-bar.module';
import { StatementComponent } from './statement.component';


@NgModule({
  imports: [
    CommonModule,
    StatementRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressAnimation: 'decreasing',
      progressBar: true,
      closeButton: true,
    }),
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    HttpClientModule,
    MatTabsModule,
    MatDialogModule,
    ApplicationPipesModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatInputModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatStepperModule,
    MatProgressSpinnerModule,
    BrowserAnimationsModule,
    ActionBarModule,
    MatTableModule,
    MatPaginatorModule,
    NgxCurrencyModule,
    MatMenuModule,
    MatCheckboxModule,
    NgxMaskModule.forRoot(),
  ],
  declarations: [
    StatementComponent,
  ],
  providers: [
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'pt-BR'
    },
    CustomValidators,
  ],
})
export class StatementModule { }
