import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from 'src/app/common/services/authentication/auth-guard';
import { AuthService } from 'src/app/common/services/authentication/auth.service';
import { SignUpStatus } from 'src/app/common/utils';
import { FullPageComponent } from 'src/app/layout/full-page/full-page.component';
import { ManagePlansComponent } from './manage-plans.component';


const routes: Routes = [
  {
    path: 'planos',
    component: FullPageComponent,
    children: [
      {
        path: '',
        component: ManagePlansComponent,
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
export class ManagePlansRoutingModule { }
