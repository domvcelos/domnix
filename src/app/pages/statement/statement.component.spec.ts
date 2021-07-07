import { CommonModule, CurrencyPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxCurrencyModule } from 'ngx-currency';
import { NgxMaskModule } from 'ngx-mask';
import { ToastrModule } from 'ngx-toastr';
import { JsPdfHelper } from 'src/app/common/jsPdf.helper';
import { Utils } from 'src/app/common/utils';
import { ApplicationPipesModule } from 'src/app/pipes/application-pipes.module';
import { CpfCnpjPipe } from 'src/app/pipes/cpfCnpj/cpf-cnpj.pipe';
import { PaymentMethodPipe } from 'src/app/pipes/payment-method/payment-method.pipe';

import { StatementComponent } from './statement.component';

describe('StatementComponent', () => {
  let component: StatementComponent;
  let fixture: ComponentFixture<StatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        MatDialogModule,
        MatSelectModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatStepperModule,
        NgxMaskModule.forRoot(),
        NgxCurrencyModule,
        HttpClientModule,
        ApplicationPipesModule,
        ToastrModule.forRoot(),
      ],
      declarations: [
        StatementComponent,
      ],
      providers: [
        CurrencyPipe,
        CpfCnpjPipe,
        JsPdfHelper,
        PaymentMethodPipe,
        Utils,
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
