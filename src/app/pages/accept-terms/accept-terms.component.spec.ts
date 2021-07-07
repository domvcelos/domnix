import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from 'src/app/common/services/authentication/auth.service';
import { AcceptTermsComponent } from './accept-terms.component';


describe('AcceptTermsComponent', () => {
  let component: AcceptTermsComponent;
  let fixture: ComponentFixture<AcceptTermsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientModule,
      ],
      declarations: [
        AcceptTermsComponent
      ], providers: [AuthService],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
