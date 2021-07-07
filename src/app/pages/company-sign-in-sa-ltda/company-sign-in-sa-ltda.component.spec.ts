import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { NgxImageCompressService } from 'ngx-image-compress';
import { NgxMaskModule } from 'ngx-mask';
import { ToastrModule } from 'ngx-toastr';

import { Utils } from 'src/app/common/utils';
import { CompanySignInSaLtdaRoutingModule } from './company-sign-in-sa-ltda-routing.module';
import { CompanySignInSaLtdaComponent } from './company-sign-in-sa-ltda.component';



describe('CompanySignInComponent', () => {
  let component: CompanySignInSaLtdaComponent;
  let fixture: ComponentFixture<CompanySignInSaLtdaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        CompanySignInSaLtdaRoutingModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        ToastrModule.forRoot(),
        MatExpansionModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatStepperModule,
        MatIconModule,
        NgxMaskModule.forRoot(),
      ],
      declarations: [CompanySignInSaLtdaComponent],
      providers: [Utils, NgxImageCompressService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanySignInSaLtdaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
