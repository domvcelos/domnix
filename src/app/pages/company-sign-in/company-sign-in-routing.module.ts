import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FullPageComponent } from 'src/app/layout/full-page/full-page.component';
import { CompanySignInComponent } from './company-sign-in.component';

const routes: Routes = [
  {
    path: 'cadastrar-empresa',
    component: FullPageComponent,
    children: [
      { path: '', component: CompanySignInComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanySignInRoutingModule { }
