import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { ToastrModule } from 'ngx-toastr';

import { AuthService } from 'src/app/common/services/authentication/auth.service';
import { SigninNotCompleteComponent } from './signin-not-complete.component';


describe('SigninNotCompleteComponent', () => {
  let component: SigninNotCompleteComponent;
  let fixture: ComponentFixture<SigninNotCompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientModule,
        ToastrModule.forRoot(),
      ],
      declarations: [
        SigninNotCompleteComponent
      ], providers: [AuthService],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SigninNotCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
