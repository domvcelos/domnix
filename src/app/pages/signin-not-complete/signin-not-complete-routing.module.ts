import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from 'src/app/common/services/authentication/auth-guard';
import { AuthService } from 'src/app/common/services/authentication/auth.service';
import { SignUpStatus } from 'src/app/common/utils';
import { FullPageComponent } from 'src/app/layout/full-page/full-page.component';
import { SigninNotCompleteComponent } from './signin-not-complete.component';

const routes: Routes = [
  {
    path: 'cadastro-nao-completo',
    component: FullPageComponent,
    children: [
      {
        path: '',
        component: SigninNotCompleteComponent,
        canActivate: [AuthGuard],
        data: { roles: [SignUpStatus.pending, SignUpStatus.waiting, SignUpStatus.error, ] },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, AuthService],
})
export class SigninNotCompleteRoutingModule { }
