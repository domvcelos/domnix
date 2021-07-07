import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';

import { ConfirmPaymentDataModalComponent } from './confirm-payment-data-modal.component';

describe('ConfirmPaymentDataModalComponent', () => {
  let component: ConfirmPaymentDataModalComponent;
  let fixture: ComponentFixture<ConfirmPaymentDataModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        HttpClientModule,
      ],
      declarations: [ConfirmPaymentDataModalComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPaymentDataModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
