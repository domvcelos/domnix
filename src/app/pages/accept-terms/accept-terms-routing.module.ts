import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/common/services/authentication/auth-guard';
import { AuthService } from 'src/app/common/services/authentication/auth.service';
import { SignUpStatus } from 'src/app/common/utils';
import { FullPageComponent } from 'src/app/layout/full-page/full-page.component';
import { AcceptTermsComponent } from './accept-terms.component';

const routes: Routes = [
  {
    path: 'termo-de-adesao',
    component: FullPageComponent,
    children: [
      {
        path: '',
        component: AcceptTermsComponent,
        canActivate: [AuthGuard],
        data: { roles: [SignUpStatus.inactive] },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, AuthService],
})
export class AcceptTermsRoutingModule {}
