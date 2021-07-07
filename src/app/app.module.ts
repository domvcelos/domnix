import { DEFAULT_CURRENCY_CODE, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CurrencyMaskInputMode, NgxCurrencyModule } from 'ngx-currency';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeModule } from './pages/home/home.module';
import { ChargeModule } from './pages/charge/charge.module';
import { LoginModule } from './pages/login/login.module';
import { AuthorizationInterceptor } from './common/interceptor/authorization-interceptor';
import { ChargeService } from './pages/charge/shared/charge.service';
import { AcceptTermsModule } from './pages/accept-terms/accept-terms.module';
import { RegisterCompanyModule } from './pages/register-company/register-company.module';
import { RecurrenceManagementModule } from './pages/recurrence-management/recurrence-management.module';
import { ForgotPasswordModule } from './pages/forgot-password/forgot-password.module';
import { CollectionManagementModule } from './pages/collection-management/collection-management.module';
import { Utils } from './common/utils';
import { LayoutModule } from './layout/layout.module';
import { PaymentManagementModule } from './pages/payment-management/payment-management.module';
import { PayModule } from './pages/pay/pay.module';
import { DepositModule } from './pages/deposit/deposit.module';
import { SettingsModule } from './pages/settings/settings.module';
import { CardModule } from './pages/card/card.module';
import { ContactsModule } from './pages/contacts/contacts.module';
import { StatementModule } from './pages/statement/statement.module';
import { UserSignInModule } from './pages/user-sign-in/user-sign-in.module';
import { CompanySignInModule } from './pages/company-sign-in/company-sign-in.module';
import { NotificationsModule } from './pages/notifications/notifications.module';
import { TransferModule } from './pages/transfer/transfer.module';
import { SigninNotCompleteModule } from './pages/signin-not-complete/signin-not-complete.module';
import { ManageCompaniesModule } from './pages/manage-companies/manage-companies.module';
import { ManagePlansModule } from './pages/manage-plans/manage-plans.module';
import { PlanModule } from './pages/manage-plans/components/plan/plan.module';
import { CompanySignInSaLtdaModule } from './pages/company-sign-in-sa-ltda/company-sign-in-sa-ltda.module';
import { SelectEstablishmentTypeModule } from './pages/select-establishment-type/select-establishment-type.module';


export const customCurrencyMaskConfig = {
  align: 'left',
  allowNegative: false,
  allowZero: true,
  decimal: ',',
  precision: 2,
  prefix: 'R$ ',
  suffix: '',
  thousands: '.',
  nullable: true,
  inputMode: CurrencyMaskInputMode.FINANCIAL,
};
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    HomeModule,
    ChargeModule,
    TransferModule,
    LoginModule,
    CompanySignInModule,
    ForgotPasswordModule,
    RecurrenceManagementModule,
    HttpClientModule,
    RegisterCompanyModule,
    AcceptTermsModule,
    SigninNotCompleteModule,
    CollectionManagementModule,
    PaymentManagementModule,
    DepositModule,
    PayModule,
    SettingsModule,
    CardModule,
    ContactsModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
    StatementModule,
    UserSignInModule,
    NotificationsModule,
    ManageCompaniesModule,
    ManagePlansModule,
    PlanModule,
    CompanySignInSaLtdaModule,
    SelectEstablishmentTypeModule
  ],
  providers: [
    ChargeService,
    {
      provide: DEFAULT_CURRENCY_CODE,
      useValue: 'R$ '
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthorizationInterceptor,
      multi: true,
    },
    Utils,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
