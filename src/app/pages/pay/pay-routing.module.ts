import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/common/services/authentication/auth-guard';
import { SignUpStatus } from 'src/app/common/utils';
import { MainLayoutComponent } from 'src/app/layout/main-layout/main-layout.component';
import { PayComponent } from './pay.component';

const routes: Routes = [
  {
    path: 'pagar',
    component: MainLayoutComponent,
    data: { animation: 'toLeft' },
    children: [
      {
        path: '',
        component: PayComponent,
        canActivate: [AuthGuard],
        data: { roles: [SignUpStatus.active] },
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayRoutingModule { }
