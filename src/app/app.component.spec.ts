import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { AuthService } from './common/services/authentication/auth.service';
import { LoginComponent } from './pages/login/login.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        HttpClientModule,
        ToastrModule.forRoot(),
      ],
      declarations: [AppComponent],
      providers: [AuthService],
    }).compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });
  it(`should have as title 'nix-empresas-web'`, () => {
    expect(component.title).toEqual('nix-empresas-web');
  });
  it('should router-outlet tag exists', () => {
    const routerOutlet = fixture.debugElement.query(By.css('router-outlet'));
    expect(routerOutlet).toBeTruthy();
  });
  describe('Genarate token', () => {
    xit('should call function #login()', () => {
      const fixtureLogin = TestBed.createComponent(LoginComponent);
      const loginComponent = fixtureLogin.componentInstance;
      loginComponent.loginFormGroup.controls['user'].setValue(
        'xafev79954@ismailgul.net'
      );
      loginComponent.loginFormGroup.controls['password'].setValue('123456');
      loginComponent.login();
    });
  });
});
