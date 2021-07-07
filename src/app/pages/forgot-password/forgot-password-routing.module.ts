import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FullPageComponent } from 'src/app/layout/full-page/full-page.component';
import { ForgotPasswordComponent } from './forgot-password.component';

const routes: Routes = [
  {
    path: 'recuperar-senha',
    component: FullPageComponent,
    children: [{ path: '', component: ForgotPasswordComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForgotPasswordRoutingModule {}
