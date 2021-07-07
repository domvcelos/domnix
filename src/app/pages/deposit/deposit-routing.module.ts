import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/common/services/authentication/auth-guard';
import { AuthService } from 'src/app/common/services/authentication/auth.service';
import { SignUpStatus } from 'src/app/common/utils';
import { MainLayoutComponent } from 'src/app/layout/main-layout/main-layout.component';
import { DepositComponent } from './deposit.component';

const routes: Routes = [
  {
    path: 'depositar',
    component: MainLayoutComponent,
    data: { animation: 'toLeft' },
    children: [
      {
        path: '',
        component: DepositComponent,
        canActivate: [AuthGuard],
        data: { roles: [SignUpStatus.active] },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, AuthService],
})
export class DepositRoutingModule {}
