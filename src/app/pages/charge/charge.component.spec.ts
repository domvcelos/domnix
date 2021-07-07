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

import { ActionBarModule } from 'src/app/components/action-bar/action-bar.module';
import { ChargeRoutingModule } from './charge-routing.module';
import { ChargeComponent } from './charge.component';
import { CardFormModule } from './components/card-form/card-form.module';
import { ConfirmPaymentDataModalComponent } from './components/confirm-payment-data-modal/confirm-payment-data-modal.component';
import { NewContactModalComponent } from '../../components/new-contact-modal/new-contact-modal.component';
import { PaymentBookModule } from './components/payment-book-form/payment-book-form.module';
import { SUBPEOPLELIST } from '../contacts/shared/contacts.mock';

xdescribe('ChargeComponent', () => {
  let component: ChargeComponent;
  let fixture: ComponentFixture<ChargeComponent>;

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
      ],
      declarations: [
        ChargeComponent,
        NewContactModalComponent,
        ConfirmPaymentDataModalComponent,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeComponent);
    component = fixture.componentInstance;
    component.subPeopleList = SUBPEOPLELIST;
    spyOn<any>(component, 'getContactList');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('#_filter test', () => {
    it('should return a subPeople`s name', () => {
      const filtredValue = component._filter('Arlindo');
      expect(filtredValue[0].name).toContain('ARLINDO BONINA');
    });
    it('`Novo Contato` button should be disabled', () => {
      component._filter('Arlindo');
      expect(component.buttonControl.enableButton).toBe(false);
    });
    it('should not return a subPeople`s name', () => {
      const filtredValue = component._filter('sa');
      expect(filtredValue.length).toBeLessThan(1);
    });
    it('`Novo Contato` button should be enabled', () => {
      component._filter('sa');
      expect(component.buttonControl.enableButton).toBe(true);
    });
  });
  describe('#getSelectedSubPeople test', () => {
    it('should has a selectedSubPeople', () => {
      component.getSelectedSubPeople(SUBPEOPLELIST[0]);
      expect(component.selectedSubPeople).toBeTruthy();
    });
  });

  describe('#openDialog test', () => {
    it('should call function #openDialog()', () => {
      const spy = spyOn(component, 'openDialog');
      component.openDialog();
      expect(spy).toHaveBeenCalled();
    });
  });
});
