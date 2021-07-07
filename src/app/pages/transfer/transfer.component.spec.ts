import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { ToastrModule } from 'ngx-toastr';

import { Utils } from 'src/app/common/utils';
import { ActionBarModule } from 'src/app/components/action-bar/action-bar.module';
import { CpfCnpjPipe } from 'src/app/pipes/cpfCnpj/cpf-cnpj.pipe';
import { TransferRoutingModule } from './transfer-routing.module';
import { TransferComponent } from './transfer.component';


describe('TransferComponent', () => {
  let component: TransferComponent;
  let fixture: ComponentFixture<TransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        ActionBarModule,
        TransferRoutingModule,
        RouterTestingModule,
        MatDialogModule,
        HttpClientModule,
        ToastrModule.forRoot(),
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatAutocompleteModule,
        FormsModule,
      ],
      declarations: [
        TransferComponent
      ],
      providers: [
        CpfCnpjPipe,
        Utils,
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
