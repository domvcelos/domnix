import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
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
import { ChargeRoutingModule } from 'src/app/pages/charge/charge-routing.module';
import { CardFormModule } from 'src/app/pages/charge/components/card-form/card-form.module';
import { PaymentBookModule } from 'src/app/pages/charge/components/payment-book-form/payment-book-form.module';
import { ApplicationPipesModule } from 'src/app/pipes/application-pipes.module';
import { SelectContactModalComponent } from './select-contact-modal.component';


describe('SelectContactModalComponent', () => {
  let component: SelectContactModalComponent;
  let fixture: ComponentFixture<SelectContactModalComponent>;

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
        ApplicationPipesModule,
      ],
      declarations: [
        SelectContactModalComponent,
      ],
      providers: [
        Utils,
        {
          provide: MatDialogRef,
          useValue: {}
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectContactModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
