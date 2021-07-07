import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxCurrencyModule } from 'ngx-currency';
import { ToastrModule } from 'ngx-toastr';
import { Utils } from 'src/app/common/utils';
import { ActionBarModule } from 'src/app/components/action-bar/action-bar.module';
import { ChargeRoutingModule } from '../charge/charge-routing.module';
import { CardFormModule } from '../charge/components/card-form/card-form.module';
import { PaymentBookModule } from '../charge/components/payment-book-form/payment-book-form.module';

import { PayComponent } from './pay.component';

describe('PayComponent', () => {
  let component: PayComponent;
  let fixture: ComponentFixture<PayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        RouterTestingModule,
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
        HttpClientModule,
        ToastrModule.forRoot(),
      ],
      declarations: [PayComponent],
      providers: [Utils],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
